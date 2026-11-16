/* Đăng nhập (user/admin), đăng ký, quên mật khẩu, đăng xuất */
(function(A){
const {Models:M,Views:V,Session:S,Validator:Vd,Router:R}=A,toast=m=>V.Layout.toast(m);
const C=A.Controllers.Auth={
  role:"user",fgEmail:"",
  init(){
    R.add("login",()=>C.login("user"),{guest:true});
    R.add("login-admin",()=>C.login("admin"),{guest:true});
    R.add("register",()=>V.Layout.mount(V.Auth.register()),{guest:true});
    R.add("forgot",()=>{V.Layout.mount(V.Auth.forgot());V.Auth.forgotStep(1)});
    A.Events.register({
      actions:{
        role:el=>R.go(el.dataset.r==="admin"?"login-admin":"login"),
        demo:()=>V.Auth.fillDemo(C.role),
        eye:el=>V.Auth.togglePassword(el),
        gg:()=>toast("Đăng nhập Google chỉ là bản demo"),
        resend:()=>toast("Đã gửi lại mã xác nhận"),
        out:()=>{S.logout();A.Controllers.Layout.render();toast("Đã đăng xuất");R.go("home")}
      },
      forms:{
        login:f=>{
          if(!Vd.check(f,{e:Vd.email,p:Vd.required("Vui lòng nhập mật khẩu")}))return;
          const u=M.User.authenticate(f.e.value,f.p.value);
          if(!u)return V.Auth.passwordError(f,"Email hoặc mật khẩu chưa đúng");
          if(u.role!==C.role)return toast(C.role==="admin"?"Tài khoản này không có quyền quản trị":"Đây là tài khoản quản trị, hãy chọn tab Quản trị viên");
          if(u.status==="locked")return toast("Tài khoản đã bị khóa, vui lòng liên hệ quản trị viên");
          S.login(u);A.Controllers.Layout.render();toast("Đăng nhập thành công");R.go(S.home());
        },
        reg:f=>{
          if(!Vd.check(f,{n:Vd.required("Vui lòng nhập họ tên"),e:v=>Vd.email(v)||(M.User.emailTaken(v)?"Email đã được sử dụng":""),p:Vd.password,c:Vd.same(f),t:v=>v?"":"Bạn cần đồng ý với điều khoản"}))return;
          S.login(M.User.create({full_name:f.n.value.trim(),email:f.e.value,password:f.p.value}));
          A.Controllers.Layout.render();toast("Tạo tài khoản thành công");R.go("dashboard");
        },
        fg1:f=>{
          if(!Vd.check(f,{e:v=>Vd.email(v)||(M.User.emailTaken(v)?"":"Email này chưa được đăng ký")}))return;
          C.fgEmail=f.e.value.trim().toLowerCase();V.Auth.forgotStep(2);toast("Đã gửi mã xác nhận");
        },
        fg2:f=>{if(Vd.check(f,{c:v=>v==="123456"?"":"Mã xác nhận chưa đúng"}))V.Auth.forgotStep(3)},
        fg3:f=>{if(!Vd.check(f,{p:Vd.password,c:Vd.same(f)}))return;M.User.setPassword(C.fgEmail,f.p.value.trim());V.Auth.forgotStep(4)}
      }
    });
  },
  login(role){C.role=role;V.Layout.mount(V.Auth.login(role))}
};
})(window.App);
