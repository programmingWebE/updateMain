function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

$(document).ready(function() {

  if (window.Swiper) {
    let swiper = new Swiper(".swiper__info", {
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next.info__button.info__button--next",
        prevEl: ".swiper-button-prev.info__button.info__button--prev",
      },
      pagination: {
        clickable: true,
        el: ".swiper-pagination",
      },
      allowTouchMove: false
    });
  }

  $('.menu__link--submenu').on('click', function(e){
    $(this).next().slideToggle(200);
    $(this).toggleClass('menu__link--submenu--active'); 
    e.preventDefault();
  })

  $('.main-header__search').on('click', function(){
    $('.main-header__row').toggleClass('main-header__row--active');
    $('.main-header__input').focus();
  })

  $('.main-header__user').on('click', function(){
    $('.main-header__wrapper').toggleClass('main-header__wrapper--active');
  })

  $('.main-header__burger-wrap').on('click', function(){
     $('.container--inner').toggleClass('active');
     $('.menu').toggleClass('menu--active');
     $('.wrap').addClass('wrap--popup');
     $('.main-header__burger').addClass('main-header__burger--close');
     console.log('le')
     $('.main-header').toggleClass('main-header--fixed')
  })

  $('#burger-menu--mobile').on('click', function(){
    $('#burger-menu .main-header__burger').removeClass('main-header__burger--close');
     $('.wrap').removeClass('wrap--popup');
  })


  let image = $('.panel__item');
  let title = $('.panel__title');
  let defaultTitle = $('.panel__title').data('default');
  let defaultDesc = $('.panel__text p').data('default');
  let wrap = $('.panel');
  let desc = $('.panel__text p');
  image.on('mouseover', function() {
    
    let currentColor = $(this).data("color");
    let currentTitle = $(this).data("title");
    let currentDesc = $(this).data("text");
    wrap.css("background", currentColor);
    title.text(currentTitle);
    desc.text(currentDesc);

    image.addClass('panel__disabled');
    $(this).addClass('panel__active');
  })

  image.on('mouseout', function() {
    image.removeClass('panel__disabled');
    image.removeClass('panel__active');
    title.text(defaultTitle);
    desc.text(defaultDesc);
    wrap.attr('style', '')
  })

  $('.btn').each(function() {
    $(this).children('span').clone().addClass('no-active').appendTo($(this));
  });


  let fontSize = getCookie('fontSize');
  if (fontSize) {
    $('html').css({
      'fontSize': `${fontSize}px`
    });
  }

  let btnFont = $('.main-header__item');

  btnFont.click(function() {
    let elem = parseInt($(this).data('font'));
    let fontSize = (16 * elem) / 100;
    $('html').css({
      'fontSize': `${fontSize}px`
    });
    document.cookie = `fontSize=${fontSize}; path=/; max-age=2592000`;
  });

  function fixContrastBg() {
    let $fixedMenu = $('.main-header');
    let list = $('.main-header__menu');
    let wrap = $('.main-header__wrap');
    let $intersection = $('.main-header+section');

      if ($intersection.offset().top < $(window).scrollTop() ) {
        $fixedMenu.addClass('header-control')
       list.addClass("main-header__menu--hidden");
        wrap.addClass('main-header__wrap--scroll')
      } else {
         $fixedMenu.removeClass('header-control')
        list.removeClass("main-header__menu--hidden");
         wrap.removeClass('main-header__wrap--scroll')
      }
    }

    fixContrastBg();

     $(window).scroll(function() {
      fixContrastBg()
    });

    (function () {
    
    $('.select__wrap').each(function () {
        var placeholder = $(this).find('.select__placeholder').html();
        if(placeholder == '') {
            checkActive(this);
            placeholder = $(this).find('.select__placeholder').html();
        }
    });

    $('.select__wrap').on('click', function (e) {
        if ($(e.target).is('.select__disabled') || $(e.target).closest('.select__list').length) {
            return false;
        }
        
        let $select__wrap = $(this);

        if(!$select__wrap.hasClass('select__wrap--active')) {
          if($select__wrap.hasClass('select__wrap--end-active')) {
          // предотвращение дребезга
          // меню ещё закрывается
          return
          }
            showSelectList($select__wrap)
        } else {
            hideSelectList($select__wrap)
        }
        
    });

    $('.select__wrap').on('click', '.select__item', function (e) {
        if ($(e.target).is('.select__item--disabled')) {
            return false;
        } else {
            let $select__wrap = $(this).parents('.select__wrap')
            let $select__item = $(this)

            $select__wrap.find('.select__item--active').removeClass('select__item--active')
            $select__item.addClass('select__item--active');
            setPlaceholder(this);

            hideSelectList($select__wrap)
        }
    });

    $('body').on('input', '.select__input', function (e) {
        let isFound;
        $(e.target).parent().siblings('li').each((i, el) => {
            let is = $(el).html().toLowerCase().indexOf(e.target.value.toLowerCase()) != -1;
            $(el).css("display", is ? "block" : "none");
            if(is) isFound = true;
        });
        $('.select__item-search-not-found').css("display", isFound ? "none" : "block");
    })

    $(document).on('click', function (e) {
        var $select__wrap = $(".select__wrap");
        if (!$select__wrap.is(e.target) && $select__wrap.has(e.target).length === 0) {
            hideSelectList($select__wrap)
        }
    });

    function showSelectList($select__wrap) {
        let $select__list = $select__wrap.find(".select__list");

        let { height, top, bottom } = $select__list.get(0).getBoundingClientRect();
        if($(window).height() < bottom - 16 && top > height + 16 * 2) {
        $select__wrap.addClass('select__wrap--position-top');
        }

        $('.select__wrap').removeClass('select__wrap--active');
        $select__wrap.addClass('select__wrap--start-active');
        setTimeout(() => {
            $select__wrap.removeClass('select__wrap--start-active').addClass('select__wrap--active');
            let duration = getTransitionDuration($select__list);
            setTimeout(() => {$select__wrap.addClass('select__wrap--end-active')}, duration)
        }, 0)
        
    }

    function hideSelectList($select__wrap) {
        $select__wrap.removeClass('select__wrap--active');
        let duration = getTransitionDuration($select__wrap.find(".select__list"));
        setTimeout(() => {$select__wrap.removeClass('select__wrap--position-top select__wrap--end-active')}, duration)
    }

    function setPlaceholder(self) {
        var value_pl = $(self).html();
        $(self).parents('.select__wrap').find('.select__placeholder').html(value_pl);
    }

    function checkActive(self) {
        var text = $(self).find('.select__item--active').text();
        if (text === undefined || text === '') {
            text = $(self).find('.select__item:not(.select__item--disabled):eq(0)').addClass('select__item--active').text();
        }
        $(self).find('.select__placeholder').html(text);
    }

    // Возвращает макс прододжительность анимации $self
    // Поддерживает только время в секундах (s)
    function getTransitionDuration($self) {
        return Math.max(...$self.css('transition-duration').split('s,').map(parseFloat), 0) * 1000 + 50;
    }

})();


});


$(document).on('click', function(e) {
  if (!$(e.target).closest(".menu").length && !$(e.target).closest(".main-header__burger").length 
    && !$(e.target).closest(".main-header__text").length && !$(e.target).closest(".main-header__burger-wrap").length) {
    $('.wrap').removeClass('wrap--popup');
    $('.menu').removeClass('menu--active');
    $('.container--inner').removeClass('active');
    $('.main-header__burger').removeClass('main-header__burger--close');
     $('#burger-menu .main-header__burger').removeClass('main-header__burger--close');
     $('.main-header').removeClass('main-header--fixed')
  }

   if (!$(e.target).closest(".main-header").length) {
    $('.main-header__row').removeClass('main-header__row--active')
   }

   if (!$(e.target).closest(".main-header__user").length && !$(e.target).closest(".main-header__col").length) {
    $('.main-header__wrapper').removeClass('main-header__wrapper--active');
   }
  e.stopPropagation();
});