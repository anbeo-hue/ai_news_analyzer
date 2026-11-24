/* Bộ icon SVG nét mảnh, chèn một lần vào trang và gọi bằng <use href="#i-tên"> */
(function(A){
const P={
search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20v-1a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v1M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.5a5 5 0 0 1 3 4.5v1"/>',
shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',
flag:'<path d="M5 21V4m0 0h12l-2 4.5 2 4.5H5"/>',
chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
grid:'<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="11" width="8" height="10" rx="1.5"/><rect x="3" y="14" width="8" height="7" rx="1.5"/>',
news:'<path d="M5 4h11a2 2 0 0 1 2 2v13a1 1 0 0 0 1 1H7a2 2 0 0 1-2-2z"/><path d="M18 8h2a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2M8.5 8h6M8.5 12h6M8.5 16h4"/>',
globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1"/>',
chev:'<path d="M6 9l6 6 6-6"/>',
check:'<path d="M5 12l5 5L20 7"/>',
out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
menu:'<path d="M4 7h16M4 12h16M4 17h16"/>'};
A.Views.Icons={
  inject(){
    const s='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>'+Object.entries(P).map(([k,v])=>`<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join("")+'</defs></svg>';
    document.body.insertAdjacentHTML("afterbegin",s);
  }
};
})(window.App);
