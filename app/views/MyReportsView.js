/* Báo cáo người dùng đã gửi (bảng reports) */
(function(A){
const {esc,fmt}=A.U,UI=A.Views.UI;
A.Views.MyReports={
  render(list){return `<div class="row"><div><h2 class="t">Báo cáo của tôi</h2><p class="mut">Các báo cáo bài viết bạn đã gửi tới quản trị viên</p></div><a class="btn ghost sm" href="#home">Tìm bài để báo cáo</a></div><div class="box" style="margin-top:20px">${UI.tbl(["Bài viết","Lý do","Trạng thái","Ngày gửi","Phản hồi của quản trị"],list.map(r=>`<tr>${UI.td(r.article?r.article.title:"Bài đã bị xóa")}<td>${esc(r.reason)}</td><td>${UI.bd(UI.RS[r.status][0],UI.RS[r.status][1])}</td><td class="mut">${fmt(r.created_at)}</td>${UI.td(r.admin_note||"—")}</tr>`))}</div>`}
};
})(window.App);
