/* Khu quản trị: tổng quan, người dùng, bài viết, nguồn tin, chuyên mục, báo cáo */
(function(A){
const {Models:M,Views:V,Session:S,Validator:Vd,Router:R}=A,toast=m=>V.Layout.toast(m);
const PAGES=["admin","admin-users","admin-articles","admin-sources","admin-categories","admin-reports"];
const C=A.Controllers.Admin={
  q:"",sel:0,last:"",
  init(){
    PAGES.forEach(p=>R.add(p,h=>C.enter(h),{auth:true,role:"admin"}));
    A.Events.register({
      actions:{
        lock:el=>{const u=M.User.toggleStatus(+el.dataset.i);toast(u.status==="locked"?"Đã khóa tài khoản":"Đã mở khóa tài khoản");C.draw()},
        du:el=>{if(!V.UI.armed(el))return;M.User.remove(+el.dataset.i);toast("Đã xóa người dùng");C.draw()},
        da:el=>{if(!V.UI.armed(el))return;M.Article.remove(+el.dataset.i);toast("Đã xóa bài viết");C.draw()},
        ds:el=>{const id=+el.dataset.i;if(M.Source.countArticles(id))return toast("Không thể xóa: nguồn đang có bài viết");if(!V.UI.armed(el))return;M.Source.remove(id);toast("Đã xóa nguồn tin");C.draw()},
        dc:el=>{const id=+el.dataset.i;if(M.Category.countArticles(id))return toast("Không thể xóa: chuyên mục đang có bài viết");if(!V.UI.armed(el))return;M.Category.remove(id);toast("Đã xóa chuyên mục");C.draw()},
        tgs:el=>{M.Source.toggle(+el.dataset.i);toast("Đã cập nhật trạng thái");C.draw()},
        tgc:el=>{M.Category.toggle(+el.dataset.i);toast("Đã cập nhật trạng thái");C.draw()},
        rsel:el=>{C.sel=+el.dataset.i;C.draw()},
        rok:el=>{M.Report.resolve(+el.dataset.i,"resolved",V.AdminReports.note());toast("Đã cập nhật báo cáo");C.draw()},
        rno:el=>{M.Report.resolve(+el.dataset.i,"rejected",V.AdminReports.note());toast("Đã cập nhật báo cáo");C.draw()}
      },
      inputs:{"admin-search":el=>{C.q=el.value;C.draw();V.AdminLayout.restoreSearch(C.q,true)}},
      forms:{
        src:f=>{
          if(!Vd.check(f,{n:Vd.required("Nhập tên nguồn"),u:v=>!v?"Nhập tên miền":M.Source.urlExists(v)?"Nguồn này đã tồn tại":"",s:v=>v===""||isNaN(v)||v<0||v>100?"Nhập điểm từ 0 đến 100":""}))return;
          M.Source.create({name:f.n.value.trim(),url:f.u.value.trim(),source_type:f.t.value.trim(),reliability_score:+f.s.value});toast("Đã thêm nguồn tin");C.draw();
        },
        cat:f=>{
          if(!Vd.check(f,{n:v=>!v?"Nhập tên chuyên mục":M.Category.nameExists(v)?"Chuyên mục đã tồn tại":""}))return;
          M.Category.create({name:f.n.value.trim(),description:f.d.value.trim()});toast("Đã thêm chuyên mục");C.draw();
        }
      }
    });
  },
  /* Vào trang: chỉ đặt lại ô tìm kiếm / báo cáo đang chọn khi đổi sang trang quản trị khác */
  enter(h){if(h!==C.last){C.q="";C.sel=0;C.last=h}C.draw()},
  draw(){
    const p=PAGES.includes(R.current)?R.current:"admin",q=C.q.trim().toLowerCase(),AV=V.AdminLayout;AV.who=S.user.email;let html;
    if(p==="admin")html=V.AdminOverview.render(C.overview());
    else if(p==="admin-users")html=V.AdminUsers.render({total:M.User.all().length,selfId:S.user.user_id,users:M.User.all().filter(u=>(u.full_name+u.email).toLowerCase().includes(q)).map(u=>({...u,count:A.DB.where("analysis_history",x=>x.user_id===u.user_id).length}))});
    else if(p==="admin-articles")html=V.AdminArticles.render({total:M.Article.count(),articles:M.Article.all().filter(a=>a.title.toLowerCase().includes(q))});
    else if(p==="admin-sources")html=V.AdminSources.render(M.Source.all().map(s=>({...s,count:M.Source.countArticles(s.source_id)})));
    else if(p==="admin-categories")html=V.AdminCategories.render(M.Category.all().map(c=>({...c,count:M.Category.countArticles(c.category_id)})));
    else html=V.AdminReports.render({reports:M.Report.all(),selected:C.sel?M.Report.find(C.sel):null});
    V.Layout.mount(AV.wrap(p,html));AV.restoreSearch(C.q);
  },
  overview(){
    const nu=M.User.all().filter(u=>u.role==="user"),rp=M.Report.all();
    return{users:nu.length,activeUsers:nu.filter(u=>u.status==="active").length,articles:M.Article.count(),sources:M.Source.all().length,history:M.History.count(),bookmarks:M.Bookmark.total(),pending:M.Report.pendingCount(),reports:rp.length,dates:M.History.dates(),levels:M.Analysis.levels(),recent:rp.slice(0,4),cats:M.Category.all().map(c=>[c.name,M.Category.countArticles(c.category_id)])};
  }
};
})(window.App);
