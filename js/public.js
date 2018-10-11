/**
 * 公共方法
 */
window.publicFuns = {};
publicFuns.property = {
    _clearTimer_: 0,
    _limit_timer: 0,
    _time_down: 0,
    _textMarquee_timer: 0,
    _setTimes_: 10,    //以秒为单位
    _set_limitTimes_: 24 * 3600,    //以天为单位
    _regAry: {
        telephone: /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
        telCode: /^[0-9]{6}$/,
        strengthA: {
            number: /^[0-9]+$/,
            letterCaps: /^[A-Z]+$/,
            letterLows: /^[a-z]+$/,
            symbol: /^\W+$/
        },
        strengthB: {
            numLetterA: /^(([0-9]+[a-z]+)|([a-z]+[0-9]+))[0-9a-z]*$/,
            numLetterB: /^(([0-9]+[A-Z]+)|([A-Z]+[0-9]+))[0-9A-Z]*$/,
            numSymbol: /^((\W+[0-9]+)|([0-9]+\W+))[\W0-9]*$/,
            LetterALetterB: /^(([A-Z]+[a-z]+)|([a-z]+[A-Z]+))[A-Za-z]*$/,
            LetterASymbol: /^((\W+[a-z]+)|([a-z]+\W+))[\Wa-z]*$/,
            LetterBSymbol: /^((\W+[A-Z]+)|([A-Z]+\W+))[\WA-Z]*$/
        }
    }
};
var _this_prop = publicFuns.property;

/**
 * 显示滑动动画
 * @param dom   触发元素
 * @param tag   显示元素
 */
publicFuns.animateTransform = {
    show: function (dom, tag) {
        $(document).on("click", dom, function () {
            $(tag).addClass("active");
        });
    },
    hide: function (dom, tag) {
        $(document).on("click", dom, function () {
            $(tag).removeClass("active");
        });
    }
};

/**
 * 文字跑马灯
 * @param tag   元素
 * @param slideDir 方向   top
 * @param time  时间
 */
publicFuns.marqueeText = function (tag, slideDir, time) {
    clearInterval(_this_prop._textMarquee_timer);
    _this_prop._textMarquee_timer = setInterval(function () {
        var _top = parseInt($(tag).css("marginTop"));
        var _moveHeight = $(tag).find("li:eq(0)").height();
        switch (slideDir) {
            case "top":
                $(tag).animate({
                    "marginTop": _top - _moveHeight + "px"
                }, 300, function () {
                    $(tag).css({"marginTop": 0}).children("li").last().after($(tag).children("li").first());
                });
                break;
        }
    }, time);
};

/**
 * 调用Swiper
 * @param ele   元素
 * @param type  类型，1：轮播，2：横向滑动，3：竖直滑动
 */
publicFuns.newSwiper = function (ele, type) {
    var opt = "";
    var tag = "";
    if (type == 1) {
        opt = {
            autoplay: 4000,
            pagination: ".swiper-pagination",
            loop: true,
            autoplayDisableOnInteraction: false,
            lazyLoading: true
        }
    } else if (type == 2) {
        opt = {
            freeMode: true,
            slidesPerView: "auto",
            lazyLoading: true,
            watchSlidesVisibility: true
        }
    } else if (type == 4) {
        opt = {
            pagination: ".swiper-pagination",
            autoplayDisableOnInteraction: false,
            lazyLoading: true
        }
    } else if (type == 5) {
        opt = {
            autoplayDisableOnInteraction: false,
            lazyLoading: true
        }
    } else {
        opt = {
            direction: 'vertical',
            freeMode: true,
            slidesPerView: "auto",
            lazyLoading: true,
            watchSlidesVisibility: true
        }
    }
    tag = new Swiper(ele, opt);
    return tag;
};

/**
 * 调用简单ISscroll
 * @param ele 元素
 */
publicFuns.newIScroll = function (ele) {
    var myScroll = new IScroll(ele, {
        scrollbars: true,
        mouseWheel: true,
        interactiveScrollbars: true,
        shrinkScrollbars: 'scale',
        fadeScrollbars: true,
        click: true,
        tap: true
    });
    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, false);
    return myScroll;
};

/**
 * 调用刷新ISscroll
 * @param ele
 * @param refreshFun
 * @param loadFun
 * @param type
 * @param imgCount
 * @returns {IScroll}
 */
