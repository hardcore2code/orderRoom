var blacklist;
if (!blacklist)
	blacklist = {};

blacklist.pageNum = 1;
blacklist.onLoad = function(){

	blacklist.pageNum = 1;

	var tel = localStorage.getItem("tel") ? localStorage.getItem("tel") : '';
	var email = localStorage.getItem("mail") ? localStorage.getItem("mail") : '';
	
	$("#blacklist").find(".userInfoArea_userName").text(tel);
	$("#blacklist").find(".userInfoArea_mailAddr").text(email);
	


	common.setLeftToolAuth("blacklist","admin");
	blacklist.getManagerPageData("");

};
blacklist.getManagerPageData = function(content){
	$("#blacklist_listMoreBtn").hide();
	var url = Global.BASE_URL + VisitUrl.QUERYBLACKLIST;
	var param = {
		pn : blacklist.pageNum,
		ps : 10,
		content : content
	};
	LogicUtil.doLogic(url, false, param, [], function(e) {

		var blacklistData = (new Function('return ' + e.dataList))();
		
		var blackList = $("#blacklist_registApprovalList");
		console.log(blacklistData);
		for(var i = 0; i < blacklistData.length; i++){

			var pointShowStr = blacklistData[i].ifBlack == '1' ? 'block' : 'none';
			var cancelBtnShowStr = blacklistData[i].ifBlack == '1' ? 'block' : 'none';
			var blackliatStr = '<li id="' + blacklistData[i].USER_ID + '"><div class="blacklist_newPoint bgColor_greyPoint" style="display:' + pointShowStr + '"></div>' +
	            '<div class="registApprovalList_nameAndOperate"><div class="registApprovalList_name">' + blacklistData[i].NAME + '</div>' +
	            '<button class="registApprovalList_button fontColor_wordWhite bgColor_greyPoint border_greyPoint" onclick="blacklist.setting(this);">设置</button>' +
	            '<button class="registApprovalList_button fontColor_greyPoint bgColor_white border_greyPoint" onclick="blacklist.cancelDoBlack(this);" style="display:' + cancelBtnShowStr + '">解除</button>' +
	            '</div><div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">手机号：' + blacklistData[i].TEL + '</div>' +
	            '<div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">邮箱：' + blacklistData[i].MAIL + '</div>' +
	            '<div class="registApprovalList_typeAndTime fontColor_listTypeAndTime">一卡通号：' + blacklistData[i].cardId + '</div></li>';
			blackList.append(blackliatStr);
		}
		if(blacklistData.length >= 10){
			$("#blacklist_listMoreBtn").show();
		}
		common.getLeftCount(function(){
			common.setLeftCountToPage("blacklist");
		});

    },function(error){
    	console.log(error);
    });
};
blacklist.getMoreListContent = function(){
	blacklist.pageNum++;
	var searchVal = $("#blacklist_searchInput").val();
	blacklist.getManagerPageData(searchVal);
};
blacklist.doSearch = function(){
	blacklist.pageNum = 1;
	$("#managerApproval_registApprovalList").html("");
	var searchVal = $("#blacklist_searchInput").val();
	blacklist.getManagerPageData(searchVal);
};
blacklist.setting = function(e){
	var userId = $(e).parents("li").attr("id");
	window.location.href = "blacklistSetting.html?userId=" + userId;
};
blacklist.cancelDoBlack = function(self){
	var userId = $(self).parents("li").attr("id");

	var url = Global.BASE_URL + VisitUrl.DELBLACKLIST;
	var param = {
		userId : userId
	};
	LogicUtil.doLogic(url, false, param, [], function(e) {
		$(self).hide();	
		$(self).parents("li").find(".blacklist_newPoint").css("display","none");
		common.getLeftCount(function(){
			common.setLeftCountToPage("blacklist");
		});
    },function(error){
    	console.log(error);
    });
};
