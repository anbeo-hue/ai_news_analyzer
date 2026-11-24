/* Đăng nhập (2 vai trò), đăng ký, quên mật khẩu 4 bước */
(function(A){
const {$,$$}=A.U;
A.Views.Auth={
  login(role){return `<div class="auth"><div class="box">
<h2 class="t">Đăng nhập</h2><p class="mut">Chọn loại tài khoản để tiếp tục</p><div class="tabs" id="rt" style="margin-top:14px"><button class="${role==="user"?"on":""}" data-action="role" data-r="user">Người dùng</button><button class="${role==="admin"?"on":""}" data-action="role" data-r="admin">Quản trị viên</button></div>
<form id="f-login" data-form="login" novalidate><label>Email</label><input name="e" type="email" placeholder="ban@email.com"><div class="er"></div>
<label>Mật khẩu</label><div class="pw"><input name="p" type="password" placeholder="Nhập mật khẩu"><button type="button" data-action="eye" aria-label="Hiện mật khẩu">Hiện</button></div><div class="er"></div>
<div class="row"><label class="chk"><input type="checkbox" name="r"> Ghi nhớ tôi</label><a class="lnk" href="#forgot">Quên mật khẩu?</a></div>
<button class="btn full" style="margin-top:14px">Đăng nhập</button></form><p class="mut" id="dm" style="margin-top:14px">Tài khoản demo: ${role==="admin"?"admin@ainews.vn / admin123":"user@ainews.vn / user1234"} · <button type="button" class="lnk" data-action="demo">Điền sẵn</button></p>${role==="admin"?"":`
<div class="or">hoặc</div><button class="btn ghost full" data-action="gg">Tiếp tục với Google</button>
<p class="mut" style="text-align:center;margin-top:16px">Chưa có tài khoản? <a class="lnk" href="#register">Đăng ký</a></p>`}</div></div>`},
  register(){return `<div class="auth"><div class="box">
<h2 class="t">Tạo tài khoản</h2><p class="mut">Lưu lịch sử và theo dõi các bài đã phân tích</p>
<form id="f-reg" data-form="reg" novalidate><label>Họ và tên</label><input name="n" placeholder="Nguyễn Văn A"><div class="er"></div>
<label>Email</label><input name="e" type="email" placeholder="ban@email.com"><div class="er"></div>
<label>Mật khẩu</label><div class="pw"><input name="p" type="password" placeholder="Ít nhất 8 ký tự"><button type="button" data-action="eye" aria-label="Hiện mật khẩu">Hiện</button></div><div class="er"></div>
<label>Nhập lại mật khẩu</label><input name="c" type="password"><div class="er"></div>
<label class="chk"><input type="checkbox" name="t"> Tôi đồng ý với điều khoản sử dụng</label><div class="er"></div>
<button class="btn full">Đăng ký</button></form>
<p class="mut" style="text-align:center;margin-top:16px">Đã có tài khoản? <a class="lnk" href="#login">Đăng nhập</a></p></div></div>`},
  forgot(){return `<div class="auth"><div class="box">
<h2 class="t">Quên mật khẩu</h2><div class="stp" id="sp"><b></b><b></b><b></b></div>
<div data-s="1"><p class="mut">Nhập email đã đăng ký, chúng tôi sẽ gửi mã xác nhận 6 số.</p>
<form id="f-fg1" data-form="fg1" novalidate><label>Email</label><input name="e" type="email" placeholder="ban@email.com"><div class="er"></div><button class="btn full">Gửi mã xác nhận</button></form></div>
<div data-s="2" hidden><p class="mut">Nhập mã đã gửi tới email của bạn (mã demo: 123456).</p>
<form id="f-fg2" data-form="fg2" novalidate><label>Mã xác nhận</label><input name="c" maxlength="6" inputmode="numeric" placeholder="000000"><div class="er"></div><button class="btn full">Xác nhận</button></form>
<p class="mut" style="margin-top:12px">Chưa nhận được? <button type="button" class="lnk" data-action="resend">Gửi lại mã</button></p></div>
<div data-s="3" hidden><form id="f-fg3" data-form="fg3" novalidate><label>Mật khẩu mới</label><input name="p" type="password" placeholder="Ít nhất 8 ký tự"><div class="er"></div><label>Nhập lại mật khẩu</label><input name="c" type="password"><div class="er"></div><button class="btn full" style="margin-top:8px">Đặt lại mật khẩu</button></form></div>
<div data-s="4" hidden class="ok"><svg class="ic big" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-check"/></svg><h3 style="margin:8px 0">Đã đặt lại mật khẩu</h3><p class="mut">Bạn có thể đăng nhập bằng mật khẩu mới.</p><a class="btn" style="margin-top:14px" href="#login">Đăng nhập</a></div>
<p class="mut" style="text-align:center;margin-top:16px"><a class="lnk" href="#login">Quay lại đăng nhập</a></p></div></div>`},
  forgotStep(n){$$("[data-s]").forEach(x=>x.hidden=x.dataset.s!=n);$$("#sp b").forEach((b,i)=>b.classList.toggle("on",i<Math.min(n,3)))},
  fillDemo(role){const f=$("#f-login"),ad=role==="admin";f.e.value=ad?"admin@ainews.vn":"user@ainews.vn";f.p.value=ad?"admin123":"user1234"},
  passwordError(f,m){f.p.classList.add("bad");f.p.closest(".pw").nextElementSibling.textContent=m},
  togglePassword(btn){const x=btn.previousElementSibling;x.type=x.type==="password"?"text":"password";btn.textContent=x.type==="password"?"Hiện":"Ẩn"}
};
})(window.App);
