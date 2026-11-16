/* Bảng users */
(function(A){
const DB=()=>A.DB;
A.Models.User={
  all:()=>DB().all("users"),
  find:id=>DB().find("users","user_id",id),
  findByEmail:e=>DB().find("users","email",String(e).trim().toLowerCase()),
  authenticate(email,pw){return DB().where("users",u=>u.email===String(email).trim().toLowerCase()&&u.password===pw)[0]||null},
  emailTaken:e=>!!A.Models.User.findByEmail(e),
  create({full_name,email,password}){return DB().insert("users",{full_name,email:email.trim().toLowerCase(),password,avatar:"",role:"user",status:"active",created_at:A.U.today()})},
  update(id,fields){return Object.assign(this.find(id),fields)},
  setPassword(email,pw){const u=this.findByEmail(email);if(u)u.password=pw;return !!u},
  toggleStatus(id){const u=this.find(id);u.status=u.status==="active"?"locked":"active";return u},
  /* Xóa người dùng kéo theo lịch sử, bookmark và báo cáo của họ (ON DELETE CASCADE) */
  remove(id){["analysis_history","bookmarks","reports"].forEach(t=>DB().remove(t,x=>x.user_id===id));DB().remove("users",x=>x.user_id===id)}
};
})(window.App);
