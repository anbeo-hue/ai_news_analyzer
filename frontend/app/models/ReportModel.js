/* Bảng reports: người dùng báo cáo bài viết, quản trị viên xử lý. status: pending | resolved | rejected */
(function(A){
const join=r=>({...r,user:A.Models.User.find(r.user_id),article:A.Models.Article.find(r.article_id)});
A.Models.Report={
  all:()=>[...A.DB.all("reports")].sort((x,y)=>y.report_id-x.report_id).map(join),
  find:id=>{const r=A.DB.find("reports","report_id",id);return r&&join(r)},
  byUser:uid=>A.Models.Report.all().filter(r=>r.user_id===uid),
  countByUser:uid=>A.DB.where("reports",r=>r.user_id===uid).length,
  pendingCount:()=>A.DB.where("reports",r=>r.status==="pending").length,
  create({user_id,article_id,reason,description}){return A.DB.insert("reports",{user_id,article_id,reason,description,status:"pending",admin_note:"",created_at:A.U.today(),resolved_at:null})},
  resolve(id,status,note){return Object.assign(A.DB.find("reports","report_id",id),{status,admin_note:note,resolved_at:A.U.today()})}
};
})(window.App);
