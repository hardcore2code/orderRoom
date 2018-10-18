var common;
if (!common)
	common = {};

common.setLeftToolAuth = function(pageId,auth){
	if(auth == "admin"){
		$("#" + pageId).find(".common-manager").hide();
		$("#" + pageId).find(".common-user").hide();
		$("#" + pageId).find(".common-admin").show();

	}else if(auth == "manager"){
		$("#" + pageId).find(".common-admin").hide();
		$("#" + pageId).find(".common-user").hide();
		$("#" + pageId).find(".common-manager").show();
	}else if(auth == "user"){
		$("#" + pageId).find(".common-admin").hide();
		$("#" + pageId).find(".common-manager").hide();
		$("#" + pageId).find(".common-user").show();
	}
};
common.showErrorToast = function(pageId,text){
	var toastAlert = '<div id="common_toast" class="common_toastBg fontColor_red"><div class="common_toastText">' + text + '</div></div>';
	$("#" + pageId).parent().append(toastAlert);

	setTimeout(function(){
		$("#common_toast").remove();
	},1500)
};
common.subStringByUnderline = function (str) {
	var strIndex = str.indexOf("_") + 1;
	var resultStr = str.substr(strIndex, str.length);
	return resultStr;
};
common.subStringByUnderlineGetBefore = function (str) {
	var strIndex = str.indexOf("_");
	var resultStr = str.substr(0, strIndex);
	return resultStr;
};
common.subStringBySpaceGetBefore = function (str) {
	var strIndex = str.indexOf(" ");
	var resultStr = str.substr(0, strIndex);
	return resultStr;
};
common.subStringBySpace = function (str) {
	var strIndex = str.indexOf(" ") + 1;
	var resultStr = str.substr(strIndex, str.length);
	return resultStr;
};
common.logout = function(){
	localStorage.clear();
	window.location.href = "login.html";
};
common.getLeftCount = function(callback){
	var role = localStorage.getItem("role");
	var uri = Global.BASE_URL + VisitUrl.GETUNDOCOUNT;
	var params = {};
	LogicUtil.doLogic(uri, false, params, [], function(data) {
		if(role == "user"){
			localStorage.setItem("myUnApprovedCount",data.unApprovedCount);
			localStorage.setItem("unManagerApprovedCount","");
			localStorage.setItem("unApprovedCount","");
			localStorage.setItem("blackListCount","");
	    }else if(role == "manager"){
	    	localStorage.setItem("unManagerApprovedCount",data.unApprovedCount);
	    	localStorage.setItem("myUnApprovedCount",data.unApprovedCountBySelf);
	    	localStorage.setItem("unApprovedCount","");
			localStorage.setItem("blackListCount","");
    	}else if(role == "admin"){
			localStorage.setItem("unApprovedCount",data.unApprovedCount);
			localStorage.setItem("blackListCount",data.blackListCount);
			localStorage.setItem("unManagerApprovedCount","");
	    	localStorage.setItem("myUnApprovedCount","");
	    }
	    if(typeof(callback) === "function"){
	    	callback();
	    }
	});
};
common.setLeftCountToPage = function(pageId){
	var unApprovedCount = localStorage.getItem("unApprovedCount") ? localStorage.getItem("unApprovedCount") : 0;
	var blackListCount = localStorage.getItem("blackListCount") ? localStorage.getItem("blackListCount") : 0;
	var unManagerApprovedCount = localStorage.getItem("unManagerApprovedCount") ? localStorage.getItem("unManagerApprovedCount") : 0;
	var myUnApprovedCount = localStorage.getItem("myUnApprovedCount") ? localStorage.getItem("myUnApprovedCount") : 0;

	$("#" + pageId).find(".blackListCount").text(blackListCount);
	$("#" + pageId).find(".unApprovedCount").text(unApprovedCount);
	$("#" + pageId).find(".unManagerApprovedCount").text(unManagerApprovedCount);
	$("#" + pageId).find(".myUnApprovedCount").text(myUnApprovedCount);

};
common.toDoAppointment = function(){
	window.location.href = "userDoAppointment.html";
};
common.toWatchAppointment = function(){
	window.location.href = "watchAppointment.html";
};
common.getAppointmentTime = function(timeJson){	
	var timeIndex = 0;
	var fromTime = 0;
	var toTime = 0;
	var timeList = timeJson.split("_",14);
	for (var i = 0; i < timeList.length; i++) {
		if(timeList[i] == "1"){
			timeIndex++;
			if(timeIndex == 1){
				fromTime = i + 8;
			}
			toTime = i + 9;
		}
	}
	var returnTime = fromTime + ":00:00 - " + toTime + ":00:00";
	return returnTime;
};
common.getWeek = function(weekNum){
	var reDate = "";
	if(weekNum == "0"){
		reDate = "星期日";
	}else if(weekNum == "1"){
		reDate = "星期一";
	}else if(weekNum == "2"){
		reDate = "星期二";
	}else if(weekNum == "3"){
		reDate = "星期三";
	}else if(weekNum == "4"){
		reDate = "星期四";
	}else if(weekNum == "5"){
		reDate = "星期五";
	}else if(weekNum == "6"){
		reDate = "星期六";
	}
	return reDate;
};