publicFuns.newIScrollRefresh = function (ele, refreshFun, loadFun, type, imgCount) {
    var pullDownFlag, pullUpFlag;
    var pullDown, pullUp;
    var myScroll;
    var isScrolling = false;
    pullDownFlag = 0;
    pullUpFlag = 0;
    pullUp = document.getElementById("pullUp");
    pullDown = document.getElementById("pullDown");
    myScroll = new IScroll(ele, {
        probeType: 2,
        click: true,
        tap: true,
        momentum: true,
        mouseWheel: true,
        scrollbars: true,
        interactiveScrollbars: true,
        shrinkScrollbars: 'scale'
        //startY:-pullDown.offsetHeight
    });


    loadImg();

    if (type == 0) {
        myScroll.on("scroll", moveDistance);
        myScroll.on("scrollEnd", refreshAction);
    } else {
        myScroll.off("scroll", moveDistance);
        myScroll.off("scrollEnd", refreshAction);
    }


    myScroll.on("scrollStart", function () {
        //if (this.y == this.startY) {
        isScrolling = true;
        //}
    });

    function moveDistance() {
        if ((this.y < this.maxScrollY) && (this.pointY < 1)) {
            this.scrollTo(0, this.maxScrollY, 400);
            return;
        } else if (this.y > 0 && (this.pointY > window.innerHeight - 1)) {
            this.scrollTo(0, 0, 400);
            return;
        }
        if (isScrolling) {
            if (this.y >= 20) {
                pullDownFlag = 1;
                $(pullDown).css({"marginTop": "-81px"}, 600);
                $(pullDown).attr("class", "flip").find(".pullDownLabel").text("释放刷新...");
            } else if (this.y < 20) {
                pullDownFlag = 0;
                $(pullDown).attr("class", "").find(".pullDownLabel").text("下拉刷新...");
            }
            if (this.y < (this.maxScrollY - 30)) {
                pullUpFlag = 1;
                if (!$(pullUp).find("span").hasClass("index-pullUp")) {
                    $(pullUp).attr("class", "flip").find(".pullUpLabel").text("释放加载...");
                } else {
                    $(pullUp).attr("class", "flip").find(".pullUpLabel").text("释放，进入猜你喜欢");
                }
            } else if (this.y > (this.maxScrollY - 30)) {
                pullUpFlag = 0;
                if (!$(pullUp).find("span").hasClass("index-pullUp")) {
                    $(pullUp).attr("class", "").find(".pullUpLabel").text("加载更多...");
                } else {
                    $(pullUp).attr("class", "").find(".pullUpLabel").text("上拉，进入猜你喜欢");
                }
            }
        }
    }

    function refreshAction() {
        loadImg();
        if (pullDownFlag == 1) {
            $(pullDown).css({"marginTop": "-81px"});
            $(pullDown).attr("class", "loadingCls").find(".pullDownLabel").text("刷新中...");
            if (isScrolling) {
                myScroll.off("scroll", moveDistance);
                myScroll.off("scrollEnd", refreshAction);
                pullDownAction();
            }
        } else if (pullDownFlag == 0) {
            $(pullDown).css({"marginTop": "-121px"});
        }
        if (pullUpFlag == 1) {
            if (isScrolling) {
                myScroll.off("scroll", moveDistance);
                myScroll.off("scrollEnd", refreshAction);
                pullUpAction();
            }
            $(pullUp).attr("class", "loadingCls").find(".pullUpLabel").text("加载中...");
        }
        isScrolling = false;
    }

    function pullDownAction() {
        if (pullDown) {
            setTimeout(function () {
                $(pullDown).css({"marginTop": "-121px"});
                $(pullDown).attr("class", "").find(".pullDownLabel").text("下拉刷新...");
                if (refreshFun == undefined || refreshFun == null || refreshFun == "") {
                    return false;
                } else {
                    refreshFun.call();
                    pullDownFlag = 0;
                    myScroll.on("scroll", moveDistance);
                    myScroll.on("scrollEnd", refreshAction);
                    //myScroll.refresh();
                }
            }, 1000);
        } else {
            myScroll.on("scroll", moveDistance);
            myScroll.on("scrollEnd", refreshAction);
        }
    }

    function pullUpAction() {
        if (pullUp) {
            setTimeout(function () {
                if (!$(pullUp).find("span").hasClass("index-pullUp")) {
                    $(pullUp).attr("class", "").find(".pullUpLabel").text("加载更多...");
                } else {
                    $(pullUp).attr("class", "").find(".pullUpLabel").text("上拉，进入猜你喜欢");
                }
                if (loadFun == undefined || loadFun == null || loadFun == "") {
                    return false;
                } else {
                    loadFun.call();
                    pullUpFlag = 0;
                    myScroll.on("scroll", moveDistance);
                    myScroll.on("scrollEnd", refreshAction);
                    //myScroll.refresh();
                }
            }, 200);
        } else {
            myScroll.on("scroll", moveDistance);
            myScroll.on("scrollEnd", refreshAction);
        }
    }

    function loadImg() {
        var _container = $("#wrapper");
        var _imgTag = $('img.lazy');
        _container.trigger("scroll");
        if (_imgTag.length > 0) {
            _imgTag.lazyload({
                effect: "show",
                event: "scroll",
                threshold: 50,
                container: _container,
                load: function () {
                    $(this).addClass("img-loaded");
                    publicFuns.countProductImg(this, imgCount);
                }
            });
        }
        myScroll.refresh();
    }

    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, false);
    return myScroll;
};

