var phone;
if (!phone)
	phone = {};

phone.onLoad = function(){
	var tel = localStorage.getItem("tel") ? localStorage.getItem("tel") : '';
	var email = localStorage.getItem("mail") ? localStorage.getItem("mail") : '';
	
	$("#phone").find(".userInfoArea_userName").text(tel);
	$("#phone").find(".userInfoArea_mailAddr").text(email);
	
	var authType = localStorage.getItem("role");
	common.setLeftToolAuth("phone",authType);
	common.getLeftCount(function(){
		common.setLeftCountToPage("phone");
	});
};
