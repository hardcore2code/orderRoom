var blacklistSetting;
if (!blacklistSetting)
	blacklistSetting = {};

blacklistSetting.appointmentType = "0";
blacklistSetting.beginDate = "";
blacklistSetting.endDate = "";
blacklistSetting.userId = "";
blacklistSetting.onLoad = function(eve){
	blacklistSetting.appointmentType = "0";

	var userId = location.search.substr(1).split("=");
	blacklistSetting.userId = userId[1];
	var url = Global.BASE_URL + VisitUrl.GETBLACKLISTDETAIL;
	var param = {
		userId : blacklistSetting.userId
	};
	LogicUtil.doLogic(url, false, param, [], function(e) {

		blacklistSetting.beginDate = e.begindate;
		blacklistSetting.endDate = e.enddate;

		$("#batchDatepicker_beginDate").datepicker({  
	        dateFormat:"yy-mm-dd",
	        minDate: new Date()
	    });
	    $("#batchDatepicker_endDate").datepicker({  
	        dateFormat:"yy-mm-dd",
	        minDate: new Date()
	    });
	 	$("#batchDatepicker_beginDate").val(blacklistSetting.beginDate);
		$("#batchDatepicker_endDate").val(blacklistSetting.endDate);

		common.getLeftCount(function(){
			common.setLeftCountToPage("blacklistSetting");
		});

    },function(error){
    	console.log(error);
    });

	common.setLeftToolAuth("blacklistSetting","admin");
	

};

blacklistSetting.chooseAppointmentType = function(self,type){
	if(type != blacklistSetting.appointmentType){
		$(self).find('.userDoAppointment_typeImg').attr("src","image/checkbox_o.png");
		if(type == "0"){
			$(self).next().find('.userDoAppointment_typeImg').attr("src","image/checkbox.png");
		}else{
			$(self).prev().find('.userDoAppointment_typeImg').attr("src","image/checkbox.png");
		}
		blacklistSetting.appointmentType = type;
	}
	
};
blacklistSetting.toBlacklist = function(){
	window.location.href = 'blacklist.html';
};
blacklistSetting.doSubmitSetting = function(){

	var beginDate = $("#batchDatepicker_beginDate").val();
	var endDate = $("#batchDatepicker_endDate").val();

	var oDate1 = new Date(beginDate);
    var oDate2 = new Date(endDate);
    if(oDate1.getTime() >= oDate2.getTime()){
	     common.showErrorToast("blacklistSetting","请选择正确的时间区间");
         return;
    }else{
    	if(beginDate == blacklistSetting.beginDate && endDate == blacklistSetting.endDate){
			window.location.href = 'blacklist.html';
		}else{
	        var url = Global.BASE_URL + VisitUrl.ADDBLACKLIST;
			var param = {
				userId : blacklistSetting.userId,
				begindate : beginDate,
				enddate : endDate
			};
			LogicUtil.doLogic(url, false, param, [], function(e) {
				window.location.href = 'blacklist.html';
		    },function(error){
		    	console.log(error);
		    });
		}
    }
	
};