publicFuns.countProductImg = function (imgEle, type) {
    if (type) {
        var that = $(imgEle);
        var ceil_w = Math.ceil(that.parents("li.upload-box").width());
        var ceil_h = Math.ceil(that.parents("li.upload-box").height());
        var w = that.width();
        var h = that.height();
        var width, height;
        width = ceil_w;
        height = Math.ceil(ceil_w / w * h);
        that.css({
            "width": width + "px",
            "height": height + "px",
            "margin-top": -Math.floor((height - ceil_h) / 2) + "px"
        });
    }
};

/**
 * 计算高度
 * @param ele
 * @param w
 * @param h
 */
publicFuns.countRatio = function (ele, w, h) {
    var _ratio;
    var _width = $(window).width();
    _ratio = _width / w;
    $(ele).height(parseInt(h * _ratio));
};

/**
 *  显示倒计时
 * @param dom   显示文字的元素
 * @param time   倒计时时间
 * @param finishFun   结束回调
 * @param countFun   倒计时回调
 */
publicFuns.countDown = function (dom, time, finishFun, countFun) {
    clearInterval(_this_prop._clearTimer_);
    var _times = (time == "" || time == null || time == undefined) ? _this_prop._setTimes_ : time;
    var $this = $(dom);
    if (!$this.hasClass("show-time")) {
        if ($this.parents("#codeTextNum").length > 0) {
            $this.text(publicFuns.padZero(_times, 2));
        } else {
            $this.text(publicFuns.padZero(_times, 2) + "秒后重发").addClass("active");
        }
    } else {
        $this.text(publicFuns.padZero(_times, 2));
    }
    _this_prop._clearTimer_ = setInterval(function () {
        if (countFun) countFun.call(dom, _times);
        _times--;
        if (_times == 0) {
            if (!$this.hasClass("show-time")) {
                $this.text("获取验证码").removeClass("active");
            }
            clearInterval(_this_prop._clearTimer_);
            finishFun.call($this);
        } else {
            if (!$this.hasClass("show-time")) {
                if ($this.parents("#codeTextNum").length > 0) {
                    $this.text(publicFuns.padZero(_times, 2));
                } else {
                    $this.text(publicFuns.padZero(_times, 2) + "秒后重发");
                }
            } else {
                $this.text(publicFuns.padZero(_times, 2));
            }
        }
    }, 1000);
};

/**
 * 点击触发倒计时
 * 编写发送验证码方法
 */
publicFuns.clickShowTime = function () {
    clearInterval(_this_prop._clearTimer_);
    var $this = $(this);
    var _times = _this_prop._setTimes_;
    $this.off("click", publicFuns.clickShowTime);
    $this.text(publicFuns.padZero(_times, 2) + "秒后重发").addClass("active")
    _this_prop._clearTimer_ = setInterval(function () {
        _times--;
        if (_times == 0) {
            $this.text("获取验证码").removeClass("active");
            $this.on("click", publicFuns.clickShowTime);
            clearInterval(_this_prop._clearTimer_);
        } else {
            $this.text(publicFuns.padZero(_times, 2) + "秒后重发");
        }
    }, 1000);
};

/**
 * 补零
 * @param num 补零的数字
 * @param n 补零的位数
 * @returns {num}   补零之后的字符
 */
publicFuns.padZero = function (num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
};

/**
 * 限时  倒计时
 * @param tag   目标
 * @param time   日期格式
 * @param Fun     结束的回调
 */
publicFuns.limitTime = function (tag, time, Fun) {
    var _time = 0;
    _time = setInterval(function () {
        var endTime = new Date("" + time + "");
        var curTime = new Date();
        var countTime = parseInt((endTime.getTime() - curTime.getTime()) / 1000);
        var d = parseInt(countTime / (60 * 60 * 24));
        var h = parseInt(countTime / (60 * 60) % 24);
        var m = parseInt(countTime / 60 % 60);
        var s = parseInt(countTime % 60);
        if (countTime <= 0) {
            d = 0;
            h = 0;
            m = 0;
            s = 0;
            Fun.call();
            clearInterval(_time);
        }
        $(tag).find('.timeDay').html(publicFuns.padZero(d, 2));
        $(tag).find('.timeHour').html(publicFuns.padZero(h, 2));
        $(tag).find('.timeMinute').html(publicFuns.padZero(m, 2));
        $(tag).find('.timeSecond').html(publicFuns.padZero(s, 2));
    }, 0);
    return _time;
};

/**
 * 倒计时(包含天)
 * @param tag   目标
 * @param time  倒计时时间   秒为单位
 * @param Fun
 */
