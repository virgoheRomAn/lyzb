/**
 * 新版选择地址信息列表
 * v2.0
 * 修复执行获取地址需要初始化的问题。
 * js默认初始化，初始化中可以加当前对象的Element
 * 新增当前点击的对象。允许多个地址操作存在
 * xjq
 * 2016-11-09
 */
;
(function ($) {
    var areaFun = function (options, eleAry, list) {
        var _result_html_ = "";
        var _tag, _list, _ele, $province, $city, $county;
        var _this = this, tagElement;
        var _rank = 0;
        var callback = null;
        //var _province_id_ = [], _city_id_ = [], _id_list_ = [], _result_ary = [];

        _this.init = function (ele, rank, type, tagEle, Fun) {
            callback = Fun;
            _ele = ele;
            _list = $(ele);
            $province = $("#" + eleAry[0]);
            $city = $("#" + eleAry[1]);
            $county = $("#" + eleAry[2]);

            //当前点击对象
            tagElement = !tagEle ? "#checkArea" : tagEle;

            lineAnimate(36, -20);
            $province.find("span").text("请选择");
            $city.addClass("hide-modal").removeClass("active show-modal").find("span").text("请选择");
            $county.addClass("hide-modal").removeClass("active show-modal").find("span").text("请选择");
            $(".disk-loading").show();
            setTimeout(function () {
                $(".disk-loading").hide();
                initListFun(rank, type, "init", null);
            }, 500);
        };

        //获取地址信息
        _this.getAreaIntro = function (text, tagEle, Fun) {
            callback = Fun;
            tagElement = !tagEle ? "#checkArea" : tagEle;
            $province.addClass("show-modal").removeClass("hide-modal active").find("span").text(text.split(" ")[0]);
            $city.addClass("show-modal").removeClass("hide-modal active").find("span").text(text.split(" ")[1]);
            $county.removeClass("hide-modal").addClass("show-modal active").find("span").text(text.split(" ")[2]);

            var _this_area_ = getCityID(3, text.split(" ")[1]);
            initListFun(4, true, "select", _this_area_.id);
            $("#showArea").find("span").each(function () {
                if ($(this).text() == text.split(" ")[2]) {
                    $(this).addClass("active");
                }
            });
            lineAnimate($county.width(), ($province.width() + $city.width() + 20));
        };

        function initListFun(n, type, state, id) {
            _rank = n;
            _tag = $("#" + eleAry[n - 2]);
            var _html_ = "";
            if (state == "init") {
                _html_ = addHTML(n, options);
            } else if (state == "select") {
                _html_ = addHTML(n, options, id);
            }

            _list.scrollTop(0);
            _list.empty().html(_html_);
            var areaList = publicFuns.newSwiper(list, 3);
            areaList.update();

            _tag.addClass("active show-modal").removeClass("hide-modal").siblings().removeClass("active");

            if (type) {
                _list.find(".swiper-slide").on("click", selectAreaName);
            } else {
                _list.find(".swiper-slide").on("click", selectCityName);
            }
        }

        function addHTML(n, ary, id) {
            var _html_ = "";
            _html_ += '<div class="swiper-container area-swiper">';
            _html_ += '     <div class="swiper-wrapper">';
            for (var i = 0; i < ary.length; i++) {
                if (!id) {
                    if (n == parseInt(ary[i].Class)) {
                        _html_ += '<div class="swiper-slide"><span>' + ary[i].Name + '</span></div>';
                    }
                } else {
                    if (n == parseInt(ary[i].Class)) {
                        if (id == ary[i].ParentID) {
                            _html_ += '<div class="swiper-slide"><span>' + ary[i].Name + '</span></div>';
                        }
                    }
                }
            }
            _html_ += '     </div>';
            _html_ += '</div>';
            return _html_;
        }

        //选择省份地址
        function selectCityName() {
            $("#diskCont").removeClass("active");
            $("#disk").hide();
            $(tagElement).html('<i class="shop-sprite-icon"></i>' + $(this).text() + '');
        }

        //选择完整地址
        function selectAreaName() {
            var _val = $(this).text();
            var _length = $(".disk-tab-option.show-modal").length;
            var province_id, city_id, county_id;

            /*重新选择*/
            if (_length == 3) {
                if ($province.hasClass("active")) {
                    if ($province.find("span").text() != _val) {
                        $city.find("span").text("请选择");
                        $county.addClass("hide-modal").removeClass("show-modal").find("span").text("请选择");
                    }
                }
                if ($city.hasClass("active")) {
                    if ($city.find("span").text() != _val) {
                        $county.addClass("hide-modal").removeClass("show-modal").find("span").text("请选择");
                    }
                }
            }

            _tag.find("span").text(_val);
            _result_html_ = $province.text() + " " + $city.text() + " " + $county.text();
            //$(this).addClass("active").siblings().removeClass("active");
            //$(this).find("span").addClass("active").parent().siblings().find("span").removeClass("active");

            if (_rank == 4) {
                $("#diskCont").removeClass("active");
                $("#disk").hide();
                $(tagElement).text(_result_html_).addClass("active");
                var opt = {
                    A_province: getCityID(2, _result_html_.split(" ")[0]),
                    B_city: getCityID(3, _result_html_.split(" ")[1]),
                    C_county: getCityID(4, _result_html_.split(" ")[2])
                };
                if (callback) callback.call(tagElement, opt);
            } else {
                //静态模拟loading
                //真实数据获取，ajax请求，loading事件
                //后台获取数据，注意保持area.Item对象格式
                $(".disk-loading").show();
                setTimeout(function () {
                    $(".disk-loading").hide();
                    if (_rank == 2) {
                        var _pId = getCityID(2, $("a.disk-tab-option").eq(0).text());
                        initListFun((_rank + 1), true, "select", _pId.id);
                        lineAnimate($city.width(), $province.width());
                    } else if (_rank == 3) {
                        var _cId = getCityID(3, $("a.disk-tab-option").eq(1).text());
                        initListFun((_rank + 1), true, "select", _cId.id);
                        lineAnimate($county.width(), $province.width() + $city.width() + 20);
                    }
                }, 300);
            }
        }

        //线动画
        function lineAnimate(w, left) {
            var _line = $(".current-line");
            _line.css({
                "width": w + "px"
            }).animate({
                "left": (left + 30) + "px"
            }, 300, function () {
                $(this).width(w);
            })
        }

        //获取城市对应ID
        function getCityID(rank, text) {
            for (var i = 0; i < options.length; i++) {
                if (rank == options[i].Class) {
                    if (text == options[i].Name) {
                        return {id: options[i].Id, name: options[i].Name};
                    }
                }
            }
        }

        //获取城市名称
        function getCityName(rank) {
            var cityName = [];
            for (var i = 0; i < options.length; i++) {
                if (rank == options[i].Class) {
                    cityName.push(options[i].Name);
                }
            }
            return cityName;
        }


        //获取当前ID的列表
        function getAreaList(rank, id) {
            var obj = {
                areaID: [],
                areaName: []
            };
            for (var i = 0; i < options.length; i++) {
                if (rank == options[i].Class) {
                    if (id == options[i].ParentID) {
                        obj.areaID.push(options[i].Id);
                        obj.areaName.push(options[i].Name);
                    }
                }
            }
            return obj;
        }

        //绑定事件
        $("a.disk-tab-option").on("click", function () {
            var _i = $(this).index();
            var _t = $(this).text();
            $(this).addClass("active show-modal").removeClass("hide-modal").siblings().removeClass("active");

            if (_i == 0) {
                initListFun((_i + 2), true, "init");
                lineAnimate($province.width(), -20);
            } else if (_i == 1) {
                var _pId = getCityID(2, $("a.disk-tab-option").eq(0).text());
                initListFun((_i + 2), true, "select", _pId.id);
                lineAnimate($city.width(), $province.width());
            } else {
                var _cId = getCityID(3, $("a.disk-tab-option").eq(1).text());
                initListFun((_i + 2), true, "select", _cId.id);
                lineAnimate($county.width(), $province.width() + $city.width() + 20);
            }

            $("#showArea").find("span").each(function () {
                if ($(this).text() == _t) {
                    $(this).addClass("active");
                }
            });
        });

        //关闭弹窗
        $("#closeDisk").click(function () {
            $("#diskCont").removeClass("active");
            $("#disk").hide();
        });

        _this.init("#showArea", 2, false);
    };

    $.extend({
        checkArea: new areaFun(window._Area_Data, ["province", "city", "county"], ".area-swiper")
    });
})
(jQuery);



