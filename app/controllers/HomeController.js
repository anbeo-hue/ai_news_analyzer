/* Trang chủ và luồng phân tích bài viết */
(function(A){
const {Models:M,Views:V,Session:S,Router:R}=A,toast=m=>V.Layout.toast(m);
A.Controllers.Home={
  init(){
    R.add("home",()=>V.Layout.mount(V.Home.render(M.Article.all())));
    A.Events.register({actions:{
      tab:el=>V.Home.showTab(el.dataset.t),
      analyze:()=>{
        const {mode,value:v}=V.Home.read();
        if(!v)return V.Home.setError(mode==="text"?"Vui lòng dán nội dung bài báo":"Vui lòng nhập đường dẫn bài báo");
        if(mode==="text"&&v.length<20)return V.Home.setError("Nội dung cần ít nhất 20 ký tự để phân tích");
        if(mode==="url"&&!/^https?:\/\/\S+\.\S+/.test(v))return V.Home.setError("Đường dẫn cần bắt đầu bằng http:// hoặc https://");
        V.Home.setError("");V.Home.setBusy(true);
        setTimeout(()=>{V.Home.setBusy(false);A.Controllers.Article.current=M.Analysis.analyze(v,mode==="url",S.user&&S.user.user_id);toast("Phân tích xong");R.go("result")},1200);
      }
    }});
  }
};
})(window.App);
