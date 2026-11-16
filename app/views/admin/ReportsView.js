(function(A){
const {$,esc,fmt}=A.U,UI=A.Views.UI,L=()=>A.Views.AdminLayout;
A.Views.AdminReports={
  render({reports,selected}){
    const r=selected;
    const detail=r?`<div class="box" style="margin-top:18px"><h3>Báo cáo #${r.report_id}: ${esc(r.reason)}</h3><p class="mut">Bài viết: ${esc(r.article?r.article.title:"đã bị xóa")} · Người gửi: ${esc((r.user||{}).full_name||"—")} · ${fmt(r.created_at)}</p><p style="margin-top:8px">${esc(r.description)}</p><label>Ghi chú của quản trị viên</label><textarea class="sm" id="anote">${esc(r.admin_note)}</textarea><div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" data-action="rok" data-i="${r.report_id}">Đánh dấu đã xử lý</button><button class="btn red sm" data-action="rno" data-i="${r.report_id}">Từ chối báo cáo</button></div></div>`:"";
    return L().head("Quản lý báo cáo",reports.length+" báo cáo trong bảng reports")+detail+`<div class="box" style="margin-top:18px">${UI.tbl(["Người gửi","Bài viết","Lý do","Trạng thái","Ngày gửi",""],reports.map(x=>`<tr><td>${esc((x.user||{}).full_name||"—")}</td>${UI.td(x.article?x.article.title:"Bài đã bị xóa")}<td>${esc(x.reason)}</td><td>${UI.bd(UI.RS[x.status][0],UI.RS[x.status][1])}</td><td class="mut">${fmt(x.created_at)}</td><td class="ac">${UI.bt("rsel",x.report_id,"Xử lý")}</td></tr>`))}</div>`;
  },
  note:()=>$("#anote").value.trim()
};
})(window.App);
