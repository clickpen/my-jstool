// version: 1.0.1.4.23
//数组去重方法
Array.prototype.unique = function() {	//原型链上修改 //思路：对象内部的名称不能有重复
	var temp = {};
	var arr = [];
	var len = this.length;
	for (var i = 0; i < len; i++) {
		if (!temp[this[i]]) {	//判断该值在对象内是否为undefined，是则执行下一步操作
			temp[this[i]] = 'a';
			arr.push(this[i]);
		}
	}
	return arr;
}
//打乱数组顺序一次性返回方法
function disturb(target) {
	target.sort(function() {
		return (Math.random() - 0.5);	//Math.random():产生一个随机数在（0,1）内
	})
}
//typeof()加强版——详细返回方法
function type(target) {
	if (target == null) {
		return 'null';
	}
	if (typeof target == 'object') {
		var toStr = Object.prototype.toString.call(target);	//用Object原型上的toString方法来构造target
		return toStr;
	}
	return typeof (target);
}
//深度克隆方法
function deepClone(origin, target) {
	//针对没有传入target的时候自己创建一个空对象
	var target = target || {},
		toStr = Object.prototype.toString,
		arrStr = '[object Array]';
	for (var prop in origin) {
		if (origin.hasOwnProperty(prop)) {
			if (typeof (origin[prop]) == 'object') {
				target[prop] = toStr.call(origin[prop]) == arrStr ? [] : {};
				deepClone(origin[prop], target[prop]);
			} else {
				target[prop] = origin[prop];
			}
		}
	}
	return target;
}
//节流函数
function throttle(target, wait) {
	var lastTime = 0;
	return function() {
		var nowTime = new Date().getTime();
		if (nowTime - lastTime > wait) {
			target();
			lastTime = nowTime;
		}
	};
}
//防抖函数
function debounce(target, delay) {
	var timer = null;
	return function() {
		var _self = this,
			_arg = arguments;
		clearTimeout(timer);
		timer = setTimeout(function() {
			target.apply(_self, _arg);
		}, delay);
	};
}
//封装兼容性的绑定事件函数
function addEvent(ele, type, handle) {
	if (ele.addEventListener) {		//主流
		ele.addEventListener(type, function() {
			handle.call(ele);
			console.log('addEvent')
		}, false)
	} else if (ele.attachEvent) {	//IE
		ele.attachEvent('on' + type, function() {
			handle.call(ele);
			console.log('attachEvent')
		})
	} else {							//最后的办法
		ele['on' + type] = handle;
		console.log('on+type')
	}
}
//在Document.prototype上封装getByClassName
Document.prototype.getByClassName = function(className) {
	var allDomArr = Array.prototype.slice.call(document.getElementsByTagName('*'), 0);
	var filterArr = [];
	function dealClass(dom) {
		var reg = /\s+/g;
		var arrClassName = dom.className.replace(reg, " ").trim();	//trim()去除字符串两边的空格
		return arrClassName;
	}
	allDomArr.forEach(function(ele, index) {
		var itemClassArr = dealClass(ele).split(' ');
		for (var i = 0; i < itemClassArr.length; i++) {
			if (itemClassArr[i] == className) {
				filterArr.push(ele);
				break;
			}
		}
	})
	return filterArr;
}
//在Element原型上封装insertAfter()函数
Element.prototype.insertAfter = function(targetNode, afterNode) {
	let beforeNode = afterNode.nextElementSibling;
	if (beforeNode) {
		this.insertBefore(targetNode, beforeNode);
	} else {
		this.appendChild(targetNode);
	}
}
//获取元素的只读css属性方法
function getStyle(obj, attr) {	//注：attr为字符串	//返回值为string类型
	if (obj.currentStyle) {
		return obj.currentStyle[attr];
	} else {
		return window.getComputedStyle(obj, false)[attr];
	}
}
// cookie设置、获取、删除
function setCookie(name, value, path, expires, domain) {
	if (!name || value === undefined) {
		return;
	}
	expires = expires ? new Date(new Date().getTime() + expires).toGMTString() : '';
	document.cookie = name + '=' + escape(value) +
		';path=' + (path || '/') +
		';expires=' + expires +
		';domain=' + (domain || '') + ';';
}
function getCookie(name, err) {
	if (!name || !document.cookie.length) {
		return;
	}
	let _n = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
	return _n != null ? _n[2] : err;
}
function delCookie(name) {
	setCookie(name, '', '', -1);
}
// 格式化时间（yy-MM-dd hh:mm:ss）
function formatTime(time, template, errorTemplate) {
	// padStart(length, fillStr) // es2017新增的方法，判断字符串长度，小于此长度时自动补充fillStr到前面
	time = time || new Date()
	let _date = null
	switch (true) {
		// 时间对象
		case Object.prototype.toString.call(time) === '[object Date]':
			_date = time
			break
		// 10位时间戳
		case /^[1-9]\d{9}$/.test(time):
			_date = new Date(parseInt(time) * 1000)
			break
		// 13位时间戳
		case /^[1-9]\d{12}$/.test(time):
			_date = new Date(parseInt(time))
			break
		// 可以进行new Date格式化的
		case new Date(time).toString() !== 'Invalid Date':
			_date = new Date(time)
			break
		// 无法解析的用当前时间表示
		default:
			if (errorTemplate !== undefined) return errorTemplate
			_date = new Date()
			console.warn('时间解析异常', time)
			break
	}
	// 不提供模版则直接返回时间戳
	if (!template) {
		return _date.getTime()
	}
	const dateEnums = {
		'y+': _date.getFullYear(),
		'M+': _date.getMonth() + 1,
		'd+': _date.getDate(),
		'h+': _date.getHours(),
		'm+': _date.getMinutes(),
		's+': _date.getSeconds()
	}
	for (let prop in dateEnums) {
		let regArr = new RegExp(prop).exec(template)
		if (regArr && regArr[0]) {
			let itemMinLength = regArr[0].length
			template = template.replace(regArr[0], String(dateEnums[prop]).padStart(itemMinLength, '0'))
		}
	}
	return template
}
