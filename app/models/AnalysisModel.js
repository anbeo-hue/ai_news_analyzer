/* Bảng article_analysis: kết quả phân tích của AI cho từng bài viết. */
(function(A){
const M=A.Models.Analysis={
  level:n=>n>=75?"high":n>=50?"medium":"low",
  build(id,articleId,cat,conf,summary,keywords,z,date){
    const t=Math.round(z.reduce((a,b)=>a+b,0)/5);
    return{analysis_id:id,article_id:articleId,category_prediction:cat,category_confidence:conf,summary,keywords,
      source_score:z[0],author_score:z[1],evidence_score:z[2],crosscheck_score:z[3],content_score:z[4],
      trust_score:t,trust_level:M.level(t),model_name:"ai-news-analyzer",model_version:"1.0",analyzed_at:date};
  },
  criteria:n=>[["Nguồn tin",n.source_score],["Tác giả",n.author_score],["Dẫn chứng",n.evidence_score],["Đối chiếu chéo",n.crosscheck_score],["Nội dung",n.content_score]],
  levels:()=>A.DB.all("article_analysis").map(x=>x.trust_level),
  /* Tạo bài viết + kết quả phân tích từ văn bản/URL người dùng nhập. Điểm số là giả lập, thay bằng API AI thật khi triển khai. */
  analyze(raw,isUrl,userId){
    const DB=A.DB,t=A.U.today();let host="";
    if(isUrl){try{host=new URL(raw).hostname.replace(/^www\./,"")}catch(e){}}
    const s=A.Models.Source.findOrCreate(host||"nhap-tay",host||"Văn bản nhập tay",host?"Chưa phân loại":"Văn bản nhập tay");
    const h=raw.length*7+raw.charCodeAt(raw.length-1),b=40+h%50,cats=DB.all("categories"),cat=cats[h%cats.length];
    const z=[s.reliability_score,b-8,b+4,b-3,b+2].map(x=>Math.max(5,Math.min(98,Math.round(x))));
    const kw=[...new Set(raw.toLowerCase().match(/\p{L}{5,}/gu)||[])].slice(0,4);
    const ar=DB.insert("articles",{source_id:s.source_id,author_id:null,category_id:cat.category_id,
      title:isUrl?"Bài viết từ "+host:raw.slice(0,70)+(raw.length>70?"…":""),content:isUrl?"":raw,url:isUrl?raw:"",published_at:t,created_at:t});
    const sum="Tóm tắt tự động: "+(isUrl?"nội dung được trích từ đường dẫn đã nhập.":raw.slice(0,140)+(raw.length>140?"…":""));
    const n=DB.insert("article_analysis",M.build(0,ar.article_id,cat.name,70+h%28,sum,kw.join(",")||"Tin tức",z,t));
    if(userId)A.Models.History.add(userId,ar.article_id,n.analysis_id);
    return ar.article_id;
  }
};
})(window.App);
