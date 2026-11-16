/* Bảng sources (và authors gắn với nguồn) */
(function(A){
A.Models.Source={
  all:()=>A.DB.all("sources"),
  find:id=>A.DB.find("sources","source_id",id),
  urlExists:u=>A.DB.all("sources").some(x=>x.url===u.toLowerCase()),
  create({name,url,source_type,reliability_score}){return A.DB.insert("sources",{name,url:url.toLowerCase(),description:"",source_type:source_type||"Khác",reliability_score,status:"active",created_at:A.U.today()})},
  findOrCreate(url,name,type){return A.DB.find("sources","url",url)||this.create({name,url,source_type:type,reliability_score:50})},
  toggle(id){const s=this.find(id);s.status=s.status==="active"?"inactive":"active";return s},
  countArticles:id=>A.DB.where("articles",a=>a.source_id===id).length,
  remove(id){if(this.countArticles(id))return{ok:false,msg:"Không thể xóa: nguồn đang có bài viết"};A.DB.remove("authors",x=>x.source_id===id);A.DB.remove("sources",x=>x.source_id===id);return{ok:true}}
};
})(window.App);
