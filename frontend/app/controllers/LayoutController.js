/* Điều khiển phần khung: header/menu, footer, menu xổ xuống, nút mở menu trên điện thoại */
(function(A){
const V=()=>A.Views.Layout;
A.Controllers.Layout={
  init(){
    A.Events.register({actions:{dd:el=>V().toggleMenu(el),burger:()=>V().toggleNav()}});
    document.addEventListener("click",e=>V().closeMenus(e.target.closest('[data-action="dd"]')));
    document.addEventListener("keydown",e=>{if(e.key==="Escape")V().closeMenus()});
    V().footer();
  },
  render(){V().header(A.Session.user)},
  syncNav(h){V().setActive(h);V().closeNav()}
};
})(window.App);
