$(function () {
    //if (browser.versions.mobile) window.location.href = "404.html";

    //窗口改变
    $(window).resize(function () {
        $(".related-swiper .swiper-slide").height($(".related-list").height());
        //publicFuns.countRatio(".header-banner", 750, 420);
    }).trigger("resize");

    //滚动条触发
    $(window).scroll(function () {
        var _t = Math.abs(parseInt($("#scroller").css("transform").split(",")[5].replace(")", "")));
        if (_t >= 200) {
            $("#goTop").fadeIn();
            //$(".lottery-tag-img").fadeIn();
        } else {
            $("#goTop").fadeOut();
            //$(".lottery-tag-img").fadeOut();
        }
    }).trigger("scroll");

    //热点列表滚动
    publicFuns.marqueeText("#hotsList", "top", 3000);

    //绑定需要预加载的图片
    //$("img.lazy").each(function () {
    //    lazyImg();
    //});

    //懒加载
    //function lazyImg() {
    //    $("img.lazy").lazyload({
    //        effect: "show",
    //        event: "scroll",
    //        load :function(){
    //            $(this).addClass("loaded");
    //        }
    //    });
    //}

    /**
     * 调用swiper
     */
    var bannerList = publicFuns.newSwiper(".header-banner", 1);
    var brandList = publicFuns.newSwiper("#brandList", 2);
    var newProList = publicFuns.newSwiper("#newProList", 2);
    var groupList = publicFuns.newSwiper("#groupList", 2);

    //每日推荐
    var productList = publicFuns.newSwiper("#recommendList", 2);
    $(".arrow-right").click(function () {
        productList.slideNext();
        if (productList.isEnd) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });

    productList.on("onSlideChangeEnd", function () {
        if (productList.isEnd) {
            $(".arrow-right").hide();
        } else {
            $(".arrow-right").show();
        }
    });

    productList.on("onSliderMove", function () {
        if (productList.isEnd) {
            $(".arrow-right").hide();
        } else {
            $(".arrow-right").show();
        }
    });

    /**
     * 调用IScroll刷新
     * @type {IScroll}
     */
    var myScroll, indexSwiper;
    myScroll = publicFuns.newIScrollRefresh("#wrapper", refreshFun, loadFun, 0);
    //引导页切换
    var _guide_i = 1;
    //$("#disk").fadeIn(function () {
    //    $(".index-guide" + _guide_i).fadeIn();
    //});

    $(".guide").find("a").click(function () {
        var _height = 0;
        $(this).parents(".guide").fadeOut(30, function () {
            _guide_i++;
            if (_guide_i == 2) {
                _height = $(".timeLimit-bar:eq(0)").offset().top;
                myScroll.scrollTo(0, -(_height - 150), 600);
                setTimeout(function () {
                    $(".index-guide" + _guide_i).fadeIn();
                }, 600)
            } else {
                $(".index-guide" + _guide_i).fadeIn();
            }
            if (_guide_i == ($(".guide").length + 1)) {
                $("#disk").fadeOut(30, function () {
                    myScroll.scrollTo(0, 0, 600);
                    $.jConfirm(["系统定位您在重庆，是否切换？", "切换", "取消"], function () {
                        console.log("切换到当前城市！");
                    }, "", 230, "", "");
                });
            }
        });
    });
    //刷新方法
    function refreshFun() {
        var IsInnerApp = $("#IsInnerApp").val();
        if (IsInnerApp == 1) {
            console.log("页面刷新。");
            //$.jAlert("刷新成功", "", "", "");
            myScroll.refresh();
            window.location.reload();
        }
        else {
            console.log("页面刷新。");
            $.jAlert("刷新成功", "", "", "");
            myScroll.refresh();
            window.location.reload();
        }
    }

    //加载数据方法
    var _showMain = false;

    function loadFun() {
        var _pullBar = $(".shopDetails-pullDown");
        $(".main-cont").addClass("animated-top");
        $(".shopDetails-intro").addClass("active");
        $("#scroller").css("height", "100%");
        if (myScroll) {
            //myScroll.scrollTo(0, 0, 0);
            //myScroll.refresh();
            myScroll.destroy();
            myScroll = null;
            $("#goTop").hide();
            $(".lottery-tag-img").hide();
        }
        indexSwiper = publicFuns.newSwiper(".related-swiper", 3);
        indexSwiper.on("onSliderMove", function () {
            var _y = indexSwiper.translate;
            if (_y >= 60) {
                _pullBar.addClass("active").find("span").text("释放，返回首页");
                _showMain = true;
            } else {
                if (_y >= 5) {
                    _pullBar.fadeIn();
                    _pullBar.css({
                        "top": "-50px"
                    });
                } else {
                    _pullBar.fadeOut();
                }
                _pullBar.removeClass("active").find("span").text("下拉，返回首页");
                _showMain = false;
            }
        });

        indexSwiper.on("onTransitionEnd", function () {
            _pullBar.fadeOut();
            if (_showMain) {
                _pullBar.fadeOut();
                $(".main-cont").removeClass("animated-top");
                $(".shopDetails-intro").removeClass("active");
                $("#scroller").css("height", "auto");
                if (myScroll == null) {
                    myScroll = publicFuns.newIScrollRefresh("#wrapper", refreshFun, loadFun, 0);
                    myScroll.scrollTo(0, myScroll.maxScrollY, 0);
                    $("#goTop").show();
                    $(".lottery-tag-img").show();
                }
            }
        });

        $("#closeRelated").click(function () {
            _pullBar.fadeOut();
            $(".main-cont").removeClass("animated-top");
            $(".shopDetails-intro").removeClass("active");
            $("#scroller").css("height", "auto");
            if (myScroll == null) {
                myScroll = publicFuns.newIScrollRefresh("#wrapper", refreshFun, loadFun, 0);
                myScroll.scrollTo(0, myScroll.maxScrollY, 0);
                $("#goTop").show();
                $(".lottery-tag-img").show();
            }
        });
    }

    //购物车抛物线
    $(".shopCar-btn").click(function (event) {
        event.stopPropagation();
        var _num = parseInt($(".car-btn").find("i").text());
        var _this = this;
        var img = $(_this).parents("li").find(".related-img img").attr("src");
        var flyer = $('<img class="fly-img" src="' + img + '">');
        publicFuns.shopFly(event, flyer, {
            left: $(this).parents("li").find(".related-img img").offset().left + 138,
            top: $(this).parents("li").find(".related-img img").offset().top + 30
        }, {
            left: $(window).width() - $(".mine-btn").width(),
            top: $(window).height() - $(".index-bto").height(),
            width: 5,
            height: 5
        }, function () {
            _num++;
            if (_num <= 99) {
                $(".car-btn").find("i").text(_num);
            }
        });
    });

    //置顶
    $("#goTop").click(function () {
        myScroll.scrollTo(0, 0, 300);
    });

    /**
     * 倒计时
     * @type {Date}
     */
    var times = parseInt((new Date("2016/11/11 0:00:00") - new Date()) / 1000);

    publicFuns.dayTimeDown(".limit-time-c", times, endFun);
    function endFun() {
        $(".limit-time-bar").find("img").attr("src", "img/limit-over.png");
        $(".limit-over-disk").show();
    }

    //底部菜单
    $(".index-bto").find("a").click(function () {
        $(".index-bto").find("a").removeClass("active");
        $(this).addClass("active").css("opacity", "1");
    });

    //下载APP引导
    $("#closeTips").click(function () {
        $(".new-APP-tips").slideUp();
        myScroll.refresh();
    });
});