publicFuns.dayTimeDown = function (tag, time, Fun) {
    var countTime = time;
    var int_day = Math.floor(countTime / 60 / 60 / 24);
    var int_hour = Math.floor(countTime / (60 * 60));
    var int_minute = Math.floor(countTime / 60) - (int_hour * 60);
    var int_second = Math.floor(countTime) - (int_hour * 60 * 60) - (int_minute * 60);
    $(tag).find('.timeDay').html(publicFuns.padZero(int_day, 2));
    $(tag).find('.timeHour').html(publicFuns.padZero(int_hour % 24, 2));
    $(tag).find('.timeMinute').html(publicFuns.padZero(int_minute, 2));
    $(tag).find('.timeSecond').html(publicFuns.padZero(int_second, 2));
    var _time;
    _time = setInterval(function () {
        countTime--;
        if (countTime > 0) {
            int_day = Math.floor(countTime / 60 / 60 / 24);
            int_hour = Math.floor(countTime / (60 * 60));
            int_minute = Math.floor(countTime / 60) - (int_hour * 60);
            int_second = Math.floor(countTime) - (int_hour * 60 * 60) - (int_minute * 60);
        } else {
            int_day = 0;
            int_hour = 0;
            int_minute = 0;
            int_second = 0;
            Fun.call();
            clearInterval(_time);
        }
        $(tag).find('.timeDay').html(publicFuns.padZero(int_day, 2));
        $(tag).find('.timeHour').html(publicFuns.padZero(int_hour % 24, 2));
        $(tag).find('.timeMinute').html(publicFuns.padZero(int_minute, 2));
        $(tag).find('.timeSecond').html(publicFuns.padZero(int_second, 2));
    }, 1000);
    return _time;
};

/**
 * 倒计时(不包含天)
 * @param tag   目标
 * @param time  倒计时时间   秒为单位
 * @param Fun
 */
publicFuns.timeDown = function (tag, time, Fun) {
    var countTime = time;
    var int_hour = Math.floor(countTime / (60 * 60));
    var int_minute = Math.floor(countTime / 60) - (int_hour * 60);
    var int_second = Math.floor(countTime) - (int_hour * 60 * 60) - (int_minute * 60);
    $(tag).find('.timeHour').html(publicFuns.padZero(int_hour, 2));
    $(tag).find('.timeMinute').html(publicFuns.padZero(int_minute, 2));
    $(tag).find('.timeSecond').html(publicFuns.padZero(int_second, 2));
    var _time;
    _time = setInterval(function () {
        countTime--;
        if (countTime > 0) {
            int_hour = Math.floor(countTime / (60 * 60));
            int_minute = Math.floor(countTime / 60) - (int_hour * 60);
            int_second = Math.floor(countTime) - (int_hour * 60 * 60) - (int_minute * 60);
        } else {
            int_hour = 0;
            int_minute = 0;
            int_second = 0;
            Fun.call();
            clearInterval(_time);
        }
        $(tag).find('.timeHour').html(publicFuns.padZero(int_hour, 2));
        $(tag).find('.timeMinute').html(publicFuns.padZero(int_minute, 2));
        $(tag).find('.timeSecond').html(publicFuns.padZero(int_second, 2));
    }, 1000);
    return _time;
};

/**
 * 验证form表单
 * @param val   输入验证的值
 */
publicFuns.testForm = {
    phone: function (val) {
        var _phone = "";
        var _val = val;
        if (_val.length != 0) {
            if (_val.length == 11) {
                _phone = !!eval(_this_prop._regAry.telephone).test(_val);
            } else if (_val.length > 0) {
                _phone = false;
            }
        } else {
            _phone = false;
        }
        return _phone;
    },
    password: function (val) {
        var _password = 0;
        var _val = val;
        if (_val.length >= 6) {
            if (eval(_this_prop._regAry.strengthA.number).test(_val) ||
                eval(_this_prop._regAry.strengthA.letterCaps).test(_val) ||
                eval(_this_prop._regAry.strengthA.letterLows).test(_val) ||
                eval(_this_prop._regAry.strengthA.symbol).test(_val)) {
                _password = 1;    //密码正确
            } else {
                _password = 0;    //密码不满足正则
            }
        } else {
            _password = 2;        //密码位数太少
        }
        return _password;
    }
};


/**
 * 验证手机并提示信息
 * @param val
 * @param Fun
 */
publicFuns.testPhone = function (val, Fun) {
    if (val.length != 0) {
        if (publicFuns.testForm.phone(val)) {
            if (Fun) {
                Fun.call();
            } else {
                $.jAlert("已发送到手机，注意查收", 200, 50, "");
            }

        } else {
            $.jAlert("手机号码格式错误", 140, 50, "");
        }
    } else {
        $.jAlert("请输入手机号", 140, 50, "");
    }
};

/**
 * 验证密码 并提示信息
 * @param val
 * @returns {boolean}
 */
