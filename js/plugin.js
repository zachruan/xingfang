document.addEventListener('plusready',function(){
	var XYPlugin = 'myPlugin',
		B = window.plus.bridge;
	var myPlugin = {
		//声明异步返回方法
		myPluginFunction:function(Argus1, Argus2, Argus3, Argus4, successCallback, errorCallback){
			var success = typeof successCallback !== 'function' ? null : function(args){
				successCallback(args);
			},
			fail = typeof errorCallback !== 'function' ? null: function(code){
				errorCallback(code);
			},
			callBackID = B.callbackId(success,fail);
			//通知Native层myPlugin扩展插件运行“myPluginFunction”方法
			return B.exec(XYPlugin,"myPluginFunction",[callBackID,Argus1,Argus2,Argus3,Argus4]);
		},
        myPluginFunctionCallMeeting:function(Argus1, Argus2, Argus3, successCallback, errorCallback){
            var success = typeof successCallback !== 'function' ? null : function(args){
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null: function(code){
                errorCallback(code);
            },
            callBackID = B.callbackId(success,fail);
            //通知Native层myPlugin扩展插件运行“myPluginFunction”方法
            return B.exec(XYPlugin,"myPluginFunctionCallMeeting",[callBackID,Argus1,Argus2,Argus3]);
        },
        myPluginFunctionCallDevice:function(Argus1, Argus2, successCallback, errorCallback){
            var success = typeof successCallback !== 'function' ? null : function(args){
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null: function(code){
                errorCallback(code);
            },
            callBackID = B.callbackId(success,fail);
            //通知Native层myPlugin扩展插件运行“myPluginFunction”方法
            return B.exec(XYPlugin,"myPluginFunctionCallDevice",[callBackID,Argus1,Argus2]);
        },
		myPluginFunctionArrayArgu:function(Argus,successCallback, errorCallback){
			
			var success = typeof successCallback !== 'function' ? null : function(args){
				
				successCallback(args);
			},
			fail = typeof errorCallback !== 'function' ? null : function(code){
				errorCallback(code);
			},
			callBackID = B.callbackId(success, fail);
			return B.exec(XYPlugin,"myPluginFunctionArrayArgu",[callBackID, Argus]);
		},
		//同步返回方法
		myPluginFunctionSync :function(Argus1,Argus2,Argus3,Argus4){
			// 通知Native层plugintest扩展插件运行“PluginTestFunctionSync”方法并同步返回结果     
			return B.execSync(XYPlugin,"myPluginFunctionSync",[Argus1,Argus2,Argus3,Argus4]);
		},
		myPluginFunctionSyncArrayArgu : function(Argus){
			return B.execSync(XYPlugin,"myPluginFunctionSyncArrayArgu",[Argus]);
		}
	};
	window.plus.myPlugin = myPlugin;
},true);