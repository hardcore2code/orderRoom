var appointmentSummary;
if (!appointmentSummary)
	appointmentSummary = {};

appointmentSummary.onLoad = function(){

	var authType = localStorage.getItem("role");
	if(authType == "admin"){
		common.setLeftToolAuth("appointmentSummary","admin");
	}else if(authType == "manager"){
		common.setLeftToolAuth("appointmentSummary","manager");
	}else if(authType == "user"){
		common.setLeftToolAuth("appointmentSummary","user");
	}
	var tel = localStorage.getItem("tel") ? localStorage.getItem("tel") : '';
	var email = localStorage.getItem("mail") ? localStorage.getItem("mail") : '';
	$("#appointmentSummary").find(".userInfoArea_userName").text(tel);
	$("#appointmentSummary").find(".userInfoArea_mailAddr").text(email);
	

	// var searchVal = $("#appointmentSummary_searchInput").val();
	appointmentSummary.getPageData();
	
};
appointmentSummary.getPageData = function(content){
	var url = Global.BASE_URL + VisitUrl.STATISTICS_CLASSROOM;
	var param = {
		params : content
	};
	LogicUtil.doLogic(url, false, param, [], function(e) {
		var dataList = (new Function('return ' + e.dataList))();

		$('#appointmentSummary_table').DataTable({
			data : dataList,
			"autoWidth": false, //自适应宽度，
			"sScrollY" : 382, //DataTables的高  
			"columnDefs": [
					{"targets": 0, "width": "33.33%"},  // 设置第一列的宽度
					{"targets": 1, "width": "33.33%"},
					{"targets": 2, "width": "33.33%"},
			],
			"lengthMenu": [10, 20, 30],   // 显示每页显示的条数  
			"stripeClasses": ["odd", "even"],   // 为奇偶行添加样式
			"searching": false,       // 是否允许开启本地检索功能
			"bFilter": false,         // 去掉 搜索框
			"paging": true,            // 是否开启本地分页
			"lengthChange": true, //是否允许产品改变表格每页显示的记录数
			"info": true,             // 控制是否显示表格左下角的信息
			"pageLength": 10,      // 每页显示的条数
			"bSort": false,
			"columns":[
				{data: 'roomName'},    // 有几列就解析几次
				{data: 'cnum'},
				{data: 'name'} 
			]
		})
		
		common.getLeftCount(function(){
			common.setLeftCountToPage("appointmentSummary");
		});

	},function(error){
		console.log(error);
	});
};
appointmentSummary.doSearch = function(){
	var searchVal = $("#appointmentSummary_searchInput").val();
	$("#appointmentSummary_classroomApprovalList").html("");
	appointmentSummary.getPageData(searchVal);
};