publicFuns.testPwd = function (val) {
    var _isTerm = false;
    if (val.length == 0) {
        _isTerm = false;
        $.jAlert("请输入密码", 140, 50, "");
        return false;
    } else {
        if (publicFuns.testForm.password(val) == 0) {
            _isTerm = false;
            $.jAlert("密码不满足要求", 140, 50, "");
            return false;
        } else if (publicFuns.testForm.password(val) == 2) {
            _isTerm = false;
            $.jAlert("密码不能小于6位", 140, 50, "");
            return false;
        } else {
            _isTerm = true;
        }
    }
    return _isTerm;
};

/**
 * 清除文字
 * @param tag   清楚元素
 */
publicFuns.clearText = function (tag) {
    if (tag[0].nodeName.toLowerCase() == "input" || tag[0].nodeName.toLowerCase() == "textarea") {
        $(tag).val("");
    } else {
        $(tag).html("");
    }
};

/**
 * 全选列表
 * @param tag
 * @param list
 * @param allFun
 * @param noneFun
 */
publicFuns.allChecked = function (tag, list, allFun, noneFun) {
    var event = $(tag)[0].nodeName.toLocaleLowerCase() == "input" ? "change" : "click";
    var _this = $(tag);
    var _tag = $(list);
    var _current = $(tag)[0].nodeName.toLocaleLowerCase() == "input" ? _this.parents(".checkbox-bar") : _this.parent().find(".checkbox-bar");
    _current.toggleClass("active");
    _current.hasClass("active") ? _current.find("input[type='checkbox']").prop("checked", true) : _current.find("input[type='checkbox']").prop("checked", false);
    _tag.find(".checkbox-bar").toggleClass("active");
    if (!window._isAllCheck) {
        window._isAllCheck = true;
        _tag.find(".checkbox-bar").addClass("active");
        _tag.find("input[type='checkbox']").prop("checked", true);
        if (allFun == undefined || allFun == null || allFun == "") {
            return false;
        } else {
            allFun();
        }
    } else {
        window._isAllCheck = false;
        _tag.find(".checkbox-bar").removeClass("active");
        _tag.find("input[type='checkbox']").prop("checked", false);
        if (noneFun == undefined || noneFun == null || noneFun == "") {
            return false;
        } else {
            noneFun();
        }
    }
};

/**
 * 显示数字加减法
 * @param tag
 * @param Fun
 */
publicFuns.showCheckNum = function (tag, Fun) {
    var _this = $(tag);
    var _max = parseInt(_this.attr("data-max"));
    var _val = _this.find("input").val();
    var _html = "";
    _html += '<div id="showCheckDisk" style="display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 999;">';
    _html += '  <div class="j-alert-ani animated" id="showCheckCont" style="display: block; position: absolute; top: 50%; left: 50%; z-index: 1000; width: 210px; height: 140px; margin: -70px 0 0 -100px; background: #FFFFFF;  border-radius: 5px; box-shadow: 2px 2px 3px #444040;">';
    _html += '      <h2 style="text-align: center; font-size: 14px; padding: 15px 0; font-weight: bold; margin: 0 0 7px;">修改数量</h2>';
    _html += '      <div class="number-bar" style="width: 124px; margin: 0 auto;">';
    _html += '          <span class="reset-num-cut sprite-icon" id="resultCut" style="display: none;"></span>';
    _html += '          <span style="width: 100%;" class="reset-num-input" data-max="' + _max + '"><input id="inputNum" value="' + _val + '" type="text"></span>';
    _html += '          <span class="reset-num-add sprite-icon" id="resultAdd" style="display: none;"></span>';
    _html += '      </div>';
    _html += '      <div class="reset-num-btn" style="width: 100%; height: 44px; line-height: 44px; overflow: hidden; border-top: 1px solid #dcdada; position: absolute; bottom: 0; left: 0;">';
    _html += '          <a id="numCancelBtn" href="javascript:;" style="display: block; float: left; width: 50%; text-align: center; color: #037cff;">取消</a>';
    _html += '          <a id="numEnsureBtn" href="javascript:;" style="display: block; float: left; width: 50%; text-align: center; color: #037cff; border-left: 1px solid #dcdada;">确定</a>';
    _html += '      </div>';
    _html += '  </div>';
    _html += '</div>';

    $(document.body).append(_html);

    $("#inputNum").keyup(function () {
        var _val = $(this).val();
        //如果输入非数字，则替换为''，如果输入数字，则在每4位之后添加一个空格分隔
        //this.value = this.value.replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
        $(this).val(_val.replace(/[^\d]/g, ''));
        if (parseInt(_val) > parseInt($(this).parent().attr("data-max"))) {
            $(this).val(_max);
        } else if (parseInt(_val) == 0) {
            $(this).val("1");
        }
    });

    $("#resultCut").click(function () {
        var _max = parseInt($(this).next().attr("data-max"));
        publicFuns.numberCalculate($(this).next(), _max, "cut", "", "");
    });

    $("#resultAdd").click(function () {
        var _max = parseInt($(this).prev().attr("data-max"));
        publicFuns.numberCalculate($(this).prev(), _max, "add", "", "");
    });

    $("#numCancelBtn").click(function () {
        $("#showCheckDisk").fadeOut(300, function () {
            $(this).remove();
        });
    });

    $("#numEnsureBtn").click(function () {
        var _val = $("#inputNum").val();
        $("#showCheckDisk").fadeIn(300, function () {
            $(this).remove();
            setTimeout(function () {
                if (_val == "") {
                    _this.find("input").val("1");
                } else {
                    _this.find("input").val(parseInt(_val));
                }
                Fun.call();
            }, 300);
        });
    });
};

