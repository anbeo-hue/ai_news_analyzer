(function(A){
const {esc,fmt}=A.U,UI=A.Views.UI,L=()=>A.Views.AdminLayout;
A.Views.AdminArticles={
  render({articles,total}){
    return L().head("Quản lý bài viết",total+" bài trong bảng articles","Tìm theo tiêu đề…")+`<div class="box">${UI.tbl(["Tiêu đề","Nguồn","Tác giả","Chuyên mục","Điểm tin cậy","Ngày đăng",""],articles.map(a=>`<tr>${UI.td(a.title)}<td>${esc(a.src.name||"—")}</td><td>${esc(a.au.name||"—")}</td><td>${esc(a.cat.name||"—")}</td><td>${UI.sc(a.an.trust_score||0)}</td><td class="mut">${fmt(a.published_at)}</td><td class="ac">${UI.bt("open",a.article_id,"Xem")}${UI.bt("da",a.article_id,"Xóa","red")}</td></tr>`))}</div>`;
  }
};
})(window.App);
