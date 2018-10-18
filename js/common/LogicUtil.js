/**
 * 业务逻辑工具类
 */
var LogicUtil;
if (!LogicUtil)
    LogicUtil = {};

/**
 * 业务逻辑执行
 * @param url 调用API的URL(必须)
 * @param doResultCheck :true or false 是否做返回值检查(必须)
 * @param logicParam 传入参数(必须) 例：{"userName" : "hello"}
 * @param emptyCheckNameArray 查空对象数组 例：[{"key":"userName","name":"用户名"}](非必须)
 * @param successCallback function(data) (非必须)
 * @param failCallback (非必须)
 */
LogicUtil.doLogic = function(url, doResultCheck, logicParam, emptyCheckNameArray, successCallback, failCallback) {
    // 非空check 非必须
    var checkEmptyArray = [];
    if (emptyCheckNameArray && emptyCheckNameArray.length > 0) {
        for (var i in emptyCheckNameArray) {
            var checkEmptyObj = {};
            checkEmptyObj.value = logicParam[emptyCheckNameArray[i].key];
            checkEmptyObj.name = emptyCheckNameArray[i].name;
            checkEmptyArray.push(checkEmptyObj);
        }
        if (!LogicUtil.inputEmptyCheck(checkEmptyArray)) {
            return;
        }
    }
    
// localStorage.removeItem("c");//清除c的值
    logicParam['IWBSESSION'] = localStorage.getItem("IWBSESSION") ? localStorage.getItem("IWBSESSION") : "";
    logicParam['DEVICE_UUID'] = "";
    logicParam['wToken'] = localStorage.getItem("wToken") ? localStorage.getItem("wToken") : "";
    logicParam["role"] = localStorage.getItem("role") ? localStorage.getItem("role") : "";

    var ajaxSetting = {};
    ajaxSetting.crossDomain = true;
    ajaxSetting.url = url;
    ajaxSetting.data = "params="+JSON.stringify(logicParam);;
    ajaxSetting.dataType = "json",
    ajaxSetting.method = "POST";
    ajaxSetting.cache = false;
    

    $.ajax(ajaxSetting).done(function (data, textStatus, jqXHR) {
        if (jqXHR.status != 200) {
            if (typeof (failCallback) == 'function') {
                failCallback(data);
            } else {
                alert("网络异常，请稍后重试");
            }
            return;
        }
        if("403" == data.resFlag){
            window.location.href = "login.html";
            return;
        }
        if(data.resFlag != "0" && !doResultCheck){
            alert(data.msg);
            return;
        }
        successCallback(data);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {

        if (typeof (failCallback) == 'function') {
            failCallback(jqXHR);
        } else {
            alert("网络异常，请稍后重试");
        }
    });


};

/**
 * 业务逻辑共通返回结果check
 */
LogicUtil.resultCheck = function(data,params) {
    var showCheckResult = function(check, type) {
        var checkCode;
        if (check.length > 0) {
            checkCode = check[0];
        } else {
            checkCode = check;
        }
        if (type === "check") {
            // ToastUtil.errorMsg(MessageConst.CHECK[checkCode]);
        } else if (type === "error") {
            // ToastUtil.errorMsg(MessageConst.ERROR[checkCode]);
        }
    };
    
    // 服务器端返回失败的场合
    if (!data.success) {
        console.error(data);
        if ("403" == data.code) {
            window.location.href = "login.html";
            return false;
        }
        if (data.attributes.error) {
            showCheckResult(data.attributes.error, "error");
            return false;
        } else if (data.attributes.check) {
            showCheckResult(data.attributes.check, "check");
            return false;
        } else if (data.attributes.code) {
            return false;
        }
    }else{
        
    }
    return true;
};

/**
 * 用户输入非空check
 */
LogicUtil.inputEmptyCheck = function(input) {

    for (var i = 0; i < input.length; i++) {
        if (!input[i].value || input[i].value === "") {
            // ToastUtil.errorMsg(MessageConst.PATTERN_EMPTY + input[i].name);
            return false;
        }
    }
    return true;

};
