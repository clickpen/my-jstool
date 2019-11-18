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
	// cookieEvent

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
//在Element原型上封装原生js无缝轮播图，只需要传入相应的json版图片地址即可生成轮播
	Element.prototype.createTurnpage = function(json) {
		var str1 = "<ul class='imgUl'>";
		var str2 = "<span class='btn btnR' title='下一张'>&gt</span><ul class='navUl'>"
		for(var prop in json) {
			str1 += "<li><img src='" + json[prop] + "'></li>";
		}
		str1 += "<li><img src='" + json[1] + "'></li>";
		str1 += "</ul><span class='btn btnL' title='上一张'>&lt</span>";
		for(var prop in json) {
			str2 += "<li num='" + prop + "'></li>";
		}
		str2 += "</ul>";
		this.innerHTML = str1 + str2;
		var ul = this.getElementsByClassName('imgUl')[0];
		console.log(ul.offsetLeft);
		var btnL = this.getElementsByClassName('btnL')[0];
		var btnR = this.getElementsByClassName('btnR')[0];
		var navUl = this.getElementsByClassName('navUl')[0];
		var indexList = navUl.getElementsByTagName('li');
		var botime = null;
		var lock = true;
		var index = 0;
		var len = (function(json) {
			var count = 0;
			for(var prop in json) {
				count++;
			}
			return count;
			})(json)
		var ulmove = {
			'left': 0
		};
		ul.style.width = (len + 1) * 500 + 'px';
		navUl.style.width = 20 * len + 'px';
		changeIndex(0);
		function init() {
			botime = setInterval(function() {
				ulmove.left -= 500;
				index ++;
				startMove(ul, ulmove);
				changeIndex(index %= len);
			}, 3000)
		}
		init();
		btnR.addEventListener('click', function() {
			if(lock) {
				lock = false;
				clearInterval(botime);
				index ++;
				ulmove.left -= 500;
				startMove(ul, ulmove);
				init();
				changeIndex(index %= len);
			}
		})
		btnL.addEventListener('click', function() {
			if(lock) {
				lock = false;
				clearInterval(botime);
				if(ul.offsetLeft == 0) {
					index += len;
					index --;
					ulmove.left = -(500 * len);
					ul.style.left = -(500 * len) + 'px';
					ulmove.left += 500;
					startMove(ul, ulmove);
					init();
					changeIndex(index %= len);
				} else {
					index --;
					ulmove.left += 500;
					startMove(ul, ulmove);
					init();
					changeIndex(index %= len);
				}
			}
		})
		function changeIndex(_index) {
			for(var i = 0; i < indexList.length; i++) {
				indexList[i].className = "";
			}
			indexList[_index].className = "actived";
		}
		for(var i = 0; i < indexList.length; i++) {
			(function(i) {
				indexList[i].addEventListener('click', function() {
					clearInterval(botime);
					ulmove.left = -i * 500;
					startMove(ul, ulmove);
					changeIndex(index = i);
					init();
				})
			})(i)
		}
		function startMove(obj, json) {
			clearInterval(obj.timer);
			lock = false;
			var iSpeed, iCur;
			obj.timer = setInterval(function() {
				var bStop = true;
				for(var attr in json) {
						iCur = parseInt(getStyle(obj, attr));
					iSpeed = (json[attr] - iCur) / 7;
					iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
						obj.style[attr] = iCur + iSpeed + 'px';
					if(iCur != json[attr]) {
						bStop = false;
					}
				}
				if(bStop) {
					clearInterval(obj.timer);
					lock = true;	//函数执行完的时候将锁打开，使下一次点击生效
					index %= len;
				}
				if(ul.offsetLeft <= -(500 * len)) {
					ulmove.left = 0;
					ul.style.left = '0px';
				}
			}, 30)
		}
		function getStyle(obj, attr) {	//封装getStyle
			if(obj.currentStyle) {
				return obj.currentStyle[attr];
			} else {
				return window.getComputedStyle(obj, false)[attr];
			}
		}
	}

//获取元素的只读css属性方法
	function getStyle(obj, attr) {	//注：attr为字符串	//返回值为string类型
		if(obj.currentStyle) {
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
