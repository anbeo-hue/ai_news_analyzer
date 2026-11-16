/* Bảng bookmarks */
(function(A){
A.Models.Bookmark={
  has:(uid,aid)=>A.DB.all("bookmarks").some(b=>b.user_id===uid&&b.article_id===aid),
  /* Bật/tắt lưu bài, trả về true nếu bài đang được lưu */
  toggle(uid,aid){
    const b=A.DB.where("bookmarks",x=>x.user_id===uid&&x.article_id===aid)[0];
    if(b){A.DB.remove("bookmarks",x=>x===b);return false}
    A.DB.insert("bookmarks",{user_id:uid,article_id:aid,created_at:A.U.today()});return true;
  },
  list:uid=>A.DB.where("bookmarks",b=>b.user_id===uid).map(b=>A.Models.Article.find(b.article_id)).filter(Boolean),
  countByUser:uid=>A.DB.where("bookmarks",b=>b.user_id===uid).length,
  total:()=>A.DB.all("bookmarks").length
};
})(window.App);
