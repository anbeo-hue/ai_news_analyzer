/* Bài viết đã lưu (bảng bookmarks) */
(function(A){
const UI=A.Views.UI;
A.Views.Bookmarks={
  render(list){return `<div><h2 class="t">Bài viết đã lưu</h2><p class="mut">Những bài bạn đánh dấu để xem lại</p></div><div style="margin-top:20px">${list.length?`<div class="grid">${list.map(a=>UI.card(a,UI.bt("bm",a.article_id,"Bỏ lưu","red"))).join("")}</div>`:'<div class="empty"><p>Bạn chưa lưu bài viết nào.</p><a class="btn" style="margin-top:12px" href="#home">Khám phá bài viết</a></div>'}</div>`}
};
})(window.App);
