var watchSummaryDetails;
if (!watchSummaryDetails)
	watchSummaryDetails = {};

watchSummaryDetails.roomId = "";
watchSummaryDetails.timeData = [];
watchSummaryDetails.orderDate = "";
watchSummaryDetails.onLoad = function(){
	var authType = localStorage.getItem("role");
	if(authType == "admin"){
		common.setLeftToolAuth("watchSummaryDetails","admin");
	}else if(authType == "manager"){
		common.setLeftToolAuth("watchSummaryDetails","manager");
	}else if(authType == "user"){
		common.setLeftToolAuth("watchSummaryDetails","user");
	}
	var tel = localStorage.getItem("tel") ? localStorage.getItem("tel") : '';
	var email = localStorage.getItem("mail") ? localStorage.getItem("mail") : '';
	$("#watchSummaryDetails").find(".userInfoArea_userName").text(tel);
	$("#watchSummaryDetails").find(".userInfoArea_mailAddr").text(email);


	var roomId = location.search.substr(1).split("=");
	watchSummaryDetails.roomId = roomId[1];

	var myDate = new Date();
	watchSummaryDetails.orderDate = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
	watchSummaryDetails.timeDataPush(watchSummaryDetails.orderDate);
	

	$("#watchSummaryDetails_datepicker").datepicker({
		inline: true,
		onSelect: function (dateText, inst) {
		   watchSummaryDetails.orderDate = inst.selectedYear + "-" +(inst.selectedMonth + 1) + "-" + inst.selectedDay;
		   watchSummaryDetails.timeDataPush(watchSummaryDetails.orderDate);
		},
	});
	

};
watchSummaryDetails.timeDataPush = function(orderDate){
	var url = Global.BASE_URL + VisitUrl.QUERYROOMDETAIL;
	var param = {
		roomId : watchSummaryDetails.roomId,
		orderdate : orderDate
	};
	LogicUtil.doLogic(url, false, param, [], function(e) {
				
		watchSummaryDetails.timeData = e.timelist;

		for (var i = 0; i < watchSummaryDetails.timeData.length; i++) {
			var item = $("#wsdTimeItem_" + (i + 8));
			if(watchSummaryDetails.timeData[i].state == "0"){
				if(item.hasClass('watchSummaryDetails_timeMyChoose')){
					item.removeClass('watchSummaryDetails_timeMyChoose');
				}
			}else if(watchSummaryDetails.timeData[i].state == "1"){
				item.addClass('watchSummaryDetails_timeMyChoose');
			}
		}

		common.getLeftCount(function(){
			common.setLeftCountToPage("watchSummaryDetails");
		});
    },function(error){
    	console.log(error);
    });
};