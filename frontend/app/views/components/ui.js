/* Thành phần giao diện dùng chung: huy hiệu, thẻ số liệu, bảng, biểu đồ, thẻ bài viết. Chỉ trả về chuỗi HTML. */
(function(A){
const {esc,fmt}=A.U;
const LV={high:["Đáng tin cậy","var(--ok)"],medium:["Cần kiểm chứng","var(--warn)"],low:["Độ tin cậy thấp","var(--bad)"]};
const RS={pending:["Chờ xử lý","var(--warn)"],resolved:["Đã xử lý","var(--ok)"],rejected:["Đã từ chối","var(--bad)"]};
const I=(n,c="")=>`<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const bd=(t,c)=>`<span class="bg" style="--c:${c}"><i></i>${t}</span>`;
const UI=A.Views.UI={LV,RS,I,bd,
  sc:n=>bd(n,LV[A.Models.Analysis.level(n)][1]),
  bt:(a,i,t,c="ghost")=>`<button class="btn ${c} sm" data-action="${a}" data-i="${i}">${t}</button>`,
  st:(i,l,v,n)=>`<div class="st">${I(i)}<span class="l">${l}</span><b>${v}</b>${n?`<small>${n}</small>`:""}</div>`,
  td:s=>`<td style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(s)}">${esc(s)}</td>`,
  tbl:(h,r)=>r.length?`<div class="tw"><table><thead><tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${r.join("")}</tbody></table></div>`:`<div class="empty">Không có dữ liệu phù hợp.</div>`,
  /* Biểu đồ cột 7 ngày gần nhất từ danh sách ngày YYYY-MM-DD */
  bars(d){
    const e=d.length?new Date(Math.max(...d.map(x=>+new Date(x)))):new Date();
    const c=[...Array(7)].map((_,i)=>{const k=new Date(e-(6-i)*864e5).toISOString().slice(0,10);return[k.slice(8)+"/"+k.slice(5,7),d.filter(x=>x===k).length]});
    const m=Math.max(1,...c.map(x=>x[1]));
    return`<div class="bc">${c.map(x=>`<div><u><i style="height:${Math.max(3,x[1]/m*100)}%"><em>${x[1]}</em></i></u><span>${x[0]}</span></div>`).join("")}</div>`;
  },
  /* Biểu đồ vòng phân bố độ tin cậy từ danh sách trust_level */
  donut(L){
    const t=L.length,o=L.filter(x=>x==="high").length,m=L.filter(x=>x==="medium").length,a=Math.round(o/(t||1)*100),b=a+Math.round(m/(t||1)*100);
    const row=(c,n,v)=>`<span><span><i style="--c:${c}"></i>${n}</span>${v}</span>`;
    return`<div class="dn" style="--a:${a};--b:${b}${t?"":";background:var(--soft)"}"><b><span>${t}<small>bài</small></span></b></div><div class="lg">${row(LV.high[1],LV.high[0],o)}${row(LV.medium[1],LV.medium[0],m)}${row(LV.low[1],LV.low[0],t-o-m)}</div>`;
  },
  gauge:(n,c)=>`<div class="gg"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" fill="none" style="stroke:var(--bd)" stroke-width="9"/><circle cx="60" cy="60" r="52" fill="none" style="stroke:${c}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${(n*3.2673).toFixed(1)} 400" transform="rotate(-90 60 60)"/></svg><b>${n}<small>/100</small></b></div>`,
  card:(a,extra)=>`<div class="card" data-action="open" data-i="${a.article_id}"><div class="row"><span class="cat">${esc(a.cat.name||"Khác")}</span>${UI.sc(a.an.trust_score)}</div><h3>${esc(a.title)}</h3><div class="mut">${esc(a.src.name)} · ${fmt(a.published_at)}</div>${extra?`<div>${extra}</div>`:""}</div>`,
  /* Nút xóa cần bấm hai lần: lần đầu chỉ "lên đạn", trả về true ở lần bấm thứ hai trong 3 giây */
  armed(el){
    if(el.dataset.sure)return true;
    el.dataset.sure=1;const t=el.textContent;el.textContent="Bấm lại để xác nhận";
    setTimeout(()=>{el.textContent=t;delete el.dataset.sure},3000);return false;
  }
};
})(window.App);
