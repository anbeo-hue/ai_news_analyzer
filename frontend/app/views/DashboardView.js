/* Dashboard của người dùng */
(function(A){
const {esc,fmt}=A.U,UI=A.Views.UI;
A.Views.Dashboard={
  render(d){return `<div class="hero dh"><p class="eyebrow">Dashboard</p><h1>Xin chào, ${esc(d.user.full_name)}</h1><p style="margin:8px 0 0">Tổng quan hoạt động phân tích tin tức của bạn.</p><a class="btn" style="margin-top:16px" href="#home">Phân tích bài mới</a></div>
<div class="sts">${UI.st("search","Bài đã phân tích",d.count)}${UI.st("chart","Điểm tin cậy trung bình",d.avg+"/100")}${UI.st("bookmark","Bài đã lưu",d.bookmarks)}${UI.st("flag","Báo cáo đã gửi",d.reports)}</div>
<div class="g2"><div class="box"><h3>Hoạt động 7 ngày gần nhất</h3>${UI.bars(d.dates)}</div><div class="box"><h3>Độ tin cậy các bài của bạn</h3>${UI.donut(d.levels)}</div></div>
<div class="sec"><h2>Phân tích gần đây</h2><a class="lnk" href="#history">Xem tất cả</a></div>
<div class="box">${d.recent.map(h=>`<div class="hi" data-action="open" data-i="${h.article_id}"><div class="x"><h3>${esc(h.a.title)}</h3><span class="mut">${esc(h.a.src.name)} · ${fmt(h.created_at)}</span></div>${UI.sc(h.a.an.trust_score)}</div>`).join("")||'<div class="empty">Bạn chưa phân tích bài nào.<br><a class="btn" style="margin-top:12px" href="#home">Bắt đầu phân tích</a></div>'}</div>`}
};
})(window.App);
