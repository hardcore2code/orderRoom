var regist;
if (!regist)
	regist = {};

regist.onLoad = function(){
	var myDate = new Date();
	var nowDate = myDate.getDate();

	if(parseInt(nowDate) % 2 == "0"){
		$("#classroom_registBg").css("background-image","url('image/loginBg.png')");
	}else{
		$("#classroom_registBg").css("background-image","url('image/loginBg_2.jpg')");
	}
};
regist.doRegist = function(){
	var name = $("#regist_name");
	var phone = $("#regist_phone");
	var card = $("#regist_card");
	var mail = $("#regist_mail");
	var pwd = $("#regist_pwd");
	var repwd = $("#regist_repwd");

	$("#regist_warn").css("visibility","hidden");
	$("#regist_warn").find(".login_warnAreaText").text("");

	if(name.val() == ""){
		$("#regist_warn").css("visibility","visible");
		$("#regist_warn").find(".login_warnAreaText").text("请输入姓名");
		return;
	}
	if(phone.val() == ""){
		$("#regist_warn").css("visibility","visible");
		$("#regist_warn").find(".login_warnAreaText").text("请输入手机号");
		return;
	}
	if(card.val() == ""){
		$("#regist_warn").css("visibility","visible");
		$("#regist_warn").find(".login_warnAreaText").text("请输入一卡通号");
		return;
	}
	if(mail.val() == ""){
		$("#regist_warn").css("visibility","visible");
		$("#regist_warn").find(".login_warnAreaText").text("请输入邮箱");
		return;
	}
	if(pwd.val() == "" || repwd.val() == ""){
		$("#regist_warn").css("visibility","visible");
		$("#regist_warn").find(".login_warnAreaText").text("请输入密码");
		return;
	}
	if(pwd.val() != repwd.val()){
		$("#regist_warn").css("visibility","visible");
		$("#regist_warn").find(".login_warnAreaText").text("两次密码不一致");
		return;
	}

	var url = Global.BASE_URL + VisitUrl.REGIST;
	var param = {
		tel:phone.val(),
		name:name.val(),
		mail:mail.val(),
		cardId:card.val(),
		pwd:pwd.val()
	};
	LogicUtil.doLogic(url, true, param, [], function(e) {
        if(e.resFlag != "0"){
        	$("#regist_warn").css("visibility","visible");
			$("#regist_warn").find(".login_warnAreaText").text(e.msg);
        }else{
        	$("#regist_warn").css("visibility","visible");
			$("#regist_warn").find(".login_warnAreaText").text("注册成功");
        	setTimeout(function(){
        		regist.closeWarnModal();
	        	name.val("");
				phone.val("");
				card.val("");
				mail.val("");
				pwd.val("");
				repwd.val("");
			        
	        	window.location.href = "login.html";
        	},1500);
        	
        }
    },function(error){
    	console.log(error);
    });

};
regist.toLogin = function(){
	window.location.href = "login.html";
};
regist.clearInputVal = function(e){
	$(e).prev().val("");
};
regist.closeWarnModal = function(){
	$("#regist_warn").css("visibility","hidden");
	$("#regist_warn").find(".login_warnAreaText").text("");
}