// Hamburger menu for mobile:
var nav = $('#menu-container');
var icon = $('#nav-icon');
var navBackground = $('#nav-background');


// Set up static variables (those won't change):
const projectNav = $('#project-nav');
const projectNavHandle = $('#project-nav-handle');
const topChevron = $('#back-to-top a').eq(0);
const introSection = $('#intro');
const overviewSection = $('#overview-anchor');
const navHandleOffset = - 50;

// Initialize variables that can change:
var curScrollPosition = getScrollPosition();
var overviewTopBeforeNavToggle = getTopPosition(overviewSection);
var overviewTopAfterNavToggle;
var positionOffset;
var navToggled = false;
var overviewTopAfterNavToggle;
var didScroll = false;
var isBelowIntro = false;
var manualScroll = true;
var linkClicked = false;

var outerTransition = (function() {
  // var anchorlinks = $('#menu-container a');

  function init() {
    return $('.outer-link').map(function(i, link) {
      $(link).click(function() {
        var newUrl = this.href;

        $('#reveal-page').fadeIn("slow");
        $('.nav-background.current').eq(0).animate({ width: '0%'}, "slow", function() {
          location.href = newUrl;
        });
        return false;
      });
    });
  }
  return { init: init};
})();

outerTransition.init();

function getParentAnchor(linkElement) {
  var allParents = linkElement.parents();
  var sectionAnchor;
  var parentHash;

  allParents.each( function(index, element) {
    var parentType = $(element).get(0).tagName;

    if (parentType == 'MAIN') {
      return false;
    } else {
      sectionAnchor = $(element).find('.section-anchor');

      if (sectionAnchor.length) {
        parentHash = '#' + sectionAnchor.attr('id');
        return false;
      } else {
        var prevSiblings = $(element).prevAll();
        var sectionsFound = prevSiblings.find('.section-anchor');

        if (sectionsFound.length) {
          sectionAnchor = $(sectionsFound[sectionsFound.length - 1]);
          parentHash = '#' + sectionAnchor.attr('id');
          return false;
        }
      }
    }
  })
  return parentHash;
};

function getCurAnchor() {
  var anchorLinks = $('.anchor');
  var curPosition = getScrollPosition() + window.innerHeight;
  var anchorIndex;

  anchorLinks.each( function(index, link) {
    if ( curPosition < $(link).offset().top ) {
      anchorIndex = index - 1;
      return false;
    }
  });
  var curAnchor = anchorLinks[anchorIndex];
  var curAnchorHash = '#' + $(curAnchor).attr('id');
  return curAnchorHash;
};

function convertHashToUrl(hash) {
  return $(location).attr('origin') + $(location).attr('pathname') + hash;
}

function scrollIt(destinationHash) {
  var curAnchor = getCurAnchor();
  var curParent = getParentAnchor($(curAnchor));
  var destinationParent = getParentAnchor($(destinationHash));
  var newPosition = $(destinationHash).offset().top;
  var curScrollPosition = getScrollPosition();
  var destinationOffset = Math.abs(newPosition - curScrollPosition);
  var scrollThreshold = 3 * window.innerHeight;

  if ( ( !elementIsVisible(projectNav)
      && (curParent === destinationParent || destinationOffset < scrollThreshold) )
      || destinationHash === '#contact' ) {
    return newPosition;
  } else {
    return null;
  }
};

function fadeNavigate(destinationHash, destinationUrl) {
  var targetElement = $(destinationHash);
  var revealPage = $('#reveal-page');

  if ( targetElement.hasClass('section-anchor') ) {
    revealPage.fadeIn(400, function() {
      location.href = destinationUrl;
      revealPage.fadeOut(800);
    });
  } else {
    var targetParent = getParentAnchor($(destinationHash));
    var parentUrl = convertHashToUrl(targetParent);
    revealPage.fadeIn(400, function() {
      location.href = parentUrl;
      revealPage.fadeOut(500, function() {
        scrollNavigate(destinationHash, destinationUrl);
      });
    });
  };
};

function scrollNavigate(destinationHash, destinationUrl) {
  var targetPosition = $(destinationHash).offset().top;
  $('html, body').animate( {
    scrollTop: targetPosition
  }, 500, function() {
    location.href = destinationUrl;
  });
};

function withinTransition() {
  $('.within-link').each(function(i, link) {
    $(link).click(function() {
      var newUrl = this.href;
      var newHash = this.hash;

      if ( $(link).parents('#project-nav.show-menu').length ) {
        closeProjectNav();
      }

      if ( scrollIt(newHash) ) {
        scrollNavigate(newHash, newUrl);
      } else {
        fadeNavigate(newHash, newUrl);
      }

      refreshProjectNav(false);

      return false;
    });
  });
}


$(document).ready(function() {
  withinTransition();
});

function showMenu(targetMenu) {
  targetMenu.addClass('show-menu');
  return true;
};

function hideMenu(targetMenu) {
  targetMenu.removeClass('show-menu');
  return true;
}

function menuIsVisible(targetMenu) {
  if ( targetMenu.hasClass('show-menu') ) {
    return true;
  } else {
    return false;
  }
};

function toggleMenu() {
  if ( menuIsVisible(nav) ) {
    hideMenu(nav);
    icon.className = 'hamburger';
    return false;
  } else {
    showMenu(nav);
    icon.className = 'close';
    return true;
  }
};

function getTopPosition(targetElement) {
  return targetElement.offset().top - getScrollPosition();
};

