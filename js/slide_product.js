;
(function ($) {
    $.slideList = function (element, options) {
        var defaults = {
            duration: 500,
            ratio: 0.5,
            menu: "",
            initFun: null,
            successFun: null,
            errorFun: null
        };


        var plugin = this;
        var ele = $(element);
        var _move_ = false, _is_move_ = false;

        plugin.opt = $.extend({}, defaults, options);
        plugin.init = function () {
            var opt = plugin.opt;
            opt.width = $(window).width();
            opt.length = $(opt.menu).length;
            opt.current = 0;
            ele.css({
                "transition-duration": "0ms",
                "transition-timing-function": "ease-in-out",
                "transform": "translate(0px,0px) translateZ(0)",
                "-webkit-transform": "translate(0px,0px) translateZ(0)"
            });
            ele.on("touchstart", startFun);
            if (opt.initFun) opt.initFun.call(ele, opt);
        };

        function startFun(e) {
            e = window.event || event;
            var opt = plugin.opt;
            var touch = e.touches[0];
            opt.startX = touch.pageX;
            opt.startY = touch.pageY;
            _move_ = true;

            $(document).on("touchmove", moveFun);
            $(document).on("touchend", endFun);
        }

        function moveFun(e) {
            if (!_move_) return false;
            e = window.event || event;
            var opt = plugin.opt;
            var touch = e.touches[0];
            var mx = touch.pageX;
            var my = touch.pageY;
            if (Math.abs(my - opt.startY) < Math.abs(mx - opt.startX)) {
                window._iScroll = false;
                ele.css({
                    "transition-duration": "0ms",
                    "transition-timing-function": "ease-in-out",
                    "transform": "translate(" + (mx - opt.startX) + "px,0px) translateZ(0)",
                    "-webkit-transform": "translate(" + (mx - opt.startX) + "px,0px) translateZ(0)"
                });
                if (Math.abs(mx - opt.startX) / $(window).width() > opt.ratio) {
                    _is_move_ = true;
                }
                if (mx > opt.startX) opt.dir = 1;
                if (mx < opt.startX) opt.dir = -1;
            }
        }

        function endFun() {
            var opt = plugin.opt;
            console.log(opt.dir);
            move(opt.current);
            if (!_is_move_) {
                ele.css({
                    "transition-duration": "" + opt.duration + "ms",
                    "transition-timing-function": "ease-in-out",
                    "transform": "translate(0px,0px) translateZ(0)",
                    "-webkit-transform": "translate(0px,0px) translateZ(0)"
                });
            }

            $(document).off("touchmove", moveFun);
            $(document).off("touchend", endFun);
        }

        function move(index) {
            var opt = plugin.opt;
            var num = opt.length;
            if (index == (num - 1) || index == 0 || index == opt.current) {
                _is_move_ = false;
            }
            var direction = index > opt.current ? 1 : -1;
            ele.css({
                "transition-duration": "" + opt.duration + "ms",
                "transition-timing-function": "ease-in-out",
                "transform": "translate(" + opt.width * direction * -1 + "px,0px) translateZ(0)",
                "-webkit-transform": "translate(" + opt.width * direction * -1 + "px,0px) translateZ(0)"
            });
            if (opt.successFun)opt.successFun.call(this, index);
        }

        plugin.init();
    };
    $.fn.slideList = function (opt) {
        return this.each(function () {
            if (!$(this).data("slideList")) {
                var slideList = new $.slideList(this, opt);
                $(this).data("slideList", slideList);
            }
        });
    };
})(jQuery);