/**
 * 数字加减法
 * @param tag
 * @param maxNum
 * @param type   add加法   cut减法
 * @param addFun
 * @param cutFun
 */
publicFuns.numberCalculate = function (tag, maxNum, type, addFun, cutFun) {
    var _num = parseInt(tag.find("input").val());
    var _max = maxNum;
    if (type == "add") {
        if (tag.find("input").val() == "") {
            tag.find("input").val("1");
        } else {
            _num++;
            if (_num == (_max + 1)) {
                tag.find("input").val(_max);
            } else {
                tag.find("input").val(_num);
                if (addFun == undefined || addFun == null || addFun == "") {
                    return false;
                } else {
                    addFun.call();
                }
            }
        }
    } else if (type == "cut") {
        if (tag.find("input").val() == "") {
            tag.find("input").val("1");
        } else {
            _num--;
            if (_num == 0) {
                tag.find("input").val("1");
            } else {
                tag.find("input").val(_num);
                if (cutFun == undefined || cutFun == null || cutFun == "") {
                    return false;
                } else {
                    cutFun.call();
                }
            }
        }
    }
};

/**
 * 显示产品大图
 * @param e
 */
publicFuns.showProductImg = function (e) {
    e.stopPropagation();
    var _box = $(".imgBasicCls");
    var _this = this;
    var $dom = $("." + e.data + "");
    var _number = 0;
    var _height = 0;
    var _tag = "";
    var _html = "", _img = "", n = 0, _w = 0, _h = 0;

    if ($(this).hasClass("swiper-slide")) {
        if (_box.find(".swiper-slide").length >= 2 && _box.find(".swiper-slide-duplicate").length > 0) {
            _number = _box.find(".swiper-slide").length - 2;
            n = parseInt($(_this).attr("data-swiper-slide-index"));
        } else {
            _number = _box.find(".swiper-slide").length;
            n = $(_this).index();
        }
        _height = window.innerHeight;

    } else {
        _number = _box.find("." + $(this).attr("class") + "").length;
        //_number=4;
        _height = window.innerHeight - 44;

        if (_box.hasClass("active")) {
            n = $(_this).index() - 1;
        } else {
            n = $(_this).index();
        }
    }
    for (var i = 0; i < _number; i++) {
        if ($(this).hasClass("swiper-slide")) {
            if (_box.find(".swiper-slide").length >= 2 && _box.find(".swiper-slide-duplicate").length > 0) {
                _tag = $(".swiper-slide").eq(i + 1).find("img");
            } else {
                _tag = $(".swiper-slide").eq(i).find("img");
            }
            _img = _tag.attr("src");
        } else {
            _tag = $("." + $(_this).attr('class') + "").eq(i).find("img");
            _img = _tag.attr("src");
        }
        _w = _tag.width();
        _h = _tag.height();
        _html += '<div class="swiper-slide" style="height: ' + _height + 'px"><img style="width:' + imgSize(_w, _h).w + 'px; height:' + imgSize(_w, _h).h + 'px; margin:-' + (imgSize(_w, _h).h / 2) + 'px 0 0 -' + (imgSize(_w, _h).w / 2) + 'px;" src="' + _img + '"></div>';
    }
    $("#showImgNum").text("（" + (n + 1) + "/" + _number + "）");
    $dom.addClass("active").find(".swiper-wrapper").append(_html);
    var mySwiper = new Swiper("." + e.data + " .showProductImg-list", {
        loop: false,
        initialSlide: n,
        height: window.innerHeight,
        pagination: ".swiper-pagination",
        onSlideNextStart: function (swiper) {
            swiper.update(true);
            $("#showImgNum").text("（" + (swiper.activeIndex + 1) + "/" + $dom.find(".swiper-slide").length + "）");
        },
        onSlidePrevStart: function (swiper) {
            swiper.update(true);
            $("#showImgNum").text("（" + (swiper.activeIndex + 1) + "/" + $dom.find(".swiper-slide").length + "）");
        }
    });

    //返回
    $("#backBtn").on("click", function () {
        $dom.removeClass("active").find(".swiper-wrapper").empty();
        mySwiper.update(true);
        mySwiper.destroy(false, true);
    });

    if ($(this).hasClass("swiper-slide")) {
        $dom.on("click", function () {
            $dom.removeClass("active").find(".swiper-wrapper").empty();
            mySwiper.update(true);
            mySwiper.destroy(false, true);
        });
    }

    //删除
    $("#delImgBtn").on("click", function () {
        var $tag = $("#uploadImg");
        $(".swiper-slide-active").fadeOut(function () {
            if (_number != 1) {
                _number--;
                _box.find("." + $(_this).attr('class') + "").eq($(this).index()).remove();
                $(this).remove();
                mySwiper.update(true);
                $("#showImgNum").text("（" + ($(".swiper-slide-active").index() + 1) + "/" + $(".swiper-slide").length + "）");
            } else {
                $dom.removeClass("active").find(".swiper-wrapper").empty();
                _box.find("." + $(_this).attr('class') + "").eq($(this).index()).find(".close-icon").click();
            }
            if ($tag.find("li").length < 6) {
                $tag.find("li:first").show();
            }
        });
    });

    //计算图片高度
    function imgSize(w, h) {
        var _size = {};
        var _w = $(window).width();
        var _h = _height;
        if (w >= _w) {
            _size.w = _w;
            _size.h = _w / (w / h);
        } else if (h >= _h) {
            _size.h = _h;
            _size.w = _h * (w / h);
        } else if (w >= h) {
            _size.w = _w;
            _size.h = _w / (w / h);
        } else if (w < h) {
            _size.h = _h;
            _size.w = _h * (w / h);
        }
        return _size;
    }
};

