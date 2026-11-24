/* Trang chủ: ô nhập văn bản/URL và danh sách bài nổi bật */
(function(A){
const {$,$$}=A.U,UI=A.Views.UI;
A.Views.Home={
  mode:"text",
  render(articles){this.mode="text";return `<div class="hero"><p class="eyebrow">Công cụ kiểm chứng thông tin</p><h1>Phân tích tin tức và bài báo bằng AI</h1><p class="lead">Dán nội dung hoặc đường dẫn bài báo để xem tóm tắt, từ khóa, bài viết tương tự và điểm tin cậy.</p></div>
<div class="box" style="margin-top:28px"><div class="tabs" id="tb"><button class="on" data-action="tab" data-t="text">Nhập văn bản</button><button data-action="tab" data-t="url">Nhập URL</button></div>
<div id="p-text"><textarea id="tx" placeholder="Dán nội dung bài báo cần phân tích…"></textarea></div>
<div id="p-url" hidden><input id="ul" placeholder="https://tenbao.vn/bai-viet"></div>
<div class="er" id="ae"></div>
<div class="row" style="margin-top:10px"><span class="mut">Không cần đăng nhập. Đăng nhập để lưu lịch sử phân tích.</span><button class="btn" id="an" data-action="analyze">Phân tích</button></div></div>
<p class="mut" style="margin:26px 0 8px">Mỗi bài viết được chấm theo 5 tiêu chí:</p>
<ol class="crit"><li><b>01</b>Nguồn tin</li><li><b>02</b>Tác giả</li><li><b>03</b>Dẫn chứng</li><li><b>04</b>Đối chiếu chéo</li><li><b>05</b>Nội dung</li></ol>
<div class="sec"><h2>Tin nổi bật</h2><span class="mut">Chọn một bài để xem phân tích</span></div>
<div class="grid" id="ft">${articles.map(a=>UI.card(a)).join("")}</div>`},
  showTab(m){this.mode=m;$$("#tb button").forEach(x=>x.classList.toggle("on",x.dataset.t===m));$("#p-text").hidden=m!=="text";$("#p-url").hidden=m!=="url";this.setError("")},
  read(){return{mode:this.mode,value:$(this.mode==="text"?"#tx":"#ul").value.trim()}},
  setError(m){$("#ae").textContent=m},
  setBusy(b){const x=$("#an");x.disabled=b;x.textContent=b?"Đang phân tích…":"Phân tích"}
};
})(window.App);
