;
(function ($) {
    $.extend({
        /**
         * 弹出层（不带确定）
         * @param intro  提示信息文字
         * @param w  提示框宽度 默认：100px
         * @param h   提示框高度 默认：30px
         * @param animate  提示动画效果 css名称
         */
        jAlert: function (intro, w, h, animate) {
            var _w = (w == null || w == "" || w == undefined) ? 120 : w;
            var _h = (h == null || h == "" || h == undefined) ? 50 : h;
            var _a = (animate == null || animate == "" || animate == undefined) ? "j-alert-ani" : animate;
            var _html = "";
            _html += '<div id="jDisk" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 1000;">';
            _html += '      <div class="j-alert j ' + _a + ' animated" style="display: table; width: ' + _w + 'px; height: ' + _h + 'px; line-height:' + _h + 'px; margin: -' + _h / 2 + 'px 0 0  -' + _w / 2 + 'px; position: absolute; top: 50%; left: 50%; z-index: 1000; background: rgba(0,0,0,0.5); text-align: center; border-radius: 3px;">';
            _html += '              <span style="display: table-cell; vertical-align: middle; padding: 8px; font-size: 14px; color: #FFFFFF; line-height: 16px;">' + intro + '</span>';
            _html += '      </div>';
            _html += '</div>';
            $(document.body).append(_html);
            setTimeout(function () {
                $("#jDisk").fadeOut(function () {
                    $(this).remove();
                });
            }, 1500);
        },
        /**
         * 确认框
         * @param textAry  数组类型，文字信息，["提示信息"，"确定"，"取消"]
         * @param ensureFun  确定信息方法
         * @param cancelFun  取消信息方法
         * @param w  提示框宽度 默认：200px
         * @param h  提示框宽度 默认：90px
         * @param animate  提示动画效果 css名称
         */
        jConfirm: function (textAry, ensureFun, cancelFun, w, h, animate) {
            var _w = (w == null || w == "" || w == undefined) ? 210 : w;
            var _h = (h == null || h == "" || h == undefined) ? 100 : h;
            var _a = (animate == null || animate == "" || animate == undefined) ? "j-alert-ani" : animate;
            var _html = "";
            _html += '<div id="jDisk" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 1000; background: rgba(0,0,0,0.5);">';
            _html += '      <div class="j-confirm ' + _a + ' animated" style="position: absolute; height: ' + _h + 'px; width: ' + _w + 'px; margin: -' + _h / 2 + 'px 0 0 -' + _w / 2 + 'px; top: 50%; left: 50%; z-index: 1000; background: #FFF; text-align: center; border-radius: 5px; box-shadow: 2px 2px 3px #444040;">';
            _html += '          <p style="height: ' + (_h - 44) + 'px; display: table; margin: 0; padding: 0 10px; width: 100%;"><span style="display: table-cell; font-weight: bold; vertical-align: middle;">' + textAry[0] + '</span></p>';
            _html += '          <div class="j-confirm-btn" style="width: 100%; height: 44px; line-height: 44px; overflow: hidden; border-top: 1px solid #dcdada; position: absolute; bottom: 0; left: 0;">';
            _html += '              <a id="jCancel" href="javascript:;" style="display: block; float: left; width: 50%; text-align: center; color: #037cff;">' + textAry[2] + '</a>';
            _html += '              <a id="jEnsure" href="javascript:;" style="display: block; float: left; width: 50%; text-align: center; color: #037cff; border-left: 1px solid #dcdada;">' + textAry[1] + '</a>';
            _html += '          </div>';
            _html += '      </div>';
            _html += '</div>';
            $(document.body).append(_html);

            $("#jCancel").on("click", jCancel);
            $("#jEnsure").on("click", jEnsure);

            function jEnsure() {
                $("#jDisk").fadeOut(300, function () {
                    $(this).remove();
                    setTimeout(function () {
                        if (ensureFun == undefined || ensureFun == null || ensureFun == "") {
                            return false;
                        } else {
                            ensureFun.call();
                        }
                    }, 300);
                });
            }

            function jCancel() {
                $("#jDisk").fadeOut(300, function () {
                    $(this).remove();
                    setTimeout(function () {
                        if (cancelFun == undefined || cancelFun == null || cancelFun == "") {
                            return false;
                        } else {
                            cancelFun.call();
                        }
                    }, 300);
                });
            }
        },
        /**
         *
         * @param textAry  数组类型，文字信息，["提示信息"，"确定"]
         * @param ensureFun  确定信息方法
         * @param w  提示框宽度 默认：200px
         * @param h  提示框宽度 默认：90px
         * @param animate  提示动画效果 css名称
         */
        jAlertBtn: function (textAry, ensureFun, w, h, animate) {
            var _w = (w == null || w == "" || w == undefined) ? 210 : w;
            var _h = (h == null || h == "" || h == undefined) ? 100 : h;
            var _a = (animate == null || animate == "" || animate == undefined) ? "j-alert-ani" : animate;
            var _html = "";
            _html += '<div id="jDisk" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 1000; background: rgba(0,0,0,0.5);">';
            _html += '      <div class="j-confirm ' + _a + ' animated" style="position: absolute; height: ' + _h + 'px; width: ' + _w + 'px; margin: -' + _h / 2 + 'px 0 0 -' + _w / 2 + 'px; top: 50%; left: 50%; z-index: 1000; background: #FFF; text-align: center; border-radius: 5px; box-shadow: 2px 2px 3px #444040;">';
            _html += '          <p style="height: ' + (_h - 44) + 'px; display: table; margin: 0; padding: 0 10px; width: 100%;"><span style="display: table-cell; font-weight: bold; vertical-align: middle;">' + textAry[0] + '</span></p>';
            _html += '          <div class="j-confirm-btn" style="width: 100%; height: 44px; line-height: 44px; overflow: hidden; border-top: 1px solid #dcdada; position: absolute; bottom: 0; left: 0;">';
            _html += '              <a id="jEnsure" href="javascript:;" style="display: block; width: 100%; text-align: center; color: #037cff;">' + textAry[1] + '</a>';
            _html += '          </div>';
            _html += '      </div>';
            _html += '</div>';
            $(document.body).append(_html);

            $("#jEnsure").on("click", jEnsure);

            function jEnsure() {
                $("#jDisk").fadeOut(300, function () {
                    $(this).remove();
                    setTimeout(function () {
                        if (ensureFun == undefined || ensureFun == null || ensureFun == "") {
                            return false;
                        } else {
                            ensureFun.call();
                        }
                    }, 300);
                });
            }
        },

        /**
         * 自定义HTML的弹出框
         * @param options
         */
        jCustomEle: function (options) {
            var that = this;
            var defaults = {
                box: {
                    cls: "jDisk-box"
                },
                container: {
                    cls: "jDisk-container",
                    w: 210,
                    h: "auto",
                    animate: "j-alert-ani"
                },
                title: {
                    text: "提示标题",
                    cls: "jDisk-title"
                },
                btn: {
                    cls: "jDisk-btn",
                    text: ["取消", "确定"],
                    ensureFun: null,
                    cancelFun: null
                },
                customEle: {
                    ele: "",
                    html: "",
                    cls: "jDisk-custom"
                },
                initBeforeFun: null,
                initAfterFun: null
            };

            var box, container, title, btn, customEle;
            var style;
            that.init = function () {
                that.opt = $.extend(true, defaults, options || {});
                box = that.opt.box;
                container = that.opt.container;
                title = that.opt.title;
                btn = that.opt.btn;
                customEle = that.opt.customEle;
                if (that.opt.initBeforeFun) that.opt.initBeforeFun.call(that, that.opt);

                var btnType = Object.prototype.toString.call(btn.text) == "[object Array]" ? "hasBtn_two" : "hasBtn_one";


                $(document.body).append(AddDiskHtml(btnType));
                if ($("#joinCss").length == 0) $(document.head).append(style);
                var ele = $("." + customEle.cls), ele2 = $("." + container.cls);
                var customDom = customEle.html;
                ele.append($(customDom).removeAttr("style id"));
                ele2.css("margin-top", -(ele2.height() / 2) + "px");
                $("#jEnsure").on("click", ensureFun);
                $("#jCancel").on("click", cancelFun);
                customEle.ele.remove();

                if (that.opt.initAfterFun) that.opt.initAfterFun.call(that, ele);
            };

            that.close = function (callback) {
                $("#jDisk_tips").fadeOut(300, function () {
                    $(this).remove();
                    if (callback) callback();
                });
            };

            function ensureFun() {
                if (btn.ensureFun) btn.ensureFun.call(that, that.opt);
            }

            function cancelFun() {
                that.close(function () {
                    if (btn.cancelFun) btn.cancelFun.call(that, that.opt);
                });
            }

            /**
             * @return {string} HTML
             */
            function AddDiskHtml(type) {
                var container_h = !Number(container.h) ? "auto" : container.h + "px";
                var _html_ = "", _btn_html_ = "";
                if (type == "hasBtn_two") {
                    _btn_html_ += '<a id="jCancel" href="javascript:;" class="hasBtn_two">' + btn.text[0] + '</a>';
                    _btn_html_ += '<a id="jEnsure" href="javascript:;" class="hasBtn_two">' + btn.text[1] + '</a>';
                } else if (type == "hasBtn_one") {
                    _btn_html_ += '<a id="jEnsure" href="javascript:;" class="hasBtn_one">' + btn.text + '</a>';
                } else if (type == "none_btn") {
                    _btn_html_ += '';
                }
                _html_ += '<div id="jDisk_tips" class="' + box.cls + '">';
                _html_ += '     <div class="' + container.cls + " " + container.animate + ' animated" style="width:' + container.w + 'px; height:' + container_h + '; margin-left:' + -(container.w / 2) + 'px;">';
                _html_ += '         <h2 class="' + title.cls + '">' + title.text + '</h2>';
                _html_ += '         <div class="' + customEle.cls + '"></div>';
                _html_ += '         <div class="' + btn.cls + ' j-btn-bar">' + _btn_html_ + '</div>';
                _html_ += '     </div>';
                _html_ += '</div>';
                return _html_;
            }


            style = '<style type="text/css" id="joinCss">' +
            '.jDisk-box{ position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 1000; background: rgba(0,0,0,0.5);}  ' +
            '.jDisk-container{ position:absolute; top:50%; left:50%; z-index:1001; display:block; background:#ffffff; border-radius:5px; box-shadow: 2px 2px 3px #444040;} ' +
            '.jDisk-title{ font-weight:bold; font-size:16px; color:#000; margin:0; padding:0; height:44px; line-height:44px; display:block; width:100%; text-align:center;}' +
            '.jDisk-custom{ display: block; border-top:1px solid #dcdada; border-bottom:1px solid #dcdada; padding:5px}' +
            '.jDisk-btn{ display:block; width:100%; height:44px; line-height:44px; overflow: hidden}' +
            '.j-btn-bar a{ display: block; float: left; width: 50%; text-align: center; color: #037cff; font-size:14px;}' +
            '.j-btn-bar a.hasBtn_two:nth-child(1){ border-left:0 none;}' +
            '.j-btn-bar a.hasBtn_two{ width: 50%; border-left: 1px solid #dcdada;}' +
            '.j-btn-bar a.hasBtn_one{ width: 100%;}' +
            '</style>';

            //启用插件
            that.init();
        }
    });
})(jQuery);