function getBottomPosition(targetElement) {
  return targetElement.offset().top + targetElement.outerHeight(true) - getScrollPosition();
};


function makeVisible(targetElement) {
  targetElement.addClass('visible');
  return true;
};

function makeInvisible(targetElement) {
  // targetElement.classList.remove('visible');
  targetElement.removeClass('visible');
  return true;
};

function elementIsVisible(targetElement) {
  // if (targetElement.classList.contains('visible')) {
  if ( targetElement.hasClass('visible') ) {
    return true;
  } else {
    return false;
  }
};

function initProjectNav() {
  // console.log('************* initProjectNav');
  if ( getScrollPosition() > overviewTopBeforeNavToggle ) {
    makeInvisible(projectNav);
  } else {
    makeVisible(projectNav);
  }
  refreshNavHandle();
  return;
}

function getScrollPosition() {
  curScrollPosition = window.pageYOffset || document.documentElement.scrollTop ;
  return curScrollPosition;
};

function setScrollPosition(targetPosition) {
  manualScroll = false;
  document.body.scrollTop = document.documentElement.scrollTop = targetPosition;
};

function adjustScrollPosition(positionOffset) {
  // console.log('***************** ADJUSTING SCROLL POSITION BY ' + positionOffset);
  setScrollPosition(getScrollPosition() + positionOffset);
  getScrollPosition();
}

function makeVisibleBelow(targetElement, triggerPosition) {
// Makes the target element visible when scroll position is below the
// triggerPosition
  if(getScrollPosition() > triggerPosition) {
    makeVisible(targetElement);
    return true;
  } else {
    makeInvisible(targetElement);
    return false;
  }
};

function makeDropdownContentVisible() {
  $('#project-nav .dropdown-content').each(function(index, element) {
    if( $(element).css('display') == 'none' ) {
      $(element).css('display','grid');
    }
  });
  return;
}

function restoreDropdownContent() {
  $('#project-nav .dropdown-content').each(function(index, element) {
    if( $(element).css('display') == 'grid' ) {
      $(element).css('display','none');
    }
  });
  return;
}

function refreshNavHandle() {
  if ( !menuIsVisible(projectNav) ) {
    return makeVisibleBelow(projectNavHandle, overviewSection.offset().top + navHandleOffset);
  }
}

function hideProjectNav() {
  makeInvisible(projectNav);
  makeVisible(projectNavHandle);
  restoreDropdownContent();
  return;
}

function unhideProjectNav() {
  makeVisible(projectNav);
  makeInvisible(projectNavHandle);
  makeDropdownContentVisible();
  return;
}

function toggleProjectNav() {
  navToggled = false;
  getScrollPosition();

  overviewTopBeforeNavToggle = getTopPosition(overviewSection)
  if ( elementIsVisible(projectNav) ) {
    if ( overviewTopBeforeNavToggle <  1 - navHandleOffset) {
      hideProjectNav()
      navToggled = true;
    }
  } else if ( !menuIsVisible(projectNav) ) {
      if ( getTopPosition(overviewSection) > 3 - navHandleOffset    ) {
        unhideProjectNav();
        navToggled = true;
    }
  }
  return navToggled;
};

function refreshTopChevron() {
  return makeVisibleBelow(topChevron, 85);
}

window.onload = function () {
  initProjectNav();
  refreshTopChevron();
  $('.nav-background.current').eq(0).animate({ width: '100%'}, "slow");
  $('#reveal-page').fadeOut();
};

window.onhashchange = function() {
  // console.log('onhsashchange');
};

window.onscroll = runScrollEvents;

function runScrollEvents() {
  didScroll = true;

  refreshTopChevron();

  refreshProjectNav();

};

setInterval(function() {
  if(didScroll) {
    didScroll = false;
  }
}, 100);

// Project navigation:
function closeProjectNav() {
  // console.log('************* CLOSING PROJECT NAV');
  if ( projectNav.hasClass('show-menu') ) {
    makeVisibleBelow(projectNavHandle, overviewSection.offset().top + navHandleOffset);
    projectNav.animate({ width: 'toggle'}, function() {
      hideMenu(projectNav);
      projectNav.removeAttr('style');
    });
    return true;
  } else {
    return false;
  }
};


function openProjectNav() {
  makeInvisible(projectNavHandle);
  showMenu(projectNav);
  projectNav.animate({ width: 'toggle'});
};

function refreshProjectNav(adjustScrollFlag = true) {
  if ( toggleProjectNav() && adjustScrollFlag ) {
    overviewTopAfterNavToggle = getTopPosition(overviewSection);
    positionOffset = overviewTopAfterNavToggle - overviewTopBeforeNavToggle;

    isBelowIntro = curScrollPosition > getBottomPosition(introSection);
    if ( isBelowIntro ) {
      adjustScrollPosition(positionOffset)
    }
    navToggled = false;
  };
};

function toggleDropdown(menuNumber) {
  var targetDropdown = $('#project-nav .dropdown').eq(menuNumber - 1);
  var targetDropdownContent = targetDropdown.find('.dropdown-content').eq(0);
  var menuCaret = targetDropdown.find('.fa').eq(0);

  menuCaret.toggleClass('fa-caret-down');
  menuCaret.toggleClass('fa-caret-up');
  if ( menuNumber === 10 && menuCaret.hasClass('fa-caret-up') ) {
    $('#project-nav .scrollable').eq(0).animate( {
      scrollTop: $('#project-nav .menu-container').eq(0).height() + 61
    }, 0.5 );
  }
  targetDropdownContent.slideToggle();
};
