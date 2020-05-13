var Global = function () {
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

  adjustScrollPosition = function(positionOffset) {
    setScrollPosition(getScrollPosition() + positionOffset);
    return getScrollPosition();
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
  };

  return {
    elementIsVisible: elementIsVisible,
    makeVisible: makeVisible,
    makeInvisible: makeInvisible,
    menuIsVisible: menuIsVisible,
    showMenu: showMenu,
    hideMenu: hideMenu,
    getScrollPosition: getScrollPosition,
    getTopPosition: getTopPosition,
    getBottomPosition: getBottomPosition,
    makeVisibleBelow: makeVisibleBelow,
    adjustScrollPosition: adjustScrollPosition
  };

} ();

// Hamburger menu for mobile:
var Hamburger = function () {
  const nav = $('#menu-container'),
        icon = $('#nav-icon'),
        menuItems = $('#menu-container .menu-item'),

  toggleMenuItems = function() {
    menuItems.each( function(index, menu) {
      let $curMenu = $(menu);
        debugger;
      setTimeout(function() {
        $curMenu.animate( { margin: 0 }, 400);
      }, 200 * index);
    });
  },

  openNav = function() {
    icon.toggleClass('hamburger close');
    nav.slideDown();
    // toggleMenuItems();
    Global.showMenu(nav);
    return;
  },

  closeNav = function() {
    icon.toggleClass('hamburger close');
    Global.hideMenu(nav);
    // toggleMenuItems();
    nav.slideUp(function() {
      nav.removeAttr('style');
    });
    return;
  },

  toggleMenu = function() {
    if ( Global.menuIsVisible(nav) ) {
      closeNav();
      return false;
    } else {
      openNav();
      return true;
    }
  };

  return {
    toggleMenu: toggleMenu
  };
} ();

var MainNav = function() {
  let didScroll = false;

  const navBackground = $('#nav-background'),
        topChevron = $('#back-to-top a').eq(0),

  getCurAnchor = function() {
    const anchorLinks = $('.anchor'),
          curPosition = Global.getScrollPosition() + window.innerHeight;

    let anchorIndex,
        curAnchor,
        curAnchorHash;

    anchorLinks.each( function(index, link) {
      if ( curPosition < $(link).offset().top ) {
        anchorIndex = index - 1;
        return false;
      }
    });

    curAnchor = anchorLinks[anchorIndex];
    curAnchorHash = '#' + $(curAnchor).attr('id');
    return curAnchorHash;
  },

  convertHashToUrl = function(hash) {
    return $(location).attr('origin') + $(location).attr('pathname') + hash;
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

  refreshTopChevron = function() {
    return Global.makeVisibleBelow(topChevron, 85);
  };

  return {
    topChevron: topChevron,
    didScroll: didScroll,
    scrollNavigate: scrollNavigate,
    convertHashToUrl: convertHashToUrl,
    goToUrl: goToUrl,
    refreshTopChevron: refreshTopChevron,
    getCurAnchor: getCurAnchor
  };

} ();

setInterval(function() {
  if(MainNav.didScroll) {
    MainNav.didScroll = false;
  }
}, 100);


$(document).ready(function() {
  $('.nav-background.current').eq(0).animate({ width: '100%'}, "slow");
  MainNav.refreshTopChevron();
  $('#reveal-page').fadeOut();
  return;
});

window.addEventListener('scroll', function() {
  MainNav.didScroll = true;
  MainNav.refreshTopChevron();
  return;
});
