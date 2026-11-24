"""Lấy nội dung bài báo từ một đường dẫn (URL).

Các bước: kiểm tra URL an toàn -> tải HTML -> bóc tiêu đề, tác giả, ngày đăng, nội dung chính.
Chỉ nhận trang HTML công khai; không bao giờ truy cập địa chỉ nội bộ của máy (xem _check_public_host).
"""
import ipaddress
import socket
from dataclasses import dataclass
from typing import Optional
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

MAX_BYTES = 2_000_000       # tối đa 2 MB HTML
MAX_REDIRECTS = 3
MIN_TEXT_CHARS = 200        # ít hơn mức này coi như không trích được nội dung
USER_AGENT = "Mozilla/5.0 (compatible; AINewsAnalyzer/1.0; +student-project)"


class FetchError(Exception):
    """Lỗi khi lấy bài báo. Nội dung thông báo hiển thị được cho người dùng."""


@dataclass
class FetchedArticle:
    url: str
    domain: str
    title: str
    text: str
    author: str
    published_at: str


def _check_public_host(host: str) -> None:
    """Chặn SSRF: không cho dùng backend để truy cập localhost, mạng LAN hay địa chỉ nội bộ.
    Nếu không chặn, ai đó có thể nhập http://127.0.0.1:3306 để dò các dịch vụ trên máy bạn."""
    try:
        infos = socket.getaddrinfo(host, None)
    except socket.gaierror:
        raise FetchError("Không tìm thấy tên miền của đường dẫn này")
    for info in infos:
        ip = ipaddress.ip_address(info[4][0])
        if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved or ip.is_multicast:
            raise FetchError("Không được phép truy cập địa chỉ nội bộ")


def _meta(soup: BeautifulSoup, *names: str) -> str:
    """Lấy nội dung thẻ <meta> đầu tiên khớp một trong các tên (name, property hoặc itemprop)."""
    for n in names:
        tag = (
            soup.find("meta", attrs={"name": n})
            or soup.find("meta", attrs={"property": n})
            or soup.find("meta", attrs={"itemprop": n})
        )
        if tag and tag.get("content", "").strip():
            return tag["content"].strip()
    return ""


def parse_html(html_bytes: bytes, url: str, max_chars: int) -> FetchedArticle:
    """Tách thông tin từ HTML. Hàm này không dùng mạng nên kiểm thử được bằng HTML mẫu."""
    soup = BeautifulSoup(html_bytes, "html.parser")

    title = _meta(soup, "og:title") or (soup.title.get_text(strip=True) if soup.title else "")
    author = _meta(soup, "author", "article:author", "og:article:author")
    published = _meta(soup, "article:published_time", "datePublished", "pubdate")

    # Bỏ các phần không phải nội dung bài: script, menu, chân trang...
    for t in soup(["script", "style", "noscript", "nav", "footer", "header", "aside", "form", "iframe"]):
        t.decompose()

    root = soup.find("article") or soup.body or soup
    paragraphs = [p.get_text(" ", strip=True) for p in root.find_all("p")]
    text = "\n".join(p for p in paragraphs if len(p) >= 30)
    if len(text) < MIN_TEXT_CHARS:
        text = root.get_text("\n", strip=True)

    if len(text) < MIN_TEXT_CHARS:
        raise FetchError(
            "Không trích được nội dung bài viết (trang có thể cần đăng nhập hoặc tải bằng JavaScript). "
            "Hãy thử dán nội dung bài viết vào thay vì dùng đường dẫn."
        )

    host = (urlparse(url).hostname or "").lower()
    return FetchedArticle(
        url=url,
        domain=host[4:] if host.startswith("www.") else host,
        title=title[:200],
        text=text[:max_chars],
        author=author[:120],
        published_at=published[:40],
    )


def fetch_article(url: str, timeout: int, max_chars: int) -> FetchedArticle:
    current = url
    for _ in range(MAX_REDIRECTS + 1):
        parsed = urlparse(current)
        if parsed.scheme not in ("http", "https") or not parsed.hostname:
            raise FetchError("Đường dẫn không hợp lệ")
        _check_public_host(parsed.hostname)   # kiểm tra lại ở MỖI lần chuyển hướng

        try:
            resp = requests.get(
                current,
                timeout=timeout,
                headers={"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml"},
                allow_redirects=False,   # tự xử lý chuyển hướng để còn kiểm tra từng chặng
                stream=True,
            )
        except requests.Timeout:
            raise FetchError("Tải bài viết quá lâu, hãy thử lại sau")
        except requests.RequestException:
            raise FetchError("Không tải được bài viết từ đường dẫn này")

        if resp.is_redirect or resp.status_code in (301, 302, 303, 307, 308):
            location = resp.headers.get("Location")
            resp.close()
            if not location:
                raise FetchError("Trang chuyển hướng không hợp lệ")
            current = urljoin(current, location)
            continue

        if resp.status_code != 200:
            resp.close()
            raise FetchError(f"Trang trả về lỗi {resp.status_code}")
        if "html" not in resp.headers.get("Content-Type", "").lower():
            resp.close()
            raise FetchError("Đường dẫn này không phải trang web (HTML)")

        data = b""
        for chunk in resp.iter_content(chunk_size=65536):
            data += chunk
            if len(data) > MAX_BYTES:
                break
        resp.close()
        return parse_html(data[:MAX_BYTES], current, max_chars)

    raise FetchError("Trang chuyển hướng quá nhiều lần")
