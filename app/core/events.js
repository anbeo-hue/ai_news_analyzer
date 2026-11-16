/* Bắt sự kiện tập trung bằng thuộc tính data-*:
   data-action="tên"  -> App.Events.actions[tên](phầnTử, sựKiện)
   data-form="tên"    -> App.Events.forms[tên](form)
   data-input="tên"   -> App.Events.inputs[tên](phầnTử)
   Thẻ <a href="#..."> được chuyển cho Router để không phụ thuộc vào hành vi mặc định của trình duyệt. */
(function(A){
A.Events={
  actions:{},forms:{},inputs:{},
  register(h){Object.assign(this.actions,h.actions||{});Object.assign(this.forms,h.forms||{});Object.assign(this.inputs,h.inputs||{})},
  init(){
    document.addEventListener("click",e=>{
      const a=e.target.closest('a[href^="#"]');
      if(a&&a.getAttribute("href").length>1){e.preventDefault();A.Router.go(a.getAttribute("href").slice(1))}
      const el=e.target.closest("[data-action]");
      if(el){const fn=this.actions[el.dataset.action];if(fn)fn(el,e)}
    });
    document.addEventListener("submit",e=>{
      const f=e.target.closest("form[data-form]");if(!f)return;
      e.preventDefault();const fn=this.forms[f.dataset.form];if(fn)fn(f);
    });
    document.addEventListener("input",e=>{
      const el=e.target;if(el.classList)el.classList.remove("bad");
      const fn=el.dataset&&el.dataset.input&&this.inputs[el.dataset.input];if(fn)fn(el);
    });
  }
};
})(window.App);
