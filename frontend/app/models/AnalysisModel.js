/* Bảng article_analysis: kết quả phân tích của AI cho từng bài viết. */
(function(A){
const M=A.Models.Analysis={
  level:n=>n>=75?"high":n>=50?"medium":"low",
  /* Dùng cho dữ liệu mẫu trong database.js */
  build(id,articleId,cat,conf,summary,keywords,z,date){
    const t=Math.round(z.reduce((a,b)=>a+b,0)/5);
    return{analysis_id:id,article_id:articleId,category_prediction:cat,category_confidence:conf,summary,keywords,
      source_score:z[0],author_score:z[1],evidence_score:z[2],crosscheck_score:z[3],content_score:z[4],
      trust_score:t,trust_level:M.level(t),model_name:"ai-news-analyzer",model_version:"1.0",analyzed_at:date};
  },
  /* Các thanh điểm: [tên, điểm 0-100, chữ hiển thị]. Kết quả từ backend có thêm criteria (điểm đạt/điểm tối đa, ví dụ 22/25). */
  criteria:n=>n.criteria
    ?n.criteria.map(c=>[c.label,c.score,c.points+"/"+c.max_points])
    :[["Nguồn tin",n.source_score],["Tác giả",n.author_score],["Dẫn chứng",n.evidence_score],["Đối chiếu chéo",n.crosscheck_score],["Nội dung",n.content_score]].map(x=>[x[0],x[1],x[1]+"%"]),
  levels:()=>A.DB.all("article_analysis").map(x=>x.trust_level),
  /* Lưu kết quả do backend trả về (POST /api/analyze) thành bài viết + nguồn + tác giả + kết quả phân tích + lịch sử.
     rawText: nội dung người dùng dán (rỗng nếu phân tích bằng URL). Trả về article_id để mở trang kết quả. */
  save(res,rawText,userId){
    const DB=A.DB,t=A.U.today(),info=res.article,manual=!info.url;
    const src=manual
      ?A.Models.Source.findOrCreate("nhap-tay","Văn bản nhập tay","Văn bản nhập tay")
      :A.Models.Source.findOrCreate(info.source_domain,info.source_domain,"Chưa phân loại");
    /* Backend trả "Không rõ" hoặc "Có nêu trong bài" khi không có tên tác giả cụ thể: không tạo bản ghi tác giả */
    const au=!info.author||/^(Không rõ|Có nêu trong bài)$/.test(info.author)?null
      :DB.insert("authors",{source_id:src.source_id,name:info.author,email:"",bio:"",created_at:t});
    const cats=DB.all("categories"),cat=cats.find(c=>c.name===res.category_prediction)||cats[0];
    const pub=/^\d{4}-\d{2}-\d{2}/.test(info.published_at||"")?info.published_at.slice(0,10):"";
    const ar=DB.insert("articles",{source_id:src.source_id,author_id:au?au.author_id:null,category_id:cat.category_id,
      title:info.title,content:manual?rawText:"",url:info.url||"",published_at:pub,created_at:t});
    const n=DB.insert("article_analysis",{article_id:ar.article_id,category_prediction:res.category_prediction,
      category_confidence:res.category_confidence,summary:res.summary,keywords:(res.keywords||[]).join(",")||"Tin tức",
      source_score:res.source_score,author_score:res.author_score,evidence_score:res.evidence_score,
      crosscheck_score:res.crosscheck_score,content_score:res.content_score,
      trust_score:res.trust_score,trust_level:res.trust_level,model_name:res.model_name,model_version:res.model_version,
      analyzed_at:res.analyzed_at||t,criteria:res.criteria,explanations:res.explanations});
    if(userId)A.Models.History.add(userId,ar.article_id,n.analysis_id);
    return ar.article_id;
  }
};
})(window.App);
