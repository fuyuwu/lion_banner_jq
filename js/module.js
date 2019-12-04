(function($) {
  "use strict";

  var ModuleName = "banner";
  var Module = function(ele, options) {
    this.ele = ele; //DOM物件
    this.$ele = $(ele); //jquery物件
    this.options = options; //各行為傳進來的值
    this.$btn = $(`<div class="${options.button.class}"></div>`);
    this.$up = $('<i class="fas fa-sort-up"></i>');
    this.$down = $('<i class="fas fa-sort-down"></i>');
    this.transTimes = 600;
    this.timer;
  };

  //options預設值
  Module.DEFAULT = {
    openAtStart: true, //[boolean] true | false
    autoToggle: false, //[boolean|number] true | false | 3000
    transition: true, //是否有transition效果
    button: {
      closeText: "收合",
      openText: "展開",
      class: "btn"
    },
    //設定模組的四個狀態(頁面呈現)
    class: {
      closed: "closed",
      closing: "closing",
      opened: "opened",
      opening: "opening"
    },
    // 當有transition時，要執行的callback function
    whenTransition: function() {
      console.log("whenTransition");
    }
  };

  //開始寫function
  Module.prototype.toggle = function() {
    if (this.$ele.hasClass("opened")) {
      console.log("closed");
      this.close();
    } else if (this.$ele.hasClass("closed")) {
      console.log("opened");
      this.open();
    }
  };

  //初始值
  Module.prototype.init = function() {
    this.$ele.append(this.$btn); //新增btn
    var openAtStart = this.options.openAtStart;
    //畫面呈現是否先開
    if (this.options.autoToggle === false) {
      //autoToggle :false --> 不自動開合
      if (openAtStart) {
        this.open(); //自動開合,btn收合
      } else {
        this.close();
      }
    } else if (this.options.autoToggle === true) {
      if (openAtStart) {
        this.close();
      } else {
        this.open();
      }
    }
  };

  //設定各個狀態
  Module.prototype.open = function() {
    var opts = this.options;
    var timer;
    // console.log(opts.button.closeText);//收合
    this.$btn.text(opts.button.closeText).append(this.$up);
    if (opts.transition && this.$ele.hasClass("closed")) {
      this.whenTrans(); //啟動setInterval
      timer = this.timer;

      this.$ele
        .addClass("transition")
        .removeClass(opts.class.closed)
        .removeClass("closed")
        .addClass(opts.class.opening)
        .addClass("opening");
      this.$ele.on(
        "transitionend webkitTransitionEnd oTransitionEnd",
        function() {
          $(this)
            .removeClass(opts.class.opening)
            .removeClass("opening")
            .removeClass(opts.class.closed)
            .removeClass("closed")
            .addClass(opts.class.opened)
            .addClass("opened");
          Module.prototype.clearTimer(timer);
        }
      );
    } else {
      this.$ele
        .removeClass(opts.class.closed)
        .removeClass("closed")
        .addClass(opts.class.opened)
        .addClass("opened");
    }
  };

  Module.prototype.close = function() {
    var opts = this.options;
    var timer;
    this.$btn.text(opts.button.openText).append(this.$down);
    if (opts.transition && this.$ele.hasClass("opened")) {
      this.whenTrans(); //啟動setInterval
      timer = this.timer;
      this.$ele
        .addClass("transition")
        .removeClass(opts.class.opened)
        .removeClass("opened")
        .addClass(opts.class.closing)
        .addClass("closing");
      this.$ele.on(
        "transitionend webkitTransitionEnd oTransitionEnd",
        function() {
          $(this)
            .removeClass(opts.class.closing)
            .removeClass("closing")
            .removeClass(opts.class.opened)
            .removeClass("opened")
            .addClass(opts.class.closed)
            .addClass("closed");
          Module.prototype.clearTimer(timer);
        }
      );
    } else {
      this.$ele
        .removeClass(opts.class.opened)
        .removeClass("opened")
        .addClass(opts.class.closed)
        .addClass("closed");
    }
  };

  Module.prototype.whenTrans = function() {
    this.timer = setInterval(this.options.whenTransition, this.transTimes / 30); //間隔毫秒
    return this.timer;
  };

  Module.prototype.clearTimer = function(timer) {
    clearInterval(timer);
    clearTimeout(timer);
  };

  Module.prototype.openAtStart = function() {
    if (this.options.openAtStart) {
      this.$ele
        .removeClass(this.options.class.closed)
        .removeClass("closed")
        .addClass(this.options.class.opened)
        .addClass("opened");
      this.$btn.text(this.options.button.closeText).append(this.$up);
    } else {
      this.$ele
        .removeClass(this.options.class.opened)
        .removeClass("opened")
        .addClass(this.options.class.closed)
        .addClass("closed");
      this.$btn.text(this.options.button.openText).append(this.$down);
    }
  };
  Module.prototype.autoToggle = function() {
    var $this = this;
    var opts = this.options;
    if (typeof opts.autoToggle === "number") {
      setTimeout(() => {
        $this.toggle();
      }, opts.autoToggle);
    } else if (opts.autoToggle === true) {
      setTimeout(function() {
        $this.toggle();
      }, 2000);
    }
  };

  //啟動,分為第一次執行和第一次執行後
  // jQuery.fn = jQuery.prototype / []代表ModuleName是可以改變而不會寫死
  $.fn[ModuleName] = function(option) {
    return this.each(function() {
      var $this = $(this); //.banner
      var module = $this.data(ModuleName);
      var opts = null; //建立容器
      //兩個驚嘆號 強制轉換類型,!!是一個邏輯操作,不論它的後面接的是什麼數值,它的結果會被強制轉換成boolean類型,結果只有單純的true和false
      // 判斷裡面打 $('.banner').banner('close')是否會立即執行
      if (!!module) {
        if (typeof option === "string") {
          // console.log('option是', option) //open or close
          module[option]();
        } else {
          console.log("unsupported option!");
          throw "unsupported option!";
        }
      } else {
        //=>js: object.assign()
        opts = $.extend(
          {},
          Module.DEFAULT,
          typeof option === "object" && option
        );
        // console.log("option:" + option)//[object object]
        module = new Module(this, opts);
        $this.data(ModuleName, module); //.data(key,value)
        module.init();

        module.$btn.on("click", function() {
          module.toggle();
        });

        module.openAtStart();
        module.autoToggle();
      }
    });
  };
})(jQuery);
