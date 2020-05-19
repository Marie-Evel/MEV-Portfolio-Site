var Global = (function () {
  const
  elementIsVisible = function(targetElement) {
    if ( targetElement.hasClass('visible') ) {
      return true;
    } else {
      return false;
    }
  },

  makeVisible = function(targetElement) {
    targetElement.addClass('visible');
    return true;
  },

  makeInvisible = function(targetElement) {
    targetElement.removeClass('visible');
    return true;
  },

  menuIsVisible = function(targetMenu) {
    if ( targetMenu.hasClass('show-menu') ) {
      return true;
    } else {
      return false;
    }
  },

  showMenu = function(targetMenu) {
    targetMenu.addClass('show-menu');
    return true;
  },

  hideMenu = function(targetMenu) {
    targetMenu.removeClass('show-menu');
    return true;
  },

  getScrollPosition = function() {
    return window.pageYOffset || document.documentElement.scrollTop;
  },

  setScrollPosition = function(targetPosition) {
    document.body.scrollTop = document.documentElement.scrollTop = targetPosition;
    return;
  },

  getTopPosition = function(targetElement) {
    return targetElement.offset().top - getScrollPosition();
  },

  getBottomPosition = function(targetElement) {
    return targetElement.offset().top + targetElement.outerHeight(true) - getScrollPosition();
  },

  makeVisibleBelow = function(targetElement, triggerPosition) {
  // Makes the target element visible when scroll position is below the
  // triggerPosition
    if(getScrollPosition() > triggerPosition) {
      makeVisible(targetElement);
      return true; // targetElement is now visible
    } else {
      makeInvisible(targetElement);
      return false; // targetElement is now hidden
    }
  }

  return {
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
  const $icon = $('#nav-icon'),

  openNav = function() {
    $icon.toggleClass('hamburger close');
    MainNav.$nav.slideDown();
    Global.showMenu(MainNav.$nav);
    return;
  },

  closeNav = function() {
    $icon.toggleClass('hamburger close');
    Global.hideMenu(MainNav.$nav);
    MainNav.$nav.slideUp(function() {
      MainNav.$nav.removeAttr('style');
    });
    return;
  },

  toggleMenu = function() {
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
  let didScroll = false;

  const $nav = $('#menu-container'),
        $topChevron = $('#back-to-top a').eq(0),

  getCurAnchor = function(basedOnTop = false) {
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
  },

  convertHashToUrl = function(hash) {
    const protocol = $(location).attr('protocol'),
          path = $(location).attr('pathname'),
          finalUrl = protocol + '//' + path + hash;

    return finalUrl;
  },

  scrollNavigate = function(destinationHash, destinationUrl) {
    const targetPosition = $(destinationHash).offset().top;
    $('html, body').animate( { scrollTop: targetPosition }, 500, function() {
      goToUrl(destinationUrl);
    });
  },

  goToUrl = function(destinationUrl) {
    location.href = destinationUrl;
    return;
  },

  hamburgerIsDisabled = function() {
    return Hamburger.$icon.css("display") === 'none';
  },

  innerLinkClickEvent = function() {
    $('body.main .within-link').each(function(i, link) {
      $(link).click( function() {
        const newUrl = this.href,
              newHash = this.hash;

        if ( !hamburgerIsDisabled() && Global.menuIsVisible($nav) ) {
          Hamburger.closeNav();
        }
        scrollNavigate(newHash, newUrl);
        return false;
      });
    });
    return;
  },

  outerLinkClickEvent = function() {
    $('body.main .outer-link').each(function(i, link) {
      $(link).click(function() {
        const newUrl = this.href;

        if ( !hamburgerIsDisabled() && Global.menuIsVisible($nav) ) {
          Hamburger.closeNav();
        }
        $('#reveal-page').fadeIn("slow", function() {
          MainNav.goToUrl(newUrl);
        });

        return false;
      });
    });
  },

  refreshTopChevron = function() {
    return Global.makeVisibleBelow($topChevron, 85);
  };

  return {
    didScroll: didScroll,
    $topChevron: $topChevron,
    $nav: $nav,
    innerLinkClickEvent: innerLinkClickEvent,
    outerLinkClickEvent: outerLinkClickEvent,
    scrollNavigate: scrollNavigate,
    convertHashToUrl: convertHashToUrl,
    goToUrl: goToUrl,
    refreshTopChevron: refreshTopChevron,
    getCurAnchor: getCurAnchor,
    hamburgerIsDisabled: hamburgerIsDisabled
  };

}) ();

setInterval(function() {
  if(MainNav.didScroll) {
    MainNav.didScroll = false;
  }
}, 100);


$(document).ready(function() {
  $('.nav-background.current').eq(0).animate({ width: '100%'}, "slow");
  MainNav.innerLinkClickEvent();
  MainNav.outerLinkClickEvent();
  MainNav.refreshTopChevron();
  $('#reveal-page').fadeOut();
});

window.addEventListener('scroll', function() {
  MainNav.didScroll = true;
  MainNav.refreshTopChevron();
});
