/* Bảng categories */
(function(A){
A.Models.Category={
  all:()=>A.DB.all("categories"),
  find:id=>A.DB.find("categories","category_id",id),
  nameExists:n=>A.DB.all("categories").some(x=>x.name.toLowerCase()===n.toLowerCase()),
  create({name,description}){return A.DB.insert("categories",{name,description,status:"active",created_at:A.U.today()})},
  toggle(id){const c=this.find(id);c.status=c.status==="active"?"inactive":"active";return c},
  countArticles:id=>A.DB.where("articles",a=>a.category_id===id).length,
  /* Không cho xóa chuyên mục đang có bài viết (ON DELETE RESTRICT) */
  remove(id){if(this.countArticles(id))return{ok:false,msg:"Không thể xóa: chuyên mục đang có bài viết"};A.DB.remove("categories",x=>x.category_id===id);return{ok:true}}
};
})(window.App);
