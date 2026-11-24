(function(A){
const {esc,fmt}=A.U,UI=A.Views.UI,L=()=>A.Views.AdminLayout;
A.Views.AdminUsers={
  render({users,total,selfId}){
    return L().head("Quản lý người dùng",total+" tài khoản trong bảng users","Tìm tên hoặc email…")+`<div class="box">${UI.tbl(["Người dùng","Vai trò","Trạng thái","Lượt phân tích","Ngày tạo",""],users.map(u=>{const on=u.status==="active";return`<tr><td><div class="who"><span class="av">${esc(u.full_name[0].toUpperCase())}</span><div><b>${esc(u.full_name)}</b><br><span class="mut">${esc(u.email)}</span></div></div></td><td><span class="tag">${u.role==="admin"?"Quản trị":"Người dùng"}</span></td><td>${UI.bd(on?"Hoạt động":"Đã khóa",on?"var(--ok)":"var(--bad)")}</td><td>${u.count}</td><td class="mut">${fmt(u.created_at)}</td><td class="ac">${u.user_id===selfId?"":UI.bt("lock",u.user_id,on?"Khóa":"Mở khóa")+UI.bt("du",u.user_id,"Xóa","red")}</td></tr>`}))}</div>`;
  }
};
})(window.App);
