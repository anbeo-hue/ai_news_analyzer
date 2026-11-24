/* Hồ sơ cá nhân: sửa thông tin, đổi mật khẩu */
(function(A){
const {esc}=A.U;
A.Views.Profile={
  render(u){return `<div class="pf"><div class="box side"><div class="av" id="pa">${esc(u.full_name[0].toUpperCase())}</div><b id="pn">${esc(u.full_name)}</b><p class="mut" id="pe">${esc(u.email)}</p><button class="btn red full" style="margin-top:14px" data-action="out">Đăng xuất</button></div>
<div><div class="box"><h2 class="t">Thông tin cá nhân</h2>
<form id="f-info" data-form="info" novalidate><label>Họ và tên</label><input name="n" value="${esc(u.full_name)}"><div class="er"></div><label>Email</label><input name="e" type="email" value="${esc(u.email)}"><div class="er"></div><div style="margin-top:12px"><button class="btn">Lưu thay đổi</button></div></form></div>
<div class="box"><h2 class="t">Đổi mật khẩu</h2>
<form id="f-pass" data-form="pass" novalidate><label>Mật khẩu hiện tại</label><input name="o" type="password"><div class="er"></div><label>Mật khẩu mới</label><input name="p" type="password"><div class="er"></div><label>Nhập lại mật khẩu mới</label><input name="c" type="password"><div class="er"></div><div style="margin-top:12px"><button class="btn">Cập nhật mật khẩu</button></div></form></div></div></div>`}
};
})(window.App);
