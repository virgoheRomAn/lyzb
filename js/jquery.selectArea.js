/**
 * 新版选择地址信息列表
 * v3.0
 * 修复执行获取地址需要初始化的问题。
 * js默认初始化，初始化中可以加当前对象的Element
 * 取消通过文字 获取ID。
 * 新增当前点击的对象。允许多个地址操作存在
 * 新增添加省/添加省市/添加省市区---1，2，3级添加。获取地址同理。
 * 新增自定义字符分隔符
 * xjq
 * 礼仪之邦
 * 2016-11-09
 */
;
(function ($) {
    /**
     * 选择地址组件
     * @param options   地址信息列表
     * @param eleAry    省市区ID
     * @param eleObj   element元素
     * @param hasSwiper 是否含有swiper
     */
    var areaFun = function (options, eleAry, eleObj, hasSwiper) {
        var that = this;
        var clickEle = "#checkArea", containerEle = "#showArea"; //点击对象，容器对象（默认值）
        var callback = null;
        var _result_html_ = "", _other_html_ = "", _result_data_ = {aProvince: {}, bCity: {}, cCounty: {}};
        var symbolDef = " ";    //默认字符之间是空格

        //省市区标识
        var $province = $("#" + eleAry[0]);
        var $city = $("#" + eleAry[1]);
        var $county = $("#" + eleAry[2]);

        //当前选择地址的标签和当前类型
        var $curTarget, sAreaType;

        //Element初始化
        var $disk = $(eleObj.diskEle), $diskCont = $(eleObj.diskContEle), $diskClose = $(eleObj.diskCloseEle);
        var $lineEle = $(eleObj.lineEle), $loading = $(eleObj.loadingEle), $tab = $(eleObj.tabEle);

        /**
         * 初始化函数
         * @param ele   当前容器对象
         * @param tag   当前的点击对象
         * @param fun   点击回调函数
         * @param callFun 初始化之后回调
         * @param symbol 默认字符分割-空格
         * @private
         */
        var _init = function (ele, tag, fun, callFun, symbol) {
            containerEle = ele ? ele : containerEle;
            callback = fun;
            clickEle = !tag ? "#checkArea" : tag;
            symbolDef = !symbol ? symbolDef : symbol;
            _result_html_ = "";

            $loading.show();
            $disk.fadeIn();
            $diskCont.addClass("active");
            if ($(clickEle).children().length > 0) {
                _other_html_ = $(clickEle).children();
            }
            setTimeout(function () {
                $loading.hide();
                if (callFun) callFun.call(containerEle);
            }, 500);
        };

        //选择省份地址
        that.sProvince = function (ele, tag, fun, symbol) {
            sAreaType = "sProvince";
            lineAnimate($province.width(), -20);
            _init(ele, tag, fun, function () {
                AddAreaListHtml(2, null, 1, sAreaType);
            }, symbol);
        };

        //选择城市地址
        that.sCity = function (ele, tag, fun, symbol) {
            sAreaType = "sCity";
            lineAnimate($province.width(), -20);
            _init(ele, tag, fun, function () {
                AddAreaListHtml(2, null, 2, sAreaType);
            }, symbol);
        };

        //选择区域地址
        that.sCounty = function (ele, tag, fun, symbol) {
            sAreaType = "sCounty";
            lineAnimate($province.width(), -20);
            _init(ele, tag, fun, function () {
                AddAreaListHtml(2, null, 3, sAreaType);
            }, symbol);
        };

        //获取地址
        that.getAreaIntro = function (text, tag, fun, symbol) {
            symbol = symbol ? symbol : " ";
            clickEle = !tag ? "#checkArea" : tag;
            callback = fun;
            var textAry = text.split(symbol);
            var areaType = textAry.length;
            var p_text = textAry[0], city_text = textAry[1], county_text = textAry[2];
            _init(containerEle, clickEle, fun, function () {
                var province = getProvinceID(p_text);
                var county = getAreaByText(county_text);
                var provinceID = province.id, cityID = "", countyID = "";
                if (county.length > 1) {
                    for (var i = 0; i < county.length; i++) {
                        if (county[i][1] == provinceID.toString().toUpperCase()) {
                            cityID = county[i][2].toString().toLowerCase();
                            countyID = county[i][3].toString().toLowerCase();
                        }
                    }
                } else {
                    cityID = getProvinceID(city_text).id;
                    countyID = getProvinceID(county_text).id;
                }

                if (areaType == 1) {
                    sAreaType = "sProvince";
                    $province.addClass("show-modal").removeClass("hide-modal active").find("span").text(p_text).data("areaId", provinceID);
                    lineAnimate($province.width(), -20);
                    AddAreaListHtml(2, null, 1, sAreaType);
                    curAreaClass(p_text);
                } else if (areaType == 2) {
                    sAreaType = "sCity";
                    $province.addClass("show-modal").removeClass("hide-modal active").find("span").text(p_text).data("areaId", provinceID);
                    $city.addClass("show-modal active").removeClass("hide-modal").find("span").text(city_text).data("areaId", cityID);
                    lineAnimate($city.width(), $province.width());
                    AddAreaListHtml(null, provinceID, 1, sAreaType);
                    curAreaClass(city_text);
                } else if (areaType == 3) {
                    sAreaType = "sCounty";
                    $province.addClass("show-modal").removeClass("hide-modal active").find("span").text(p_text).data("areaId", provinceID);
                    $city.addClass("show-modal").removeClass("hide-modal active").find("span").text(city_text).data("areaId", cityID);
                    $county.removeClass("hide-modal").addClass("show-modal active").find("span").text(county_text).data("areaId", countyID);
                    lineAnimate($county.width(), $province.width() + $city.width() + 20);
                    AddAreaListHtml(null, cityID, 1, sAreaType);
                    curAreaClass(county_text);
                }
            }, symbol);
        };

        //获取区县ID
        that.getCountID = function (text, symbol) {
            symbol = symbol ? symbol : " ";
            var id;
            var textAry = text.split(symbol);
            var areaType = textAry.length;
            var p_text = textAry[0], city_text = textAry[1], county_text = textAry[2];
            var province = getProvinceID(p_text);
            var city = getProvinceID(city_text);
            var county = getAreaByText(county_text);
            var provinceID = province.id;
            if (areaType == 1) {
                id = provinceID.id;
            } else if (areaType == 2) {
                if (city.length > 1) {
                    for (var i = 0; i < city.length; i++) {
                        if (city[i][1] == provinceID.toString().toUpperCase()) {
                            id = county[i][2].toString().toLowerCase();
                        }
                    }
                } else {
                    id = getProvinceID(city_text).id;
                }
            } else if (areaType == 3) {
                if (county.length > 1) {
                    for (var i = 0; i < county.length; i++) {
                        if (county[i][1] == provinceID.toString().toUpperCase()) {
                            id = county[i][2].toString().toLowerCase();
                        }
                    }
                } else {
                    id = getProvinceID(county_text).id;
                }
            }
            return id;
        };

        //通过文字获取ID（文字唯一）
        function getProvinceID(text) {
            var sProvince = {name: "", id: ""};
            for (var i = 0; i < options.length; i++) {
                if (text === options[i].Name) {
                    sProvince.name = options[i].Name;
                    sProvince.id = options[i].Id;
                }
            }
            return sProvince;
        }


        //通过区县文字找出城市对应的 省份ID数组
        function getAreaByText(text) {
            var countyID = [];
            for (var i = 0; i < options.length; i++) {
                if (text === options[i].Name) {
                    countyID.push(options[i].PathID.split(","));
                }
            }
            return countyID;
        }

        //通过rank获取地址的名称和id
        function getAreaByRank(rank) {
            var sProvince = {name: [], id: []};
            for (var i = 0; i < options.length; i++) {
                if (rank === parseInt(options[i].Class)) {
                    sProvince.name.push(options[i].Name);
                    sProvince.id.push(options[i].Id);
                }
            }
            return sProvince;
        }

        //通过id获取地址的名称和id
        function getAreaById(id) {
            var sCity = {name: [], id: []};
            for (var i = 0; i < options.length; i++) {
                if (id === options[i].ParentID) {
                    sCity.name.push(options[i].Name);
                    sCity.id.push(options[i].Id);
                }
            }
            return sCity;
        }

        /**
         * 添加地址列表。绑定点击事件
         * @param rank  rank值
         * @param id    地址ID
         * @param sType 选择的级别 1-省，2-市，3-区
         * @param type 选择类型
         * @constructor
         */
        function AddAreaListHtml(rank, id, sType, type) {
            if (sType != 0) {
                _result_html_ = "";
                if (type == "sCounty") {
                    $curTarget = rank === null ? $("#" + eleAry[3 - sType]) : $("#" + eleAry[rank - 2]);
                } else if (type == "sCity") {
                    $curTarget = rank === null ? $("#" + eleAry[2 - sType]) : $("#" + eleAry[rank - 2]);
                } else if (type == "sProvince") {
                    $curTarget = rank === null ? $("#" + eleAry[1 - sType]) : $("#" + eleAry[rank - 2]);
                }
                $curTarget.addClass("active show-modal").removeClass("hide-modal").siblings().removeClass("active");
                var _html_ = "", str = "";
                var ary = !id ? getAreaByRank(rank) : getAreaById(id);
                var name = !id ? getAreaByRank(rank).name : getAreaById(id).name;
                for (var i = 0; i < name.length; i++) {
                    str += hasSwiper ? "<div class='swiper-slide'><span>" + name[i] + "</span></div>" : "<li><span>" + name[i] + "</span></li>";
                }
                _html_ += hasSwiper ? "<div class='swiper-container area-swiper'>" : "<div class='area-container'>";
                _html_ += hasSwiper ? "<div class='swiper-wrapper'>" : "<div class='area-list'>";
                _html_ += hasSwiper ? str : "<ul>" + str + "</ul>";
                _html_ += "</div>";
                _html_ += "</div>";

                $(containerEle).scrollTop(0);
                $(containerEle).empty().append(_html_);
                $(containerEle).find("span").each(function (i) {
                    $(this).data("areaId", ary.id[i]).on("click", {
                        sType: sType,
                        type: type
                    }, selectAreaFun);
                });
                if (hasSwiper) {
                    var areaList = publicFuns.newSwiper(".area-swiper", 3);
                    areaList.update();
                }
            } else {
                _result_data_.aProvince.id = $province.find("span").data("areaId");
                _result_data_.aProvince.name = $province.find("span").text();
                _result_data_.bCity.id = $city.find("span").data("areaId");
                _result_data_.bCity.name = $city.find("span").text();
                _result_data_.cCounty.id = $county.find("span").data("areaId");
                _result_data_.cCounty.name = $county.find("span").text();

                closeFun(function () {
                    if (_other_html_) {
                        $(clickEle).html(_other_html_[0].outerHTML + _result_html_);
                    } else {
                        $(clickEle).html(_result_html_);
                    }
                    if (callback) callback.call(clickEle, _result_data_);
                });
            }
        }

        //选择地址函数
        function selectAreaFun(e) {
            var sType = parseInt(e.data.sType);
            var type = e.data.type;
            var that = this;
            var id = $(that).data("areaId");
            var val = $(that).text();
            var _length = $(".disk-tab-option.show-modal").length;

            $(that).addClass("active").parent().siblings().children().removeClass("active");

            //重新选择(3级别)
            if (_length == 3) {
                if ($province.hasClass("active")) {
                    if ($province.find("span").text() != val) {
                        $city.find("span").text("请选择");
                        $county.addClass("hide-modal").removeClass("show-modal").find("span").text("请选择");
                    }
                }
                if ($city.hasClass("active")) {
                    if ($city.find("span").text() != val) {
                        $county.addClass("hide-modal").removeClass("show-modal").find("span").text("请选择");
                    }
                }
            }
            //重新选择(2级别)
            if(sAreaType=="sCity"){
                if (_length == 2) {
                    if ($province.hasClass("active")) {
                        if ($province.find("span").text() != val) {
                            $city.find("span").text("请选择");
                            $county.addClass("hide-modal").removeClass("show-modal").find("span").text("请选择");
                        }
                    }
                }
            }

            $curTarget.find("span").text(val).data("areaId", id);
            $lineEle.css("width", $curTarget.width() + "px");

            $loading.show();
            setTimeout(function () {
                $loading.hide();
                switch (type) {
                    case "sCounty":
                        _result_html_ += $province.text() + symbolDef + $city.text() + symbolDef + $county.text();
                        AddAreaListHtml(null, id, sType - 1, "sCounty");
                        break;
                    case "sCity":
                        _result_html_ += $province.text() + symbolDef + $city.text();
                        AddAreaListHtml(null, id, sType - 1, "sCity");
                        break;
                    case "sProvince":
                        _result_html_ += $province.text();
                        AddAreaListHtml(null, id, sType - 1, "sProvince");
                        break;
                }

                if ((type == "sCounty" && sType == 3) || (type == "sCity" && sType == 2)) {
                    lineAnimate($city.width(), $province.width());
                } else if (type == "sCounty" && sType == 2) {
                    lineAnimate($county.width(), $province.width() + $city.width() + 20);
                }

            }, 300);
        }

        //绑定事件-tab切换
        $tab.find("a.disk-tab-option").on("click", function () {
            var _i = $(this).index();
            var _t = $(this).text();
            var p_id = $tab.find("a.disk-tab-option").eq(0).find("span").data("areaId");
            var c_id = $tab.find("a.disk-tab-option").eq(1).find("span").data("areaId");
            $(this).addClass("active show-modal").removeClass("hide-modal").siblings().removeClass("active");
            _result_html_ = "";

            switch (sAreaType) {
                case "sProvince":
                    if (_i == 0) {
                        AddAreaListHtml(2, null, 1, "sProvince");
                        lineAnimate($province.width(), -20);
                    }
                    break;
                case "sCity":
                    if (_i == 0) {
                        AddAreaListHtml(2, null, 2, "sCity");
                        lineAnimate($province.width(), -20);
                    } else if (_i == 1) {
                        AddAreaListHtml(null, p_id, 1, "sCity");
                        lineAnimate($city.width(), $province.width());
                    }
                    break;
                case "sCounty":
                    if (_i == 0) {
                        AddAreaListHtml(2, null, 3, "sCounty");
                        lineAnimate($province.width(), -20);
                    } else if (_i == 1) {
                        AddAreaListHtml(null, p_id, 2, "sCounty");
                        lineAnimate($city.width(), $province.width());
                    } else if (_i == 2) {
                        AddAreaListHtml(null, c_id, 1, "sCounty");
                        lineAnimate($county.width(), $province.width() + $city.width() + 20);
                    }
                    break;
            }
            curAreaClass(_t);
        });

        //关闭弹窗
        $diskClose.click(function () {
            closeFun();
        });

        //关闭函数
        function closeFun(callback) {
            $diskCont.removeClass("active");
            $disk.hide();
            $(containerEle).empty();
            $tab.find(".disk-tab-option").eq(0).removeClass("hide-modal").addClass("show-modal active").html("<span>请选择</span>")
                .siblings("a").removeClass("show-modal active").addClass("hide-modal").html("<span>请选择</span>");
            lineAnimate(39, -20);
            if (callback) callback();
        }

        //线动画
        function lineAnimate(w, left) {
            $lineEle.css("width", w + "px").animate({"left": (left + 30) + "px"}, 300, function () {
                $(this).width(w);
            });
        }

        //获取当前文字
        function curAreaClass(text) {
            $(containerEle).find("span").each(function () {
                if ($(this).text() == text) {
                    $(this).addClass("active");
                }
            });
        }
    };

    $.extend({
        checkArea: new areaFun(window._Area_Data, ["province", "city", "county"], {
            diskEle: "#disk",
            diskContEle: "#diskCont",
            diskCloseEle: "#closeDisk",
            lineEle: ".current-line",
            loadingEle: ".disk-loading",
            tabEle: ".disk-tab"
        }, true)
    });
})
(jQuery);



