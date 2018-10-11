/**
 * 忘记密码
 * @type {number}
 * @private
 */
var _pageStep = 0;
var _tag = "";
var _isType = "", _isTypeForget_;
var _back = $("#forgetGoBack");
var $goPhone = $("#goPhone");
var $goEmail = $("#goEmail");
var $phoneBar = $(".forget-phone");
var $emailBar = $(".forget-email");
var $mainBar = $(".forget-bar-c");

function next(type) {
    //_back.off("click", goBack);
    switch (type) {
        case "phone":
            _tag = $phoneBar;
            _isTypeForget_ = type;
            _tag.attr("data-show", "forget-phone");
            $phoneBar.show();
            $emailBar.removeClass("active").hide();
            //publicFuns.countDown("#phoneCode", 120, function () {
            //    $("#phoneCode").on("click", clickTime);
            //});
            $goPhone.hide();
            $goEmail.hide();
            break;
        case "all":
            _tag = $phoneBar;
            _isTypeForget_ = "phone";
            _tag.attr("data-show", "forget-phone");
            $phoneBar.show();
            $emailBar.removeClass("active").hide();
            //clearInterval(_this_prop._clearTimer_);
            //publicFuns.countDown("#phoneCode", 120, function () {
            //    $("#phoneCode").on("click", clickTime);
            //});
            $goPhone.show();
            $goEmail.show();
            $goPhone.on("click", goPhone);
            $goEmail.on("click", goEmail);
            $mainBar.hide();
            break;
        case "email":
            _tag = $emailBar;
            _isTypeForget_ = "email";
            _tag.attr("data-show", "forget-email");
            $emailBar.show();
            $phoneBar.removeClass("active").hide();
            //publicFuns.countDown("#emailCode", 120, function () {
            //    $("#emailCode").on("click", clickTime);
            //});
            $goPhone.hide();
            $goEmail.hide();
            break;
        case "setPaw":
            _tag = $(".forget-submit");
            break;
    }
    _tag.addClass("active");
    //_back.on("click", goBack);
}

function goBack() {
    switch (_pageStep) {
        case 0:
            _back.off("click", goBack);
            _back.click(function () {
                window.history.go(-1);
            });
            break;
        case 1:
            clearInterval(_this_prop._clearTimer_);
            _pageStep = _pageStep - 1;
            $mainBar.show();
            _tag.removeClass("active");
            break;
        case 2:
            clearInterval(_this_prop._clearTimer_);
            _pageStep = _pageStep - 1;
            _tag.removeClass("active");
            _tag = $(".forget-" + _isTypeForget_ + "");
            $("#" + _isTypeForget_ + "Code").text("获取验证码").removeClass("active").on("click", clickTime);
            break;
    }
}

function clickTime() {
    clearInterval(_this_prop._clearTimer_);
    var _times = _this_prop._setTimes_;
    var $this = $(this);
    $this.text(_times + "秒后重发").addClass("active");
    _this_prop._clearTimer_ = setInterval(function () {
        _times--;
        if (_times == 0) {
            $this.text("获取验证码").removeClass("active");
            $this.on("click", clickTime);
            clearInterval(_this_prop._clearTimer_);
        } else {
            $this.text(_times + "秒后重发");
            $this.off("click", clickTime);
        }
    }, 1000);
}

var _clear_num = 0;

function goPhone() {
    _tag = $phoneBar;
    _isTypeForget_ = "phone";
    $phoneBar.show();
    //_clear_num = _this_prop._clearTimer_;
    //clearInterval(_clear_num);
    //$("#" + _isTypeForget_ + "Code").text("获取验证码").removeClass("active").on("click", clickTime);
    setTimeout(function () {
        $phoneBar.addClass("active");
        $phoneBar.find(".forget-tips").show();
        $emailBar.removeClass("active");
    }, 100);
}

function goEmail() {
    _tag = $emailBar;
    _isTypeForget_ = "email";
    $emailBar.show();
    //_clear_num = _this_prop._clearTimer_;
    //clearInterval(_clear_num);
    //$("#" + _isTypeForget_ + "Code").text("获取验证码").removeClass("active").on("click", clickTime);
    setTimeout(function () {
        $emailBar.addClass("active");
        $emailBar.find(".forget-tips").show();
        $phoneBar.removeClass("active");
    }, 100);
}

$("#nextBtn1").click(function () {
    clearInterval(_this_prop._clearTimer_);
    _pageStep = 1;
    _isType = window.DATA._resetType_;
    _isTypeForget_ = window.DATA._resetType_;
    next(_isType);
});

$("#nextBtn2,#nextBtn3").click(function () {
    clearInterval(_this_prop._clearTimer_);
    _pageStep = 2;
    _isType = "setPaw";
    next(_isType);
});


var _clear_phoneTimer_, _isPhone_Click_ = false;
$("#phoneCode").on("click", function () {
    if (!_isPhone_Click_) {
        _isPhone_Click_ = true;
        timeDown(this, 5, _clear_phoneTimer_, function () {
            _isPhone_Click_ = false;
        });
    }
});

var _clear_emailTimer_, _isEmail_Click_ = false;
$("#emailCode").on("click", function () {
    if (!_isEmail_Click_) {
        _isEmail_Click_ = true;
        timeDown(this, 5, _clear_emailTimer_, function () {
            _isEmail_Click_ = false;
        });
    }
});

function timeDown(tag, times, clTimer, Fun) {
    var $this = $(tag);
    $this.text(times + "秒后重发").addClass("active");
    clTimer = setInterval(function () {
        times--;
        if (times == 0) {
            $this.text("获取验证码").removeClass("active");
            clearInterval(clTimer);
            Fun.call();
        } else {
            $this.text(times + "秒后重发");
        }
    }, 1000);
}


/**
 * 注册登录
 * @type {string}
 * @private
 */
//选中协议
var _isCheck = "";
$("#checkBox").change(function () {
    var $this = $(this);
    _isCheck = $this.prop("checked");
    $this.parents(".checkbox-bar").toggleClass("active");
    $(".register-btn").toggleClass("active");
});

//注册按钮
var _isTerm = false;
$(document).on("click", ".register-btn.active", function () {
    var _tel = $("#telephone");
    var _code = $("#code");
    var _pas = $("#password");
    var _pasAgain = $("#passwordAgain");


    if (_tel.val().length != 0) {
        if (publicFuns.testForm.phone(_tel.val())) {
            _isTerm = true;
        } else {
            $.jAlert("手机号码格式错误", 140, 50, "");
            _isTerm = false;
            return false;
        }
    } else {
        $.jAlert("请输入手机号", 140, 50, "");
        _isTerm = false;
        return false
    }

    if (_code.val().length == 0) {
        _isTerm = false;
        $.jAlert("请输入验证码", 140, 50, "");
        return false;
    } else {
        _isTerm = true;
    }

    if (publicFuns.testPwd(_pas.val())) {
        _isTerm = true;
    } else {
        _isTerm = false;
        return false;
    }

    if (_pasAgain.val() !== _pas.val()) {
        $.jAlert("两次密码不一样", 140, 50, "");
        _isTerm = false;
        return false;
    } else {
        _isTerm = true;
    }

    if (_isTerm) {
        $.jAlert("注册成功，正在跳转..", 160, 50, "");
    }
});

//显示密码
$("#showPaw").click(function () {
    if ($(this).hasClass("active")) {
        $("#paw").prop("type", "text");
    } else {
        $("#paw").prop("type", "password");
    }
    $(this).toggleClass("active");
});


