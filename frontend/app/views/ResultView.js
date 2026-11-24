/* Trang kết quả phân tích: thông tin bài viết, tóm tắt, bài tương tự, điểm tin cậy 5 tiêu chí */
(function(A){
const {$,esc,fmt}=A.U,UI=A.Views.UI;
A.Views.Result={
  render({a,similar,saved}){
    const n=a.an,[v,c]=UI.LV[n.trust_level],id=a.article_id,ex=(n.explanations||[]).length?`<div class="box"><h3 style="margin-bottom:10px">Vì sao bài viết được đánh giá như vậy?</h3><ul class="ex">${n.explanations.map(e=>`<li class="${e.type}"><b>${e.type==="ok"?"✓":"⚠"}</b><span>${esc(e.text)}</span></li>`).join("")}</ul></div>`:"";
    return `<div class="res"><div class="col">
<div class="box"><div class="row"><div><span class="mut">Bài viết</span><h2 class="t">${esc(a.title)}</h2><div class="meta"><span>${esc(a.src.name)}</span><span>Tác giả: ${esc(a.au.name||"chưa rõ")}</span><span>${fmt(a.published_at)}</span></div></div>${UI.bd(v,c)}</div>
<div style="margin-top:12px"><span class="mut">Chuyên mục dự đoán: </span><span class="tag">${esc(n.category_prediction)} · ${n.category_confidence}%</span><br><span class="mut">Từ khóa: </span>${n.keywords.split(",").map(k=>`<span class="tag">${esc(k)}</span>`).join("")}</div></div>
<div class="box"><h3>Tóm tắt nội dung</h3><p class="mut" style="margin-top:8px;font-size:14px">${esc(n.summary)}</p></div>
${ex}
<div class="box"><h3 style="margin-bottom:12px">Bài viết tương tự</h3>${similar.map(x=>`<div class="hi" data-action="open" data-i="${x.article.article_id}"><div class="x"><h3>${esc(x.article.title)}</h3><span class="mut">${esc(x.article.src.name)} · ${esc(x.article.cat.name||"")}</span></div>${UI.bd(x.score?x.score+"% giống":"Cùng chuyên mục","var(--pri)")}</div>`).join("")||'<div class="empty">Chưa có bài viết tương tự.</div>'}</div>
<div class="box" id="rpb" hidden><h3>Báo cáo bài viết</h3><form id="f-rep" data-form="rep" novalidate><label>Lý do</label><select name="r"><option>Thông tin sai sự thật</option><option>Tin giả</option><option>Nguồn không rõ ràng</option><option>Nội dung xúc phạm</option><option>Khác</option></select><label>Mô tả chi tiết</label><textarea class="sm" name="d" placeholder="Hãy nêu rõ vấn đề bạn thấy…"></textarea><div class="er"></div><button class="btn" style="margin-top:6px">Gửi báo cáo</button></form></div></div>
<div class="col"><div class="box" style="--c:${c}"><h3>Đánh giá độ tin cậy</h3>${UI.gauge(n.trust_score,c)}<p style="text-align:center;font-weight:700;color:${c};margin-bottom:14px">${v}</p>
${A.Models.Analysis.criteria(n).map(x=>`<div class="row mut"><span>${x[0]}</span><span>${x[2]}</span></div><div class="bar"><i style="width:${x[1]}%"></i></div>`).join("")}${n.model_name==="mock-ai"?'<p class="mk">Chế độ giả lập: điểm số chưa do AI thật đánh giá.</p>':""}<p class="mut" style="font-size:12px">Mô hình ${esc(n.model_name)} v${esc(n.model_version)} · ${fmt(n.analyzed_at)}</p></div>
<div class="box" style="display:grid;gap:10px"><button class="btn" data-action="bm" data-i="${id}">${saved?"Đã lưu · Bỏ lưu":"Lưu bài viết"}</button><button class="btn ghost" data-action="rpt">Báo cáo bài viết</button><a class="btn ghost" href="#home">Phân tích bài khác</a></div></div></div>`;
  },
  toggleReport(){const r=$("#rpb");r.hidden=!r.hidden;if(!r.hidden)r.scrollIntoView({behavior:"smooth"})},
  closeReport(){$("#rpb").hidden=true}
};
})(window.App);
