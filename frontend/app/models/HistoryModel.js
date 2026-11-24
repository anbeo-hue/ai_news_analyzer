/* Bảng analysis_history: lịch sử phân tích của từng người dùng */
(function(A){
A.Models.History={
  add:(uid,aid,anId)=>A.DB.insert("analysis_history",{user_id:uid,article_id:aid,analysis_id:anId,created_at:A.U.today()}),
  byUser:uid=>A.DB.where("analysis_history",h=>h.user_id===uid).map(h=>({...h,a:A.Models.Article.find(h.article_id)})).filter(h=>h.a).sort((x,y)=>y.created_at.localeCompare(x.created_at)||y.history_id-x.history_id),
  remove:id=>A.DB.remove("analysis_history",x=>x.history_id===id),
  count:()=>A.DB.all("analysis_history").length,
  dates:()=>A.DB.all("analysis_history").map(x=>x.created_at)
};
})(window.App);
