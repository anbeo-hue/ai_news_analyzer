/* Cơ sở dữ liệu giả lập đặt trong bộ nhớ, theo ERD ai_news_analyzer.
   Khi có backend thật: thay các hàm trong App.DB (hoặc từng Model) bằng lời gọi API, View và Controller giữ nguyên.
   Giá trị enum (role, status, trust_level...) là giả định. */
(function(A){
const rows=(k,d)=>d.map(a=>Object.fromEntries(k.map((x,i)=>[x,a[i]])));
const mk=A.Models.Analysis.build;
const PK={users:"user_id",categories:"category_id",sources:"source_id",authors:"author_id",articles:"article_id",article_analysis:"analysis_id",similar_articles:"similar_id",bookmarks:"bookmark_id",reports:"report_id",analysis_history:"history_id"};
const data={
users:rows(["user_id","full_name","email","password","avatar","role","status","created_at"],[
[1,"Quản trị viên","admin@ainews.vn","admin123","","admin","active","2026-01-10"],
[2,"Nguyễn Minh Anh","user@ainews.vn","user1234","","user","active","2026-02-14"],
[3,"Trần Quốc Bảo","bao@mail.vn","user1234","","user","active","2026-03-02"],
[4,"Lê Thu Hà","ha@mail.vn","user1234","","user","locked","2026-04-21"],
[5,"Phạm Gia Huy","huy@mail.vn","user1234","","user","active","2026-06-09"]]),
categories:rows(["category_id","name","description","status","created_at"],[
[1,"Kinh tế","Tài chính, thị trường, chính sách","active","2026-01-10"],
[2,"Công nghệ","Khoa học, công nghệ và AI","active","2026-01-10"],
[3,"Sức khỏe","Y tế và chăm sóc sức khỏe","active","2026-01-10"],
[4,"Xã hội","Tin xã hội và đời sống","active","2026-01-10"]]),
sources:rows(["source_id","name","url","description","source_type","reliability_score","status","created_at"],[
[1,"Báo Mẫu","baomau.vn","Báo điện tử tổng hợp","Báo chính thống",88,"active","2026-01-10"],
[2,"Tin Nhanh","tinnhanh.example","Tin nhanh 24 giờ","Báo điện tử",65,"active","2026-01-12"],
[3,"Phân Tích 24h","phantich.example","Chuyên đề phân tích","Tạp chí",82,"active","2026-01-15"],
[4,"Blog Không Rõ Nguồn","blog-khong-ro.example","Blog cá nhân","Blog",30,"active","2026-02-01"]]),
authors:rows(["author_id","source_id","name","email","bio","created_at"],[
[1,1,"Nguyễn Hoài Nam","nam@baomau.vn","Phóng viên kinh tế","2026-01-10"],
[2,2,"Trần Thị Lan","lan@tinnhanh.example","Biên tập viên","2026-01-12"],
[3,3,"Lê Quang Minh","minh@phantich.example","Nhà phân tích","2026-01-15"],
[4,4,"Ẩn danh","","","2026-02-01"]]),
articles:rows(["article_id","source_id","author_id","category_id","title","content","url","published_at","created_at"],[
[1,1,1,1,"Chính phủ công bố gói hỗ trợ doanh nghiệp nhỏ","","https://baomau.vn/goi-ho-tro","2026-11-06","2026-11-06"],
[2,2,2,4,"Cảnh báo chiêu trò lừa đảo qua mạng xã hội","","https://tinnhanh.example/lua-dao","2026-11-04","2026-11-04"],
[3,4,4,3,"Tin đồn thuốc chữa bách bệnh lan truyền nhanh","","https://blog-khong-ro.example/thuoc","2026-11-01","2026-11-01"],
[4,3,3,1,"Lạm phát quý III giảm nhẹ, thị trường kỳ vọng","","https://phantich.example/lam-phat","2026-11-07","2026-11-07"],
[5,1,1,2,"AI tạo sinh thay đổi cách tòa soạn làm tin","","https://baomau.vn/ai-toa-soan","2026-11-08","2026-11-08"],
[6,4,4,4,"Thông tin giả về bão lan nhanh trên mạng","","https://blog-khong-ro.example/bao","2026-11-05","2026-11-05"]]),
article_analysis:[
mk(1,1,"Kinh tế",92,"Chính phủ thông báo gói hỗ trợ gồm giảm thuế, giãn nợ và vay ưu đãi cho doanh nghiệp nhỏ. Bài viết dẫn số liệu và ý kiến từ cơ quan quản lý.","Chính sách,Doanh nghiệp,Hỗ trợ",[88,85,80,78,82],"2026-11-06"),
mk(2,2,"Xã hội",81,"Bài viết cảnh báo các thủ đoạn giả mạo ngân hàng và trúng thưởng trên mạng xã hội, kèm lời khuyên cho người dùng. Một số số liệu chưa nêu rõ nguồn.","Lừa đảo,Mạng xã hội,Cảnh báo",[65,60,62,58,70],"2026-11-04"),
mk(3,3,"Sức khỏe",88,"Bài viết khẳng định một loại thuốc chữa được nhiều bệnh nhưng không dẫn nghiên cứu hay ý kiến chuyên gia y tế nào.","Sức khỏe,Thuốc,Tin đồn",[30,20,25,28,40],"2026-11-01"),
mk(4,4,"Kinh tế",90,"Bài phân tích cho biết lạm phát quý III giảm nhẹ và thị trường kỳ vọng chính sách tiền tệ ổn định, có đối chiếu số liệu thống kê.","Lạm phát,Thị trường,Kinh tế",[82,80,78,75,76],"2026-11-07"),
mk(5,5,"Công nghệ",94,"Bài viết nêu cách các tòa soạn ứng dụng AI tạo sinh trong soạn thảo, kiểm chứng và những lo ngại về đạo đức báo chí.","AI,Báo chí,Công nghệ",[88,85,90,84,86],"2026-11-08"),
mk(6,6,"Xã hội",79,"Bài viết lan truyền thông tin bão đổ bộ kèm hình ảnh không rõ nguồn gốc, chưa được cơ quan khí tượng xác nhận.","Bão,Tin giả,Thiên tai",[30,20,22,26,34],"2026-11-05")],
similar_articles:rows(["similar_id","article_id","similar_article_id","similarity_score","created_at"],[[1,1,4,74,"2026-11-06"],[2,1,5,48,"2026-11-06"],[3,2,6,69,"2026-11-04"],[4,2,3,55,"2026-11-04"],[5,3,6,71,"2026-11-01"],[6,4,1,74,"2026-11-07"],[7,4,5,45,"2026-11-07"],[8,5,1,40,"2026-11-08"],[9,5,4,45,"2026-11-08"],[10,6,2,60,"2026-11-05"]]),
bookmarks:rows(["bookmark_id","user_id","article_id","created_at"],[[1,2,1,"2026-11-06"],[2,2,5,"2026-11-08"],[3,3,4,"2026-11-08"],[4,5,5,"2026-11-07"]]),
reports:rows(["report_id","user_id","article_id","reason","description","status","admin_note","created_at","resolved_at"],[
[1,2,3,"Thông tin sai sự thật","Bài viết nêu công dụng thuốc không có cơ sở khoa học.","pending","","2026-11-07",null],
[2,3,6,"Tin giả","Hình ảnh bão không phải của sự kiện này.","resolved","Đã xác minh và gắn cảnh báo.","2026-11-05","2026-11-06"],
[3,5,2,"Nguồn không rõ ràng","Không có dẫn nguồn cho các số liệu.","pending","","2026-11-08",null]]),
analysis_history:rows(["history_id","user_id","article_id","analysis_id","created_at"],[[1,2,1,1,"2026-11-06"],[2,2,2,2,"2026-11-04"],[3,2,3,3,"2026-11-01"],[4,3,4,4,"2026-11-08"],[5,3,5,5,"2026-11-07"],[6,5,1,1,"2026-11-08"],[7,4,6,6,"2026-11-05"],[8,5,5,5,"2026-11-04"],[9,3,2,2,"2026-11-08"],[10,2,5,5,"2026-11-08"],[11,5,3,3,"2026-11-06"],[12,2,4,4,"2026-11-03"]])
};
A.DB={
  data,
  all:t=>data[t],
  find:(t,k,v)=>data[t].find(x=>x[k]===v),
  where:(t,f)=>data[t].filter(f),
  nextId:t=>Math.max(0,...data[t].map(x=>x[PK[t]]))+1,
  insert(t,row){row[PK[t]]=this.nextId(t);data[t].push(row);return row},
  remove(t,f){data[t]=data[t].filter(x=>!f(x))}
};
})(window.App);
