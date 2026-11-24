/* Trang kết quả phân tích, lưu bài (bookmark) và báo cáo bài viết */
(function(A){
const {Models:M,Views:V,Session:S,Validator:Vd,Router:R}=A,toast=m=>V.Layout.toast(m);
const C=A.Controllers.Article={
  current:0,
  init(){
    R.add("result",()=>C.show());
    A.Events.register({
      actions:{
        open:el=>{C.current=+el.dataset.i;R.go("result")},
        bm:el=>{
          if(!S.user){toast("Hãy đăng nhập để sử dụng chức năng này");return R.go("login")}
          toast(M.Bookmark.toggle(S.user.user_id,+el.dataset.i)?"Đã lưu bài viết":"Đã bỏ lưu bài viết");R.refresh();
        },
        rpt:()=>{
          if(!S.user){toast("Hãy đăng nhập để sử dụng chức năng này");return R.go("login")}
          V.Result.toggleReport();
        }
      },
      forms:{rep:f=>{
        if(!Vd.check(f,{d:v=>v.length<10?"Hãy mô tả ít nhất 10 ký tự":""}))return;
        M.Report.create({user_id:S.user.user_id,article_id:C.current,reason:f.r.value,description:f.d.value.trim()});
        f.reset();V.Result.closeReport();toast("Đã gửi báo cáo, quản trị viên sẽ xem xét");
      }}
    });
  },
  show(){
    const a=M.Article.find(C.current)||M.Article.find(1);C.current=a.article_id;
    V.Layout.mount(V.Result.render({a,similar:M.Article.similar(a.article_id),saved:!!S.user&&M.Bookmark.has(S.user.user_id,a.article_id)}));
  }
};
})(window.App);
