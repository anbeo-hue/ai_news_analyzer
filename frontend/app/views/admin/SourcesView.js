(function(A){
const {esc}=A.U,UI=A.Views.UI,L=()=>A.Views.AdminLayout;
const stb=s=>UI.bd(s==="active"?"Hoạt động":"Đã tắt",s==="active"?"var(--ok)":"var(--mut)");
A.Views.AdminSources={
  render(list){
    return L().head("Quản lý nguồn tin",list.length+" nguồn trong bảng sources")+`<div class="box" style="margin-top:18px"><h3 style="margin-bottom:6px">Thêm nguồn tin</h3><form id="f-src" data-form="src" novalidate class="row" style="align-items:flex-start"><div style="flex:2;min-width:140px"><input name="n" placeholder="Tên nguồn"><div class="er"></div></div><div style="flex:2;min-width:140px"><input name="u" placeholder="tenmien.vn"><div class="er"></div></div><div style="flex:1;min-width:120px"><input name="t" placeholder="Loại nguồn"><div class="er"></div></div><div style="flex:1;min-width:110px"><input name="s" type="number" min="0" max="100" placeholder="Độ tin cậy"><div class="er"></div></div><button class="btn">Thêm</button></form></div>
<div class="box">${UI.tbl(["Nguồn","URL","Loại","Độ tin cậy","Trạng thái","Số bài",""],list.map(s=>`<tr><td><b>${esc(s.name)}</b></td><td>${esc(s.url)}</td><td>${esc(s.source_type)}</td><td>${UI.sc(s.reliability_score)}</td><td>${stb(s.status)}</td><td>${s.count}</td><td class="ac">${UI.bt("tgs",s.source_id,s.status==="active"?"Tắt":"Bật")}${UI.bt("ds",s.source_id,"Xóa","red")}</td></tr>`))}</div>`;
  }
};
})(window.App);
