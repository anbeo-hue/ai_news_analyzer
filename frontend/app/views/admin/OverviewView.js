(function(A){
const {esc}=A.U,UI=A.Views.UI,L=()=>A.Views.AdminLayout;
A.Views.AdminOverview={
  render(d){
    const mx=Math.max(1,...d.cats.map(x=>x[1]));
    return L().head("Tổng quan hệ thống","Số liệu tổng hợp từ cơ sở dữ liệu ai_news_analyzer")+`<div class="sts">${UI.st("users","Người dùng",d.users,d.activeUsers+" đang hoạt động")}${UI.st("news","Bài viết",d.articles,d.sources+" nguồn tin")}${UI.st("search","Lượt phân tích",d.history,d.bookmarks+" lượt lưu bài")}${UI.st("flag","Báo cáo chờ xử lý",d.pending,"trên "+d.reports+" báo cáo")}</div>
<div class="g2"><div class="box"><h3>Lượt phân tích 7 ngày gần nhất</h3>${UI.bars(d.dates)}</div><div class="box"><h3>Phân bố độ tin cậy</h3>${UI.donut(d.levels)}</div></div>
<div class="g2"><div class="box"><h3 style="margin-bottom:8px">Báo cáo mới nhất</h3>${UI.tbl(["Người báo cáo","Bài viết","Trạng thái"],d.recent.map(r=>`<tr><td>${esc((r.user||{}).full_name||"—")}</td>${UI.td((r.article||{}).title||"—")}<td>${UI.bd(UI.RS[r.status][0],UI.RS[r.status][1])}</td></tr>`))}</div>
<div class="box"><h3 style="margin-bottom:12px">Bài viết theo chuyên mục</h3>${d.cats.map(([n,v])=>`<div class="row mut"><span>${esc(n)}</span><span>${v} bài</span></div><div class="bar" style="--c:var(--pri)"><i style="width:${v/mx*100}%"></i></div>`).join("")}</div></div>`;
  }
};
})(window.App);
