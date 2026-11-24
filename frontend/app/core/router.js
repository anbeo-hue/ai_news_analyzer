/* Router theo hash (#home, #result, #admin-users ...). Mỗi route khai báo cùng quyền truy cập:
   auth:true  -> phải đăng nhập · role:"admin"|"user" -> giới hạn vai trò · guest:true -> chỉ dành cho khách */
(function(A){
A.Router={
  routes:{},current:"home",
  add(path,handler,opt={}){this.routes[path]={handler,...opt}},
  go(h){
    h=h||"home";
    try{if(location.hash!=="#"+h)location.hash=h}catch(e){}
    this.current=h;this.dispatch();
  },
  dispatch(){
    const h=this.current,S=A.Session,r=this.routes[h],L=A.Views.Layout;
    if(!r){A.Controllers.Layout.syncNav(h);L.mount(L.notFound());return}
    if(r.guest&&S.user)return this.go(S.home());
    if(r.auth&&!S.user){L.toast("Vui lòng đăng nhập để tiếp tục");return this.go("login")}
    if(r.role==="admin"&&!S.isAdmin()){L.toast("Bạn không có quyền truy cập khu vực quản trị");return this.go("dashboard")}
    if(r.role==="user"&&S.isAdmin())return this.go("admin");
    A.Controllers.Layout.syncNav(h);window.scrollTo(0,0);r.handler(h);
  },
  refresh(){const r=this.routes[this.current];if(r)r.handler(this.current)},
  start(){
    addEventListener("hashchange",()=>{const h=location.hash.slice(1)||"home";if(h!==this.current){this.current=h;this.dispatch()}});
    this.current=location.hash.slice(1)||"home";this.dispatch();
  }
};
})(window.App);
