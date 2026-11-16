(function(A){
A.Session={
  user:null,
  restore(){try{this.user=A.Models.User.find(+localStorage.getItem("u"))||null}catch(e){this.user=null}},
  login(u){this.user=u;try{localStorage.setItem("u",u.user_id)}catch(e){}},
  logout(){this.user=null;try{localStorage.removeItem("u")}catch(e){}},
  isAdmin(){return !!this.user&&this.user.role==="admin"},
  home(){return this.isAdmin()?"admin":"dashboard"}
};
})(window.App);
