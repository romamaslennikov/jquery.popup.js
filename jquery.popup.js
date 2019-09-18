;(($, window) => {
  class Popup {
    constructor(self, options) {
      this.self = self;
      this._thisHeight = self.outerHeight();
      this._window = $(window);
      this._thisTransformHideDefault = 'scale(0)';
      this._thisTransformShowDefault = 'scale(1)';
      this._opened = false;
      this.popupBg = $('#popup-bg');
      this.options = $.extend({
        background: '#000',
        position: 'absolute',
        opacity: .5,
        zIndex: 123456788,
        classAnimateShow: '',  // animate.css, link https://daneden.github.io/animate.css/
        classAnimateHide: '',  // animate.css, link https://daneden.github.io/animate.css/
        time: 400,
        onPopupClose: () => {
        },
        onPopupInit: () => {
        },
      }, options, true);

      if (typeof options === 'object' || !options) {
        if (self.length) {
          this.init().events();
        }
      } else {
        this[options]();
      }

      return this
    }

    init() {
      this._opened = true;
      this.lock('-lock', '-popup-opened', true);
      if (this.options.classAnimateShow !== '') {
        this.self.removeClass(this.options.classAnimateHide);
        this.self.css({
          position: this.options.position,
          WebkitAnimationDuration: this.options.time / 1e3 + 's',
          animationDuration: this.options.time / 1e3 + 's',
          zIndex: this.options.zIndex + 1
        }).show().addClass('animated ' + this.options.classAnimateShow);
      } else {
        this.self.css({
          position: this.options.position,
          zIndex: this.options.zIndex + 1,
          transform: this._thisTransformHideDefault,
          transition: 'transform ' + this.options.time / 1e3 + 's ease-out'
        }).fadeIn(this.options.time).css({transform: this._thisTransformShowDefault});
      }

      if (this.options.position === 'fixed') {
        this.popupPosition();
        this._window.on('resize', () => {
          this.self.css({transition: 'left ' + this.options.time / 1e3 + 's ease-out, top ' + this.options.time / 1e3 + 's ease-out'});
          this.popupPosition();
        })
      } else if (this.options.position === 'absolute') {
        this.popupPositionRezise();
        this._window.on('resize', () => {
          this.self.css({transition: 'left ' + this.options.time / 1e3 + 's ease-out, top ' + this.options.time / 1e3 + 's ease-out'});
          this.popupPositionRezise();
        })
      }

      this.options.onPopupInit();

      this.overlay();

      return this
    }

    lock(classLock, classMod, open) {
      const html = $('html');
      if (open) {
        html.addClass(classMod + ' ' + classLock);
      } else {
        html.removeClass(classMod);
        setTimeout(function () {
          html.removeClass(classLock);
        }, this.options.time)
      }
    }

    overlay() {
      if (document.getElementById('popup-bg') === null) {
        $('<div/>', {
          id: 'popup-bg',
          css: {
            position: 'fixed',
            top: 0,
            height: '100%',
            width: '100%',
            left: 0,
            display: 'none',
            background: this.options.background,
            opacity: this.options.opacity,
            zIndex: this.options.zIndex,
            cursor: 'pointer'
          }
        }).appendTo('body');
      }

      this.popupBg = $('#popup-bg');
      this.popupBg.show();

      return this;
    }

    close() {
      this._opened = false;
      if (this.options.classAnimateHide !== '') {
        this.self.removeClass(this.options.classAnimateShow);
        this.self.addClass('animated ' + this.options.classAnimateHide);
        setTimeout(() => {
          this.self.hide();
        }, this.options.time);
      } else {
        this.self.fadeOut(this.options.time).css({transform: this._thisTransformHideDefault});
        this.self.removeClass('animated ' + this.options.classAnimateShow);
      }
      this.popupBg.fadeOut(this.options.time);
      this.lock('-lock', '-popup-opened');
      this.options.onPopupClose();
      return this;
    }

    popupPosition() {
      this.self.css({
        top: this._window.height() / 2 - this.self.outerHeight() / 2,
        left: this._window.width() / 2 - this.self.outerWidth() / 2
      });
      return this
    }

    popupPositionRezise() {
      const $ = this.self.offsetParent();
      if (this._thisHeight > this._window.height()) {
        this.self.css({top: -$.offset().top + this._window.scrollTop() + 5})
      } else {
        this.self.css({top: -$.offset().top + this._window.scrollTop() + this._window.height() / 2 - this.self.outerHeight() / 2})
      }
      if (this.self.outerWidth() > this._window.width()) {
        this.self.css({left: -$.offset().left + this._window.scrollLeft() + 5})
      } else {
        this.self.css({left: -$.offset().left + this._window.scrollLeft() + this._window.width() / 2 - this.self.outerWidth() / 2})
      }
      return this
    }

    events() {
      this.popupBg.on({
        click: () => {
          this._opened && this.close();
        }
      });
      $('.js-popup-close', this.self).on({
        click: () => {
          this.close();
        }
      });
      $(document).on({
        keydown: (e) => {
          if (e.code === 'Escape') {
            this._opened && this.close();
          }
        }
      });
    }
  }

  $.fn.popup = function (options) {
    if (!this.data('popup')) {
      this.data('popup', new Popup(this, options));
    } else {
      this.data('popup').init();
    }

    return this;
  }
})(jQuery, window);
