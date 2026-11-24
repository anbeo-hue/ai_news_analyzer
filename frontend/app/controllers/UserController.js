/* Các trang của người dùng: dashboard, lịch sử, đã lưu, báo cáo của tôi, hồ sơ */
(function(A){
const {Models:M,Views:V,Session:S,Validator:Vd,Router:R,U}=A,toast=m=>V.Layout.toast(m);
const C=A.Controllers.User={
  q:"",
  init(){
    const own={auth:true,role:"user"};
    R.add("dashboard",()=>C.dashboard(),own);
    R.add("history",()=>C.history(),own);
    R.add("bookmarks",()=>V.Layout.mount(V.Bookmarks.render(M.Bookmark.list(S.user.user_id))),own);
    R.add("reports",()=>V.Layout.mount(V.MyReports.render(M.Report.byUser(S.user.user_id))),own);
    R.add("profile",()=>V.Layout.mount(V.Profile.render(S.user)),{auth:true});
    A.Events.register({
      actions:{delh:el=>{M.History.remove(+el.dataset.i);toast("Đã xóa khỏi lịch sử");C.refreshList()}},
      inputs:{"history-search":el=>{C.q=el.value;C.refreshList()}},
      forms:{
        info:f=>{
          if(!Vd.check(f,{n:Vd.required("Vui lòng nhập họ tên"),e:Vd.email}))return;
          M.User.update(S.user.user_id,{full_name:f.n.value.trim(),email:f.e.value.trim().toLowerCase()});
          A.Controllers.Layout.render();R.refresh();toast("Đã lưu thay đổi");
        },
        pass:f=>{
          if(!Vd.check(f,{o:v=>v===S.user.password?"":"Mật khẩu hiện tại chưa đúng",p:Vd.password,c:Vd.same(f)}))return;
          S.user.password=f.p.value.trim();f.reset();toast("Đã cập nhật mật khẩu");
        }
      }
    });
  },
  dashboard(){
    const u=S.user,h=M.History.byUser(u.user_id);
    V.Layout.mount(V.Dashboard.render({user:u,count:h.length,avg:U.avg(h.map(x=>x.a.an.trust_score)),bookmarks:M.Bookmark.countByUser(u.user_id),reports:M.Report.countByUser(u.user_id),dates:h.map(x=>x.created_at),levels:h.map(x=>x.a.an.trust_level),recent:h.slice(0,4)}));
  },
  history(){C.q="";V.Layout.mount(V.History.render(C.listHtml()))},
  listHtml(){const all=M.History.byUser(S.user.user_id),q=C.q.trim().toLowerCase();return V.History.list(all.filter(h=>h.a.title.toLowerCase().includes(q)),all.length)},
  refreshList(){V.History.setList(C.listHtml())}
};
})(window.App);
