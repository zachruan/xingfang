var common = {
	/**
	 * 通用ajax post请求
	 * @param {String} url 请求的 action地址  例如/applogon/logon.action
	 * @param {JSObject} data 提交数据
	 * @param {Function} callback 请求成功回调函数
	 */
	ajaxPostData: function(url, data, callback, errorCallBack) {
		//		if(typeof(common.getServerUrl())=='undefined'||!common.getServerUrl()){
		//			return;
		//		}
		//		url=localStorage.getItem('serverURL')+url;
		//console.log('call ajaxPostData @URL:' + url);
		callback = callback || $.noop;
		data = data || {};
		mui.ajax({
			type: 'post',
			data: data,
			url: url,
			dataType: 'json',
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			timeout: 20000,
			async: true,
			success: callback,
			error: function(xhr, type, errorThrown) {
				if(typeof errorCallBack == 'function') {
					errorCallBack(xhr, type, errorThrown)
				} else {
					console.log('ajaxPostData Error:' + type + '@URL:' + url);
					if(type != 'abort') {
						var errmsg = '网络异常或操作异常，停止频繁操作或网络恢复后再重试';
						mui.toast(errmsg);
					}

				}
			}
		});
	},
	/**
	 * 通用ajax post方法
	 * @param {String} url 请求的 action地址  例如/applogon/logon.action
	 * @param {JSObject} data 提交数据json对象
	 * @param {Function} successCallback 请求成功回调函数
	 * @param {Function} errorCallback 请求失败回调函数
	 * @param {JSObject} setting  参数设置:timeout(默认10000毫秒),async(默认true)
	 */
	ajaxPost: function(url, data, successCallback, errorCallback, setting) {
		if(typeof(common.getServerUrl()) == 'undefined' || !common.getServerUrl()) {
			return;
		}
		url = localStorage.getItem('serverURL') + url;
		//console.log('call ajaxPost @URL:' + url);
		successCallback = successCallback || $.noop;
		errorCallback = errorCallback || $.noop;
		data = data || {};
		setting = setting || {};
		timeout = setting.timeout || 20000;
		async = true;
		if(typeof(setting.async) != 'undefined') {
			async = setting.async;
		};
		mui.ajax({
			type: 'post',
			data: data,
			url: url,
			dataType: 'json',
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			timeout: timeout,
			async: async,
			success: successCallback,
			error: function(xhr, type, errorThrown) {
				//异常处理；
				//console.log('ajaxPost Error:' + type + '@URL:' + url);
				//console.log(JSON.stringify(data)+errorThrown);
				errorCallback(xhr, type, errorThrown);
			}
		});
	},

	/**
	 * 获取用户账号
	 */
	getAccount: function() {
		var state = common.getState();
		var account = state.account || '';
		return account;
	},

	/**
	 * 获取用户ID
	 */
	getUserid: function() {
		var state = common.getState();
		var userid = state.userid || '';
		return userid;
	},

	/**
	 * 获取当前状态
	 **/
	getState: function() {
		var stateText = localStorage.getItem('$state') || "{}";
		//console.log("stateText:"+stateText);
		return JSON.parse(stateText);
	},

	/**
	 * 设置当前状态
	 **/
	setState: function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
	},

	/*
	 * 日期格式化方法
	 **dateObj s日期对象
	 **str 格式化字符串 ：yyyy-MM-dd hh:mm:ss
	 * */
	toFormatDate: function(dateObj, str) {
		var date = new Date();
		date.setTime(dateObj.time);
		date.setHours(dateObj.hours);
		date.setMinutes(dateObj.minutes);
		date.setSeconds(dateObj.seconds);
		return date.format(str);

	},

	/*
	 * 获取服务器地址
	 */
	getServerUrl: function() {
		return localStorage.getItem('serverURL');
	},

	/**
	 * 判断是否有网络
	 * return true or false
	 */
	isOnline: function() {
		var network = true;
		if(mui.os.plus) {
			mui.plusReady(function() {
				if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
					network = false;
				}
			});
		}
		return network;
	},
	isNetwork: function() {
		var network = true;
		if(navigator.onLine) {
			network = true;
		} else {
			network = false;
		};
		return network;
	}
};

