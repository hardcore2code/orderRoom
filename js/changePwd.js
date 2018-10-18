var changePwd;
if (!changePwd)
	changePwd = {};

changePwd.onLoad = function(){
	var tel = localStorage.getItem("tel") ? localStorage.getItem("tel") : '';
	var email = localStorage.getItem("mail") ? localStorage.getItem("mail") : '';
	$("#changePwd").find(".userInfoArea_userName").text(tel);
	$("#changePwd").find(".userInfoArea_mailAddr").text(email);
	
	var authType = localStorage.getItem("role");
	common.setLeftToolAuth("changePwd",authType);
	common.getLeftCount(function(){
		common.setLeftCountToPage("changePwd");
	});
};
changePwd.clearInput = function(e){
	$(e).prev().val("");
};
changePwd.doChangePwd = function(){
	var pwd = $("#changePwd_newPwd").val();
    var rePwd = $("#changePwd_rePwd").val();

    if (pwd == "") {
    	$("#changePwd_warn").css("visibility","visible");
		$("#changePwd_warn").find(".changePwd_warnAreaText").text("请输入旧密码");
		return;
    }
    if (rePwd == "") {
    	$("#changePwd_warn").css("visibility","visible");
		$("#changePwd_warn").find(".changePwd_warnAreaText").text("请输入新密码");
		return;
    }

    var tel = localStorage.getItem("tel") ? localStorage.getItem("tel") : '';

    var uri = Global.BASE_URL + VisitUrl.CHANGEPWD;
	var params = {
		tel: tel,
		oldpwd : pwd,
		newpwd : rePwd 
	};
	LogicUtil.doLogic(uri, true, params, [], function(data) {
		if(data.resFlag != "0"){
        	$("#changePwd_warn").css("visibility","visible");
			$("#changePwd_warn").find(".changePwd_warnAreaText").text(data.msg);
        }else{
        	common.logout();
        }
	});
};
changePwd.closeWarnModal = function(){
	$("#changePwd_warn").css("visibility","hidden");
	$("#changePwd_warn").find(".changePwd_warnAreaText").text("");
};