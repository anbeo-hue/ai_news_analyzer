(function(A){
const isMail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
A.Validator={
  isMail,
  required:m=>v=>v?"":m,
  password:v=>v.length<8?"Mật khẩu cần ít nhất 8 ký tự":"",
  email:v=>!v?"Vui lòng nhập email":isMail(v)?"":"Email chưa đúng định dạng",
  same:f=>v=>v!==f.p.value.trim()?"Mật khẩu nhập lại chưa khớp":"",
  /* check(form, {tênTrường: hàmKiểmTra}) -> true nếu hợp lệ; tự hiện lỗi dưới từng ô nhập */
  check(f,rules){
    let ok=true;
    f.querySelectorAll(".bad").forEach(x=>x.classList.remove("bad"));
    f.querySelectorAll(".er").forEach(x=>x.textContent="");
    for(const[n,fn]of Object.entries(rules)){
      const el=f[n],m=fn(el.type==="checkbox"?el.checked:el.value.trim());
      if(m){ok=false;el.classList.add("bad");
        const e=(el.closest(".pw")||el.closest(".chk")||el).nextElementSibling;
        if(e&&e.classList.contains("er"))e.textContent=m}
    }
    return ok;
  }
};
})(window.App);
