var ProjectNav = function() {
  const $projectNav = $('#project-nav'),
        $projectNavHandle = $('#project-nav-handle'),
        $projectNavSlideout = $('#project-nav-slideout'),
        $overviewSection = $('#overview-anchor'),
        navHandleOffset = - 50;

  let overviewTopBeforeNavToggle = Global.getTopPosition($overviewSection),
      overviewTopAfterNavToggle,
      positionOffset,
      navToggled = false,
      isBelowIntro = false;

  const
    init = function() {
      if ( Global.getScrollPosition() > overviewTopBeforeNavToggle ) {
        Global.makeInvisible($projectNav);
      } else {
        Global.makeVisible($projectNav);
      }
      refreshNavHandle();
      return;
    },

    outerLinkClickEvent = function() {
      $('.outer-link').map(function(i, link) {
        $(link).click(function() {
          const newUrl = this.href;
          $('#reveal-page').fadeIn("slow");
          $('.nav-background.current').eq(0).animate({ width: '0%'}, "slow", function() {
            MainNav.goToUrl(newUrl);
          });
          return false;
        });
      });
    },

  innerLinkClickEvent = function() {
    $('.within-link').each(function(i, link) {
      $(link).click( function() {
          const newUrl = this.href,
                newHash = this.hash;

          if ( $(link).parents('#project-nav-slideout.show-menu').length ) {
            closeProjectNav();
          };

          if ( scrollIt(newHash) ) {
            MainNav.scrollNavigate(newHash, newUrl);
          } else {
            fadeNavigate(newHash, newUrl);
          };
          refreshNavHandle();
          return false;
      });
    });
    return;
  },

  refreshNavHandle = function() {
    if ( !Global.menuIsVisible($projectNav) ) {
      return Global.makeVisibleBelow($projectNavHandle, $overviewSection.offset().top + navHandleOffset);
    }
  },

  cloneProjectNav = function() {
    $projectNavSlideout.html($projectNav.html());
  },

  openProjectNav = function() {
    Global.makeInvisible($projectNavHandle);
    Global.showMenu($projectNavSlideout);
    $projectNavSlideout.animate({ width: 'toggle'});
  },

  closeProjectNav = function() {
    if ( $projectNavSlideout.hasClass('show-menu') ) {
      Global.makeVisibleBelow($projectNavHandle, $overviewSection.offset().top + navHandleOffset);
      $projectNavSlideout.animate({ width: 'toggle'}, function() {
        Global.hideMenu($projectNavSlideout);
      });
      return true; // projectNav was just closed
    } else {
      return false; // projectNav was already closed
    }
  },

  toggleDropdown = function(menuNumber) {
    const targetDropdown = $('#project-nav-slideout .dropdown').eq(menuNumber - 1),
          targetDropdownContent = targetDropdown.find('.dropdown-content').eq(0),
          menuCaret = targetDropdown.find('.fa').eq(0);

    menuCaret.toggleClass('fa-caret-down');
    menuCaret.toggleClass('fa-caret-up');

    if ( menuNumber === 10 && menuCaret.hasClass('fa-caret-up') ) {
      $('#project-nav-slideout .scrollable').eq(0).animate( {
        scrollTop: $('#project-nav-slideout .menu-container').eq(0).height() + 61
      }, 0.5 );
    }
    targetDropdownContent.slideToggle();
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

    if ( curParent === destinationParent || destinationOffset < scrollThreshold
        || destinationHash === '#contact' || destinationHash === '#top-anchor' ) {
      return true;
    } else {
      return false;
    }
  },

  fadeNavigate = function(destinationHash, destinationUrl) {
    const targetElement = $(destinationHash),
          revealPage = $('#reveal-page');

    if ( targetElement.hasClass('section-anchor') ) {
      revealPage.fadeIn(400, function() {
        MainNav.goToUrl(destinationUrl);
        revealPage.fadeOut(800);
      });
    } else {
      const targetParent = getParentAnchor($(destinationHash)),
            parentUrl = MainNav.convertHashToUrl(targetParent);

      revealPage.fadeIn(400, function() {
        MainNav.goToUrl(parentUrl);
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

  renderShadow = function() {
    const curWindowWidth = $(window).width()
          curWindowHeight = $(window).height();
    // This is kind of hacky, but resizing the window is the only thing
    // that works to render the shadows properly in Safari...
    window.resizeTo(curWindowWidth - 1, curWindowHeight);
    window.resizeTo(curWindowWidth, curWindowHeight);
  };

  return {
    init: init,
    toggleDropdown: toggleDropdown,
    innerLinkClickEvent: innerLinkClickEvent,
    outerLinkClickEvent: outerLinkClickEvent,
    refreshNavHandle: refreshNavHandle,
    openProjectNav: openProjectNav,
    closeProjectNav: closeProjectNav,
    cloneProjectNav: cloneProjectNav,
    renderShadow: renderShadow
  };

} ();

$(document).ready(function() {
  ProjectNav.init();
  ProjectNav.cloneProjectNav();
  ProjectNav.innerLinkClickEvent();
  ProjectNav.outerLinkClickEvent();
  ProjectNav.renderShadow();

  return;
});

window.addEventListener('scroll', function() {
  ProjectNav.refreshNavHandle();
  return;
});