Date.prototype.format = function(format) {
		/*
		 * format="yyyy-MM-dd hh:mm:ss";
		 */
		var o = {
			"M+": this.getMonth() + 1,
			"d+": this.getDate(),
			"h+": this.getHours(),
			"m+": this.getMinutes(),
			"s+": this.getSeconds(),
			"q+": Math.floor((this.getMonth() + 3) / 3),
			"S": this.getMilliseconds()
		}
		if(/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 -
				RegExp.$1.length));
		}
		for(var k in o) {
			if(new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
					o[k] :
					("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	}
	/*获取url参数值*/
function getRequestParameter(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
	var context = "";
	if(r != null)
		context = r[2];
	reg = null;
	r = null;
	return context == null || context == "" || context == "undefined" ? "" : context;
}
/*判断是否是微信浏览器*/
function is_weixin() {
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == "micromessenger") {
		return true;
	} else {
		return false;
	}
}
var idCardNoUtil = {
	provinceAndCitys: {
		11: "北京",
		12: "天津",
		13: "河北",
		14: "山西",
		15: "内蒙古",
		21: "辽宁",
		22: "吉林",
		23: "黑龙江",
		31: "上海",
		32: "江苏",
		33: "浙江",
		34: "安徽",
		35: "福建",
		36: "江西",
		37: "山东",
		41: "河南",
		42: "湖北",
		43: "湖南",
		44: "广东",
		45: "广西",
		46: "海南",
		50: "重庆",
		51: "四川",
		52: "贵州",
		53: "云南",
		54: "西藏",
		61: "陕西",
		62: "甘肃",
		63: "青海",
		64: "宁夏",
		65: "新疆",
		71: "台湾",
		81: "香港",
		82: "澳门",
		91: "国外"
	},
	powers: ["7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"],
	parityBit: ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"],
	genders: {
		male: "男",
		female: "女"
	},
	checkAddressCode: function(addressCode) {
		var check = /^[1-9]\d{5}$/.test(addressCode);
		if(!check) return false;
		if(idCardNoUtil.provinceAndCitys[parseInt(addressCode.substring(0, 2))]) {
			return true;
		} else {
			return false;
		}
	},

	checkBirthDayCode: function(birDayCode) {
		var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode);
		if(!check) return false;
		var yyyy = parseInt(birDayCode.substring(0, 4), 10);
		var mm = parseInt(birDayCode.substring(4, 6), 10);
		var dd = parseInt(birDayCode.substring(6), 10);
		var xdata = new Date(yyyy, mm - 1, dd);
		if(xdata > new Date()) {
			return false; //生日不能大于当前日期
		} else if((xdata.getFullYear() == yyyy) && (xdata.getMonth() == mm - 1) && (xdata.getDate() == dd)) {
			return true;
		} else {
			return false;
		}
	},

	getParityBit: function(idCardNo) {
		var id17 = idCardNo.substring(0, 17);
		var power = 0;
		for(var i = 0; i < 17; i++) {
			power += parseInt(id17.charAt(i), 10) * parseInt(idCardNoUtil.powers[i]);
		}
		var mod = power % 11;
		return idCardNoUtil.parityBit[mod];
	},

	checkParityBit: function(idCardNo) {
		var parityBit = idCardNo.charAt(17).toUpperCase();
		if(idCardNoUtil.getParityBit(idCardNo) == parityBit) {
			return true;
		} else {
			return false;
		}
	},

	checkIdCardNo: function(idCardNo) {
		//15位和18位身份证号码的基本校验
		var check = /^[0-9]{15}|([0-9]{17}([0-9]|x|X))$/.test(idCardNo);
		if(!check) return false;
		//判断长度为15位或18位
		if(idCardNo.length == 15) {
			return idCardNoUtil.check15IdCardNo(idCardNo);
		} else if(idCardNo.length == 18) {
			return idCardNoUtil.check18IdCardNo(idCardNo);
		} else {
			return false;
		}
	},
	//校验15位的身份证号码
	check15IdCardNo: function(idCardNo) {
		//15位身份证号码的基本校验
		//在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
		var check = /^[1-9][0-9]{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))[0-9]{3}$/.test(idCardNo);
		if(!check) return false;
		//校验地址码
		var addressCode = idCardNo.substring(0, 6);
		check = idCardNoUtil.checkAddressCode(addressCode);
		if(!check) return false;
		var birDayCode = '19' + idCardNo.substring(6, 12);
		//校验日期码
		return idCardNoUtil.checkBirthDayCode(birDayCode);
	},
	//校验18位的身份证号码
	check18IdCardNo: function(idCardNo) {
		//18位身份证号码的基本格式校验
		//在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
		var objReg = /^[1-9][0-9]{5}[1-9][0-9]{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))[0-9]{3}([0-9]|x|X)$/i;
		var check = objReg.test(idCardNo);
		if(!check) return false;
		//校验地址码
		var addressCode = idCardNo.substring(0, 6);
		check = idCardNoUtil.checkAddressCode(addressCode);
		if(!check) return false;
		//校验日期码
		var birDayCode = idCardNo.substring(6, 14);
		check = idCardNoUtil.checkBirthDayCode(birDayCode);
		if(!check) return false;
		//验证校检码
		return idCardNoUtil.checkParityBit(idCardNo);
	},
	formateDateCN: function(day) {
		var yyyy = day.substring(0, 4);
		var mm = day.substring(4, 6);
		var dd = day.substring(6);
		return yyyy + '-' + mm + '-' + dd;
	},
	//获取信息
	getIdCardInfo: function(idCardNo) {
		var idCardInfo = {
			gender: "", //性别
			birthday: "" // 出生日期(yyyy-mm-dd)
		};
		if(idCardNo.length == 15) {
			var aday = '19' + idCardNo.substring(6, 12);
			idCardInfo.birthday = idCardNoUtil.formateDateCN(aday);
			if(parseInt(idCardNo.charAt(14)) % 2 == 0) {
				idCardInfo.gender = idCardNoUtil.genders.female;
			} else {
				idCardInfo.gender = idCardNoUtil.genders.male;
			}
		} else if(idCardNo.length == 18) {
			var aday = idCardNo.substring(6, 14);
			idCardInfo.birthday = idCardNoUtil.formateDateCN(aday);
			if(parseInt(idCardNo.charAt(16)) % 2 == 0) {
				idCardInfo.gender = idCardNoUtil.genders.female;
			} else {
				idCardInfo.gender = idCardNoUtil.genders.male;
			}
		}
		return idCardInfo;
	},

	getId15: function(idCardNo) {
		if(idCardNo.length == 15) {
			return idCardNo;
		} else if(idCardNo.length == 18) {
			return idCardNo.substring(0, 6) + idCardNo.substring(8, 17);
		} else {
			return null;
		}
	},

	getId18: function(idCardNo) {
		if(idCardNo.length == 15) {
			var id17 = idCardNo.substring(0, 6) + '19' + idCardNo.substring(6);
			var parityBit = idCardNoUtil.getParityBit(id17);
			return id17 + parityBit;
		} else if(idCardNo.length == 18) {
			return idCardNo;
		} else {
			return null;
		}
	}
};
//验证护照是否正确
function checknumber(number) {
	var str = number;
	//在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
	var Expression = /(P\d{7})|(G\d{8})/;
	var objExp = new RegExp(Expression);
	if(objExp.test(str) == true) {
		return true;
	} else {
		return false;
	}
};

