//JavaScript Document
//内部包含的方法有:
//Element.prototype
	// insertAfter()

//Docuemnt.prototype
	// getByClassName()

//Object.prototype

//Array.prototype
	// unique()

//function
	// disturb()
	// type()
	// deepClone()
	// throttle()
	// debounce()
	// addEvent()

//数组去重方法
	Array.prototype.unique = function() {	//原型链上修改 //思路：对象内部的名称不能有重复
		var temp = {};
		var arr = [];
		var len = this.length;
		for(var i = 0;i < len;i ++){
			if (!temp[this[i]]) {	//判断该值在对象内是否为undefind，是则执行下一步操作
				temp[this[i]] = "a";
				arr.push(this[i]);
			}
		}
		return arr;
	}

//打乱数组顺序一次性返回方法
	function disturb(target) {
		target.sort(function(a,b) {
			return (Math.random() - 0.5);	//Math.random():产生一个随机数在（0,1）内
		})
	}

//typeof()加强版——详细返回方法
	function type(target) {
		if (target == null) {
			return "null";
		}
		if (typeof(target) == "object") {
			var tostr = Object.prototype.toString.call(target);	//用Object原型上的toString方法来构造target
			return tostr;
		}
		return typeof(target);
	}

//深度克隆方法
	function deepClone(origin , target) {
		var target = target || {},		//针对没有传入target的时候自己创建一个空对象
		toStr = Object.prototype.toString,
		arrStr = "[object Array]";
		for(var prop in origin) {
			if(origin.hasOwnProperty(prop)) {
				if(typeof(origin[prop]) == 'object') {
					target[prop] = toStr.call(origin[prop]) == arrStr ? [] : {};
					deepClone(origin[prop] , target[prop]);
				}else{
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
			if(nowTime - lastTime > wait) {
				target();
				lastTime = nowTime;
			}
		};
	}

//防抖函数
	function debounce(target, dely) {
		var timer = null;
		return function() {
			var _self = this,
				_arg = arguments;
			clearTimeout(timer);
			timer = setTimeout(function() {
				target.apply(_self, _arg);
			}, dely);
		};
	}

//封装兼容性的绑定事件函数
	function addEvent(ele,type,handle) {
		if(ele.addEventListener) {		//主流
			ele.addEventListener(type,function() {
				handle.call(ele);
				console.log("addEvent")
			},false)
		} else if(ele.attachEvent) {	//IE
			ele.attachEvent('on' + type,function() {
				handle.call(ele);
				console.log("atachEvent")
			})
		}else {							//最后的办法
			ele['on' + type] = handle;
			console.log("on+type")
		}
	}

//在Document.prototype上封装getByClassName
	Document.prototype.getByClassName = function (className) {
		var allDomArr = Array.prototype.slice.call(document.getElementsByTagName('*'), 0);
		var filterArr = [];
		function dealClass(dom) {
			var reg = /\s+/g;
			var arrClassName = dom.className.replace(reg, " ").trim();	//trim()去除字符串两边的空格
			return arrClassName;
		}
		allDomArr.forEach(function(ele, index) {
			var itemClassArr = dealClass(ele).split(' ');
			for(var i = 0; i < itemClassArr.length; i ++) {
				if(itemClassArr[i] == className) {
					filterArr.push(ele);
					break;
				}
			}
		})
		return filterArr;
	}

//在Element原型上封装insertAfter()函数
	Element.prototype.insertAfter = function(targetnode, afternode) {
		let beforenode = afternode.nextElementSibling;
		if(beforenode) {
			this.insertBefore(targetnode, beforenode);
		} else {
			this.appendChild(targetnode);
		}
	}