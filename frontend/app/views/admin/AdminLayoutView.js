/* Khung khu quản trị: thanh bên 6 mục + tiêu đề trang (có ô tìm kiếm tùy chọn) */
(function(A){
const {$,esc}=A.U,I=n=>A.Views.UI.I(n);
A.Views.AdminLayout={
  who:"",
  head(t,s,search){return `<div class="row"><div><h2 class="t">${t}</h2><p class="mut">${s}</p></div>${search?`<div style="width:260px;max-width:100%"><input id="aq" data-input="admin-search" placeholder="${search}"></div>`:`<span class="chip">${esc(this.who)}</span>`}</div>`},
  wrap(p,html){
    const items=[["admin","grid","Tổng quan"],["admin-users","users","Người dùng"],["admin-articles","news","Bài viết"],["admin-sources","globe","Nguồn tin"],["admin-categories","tag","Chuyên mục"],["admin-reports","flag","Báo cáo"]];
    return `<div class="adm"><aside class="box sb"><b>Quản trị</b>${items.map(([h,i,t])=>`<a href="#${h}" data-p="${h}" class="${h===p?"on":""}">${I(i)} ${t}</a>`).join("")}</aside><div id="am">${html}</div></div>`;
  },
  restoreSearch(q,focus){const f=$("#aq");if(!f)return;f.value=q;if(focus){f.focus();f.setSelectionRange(q.length,q.length)}}
};
})(window.App);
