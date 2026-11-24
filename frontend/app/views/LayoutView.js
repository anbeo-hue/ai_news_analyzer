/* Khung trang: header (menu theo vai trò, nút Đăng nhập chia Người dùng/Quản trị viên), footer, toast, vùng nội dung #app. */
(function(A){
const {$,$$,esc}=A.U,I=(n)=>A.Views.UI.I(n);
let tmr;
A.Views.Layout={
  mount(html){$("#app").innerHTML=`<section class="page">${html}</section>`},
  header(user){
    const ad=user&&user.role==="admin",L=(h,t)=>`<a href="#${h}" data-n="${h}">${t}</a>`;
    const nav=L("home","Trang chủ")+(user?(ad?L("admin","Quản trị"):L("dashboard","Dashboard")+L("history","Lịch sử")+L("bookmarks","Đã lưu")+L("reports","Báo cáo")):"");
    const auth=user
      ?`<div class="dd"><button class="btn ghost" data-action="dd" aria-haspopup="true" aria-expanded="false"><span class="av">${esc(user.full_name[0].toUpperCase())}</span>${esc(ad?user.full_name:user.full_name.split(" ").pop())}${I("chev")}</button><div class="menu">${ad?"":`<a href="#profile">${I("user")}<div><b>Hồ sơ cá nhân</b><span>Thông tin và mật khẩu</span></div></a>`}<button data-action="out">${I("out")}<div><b>Đăng xuất</b><span>${ad?"Quản trị viên":"Người dùng"} · ${esc(user.email)}</span></div></button></div></div>`
      :`<div class="dd"><button class="btn" data-action="dd" aria-haspopup="true" aria-expanded="false">Đăng nhập${I("chev")}</button><div class="menu"><a href="#login">${I("user")}<div><b>Người dùng</b><span>Phân tích, lưu và báo cáo bài viết</span></div></a><a href="#login-admin">${I("shield")}<div><b>Quản trị viên</b><span>Quản lý người dùng, nguồn tin, báo cáo</span></div></a><div class="mf">Chưa có tài khoản? <a href="#register" class="lnk">Đăng ký</a></div></div></div><a class="btn ghost" href="#register">Đăng ký</a>`;
    $("#header").innerHTML=`<div class="wrap nav"><a class="logo" href="#home"><svg class="mk" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="currentColor"/><path d="M7 12.5l3.2 3.2L17 8.5" fill="none" stroke="var(--on)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>AI News</a><nav id="nv">${nav}</nav><div id="au">${auth}</div><button class="burger" data-action="burger" aria-label="Mở menu">${I("menu")}</button></div>`;
  },
  footer(){$("#footer").innerHTML='<div class="wrap"><span>© 2026 AI News</span><span>Công cụ hỗ trợ kiểm chứng thông tin</span></div>'},
  setActive(h){const k=h.startsWith("admin")?"admin":h;$$("#nv a").forEach(a=>a.classList.toggle("on",a.dataset.n===k))},
  toggleMenu(btn){const d=btn.closest(".dd");d.classList.toggle("open");btn.setAttribute("aria-expanded",d.classList.contains("open"))},
  closeMenus(except){$$(".dd.open").forEach(x=>{if(!except||x!==except.closest(".dd"))x.classList.remove("open")})},
  toggleNav(){$("#nv").classList.toggle("open")},
  closeNav(){const n=$("#nv");if(n)n.classList.remove("open")},
  toast(m){const t=$("#ts");t.textContent=m;t.classList.add("show");clearTimeout(tmr);tmr=setTimeout(()=>t.classList.remove("show"),2400)},
  notFound:()=>'<div class="empty"><h2 class="t">Không tìm thấy trang</h2><p>Đường dẫn bạn mở không tồn tại hoặc đã được chuyển đi.</p><a class="btn" style="margin-top:16px" href="#home">Về trang chủ</a></div>'
};
})(window.App);
