/* Trang chủ và luồng phân tích bài viết: gửi bài tới backend (POST /api/analyze), lưu kết quả rồi mở trang kết quả */
(function(A){
const {Models:M,Views:V,Session:S,Router:R}=A,toast=m=>V.Layout.toast(m);
const C=A.Controllers.Home={
  busy:false,   /* đang chờ backend: chặn bấm "Phân tích" nhiều lần */
  init(){
    R.add("home",()=>V.Layout.mount(V.Home.render(M.Article.all())));
    A.Events.register({actions:{
      tab:el=>V.Home.showTab(el.dataset.t),
      analyze:()=>{
        if(C.busy)return;
        const {mode,value:v}=V.Home.read();
        if(!v)return V.Home.setError(mode==="text"?"Vui lòng dán nội dung bài báo":"Vui lòng nhập đường dẫn bài báo");
        if(mode==="text"&&v.length<20)return V.Home.setError("Nội dung cần ít nhất 20 ký tự để phân tích");
        if(mode==="text"&&v.length>50000)return V.Home.setError("Nội dung quá dài, tối đa 50.000 ký tự");
        if(mode==="url"&&!/^https?:\/\/\S+\.\S+/.test(v))return V.Home.setError("Đường dẫn cần bắt đầu bằng http:// hoặc https://");
        V.Home.setError("");C.busy=true;V.Home.setBusy(true);
        A.Api.analyze(mode==="url"?{url:v}:{text:v})
          .then(res=>{
            C.busy=false;V.Home.setBusy(false);
            A.Controllers.Article.current=M.Analysis.save(res,mode==="text"?v:"",S.user&&S.user.user_id);
            toast("Phân tích xong");
            if(R.current==="home")R.go("result");   /* người dùng đã chuyển trang khác thì không kéo họ quay lại */
          })
          .catch(e=>{
            C.busy=false;V.Home.setBusy(false);
            R.current==="home"?V.Home.setError(e.message):toast(e.message);
          });
      }
    }});
  }
};
})(window.App);
