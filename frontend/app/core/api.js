/* Gọi backend FastAPI (backend/). Mọi lỗi được đổi thành Error có thông báo tiếng Việt hiển thị được cho người dùng.
   Địa chỉ backend lấy từ App.config.apiBase (core/app.js). Backend cần bật trước: uvicorn app.main:app --port 8001 */
(function(A){
const TIMEOUT=60000;   /* phân tích bằng AI có thể mất vài giây, chờ tối đa 60 giây */

/* Backend báo lỗi dạng {detail:"..."} (lỗi nghiệp vụ) hoặc {detail:[{msg:"..."}]} (lỗi kiểm tra dữ liệu) */
const detailText=d=>{
  if(typeof d==="string")return d;
  if(Array.isArray(d)&&d[0]&&d[0].msg)return String(d[0].msg).replace(/^Value error,\s*/,"");
  return "";
};

A.Api={
  async request(path,opt){
    const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),TIMEOUT);
    let resp;
    try{resp=await fetch(A.config.apiBase+path,{...opt,signal:ctl.signal})}
    catch(e){
      throw new Error(e.name==="AbortError"
        ?"Máy chủ phản hồi quá lâu, hãy thử lại"
        :"Không kết nối được máy chủ phân tích. Hãy bật backend ("+A.config.apiBase+")");
    }finally{clearTimeout(timer)}
    let data=null;
    try{data=await resp.json()}catch(e){}
    if(!resp.ok)throw new Error(detailText(data&&data.detail)||"Máy chủ trả về lỗi "+resp.status);
    return data;
  },
  /* payload: {url} hoặc {text}. Trả về kết quả phân tích (xem backend/README.md) */
  analyze(payload){
    return this.request("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)})
      .then(d=>{
        if(!d||!d.article||typeof d.trust_score!=="number")throw new Error("Phản hồi từ máy chủ không đúng định dạng");
        return d;
      });
  },
  health(){return this.request("/api/health")}
};
})(window.App);
