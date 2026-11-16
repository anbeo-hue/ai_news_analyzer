/* Bảng articles. find() trả về bài viết đã nối sẵn nguồn, tác giả, chuyên mục và kết quả phân tích. */
(function(A){
const DB=()=>A.DB;
const M=A.Models.Article={
  find(id){
    const a=DB().find("articles","article_id",id);
    return a&&{...a,src:DB().find("sources","source_id",a.source_id)||{},au:DB().find("authors","author_id",a.author_id)||{},cat:DB().find("categories","category_id",a.category_id)||{},an:DB().find("article_analysis","article_id",id)||{}};
  },
  all:()=>DB().all("articles").map(a=>M.find(a.article_id)),
  count:()=>DB().all("articles").length,
  /* Bài viết tương tự: lấy từ similar_articles, nếu trống thì gợi ý bài cùng chuyên mục */
  similar(id){
    const a=DB().find("articles","article_id",id);
    const l=DB().where("similar_articles",x=>x.article_id===id).map(x=>({article:M.find(x.similar_article_id),score:x.similarity_score})).filter(x=>x.article);
    return l.length?l:DB().where("articles",x=>x.category_id===a.category_id&&x.article_id!==id).slice(0,3).map(x=>({article:M.find(x.article_id),score:0}));
  },
  remove(id){
    ["article_analysis","bookmarks","reports","analysis_history"].forEach(t=>DB().remove(t,x=>x.article_id===id));
    DB().remove("similar_articles",x=>x.article_id===id||x.similar_article_id===id);
    DB().remove("articles",x=>x.article_id===id);
  }
};
})(window.App);
