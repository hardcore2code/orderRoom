var login;
if (!login)
	login = {};

login.onLoad = function(){
	var myDate = new Date();
	var nowDate = myDate.getDate();

	if(parseInt(nowDate) % 2 == "0"){
		$("#classroom_loginBg").css("background-image","url('image/loginBg.png')");
	}else{
		$("#classroom_loginBg").css("background-image","url('image/loginBg_2.jpg')");
	}
	

};
login.doLogin = function(){
	var url = Global.BASE_URL + VisitUrl.LOGIN;
	var username = $("#login_username").val();
	var password = $("#login_password").val();

	if(username == ""){
		$("#login_warn").css("visibility","visible");
		$("#login_warn").find(".login_warnAreaText").text("请输入登录名");
		return;
	}
	if(password == ""){
		$("#login_warn").css("visibility","visible");
		$("#login_warn").find(".login_warnAreaText").text("请输入密码");
		return;
	}
	var param = {
		tel:username,
		pwd:password
	};
	LogicUtil.doLogic(url, true, param, [], function(e) {
        if(e.resFlag != "0"){
        	$("#login_warn").css("visibility","visible");
			$("#login_warn").find(".login_warnAreaText").text(e.msg);
        }else{
        	login.closeWarnModal();
        	$("#login_username").val("");
        	$("#login_password").val("");
        	//保存sessionId
        	var role = e.role;

	        localStorage.setItem("IWBSESSION",e.IWBSESSION);
	        localStorage.setItem("wToken",e.wToken);
	        localStorage.setItem("role",role);
	        localStorage.setItem("mail",e.mail);
	        localStorage.setItem("tel",e.tel);
	        
			if(role == "user"){
				window.location.href = "userAppointment.html";
		    }else if(role == "manager"){
		    	window.location.href = "managerAppointment.html";
	    	}else if(role == "admin"){
				window.location.href = "managerApproval.html";
		    }
		    
        }
    },function(error){
    	console.log(error);
    });
};
login.toRegist = function(){
	window.location.href = "regist.html";
};
login.closeWarnModal = function(){
	$("#login_warn").css("visibility","hidden");
	$("#login_warn").find(".login_warnAreaText").text("");
};
login.clearInput = function(e){
	$(e).prev().val("");
};
login.forgetPwdModal = function(){
	var phone = $("#login_username").val();
	if(phone == ""){
		$("#login_warn").css("visibility","visible");
		$("#login_warn").find(".login_warnAreaText").text("请输入手机号码");
		return;
	}
	login.closeWarnModal();
	$("#classroom_forgetPwdModal").show();
};
login.doCancel = function(){
	$("#classroom_forgetPwdModal").hide();
};
login.doReset = function(){
	var phone = $("#login_username").val();
	var url = Global.BASE_URL + VisitUrl.RESETPWD;
	var param = {
		tel:phone,
	};
	LogicUtil.doLogic(url, true, param, [], function(e) {
		$("#login_warn").css("visibility","visible");
        if(e.resFlag != "0"){
        	$("#login_warn").css("visibility","visible");
			$("#login_warn").find(".login_warnAreaText").text(e.msg);
        }else{
        	$("#login_warn").css("visibility","visible");
			$("#login_warn").find(".login_warnAreaText").text("密码已重置");
        	
        }
        $("#classroom_forgetPwdModal").hide();
    },function(error){
    	console.log(error);
    });
	
};