/**
 * Json对象操作，增删改查
 *
 * @author 	lellansin
 * @blog 	www.lellansin.com
 * @version 0.1
 * 
 * 解决一些常见的问题
 * get/set 解决获取和设置时，无节点中断的问题
 * create  可以创建多级节点，若存在则覆盖新值
 * delete  删除节点及其子节点
 * print_r 格式化输出对象（调试用）
 * 实例见底部
 */

function Json() {

}

/**
 * 获取Json对象中的某个节点
 * 例如：json.get(Data, 'country', 'province', 'city');
 * 结果则返回 Data['country']['province']['city']
 * 无则返回false
 */
Json.prototype.get = function(obj, key) {
	var args = this.get.arguments;
	var result = obj;

	for(var i = 1; i < args.length; i++) {
		result = result[args[i]];
		if(result === undefined) {
			return false;
		};
	};
	return result;
};

/**
 * 设置Json对象中的某个节点
 * 例如：obj.set(data, "ENTRY", "FA_TOKEN_INVALID", 1234);
 * 将 data['ENTRY']['FA_TOKEN_INVALID'] 设置为1234
 * 成功true, 失败false
 */
Json.prototype.set = function(obj, key) {
	var args = this.set.arguments;
	if(ergodic_set(obj, args, 1)) {
		return true;
	} else {
		return false;
	}
}

/**
 * 在Json对象中创建节点(若存在则覆盖值)
 * 例如：obj.create(data, 'add', 'hello', 'test', 120);
 * 添加 data['create']['hello']['test'] 节点并设置值为 120
 * 成功true, 失败false
 */
