/* Lịch sử phân tích (bảng analysis_history) */
(function(A){
const {$,esc,fmt}=A.U,UI=A.Views.UI;
A.Views.History={
  render(listHtml){return `<div class="row"><div><h2 class="t">Lịch sử phân tích</h2><p class="mut">Các bài bạn đã phân tích gần đây</p></div><div style="width:260px;max-width:100%"><input id="q" data-input="history-search" placeholder="Tìm theo tiêu đề…"></div></div>
<div style="margin-top:18px" id="hl">${listHtml}</div>`},
  list(items,total){
    return items.length
      ?`<div class="box" style="margin-top:0">${UI.tbl(["Bài viết","Chuyên mục","Điểm tin cậy","Ngày phân tích",""],items.map(h=>`<tr>${UI.td(h.a.title)}<td>${esc(h.a.cat.name||"—")}</td><td>${UI.sc(h.a.an.trust_score)}</td><td class="mut">${fmt(h.created_at)}</td><td class="ac">${UI.bt("open",h.article_id,"Xem")}${UI.bt("delh",h.history_id,"Xóa","red")}</td></tr>`))}</div>`
      :`<div class="empty"><p>${total?"Không có bài nào khớp từ khóa.":"Bạn chưa phân tích bài nào."}</p><a class="btn" style="margin-top:12px" href="#home">Phân tích bài đầu tiên</a></div>`;
  },
  setList(html){$("#hl").innerHTML=html}
};
})(window.App);
