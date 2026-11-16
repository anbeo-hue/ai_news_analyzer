(function(A){
A.U={
  $:s=>document.querySelector(s),
  $$:s=>[...document.querySelectorAll(s)],
  esc:s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])),
  today:()=>new Date().toISOString().slice(0,10),
  fmt:s=>s?String(s).slice(0,10).split("-").reverse().join("/"):"—",
  avg:l=>l.length?Math.round(l.reduce((a,b)=>a+b,0)/l.length):0
};
})(window.App);