Json.prototype.create = function(obj, key) {
	var args = this.create.arguments;
	if(ergodic_create(obj, args, 1)) {
		return true;
	} else {
		return false;
	}
}

/**
 * 在Json对象中删除节点
 * 例如：obj.delete(prods, 'grade', 'math');
 * 成功true, 失败false
 */
Json.prototype.delete = function(obj, key) {
	var args = this.delete.arguments;
	if(ergodic_delete(obj, args, 1)) {
		return true;
	} else {
		return false;
	}
}

/**
 * 返回Json对象的字符串形式（封装 ECMAScript 库函数）
 */
Json.prototype.getStr = function(obj) {
	return JSON.stringify(obj);
}

/**
 * 解析字符串返回Json对象（封装 ECMAScript 库函数）
 */
Json.prototype.getJson = function(str) {
	return JSON.parse(str);
}

/**
 * 格式化输出Json对象
 */
Json.prototype.print_r = function(obj) {
	console.log("{")
	ergodic_print(obj, "");
	console.log("}")
}

function ergodic_print(obj, indentation) {
	var indent = "	" + indentation;
	if(obj.constructor == Object) {
		for(var p in obj) {
			if(obj[p].constructor == Array || obj[p].constructor == Object) {
				console.log(indent + "[" + p + "] => " + typeof(obj) + "");
				console.log(indent + "{");
				ergodic_print(obj[p], indent);
				console.log(indent + "}");
			} else if(obj[p].constructor == String) {
				console.log(indent + "[" + p + "] => '" + obj[p] + "'");
			} else {
				console.log(indent + "[" + p + "] => " + obj[p] + "");
			}
		}
	}
}

function ergodic_set(obj, args, floor) {
	if(obj.constructor == Object) {
		for(var tmpKey in obj) {
			if(tmpKey == args[floor]) {
				if(floor < args.length - 2) {
					return ergodic_set(obj[tmpKey], args, floor + 1);
				} else {
					// 此时参数floor为倒数第二个，加1值为最后一个
					obj[tmpKey] = args[floor + 1];
					console.log("成功设置，返回true");
					return true;
				}
			}
		}
	}
}

function ergodic_create(obj, args, floor) {
	if(obj.constructor == Object) {
		for(var tmpKey in obj) {
			if(tmpKey == args[floor]) {
				if(floor < args.length - 2) {
					return ergodic_create(obj[tmpKey], args, floor + 1);
				} else {
					obj[tmpKey] = args[floor + 1];
					return true;
				}
			}
		}
	}
	// 节点不存在，创建新节点
	if(floor < args.length - 1) {
		var jsonstr = getJsonFormat(args[args.length - 1]);

		for(var i = args.length - 2; i > floor; i--) {
			jsonstr = '{"' + args[i] + '":' + jsonstr + '}';
		};

		// 使用eval解析第三方Json数据时，可能会执行恶意代码
		// var node = eval('(' + jsonstr + ')');
		var node = JSON.parse(jsonstr);
		obj[args[floor]] = node;
		return true;
	}
}

function ergodic_delete(obj, args, floor) {
	if(obj.constructor == Object) {
		for(var tmpKey in obj) {
			if(tmpKey == args[floor]) {
				if(floor < args.length - 1) {
					return ergodic_delete(obj[tmpKey], args, floor + 1);
				} else {
					delete obj[tmpKey];
					return true;
				}
			}
		}
	}
}

function getJsonFormat(param) {
	if(param.constructor == String) {
		return '"' + param + '"';
	} else {
		return param;
	}
}
var netWorkStatus = {
	check: function() {
		//获取当前网络状态
		var types = {};
		types[plus.networkinfo.CONNECTION_UNKNOW] = "Unknown connection";
		types[plus.networkinfo.CONNECTION_NONE] = "None connection";
		types[plus.networkinfo.CONNECTION_ETHERNET] = "Ethernet connection";
		types[plus.networkinfo.CONNECTION_WIFI] = "WiFi connection";
		types[plus.networkinfo.CONNECTION_CELL2G] = "Cellular 2G connection";
		types[plus.networkinfo.CONNECTION_CELL3G] = "Cellular 3G connection";
		types[plus.networkinfo.CONNECTION_CELL4G] = "Cellular 4G connection";

		var currentNetInfo = plus.networkinfo.getCurrentType();
		console.log(types[currentNetInfo]);
		if(currentNetInfo == 1) {
			mui.toast('请检查网络连接');
			return false;
		} else {
			return true;
		}
	}
}