/* Điểm khởi động: nạp icon, khôi phục phiên đăng nhập, khởi tạo controller, bật bắt sự kiện và Router */
(function(A){
A.Views.Icons.inject();
A.Session.restore();
["Layout","Auth","Home","Article","User","Admin"].forEach(n=>A.Controllers[n].init());
A.Controllers.Layout.render();
A.Events.init();
A.Router.start();
})(window.App);