/**
 * 滑块
 * @param ele
 */
publicFuns.slideBar = function (ele) {
    var _this = ele;
    var that = this;
    var saveObj = {};
    that.init = function (option) {
        var defaults = {
            ele: "#slideBarBtn",
            successFun: null,
            errorFun: null
        };
        that.opt = $.extend(defaults, option || {});
        saveObj._complete = $(_this).find(".slide-complete");
        saveObj._textTag = $(_this).find(".slide-text");
        saveObj._ratio = 0.0;
        saveObj._width = $(_this).width();
        $(_this).css({"overflow": "hidden", "position": "relative"});
        $(that.opt.ele).on("touchstart", _startFun);
    };

    var _isMove_ = false, _isSuccess_ = false;

    function _startFun(event) {
        event = window.event || event;
        event.stopPropagation();
        event.preventDefault();
        var touch = event.touches[0];
        saveObj._startLeft = $(this).position().left;
        saveObj._startX = touch.pageX;
        _isMove_ = true;
        _isSuccess_ = false;

        $(document).on("touchmove", _moveFun);
        $(document).on("touchend", _endFun);
    }

    function _moveFun(event) {
        event = window.event || event;
        event.stopPropagation();
        event.preventDefault();
        if (!_isMove_) return false;
        var opt = that.opt;
        var touch = event.touches[0];
        var _mx = touch.pageX;
        var _left = _mx - saveObj._startX + saveObj._startLeft;
        if (_left < 0) return false;
        if (_left > (saveObj._width - $(opt.ele).width() - 2)) return false;

        saveObj._ratio = _left / saveObj._width;
        //saveObj._textTag.css("opacity", (0.8 - saveObj._ratio.toFixed(2)));
        saveObj._complete.css("left", -((0.8 - saveObj._ratio.toFixed(2)) * 100) + "%");
        if (saveObj._ratio * 100 > 66) saveObj._textTag.css("opacity", "0.2");
        _isSuccess_ = saveObj._ratio * 100 >= 66;
        $(opt.ele).css("left", _left + "px");
    }

    function _endFun() {
        var opt = that.opt;
        _isMove_ = false;
        $(opt.ele).css("left", "0px");
        saveObj._textTag.css("opacity", "1");
        saveObj._complete.css("left", "-100%");
        if (!_isSuccess_) {
            _isSuccess_ = false;
            if (opt.errorFun) opt.errorFun.call(opt.ele, saveObj._ratio);
        } else {
            _isSuccess_ = true;
            if (opt.successFun) opt.successFun.call(opt.ele, saveObj._ratio);
        }

        $(document).off("touchmove", _moveFun);
        $(document).off("touchend", _endFun);
    }
};

/**
 * 购物车抛物线
 * @param event window.event对象
 * @param tag   点击目标  img的路径
 * @param startOpt  开始位置相关参数
 * @param endOpt    结束位置相关参数
 * @param endFun    动画结束时的回调
 */
publicFuns.shopFly = function (event, tag, startOpt, endOpt, endFun) {
    var start, end;
    if (startOpt == "" || startOpt == null || startOpt == undefined) {
        start = {
            left: $(event.target).offset().left - 20,
            top: $(event.target).offset().top - 50
        }
    } else {
        start = startOpt;
    }
    if (endOpt == "" || endOpt == null || endOpt == undefined) {
        end = {
            left: $(window).width(),
            top: $(window).height(),
            width: 5,
            height: 5
        }
    } else {
        end = endOpt;
    }

    var flyer = tag.fly({
        start: start,
        end: end,
        onEnd: function () {
            if (endFun == "" || endFun == null || endFun == undefined) {
                return false;
            } else {
                endFun.call();
                $(flyer).remove();
            }
        }
    });
};


