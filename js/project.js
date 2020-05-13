var ProjectNav = function() {
  const projectNav = $('#project-nav'),
        projectNavHandle = $('#project-nav-handle'),
        introSection = $('#intro'),
        overviewSection = $('#overview-anchor'),
        navHandleOffset = - 50;

  let overviewTopBeforeNavToggle = Global.getTopPosition(overviewSection),
      overviewTopAfterNavToggle,
      positionOffset,
      navToggled = false,
      isBelowIntro = false;

  const
    init = function() {
      if ( Global.getScrollPosition() > overviewTopBeforeNavToggle ) {
        Global.makeInvisible(projectNav);
      } else {
        Global.makeVisible(projectNav);
      }
      refreshNavHandle();
      return;
    },

    outerLinkClickEvent = function() {
      $('.outer-link').map(function(i, link) {
        $(link).click(function() {
          let newUrl = this.href;
          $('#reveal-page').fadeIn("slow");
          $('.nav-background.current').eq(0).animate({ width: '0%'}, "slow", MainNav.goToUrl(newUrl));
          return false;
        });
      });
    },

  innerLinkClickEvent = function() {
    $('.within-link').each(function(i, link) {
      $(link).click(__goToClickedLink(link));
    });
    return;
  },

  refreshNavHandle = function() {
    if ( !Global.menuIsVisible(projectNav) ) {
      return Global.makeVisibleBelow(projectNavHandle, overviewSection.offset().top + navHandleOffset);
    }
  },

  openProjectNav = function() {
    Global.makeInvisible(projectNavHandle);
    Global.showMenu(projectNav);
    projectNav.animate({ width: 'toggle'});
  },

  closeProjectNav = function() {
    if ( projectNav.hasClass('show-menu') ) {
      Global.makeVisibleBelow(projectNavHandle, overviewSection.offset().top + navHandleOffset);
      projectNav.animate({ width: 'toggle'}, __doAfterOpeningProjectNav);
      return true; // projectNav was just closed
    } else {
      return false; // projectNav was already closed
    }
  },

  refreshProjectNav = function(adjustScrollFlag = true) {
    if ( toggleProjectNav() && adjustScrollFlag ) {
      overviewTopAfterNavToggle = Global.getTopPosition(overviewSection);
      positionOffset = overviewTopAfterNavToggle - overviewTopBeforeNavToggle;

      isBelowIntro = Global.getScrollPosition() > Global.getBottomPosition(introSection);
      if ( isBelowIntro ) {
        Global.adjustScrollPosition(positionOffset)
      }
      navToggled = false;
    };
  },

  toggleProjectNav = function() {
    navToggled = false;
    Global.getScrollPosition();
    overviewTopBeforeNavToggle = getTopPosition(overviewSection)
    if ( Global.elementIsVisible(projectNav) ) {
      if ( overviewTopBeforeNavToggle <  1 - navHandleOffset) {
        hideProjectNav()
        navToggled = true;
      }
    } else if ( !menuIsVisible(projectNav) ) {
        if ( Global.getTopPosition(overviewSection) > 3 - navHandleOffset    ) {
          unhideProjectNav();
          navToggled = true;
      }
    }
    return navToggled;
  },

  hideProjectNav = function() {
    Global.makeInvisible(projectNav);
    Global.makeVisible(projectNavHandle);
    restoreDropdownContent();
    return;
  },

  unhideProjectNav = function() {
    Global.makeVisible(projectNav);
    Global.makeInvisible(projectNavHandle);
    makeDropdownContentVisible();
    return;
  },

  toggleDropdown = function(menuNumber) {
    const targetDropdown = $('#project-nav .dropdown').eq(menuNumber - 1),
          targetDropdownContent = targetDropdown.find('.dropdown-content').eq(0),
          menuCaret = targetDropdown.find('.fa').eq(0);

    menuCaret.toggleClass('fa-caret-down');
    menuCaret.toggleClass('fa-caret-up');

    if ( menuNumber === 10 && menuCaret.hasClass('fa-caret-up') ) {
      $('#project-nav .scrollable').eq(0).animate( {
        scrollTop: $('#project-nav .menu-container').eq(0).height() + 61
      }, 0.5 );
    }
    targetDropdownContent.slideToggle();
  },

  restoreDropdownContent = function() {
    $('#project-nav .dropdown-content').each(function(index, element) {
      if( $(element).css('display') == 'grid' ) {
        $(element).css('display','none');
      }
    });
    return;
  },

  makeDropdownContentVisible = function() {
    $('#project-nav .dropdown-content').each(function(index, element) {
      if( $(element).css('display') == 'none' ) {
        $(element).css('display','grid');
      }
    });
    return;
  },

  scrollIt = function(destinationHash) {
    const curAnchor = MainNav.getCurAnchor(),
          curParent = getParentAnchor($(curAnchor)),
          destinationParent = getParentAnchor($(destinationHash)),
          newPosition = $(destinationHash).offset().top,
          destinationOffset = Math.abs(newPosition - Global.getScrollPosition()),
          scrollThreshold = 3 * window.innerHeight;

    if ( ( !Global.elementIsVisible(projectNav)
        && (curParent === destinationParent || destinationOffset < scrollThreshold) )
        || destinationHash === '#contact' ) {
      return newPosition;
    } else {
      return null;
    }
  },

  fadeNavigate = function(destinationHash, destinationUrl) {
    const targetElement = $(destinationHash),
          revealPage = $('#reveal-page');

    if ( targetElement.hasClass('section-anchor') ) {
      revealPage.fadeIn(400, function() {
        MainNav.gotoUrl(destinationUrl);
        revealPage.fadeOut(800);
      });
    } else {
      const targetParent = getParentAnchor($(destinationHash)),
            parentUrl = MainNav.convertHashToUrl(targetParent);
      revealPage.fadeIn(400, function() {
        MainNav.gotoUrl(parentUrl);
        revealPage.fadeOut(500, function() {
          MainNav.scrollNavigate(destinationHash, destinationUrl);
        });
      });
    };
  },

  getParentAnchor = function(linkElement) {
    const allParents = linkElement.parents();
    let parentType,
        sectionAnchor,
        parentHash;

    allParents.each( function(index, element) {
      parentType = $(element).get(0).tagName;

      if (parentType == 'MAIN') {
        return false;
      } else {
        sectionAnchor = $(element).find('.section-anchor');

        if (sectionAnchor.length) {
          parentHash = '#' + sectionAnchor.attr('id');
          return false;
        } else {
          let prevSiblings = $(element).prevAll();
          let sectionsFound = prevSiblings.find('.section-anchor');

          if (sectionsFound.length) {
            sectionAnchor = $(sectionsFound[sectionsFound.length - 1]);
            parentHash = '#' + sectionAnchor.attr('id');
            return false;
          }
        }
      }
    })
    return parentHash;
  },

  __goToClickedLink = function(link) {
    const newUrl = this.href,
          newHash = this.hash;
    if ( $(link).parents('#project-nav.show-menu').length ) {
      closeProjectNav();
    };
    if ( scrollIt(newHash) ) {
      scrollNavigate(newHash, newUrl);
    } else {
      fadeNavigate(newHash, newUrl);
    };
    refreshProjectNav(false);
    return false;
  },

  __doAfterOpeningProjectNav = function() {
    hideMenu(projectNav);
    projectNav.removeAttr('style');
  };

  return {
    init: init,
    toggleDropdown: toggleDropdown,
    innerLinkClickEvent: innerLinkClickEvent,
    outerLinkClickEvent: outerLinkClickEvent,
    refreshProjectNav: refreshProjectNav,
    openProjectNav: openProjectNav,
    closeProjectNav: closeProjectNav
  };

} ();

$(document).ready(function() {
  $('.nav-background.current').eq(0).animate({ width: '100%'}, "slow");
  MainNav.refreshTopChevron();
  ProjectNav.init();
  $('#reveal-page').fadeOut();
  ProjectNav.innerLinkClickEvent();
  ProjectNav.outerLinkClickEvent();
  return;
});

window.addEventListener('scroll', function() {
  MainNav.didScroll = true;
  MainNav.refreshTopChevron();
  ProjectNav.refreshProjectNav();
  return;
});

// window.onload = function () {
  // $('.nav-background.current').eq(0).animate({ width: '100%'}, "slow");
  // ProjectNav.init();
  // MainNav.refreshTopChevron();
  // $('#reveal-page').fadeOut();
// };
