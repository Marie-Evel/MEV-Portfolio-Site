var Global = (function () {
  let didScroll = false;

  const elementIsVisible = function(targetElement) {
    if ( targetElement.hasClass('visible') ) {
      return true;
    } else {
      return false;
    }
  };

  const makeVisible = function(targetElement) {
    targetElement.addClass('visible');
    return true;
  };

  const makeInvisible = function(targetElement) {
    targetElement.removeClass('visible');
    return true;
  };

  const menuIsVisible = function(targetMenu) {
    if ( targetMenu.hasClass('show-menu') ) {
      return true;
    } else {
      return false;
    }
  };

  const showMenu = function(targetMenu) {
    targetMenu.addClass('show-menu');
    return true;
  };

  const hideMenu = function(targetMenu) {
    targetMenu.removeClass('show-menu');
    return true;
  };

  const getScrollPosition = function() {
    return window.pageYOffset || document.documentElement.scrollTop;
  };

  const setScrollPosition = function(targetPosition) {
    document.body.scrollTop = document.documentElement.scrollTop = targetPosition;
    return;
  };

  const getTopPosition = function(targetElement) {
    return targetElement.offset().top - getScrollPosition();
  };

  const getBottomPosition = function(targetElement) {
    return targetElement.offset().top + targetElement.outerHeight(true) - getScrollPosition();
  };

  const makeVisibleBelow = function(targetElement, triggerPosition) {
  // Makes the target element visible when scroll position is below the
  // triggerPosition
    if(getScrollPosition() > triggerPosition) {
      makeVisible(targetElement);
      return true; // targetElement is now visible
    } else {
      makeInvisible(targetElement);
      return false; // targetElement is now hidden
    }
  };

  return {
    didScroll: didScroll,
    elementIsVisible: elementIsVisible,
    makeVisible: makeVisible,
    makeInvisible: makeInvisible,
    menuIsVisible: menuIsVisible,
    showMenu: showMenu,
    hideMenu: hideMenu,
    getScrollPosition: getScrollPosition,
    setScrollPosition: setScrollPosition,
    getTopPosition: getTopPosition,
    getBottomPosition: getBottomPosition,
    makeVisibleBelow: makeVisibleBelow
  };

}) ();

// Hamburger menu for mobile:
var Hamburger = (function () {
  const $icon = $('#nav-icon');

  const openNav = function() {
    $icon.toggleClass('hamburger close');
    MainNav.$nav.slideDown();
    Global.showMenu(MainNav.$nav);
    return;
  };

  const closeNav = function() {
    $icon.toggleClass('hamburger close');
    Global.hideMenu(MainNav.$nav);
    MainNav.$nav.slideUp(function() {
      MainNav.$nav.removeAttr('style');
    });
    return;
  };

  const toggleMenu = function() {
    if ( Global.menuIsVisible(MainNav.$nav) ) {
      closeNav();
      return false;
    } else {
      openNav();
      return true;
    }
  };

  return {
    $icon: $icon,
    toggleMenu: toggleMenu,
    closeNav: closeNav
  };
}) ();

