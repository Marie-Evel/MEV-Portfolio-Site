// Hamburger menu for mobile:
var nav = document.getElementById('menu-container');
var icon = document.getElementById('nav-icon');
var navBackground = document.getElementById('nav-background');

function showMenu(targetMenu) {
  targetMenu.classList.add('show-menu');
};

function hideMenu(targetMenu) {
  targetMenu.classList.remove('show-menu');
}

function menuIsVisible(targetMenu) {
  if ( targetMenu.classList.contains('show-menu') ) {
    return true;
  } else {
    return false;
  }
};

function toggleMenu() {
  if ( menuIsVisible(nav) ) {
    hideMenu(nav);
    icon.className = 'hamburger';
  } else {
    showMenu(nav);
    icon.className = 'close';
  }
};

function getTopPosition(targetElement) {
  return targetElement.getBoundingClientRect().top;
};

function getBottomPosition(targetElement) {
  return targetElement.getBoundingClientRect().bottom;
};

function getElementHeight(targetElement) {
  return targetElement.getBoundingClientRect().height;
}

// Set up static variables (those won't change):
const projectNav = document.getElementById('project-nav');
const projectNavHandle = document.getElementById('project-nav-handle');
const topChevron = document.getElementById('back-to-top').getElementsByTagName('a')[0];
const introSection = document.getElementById('intro');
const overviewSection = document.getElementById('overview-anchor');

// Initialize variables that can change:
var curScrollPosition = getScrollPosition();
var overviewTopBeforeNavToggle = getTopPosition(overviewSection);
var overviewTopAfterNavToggle;
var positionOffset;
var navHandleMinPosition;
var linkScroll = false;
var navToggled = false;
var overviewTopAfterNavToggle;
var didScroll = false;
var isBelowIntro = false;

function makeVisible(targetElement) {
  targetElement.classList.add('visible');
};

function makeInvisible(targetElement) {
  targetElement.classList.remove('visible');
};

function elementIsVisible(targetElement) {
  if (targetElement.classList.contains('visible')) {
    return true;
  } else {
    return false;
  }
};

function refreshNavHandleMin () {
  return getScrollPosition() + getTopPosition(overviewSection) - 30;
}

function initProjectNav() {
  console.log('************** initProjectNav');
  navHandleMinPosition = refreshNavHandleMin()
  console.log('initial chevron trigger before init = ' + navHandleMinPosition );

  if ( getScrollPosition() > overviewTopBeforeNavToggle ) {
    makeInvisible(projectNav);
  } else {
    makeVisible(projectNav);
  }

  console.log('initial chevron trigger after init = ' + navHandleMinPosition );
}

function getScrollPosition() {
  curScrollPosition = window.pageYOffset || document.documentElement.scrollTop ;
  return curScrollPosition;
};

function setScrollPosition(targetPosition) {
  document.body.scrollTop = document.documentElement.scrollTop = targetPosition;
};

function adjustScrollPosition(positionOffset) {
  console.log('***************** ADJUSTING SCROLL POSITION BY ' + positionOffset);
  setScrollPosition(getScrollPosition() + positionOffset);
  getScrollPosition();
}

function makeVisibleBelow(targetElement, triggerPosition) {
// Makes the target element visible when scroll position is below the
// triggerPosition
  if(getScrollPosition() > triggerPosition) {
    makeVisible(targetElement);
  } else {
    makeInvisible(targetElement);
  }
};

function toggleProjectNav() {
  navToggled = false;
  getScrollPosition();
  // console.log('current scroll position: ' + curScrollPosition);

  overviewTopBeforeNavToggle = getTopPosition(overviewSection)
  if ( elementIsVisible(projectNav) ) {
    // console.log('checking if overviewTop ' + overviewTopBeforeNavToggle + ' < -1');
    if ( overviewTopBeforeNavToggle < -1 ) {
      console.log('****************** HIDE PROJECT NAV');
      makeInvisible(projectNav);
      navToggled = true;
    }

  } else if ( !menuIsVisible(projectNav) ) {
      // console.log('checking if overviewTop ' + overviewTopBeforeNavToggle + ' > 1');
      if ( getTopPosition(overviewSection) > 1 ) {
        console.log('****************** UNHIDE PROJECT NAV');
        makeVisible(projectNav);
        navToggled = true;
    }
  }
  return navToggled;
};

window.onload = function () {
  initProjectNav();
};

window.onhashchange = function() {
  console.log('onhsashchange');
  linkScroll = true;
};


window.onscroll = runScrollEvents;

function runScrollEvents() {
  didScroll = true;

  // Display scroll back to top chevron:
  makeVisibleBelow(topChevron, 85);

  // console.log('current scroll position: ' + getScrollPosition() );

  // Verify if project nav section needs to be hidden or unhiden:
  if ( toggleProjectNav() ) {
    console.log('current scroll position: ' + curScrollPosition);
    overviewTopAfterNavToggle = getTopPosition(overviewSection);
    positionOffset = overviewTopAfterNavToggle - overviewTopBeforeNavToggle;
    navHandleMinPosition = refreshNavHandleMin();
    console.log('chevron trigger = ' + navHandleMinPosition);
    console.log('current scroll position: ' + curScrollPosition + ' vs  calculated: ' + getScrollPosition() );
    isBelowIntro = curScrollPosition > getBottomPosition(introSection);
    console.log('linkScroll = ' + linkScroll + ' and scroll position is below intro ' + isBelowIntro);
    if ( isBelowIntro ) {
      adjustScrollPosition(positionOffset)

    } else {
      linkScroll = false;
    }
    navToggled = false;
  };

  // Display content handle for project nav:
  if (!menuIsVisible(projectNav)) {
    // console.log('trigger for chevron: ' + navHandleMinPosition);
    makeVisibleBelow(projectNavHandle, navHandleMinPosition);
  };

};

setInterval(function() {
  if(didScroll) {
    didScroll = false;
  }
}, 100);

// Project navigation:
function closeProjectNav() {
  // console.log('************* CLOSING PROJECT NAV');
  makeVisibleBelow(projectNavHandle, navHandleMinPosition);
  hideMenu(projectNav);

};

function openProjectNav() {
  // projectNav.classList.remove('closing');
  makeInvisible(projectNavHandle);
  showMenu(projectNav);
};

function toggleCaret(targetElement) {
  var needToExpand;
  if ( targetElement.classList.contains('fa-caret-down') ) {
    targetElement.className = 'fa fa-caret-up';
    needToExpand = true;
  } else {
    targetElement.className = 'fa fa-caret-down';
    needToExpand = false;
  }
  return needToExpand;
}

function toggleDropdown(menuNumber) {
  var dropdownMenus = projectNav.getElementsByClassName('dropdown');
  var targetDropdown = dropdownMenus[menuNumber - 1];
  var menuCaret = targetDropdown.getElementsByClassName('fa')[0];

  if ( toggleCaret(menuCaret) ) {
    targetDropdown.classList.add('expanded');
  } else {
    targetDropdown.classList.remove('expanded');
  }

  // Collapse all other menus:
  // var i;
  // for (i = 0; i < dropdownMenus.length - 1; i++) {
  //   var curDropdown = dropdownMenus[i];
  //   if ( curDropdown.classList.contains('expanded') && curDropdown !== targetDropdown ) {
  //     var curCaret = curDropdown.getElementsByClassName('fa')[0];
  //     toggleCaret(curCaret);
  //     curDropdown.classList.remove('expanded');
  //   }
  // }


}
