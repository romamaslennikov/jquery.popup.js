/**
 * jquery.popup.js v. 0.09
 * author: Roman Maslennikov
 * used default: $('#elem').popup();
 * used options default:
 * background: '#000' // bg overlay
 * position: 'absolute' // position absolute or fixed
 * opacity: 0.5 // opacity overlay
 * zIndex: 123456788 // z-index overlay
 * transform: "scale" //"scale", "translateY", "translateX"
 * time: 400 // time init
 * onPopupClose: function e(){} // popup close after function
 * onPopupInit: function e(){} // popup init after function
 **/
(function ($$) {
    $$.fn.popup = function (popupParam) {

        // options default

        popupParam = $$.extend({
                background: "#000",
                position: "absolute",
                opacity: .5,
                zIndex: 123456788,
                transform: "scale",   //"scale", "translateY", "translateX"
                time: 400,
                onPopupClose: function e(){},
                onPopupInit: function e(){}
            },
            popupParam);

        // var

        var _window = $$(window);
        var _this = $$(this);
        var _thisHeight = _this.outerHeight();
        var _thisWidth = _this.outerWidth();
        var _thisTransformHide = null;
        var _thisTransformShow = null;

        // function popupInit

        function popupInit(e) {
            if(popupParam.transform == "scale"){
                _thisTransformHide = "scale(0)";
                _thisTransformShow = "scale(1)";
            }else if(popupParam.transform == "translateY"){
                var _thisParamTranslateY  = _window.height() / 2 - _thisHeight / 2 + _thisHeight;
                _thisTransformHide = "translateY(-" + _thisParamTranslateY + "px" +")";
                _thisTransformShow = "translateY(0)";
            }else{
                var _thisParamTranslateX  = _window.width() / 2 - _thisWidth / 2 + _thisWidth;
                _thisTransformHide = "translateX(-" + _thisParamTranslateX + "px" +")";
                _thisTransformShow = "translateX(0)";
            }
            _this.css({
                position: popupParam.position,
                zIndex: popupParam.zIndex + 1,
                transform: _thisTransformHide,
                transition: "transform " + popupParam.time / 1e3 + "s ease-out"
            }).fadeIn(popupParam.time).css({transform: _thisTransformShow});
            e();
        }

        //  function popupClose

        function popupClose(e) {
            popupBg.fadeOut(popupParam.time);
            _this.fadeOut(popupParam.time).css({transform: _thisTransformHide});
            e();
        }

        // function popupPosition

        function popupPosition() {
            _this.css({top: _window.height() / 2 - _this.outerHeight() / 2, left: _window.width() / 2 - _this.outerWidth() / 2})
        }

        // function popupPositionRezise

        function popupPositionRezise() {
            var $$ = _this.offsetParent();
            if (_thisHeight > _window.height()) {
                _this.css({top: -$$.offset().top + _window.scrollTop() + 5})
            } else {
                _this.css({top: -$$.offset().top + _window.scrollTop() + _window.height() / 2 - _this.outerHeight() / 2})
            }
            if (_this.outerWidth() > _window.width()) {
                _this.css({left: -$$.offset().left + _window.scrollLeft() + 5})
            } else {
                _this.css({left: -$$.offset().left + _window.scrollLeft() + _window.width() / 2 - _this.outerWidth() / 2})
            }
        }

        //  function popupBgAddCss

        function popupBgAddCss() {
            popupBg.height($$(document).height());
            popupBg.width($$(document).width())
        }

        //  init overlay

        if (document.getElementById("popup-bg") != null) {
            $$("#popup-bg").remove()
        }
        $$("<div/>", {
            id: "popup-bg",
            css: {
                position: "fixed",
                top: 0,
                height: $$(document).height(),
                width: $$(document).width(),
                left: 0,
                display: "none",
                background: popupParam.background,
                opacity: popupParam.opacity,
                filter: "alpha(opacity=" + popupParam.opacity * 100 + ")",
                zIndex: popupParam.zIndex,
                cursor: "pointer"
            }
        }).appendTo("body");
        var popupBg = $$("#popup-bg");
        popupBg.fadeIn(popupParam.time);
        popupBgAddCss();
        _window.scroll(function () {
            popupBg.height($$(document).height());
            popupBg.width($$(document).width())
        });

        //  init popup

        popupInit(popupParam.onPopupInit);

        if (popupParam.position == "fixed") {
            popupPosition();
            _window.resize(function () {
                _this.css({transition: "all " + popupParam.time / 1e3 + "s ease-out"});
                popupPosition();
                popupBgAddCss();
            })
        } else if (popupParam.position == "absolute") {
            popupPositionRezise();
            _window.resize(function () {
                _this.css({transition: "all " + popupParam.time / 1e3 + "s ease-out"});
                popupPositionRezise();
                popupBgAddCss();
            })
        }

        //on events

        $$("#popup-bg,.js-popup-close").off('click').on({
            click: function () {
                popupClose(popupParam.onPopupClose);
                $$(document).off('keydown');
            }
        });
        $$(document).off('keydown').one('keydown',function ($$) {
            if ($$.keyCode == 27) {
                popupClose(popupParam.onPopupClose);
            }
        });

    }
})(jQuery);