var MainNav = (function() {
  const $nav = $('#menu-container'),
        $topChevron = $('#back-to-top a').eq(0);

  const getCurAnchor = function(basedOnTop = false) {
    const $anchorLinks = $('.anchor');

    let curPosition = Global.getScrollPosition(),
        anchorIndex,
        $curAnchor,
        curAnchorHash;

    if ( basedOnTop ) {
      curPosition = Global.getScrollPosition() + 0.4 * window.innerHeight;

    } else {
      curPosition = curPosition + window.innerHeight;
    }

    $anchorLinks.each( function(index, link) {
      if ( curPosition < $(link).offset().top ) {
        anchorIndex = index - 1;
        return false;
      }
    });

    $curAnchor = $anchorLinks[anchorIndex];
    curAnchorHash = '#' + $($curAnchor).attr('id');
    return curAnchorHash;
  };

  const convertHashToUrl = function(hash) {
    const protocol = $(location).attr('protocol'),
          path = $(location).attr('pathname'),
          finalUrl = protocol + '//' + path + hash;

    return finalUrl;
  };

  const scrollNavigate = function(destinationHash) {
  // const scrollNavigate = function(destinationHash, destinationUrl) {
    const targetPosition = $(destinationHash).offset().top;
    $('html, body').animate( { scrollTop: targetPosition }, 500, function() {
      // goToUrl(destinationUrl);
      refreshLocation(destinationHash);
    });
  };

  const goToUrl = function(destinationUrl) {
    location.href = destinationUrl;
    return;
  };

  const refreshLocation = function (destinationHash) {
    location.hash = destinationHash;
    return;
  };

  const hamburgerIsDisabled = function() {
    return Hamburger.$icon.css("display") === 'none';
  };

  const innerLinkClickEvent = function() {
    $('body.main .within-link').each(function(i, link) {
      $(link).click( function() {
        const newHash = this.hash;

        if ( !hamburgerIsDisabled() && Global.menuIsVisible($nav) ) {
          Hamburger.closeNav();
        }
        
        scrollNavigate(newHash);
        return false;
      });
    });
    return;
  };

  const outerLinkClickEvent = function() {
    $('body.main .outer-link').each(function(i, link) {
      $(link).click(function() {
        const newUrl = this.href;

        if ( !hamburgerIsDisabled() && Global.menuIsVisible($nav) ) {
          Hamburger.closeNav();
        }
        $('.reveal-page').fadeIn("slow", function() {
          MainNav.goToUrl(newUrl);
        });

        return false;
      });
    });
  };

  const refreshTopChevron = function() {
    return Global.makeVisibleBelow($topChevron, 85);
  };

  return {
    $topChevron: $topChevron,
    $nav: $nav,
    innerLinkClickEvent: innerLinkClickEvent,
    outerLinkClickEvent: outerLinkClickEvent,
    scrollNavigate: scrollNavigate,
    convertHashToUrl: convertHashToUrl,
    refreshLocation: refreshLocation,
    goToUrl: goToUrl,
    refreshTopChevron: refreshTopChevron,
    getCurAnchor: getCurAnchor,
    hamburgerIsDisabled: hamburgerIsDisabled
  };

}) ();

var Parallax = function() {
  const applyParallax = function ($container, strength = 0.5) {
    // For the effect to work, the container must have a specific height, with
    // overflow hidden, and its position must be set to relative.
    // The container must contain an img tag, and the image's position must be
    // set to absolute.
    //**********************************
    // strength must be between 0 and 1:
    // 0: no parallax effect; image moves with its container
    // 1: full parallax effect; image is pinned to the background behind the
    //    text

    strength = Math.max(Math.min(strength, 1), 0);

    let parallaxInEffect = false,
        headerHeight = $('header').outerHeight(),
        windowTop = Global.getScrollPosition(),
        windowBottom = windowTop + window.innerHeight,
        containerTopY = $container.offset().top,
        containerHeight = $container.innerHeight(),
        containerBottomY = containerTopY + containerHeight,
        newTop = 0,
        newBottom =0,
        vertOffset = 0;

    if ( windowTop + headerHeight >= containerTopY && windowTop + headerHeight <= containerBottomY ) {
      parallaxInEffect = true;
      newBottom = 0;
      newTop = 100 * (windowTop + headerHeight - containerTopY) / containerHeight;
      vertOffset = (strength - 1) * newTop;
    }
    // else if ( containerBottomY >= windowBottom && containerTopY <= windowBottom ) {
    //   parallaxInEffect = true;
    //   newTop = 0;
    //   newBottom = 100 * (containerBottomY - windowBottom) / containerHeight;
    //   vertOffset = -strength * newBottom;
    // }

    if ( parallaxInEffect ) {
      $container.find('img').css({
        top: newTop + '%',
        bottom: newBottom + '%',
        transform: 'translateY(' + vertOffset + '%)'
      });
    } else {
      $container.removeAttr('style');
    }

  };

  return {
    applyParallax: applyParallax
  }

} ();


setInterval(function() {
  if(Global.didScroll) {
    Global.didScroll = false;
  }
}, 100);


$(document).ready(function() {
  $('.nav-background.current').eq(0).animate({ width: '100%'}, "slow");
  MainNav.innerLinkClickEvent();
  MainNav.outerLinkClickEvent();
  MainNav.refreshTopChevron();
  // $('.reveal-page').fadeOut();
});

$(window).on('load', function() {
  $('.reveal-page').fadeOut();
});

window.addEventListener('scroll', function() {
  Global.didScroll = true;
  MainNav.refreshTopChevron();
});

// This ensures that when the back or forward buttons are used, the page gets
// reloaded (if not reloaded, .reveal-page is not faded out and it makes the
// page look blank). This is necessary because Safari (being a pain again)
// retrieves the prior or next page from cache, which was saved right after the
// .reveal page was faded in, therefore blocking the content of the page.
$(window).bind("pageshow", function(event) {
  if (event.originalEvent.persisted) {
    console.log('persisted');
    window.location.reload();
  }
});