//检测浏览器
var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //|| !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            HuaWei: u.indexOf('HUAWEI') > -1
        };
    }()
};

var browserVersions = function (text, start, end) {
    var result;
    var s = text.indexOf(start);
    if (s > -1) {
        var text2 = text.substr(s + start.length);
        var s2 = text2.indexOf(end);
        if (s2 > -1) {
            result = text2.substr(0, s2);
        } else result = '';
    } else result = '';
    return result;
};


//UC10版本  底部被遮到处理
publicFuns.isUC10 = function () {
    var screenHeight = window.screen.height;
    var scrollHeight = document.body.scrollHeight;
    var UC = navigator.userAgent.indexOf("UCBrowser") > -1;
    var UC_VERSIONS = browserVersions(navigator.userAgent, "UCBrowser/", " Mobile");
    if (UC) {
        if (Number(UC_VERSIONS.split(".")[0]) <= 10 && Number(UC_VERSIONS.split(".")[1]) <= 6) {
            if (scrollHeight <= screenHeight) {
                $("body").css("padding-bottom", "44px");
            }

            $(document).on("focus", "textarea,input", function () {
                $("body").css("padding-top", "0");
            });

            $(document).on("blur", "textarea.textarea,input.textarea", function () {
                $("body").css("padding-top", "44px");
            });
        }
    }

}();


//var UC = navigator.userAgent.indexOf("UCBrowser") > -1;
//var UC_VERSIONS = browserVersions(navigator.userAgent, "UCBrowser/", " Mobile");
//if (UC) {
//    if (Number(UC_VERSIONS.split(".")[0]) <= 10) {
//        if ($(".index-bto") && $(".index-bto").length != 0) {
//            $("body").css("padding-bottom", "44px");
//            //$(".index-bto").css("bottom", "44px");
//        }
//
//        //if
//
//        //$(document).on("blur", "textarea", function () {
//        //    $("body").css("padding-top", "44px");
//        //});
//    }
//}


//华为手机-处理输入文字变大
if (browser.versions.HuaWei) {
    if (parseInt(browserVersions(navigator.userAgent, "Chrome/", " Mobile").substring(0, 2)) <= 39) {
        var style = "" +
            "<style>" +
            "select:focus, textarea:focus,input:focus { font-size: 16px !important; }" +
            "</style>";
        $(document.head).append(style);
    }
}

//安卓手机-处理文本焦点
if (browser.versions.android) {
    $(document.body).click(function (e) {
        if (e.target.tagName.toLowerCase() == "input" || e.target.tagName.toLowerCase() == "textarea") {
            if ($(e.target.tagName).attr("type") == "text") {
                return false;
            }
        } else {
            $("input,textarea").blur();
        }
    });
}


/*后台添加*/
function GetShopItemCount() {
    $.ajax({
        url: "/ShopingCar/_load_itemcount",
        type: "POST",
        data: null,
        success: function (data) {
            var shopcount = "0";
            if (data.count > 0) {
                if (Number(data.count) > 99) {
                    shopcount = "99+";
                } else {
                    shopcount = data.count;
                }
            }
            return shopcount;
        }
    });
}


/********对接**********/

var api = {
    ios: (/iphone|ipad/gi).test(navigator.appVersion),
    /*扫描二维码*/
    scanning: function () {
    },
    /*
     * n:函数前缀
     * fn:函数名
     * param:参数集合
     * q:是否以双引号包裹
     */
    sendApi: function (n, fn, param, q) {

        var that = this;
        if (that.ios) {
            if (param != null && param.toString().indexOf("app/download") > 0) {
                var p = param[0];
                var replaceStr = '"';
                p = p.replace(new RegExp(replaceStr, ''), '');
                p = p.replace(new RegExp(replaceStr, ''), '');
                param[0] = p;
                that.makepost(fn, param);
            } else {
                that.makepost(fn, param);
            }

        } else {
            if (n != "IOS") {
                if (param && param instanceof Array) {
                    if (q) {
                        eval(n + "." + fn + "(\"" + param.join("\",\"") + "\")");
                    }
                    else {
                        eval(n + "." + fn + "(" + param.join(",") + ")");
                    }
                } else {
                    eval(n + "." + fn + "()");
                }
            }
        }


    },
    makepost: function (fn, param) {
        var _url = "http://ios_jsapi/" + fn;
        if (param && param instanceof Array) {
            if (fn == 'chat') {
                _url += "?" + param.join(",");
            } else {
                _url += "?" + param.join("&");
            }
        }
        window.location.href = _url;
    }
};
