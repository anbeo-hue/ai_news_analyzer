(function(A){
const {esc,fmt}=A.U,UI=A.Views.UI,L=()=>A.Views.AdminLayout;
const stb=s=>UI.bd(s==="active"?"Hoạt động":"Đã tắt",s==="active"?"var(--ok)":"var(--mut)");
A.Views.AdminCategories={
  render(list){
    return L().head("Quản lý chuyên mục",list.length+" chuyên mục trong bảng categories")+`<div class="box" style="margin-top:18px"><h3 style="margin-bottom:6px">Thêm chuyên mục</h3><form id="f-cat" data-form="cat" novalidate class="row" style="align-items:flex-start"><div style="flex:1;min-width:160px"><input name="n" placeholder="Tên chuyên mục"><div class="er"></div></div><div style="flex:2;min-width:200px"><input name="d" placeholder="Mô tả"><div class="er"></div></div><button class="btn">Thêm</button></form></div>
<div class="box">${UI.tbl(["Chuyên mục","Mô tả","Trạng thái","Số bài","Ngày tạo",""],list.map(c=>`<tr><td><b>${esc(c.name)}</b></td>${UI.td(c.description)}<td>${stb(c.status)}</td><td>${c.count}</td><td class="mut">${fmt(c.created_at)}</td><td class="ac">${UI.bt("tgc",c.category_id,c.status==="active"?"Tắt":"Bật")}${UI.bt("dc",c.category_id,"Xóa","red")}</td></tr>`))}</div>`;
  }
};
})(window.App);
