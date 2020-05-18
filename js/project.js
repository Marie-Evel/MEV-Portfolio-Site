var ProjectNav = function() {
  const $projectNav = $('#project-nav'),
        $projectNavHandle = $('#project-nav-handle'),
        $projectNavSlideout = $('#project-nav-slideout'),
        $overviewSection = $('#overview-anchor'),
        navHandleOffset = - 50;

  const
    outerLinkClickEvent = function() {
      $('.outer-link').map(function(i, link) {
        $(link).click(function() {
          const newUrl = this.href;

          if ( !MainNav.hamburgerIsDisabled() && Global.menuIsVisible(MainNav.$nav) ) {
            Hamburger.closeNav();
          }

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

          if ( !MainNav.hamburgerIsDisabled() && Global.menuIsVisible(MainNav.$nav) ) {
            Hamburger.closeNav();
          }

          if ( $(link).parents('#project-nav-slideout.show-menu').length ) {
            closeProjectNav();
          }

          if ( scrollIt(newHash) ) {
            MainNav.scrollNavigate(newHash, newUrl);
          } else {
            fadeNavigate(newHash, newUrl);
          }
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
    expandCurrentSection();
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

  expandCurrentSection = function() {
    const curAnchor = MainNav.getCurAnchor(true),
          $priorSection = $projectNavSlideout.find('.current-section'),
          $menuItem = $projectNavSlideout.find('a[href="' + curAnchor + '"]');


    if ( $menuItem.parentsUntil('.dropdown').length ) {
      const $targetDropdown = $menuItem.parents('.dropdown');

      if ( $priorSection.length ) {
        if( $priorSection[0] !== $targetDropdown[0] ) {
          if ( dropdownIsExpanded($priorSection) ) {
            toggleDropdown($priorSection);
          }
          $priorSection.removeClass('current-section');
        }
      }

      if ( !dropdownIsExpanded($targetDropdown) ) {
        toggleDropdown($targetDropdown);
        $targetDropdown.addClass('current-section');
      }
    }
  },


  getMenuCaret = function($targetDropdown) {
    if ($targetDropdown.find('.fa').length) {
      return $targetDropdown.find('.fa').eq(0);
    } else {
      return false;
    }
  },

  dropdownIsExpanded = function($targetDropdown) {
    const $menuCaret = getMenuCaret($targetDropdown);

    if ( $menuCaret.hasClass('fa-caret-up') ) {
      return true;
    } else {
      return false;
    }
  },

  toggleDropdown = function($targetDropdown) {
    $targetDropdown = $targetDropdown || $(event.target).parents('.dropdown');

    const $targetDropdownContent = $targetDropdown.find('.dropdown-content').eq(0),
          $menuCaret = getMenuCaret($targetDropdown);

    $menuCaret.toggleClass('fa-caret-down');
    $menuCaret.toggleClass('fa-caret-up');

    // NOTE: Doesn't work...
    // I was trying to scroll the bottom of the pullout nav when the user
    // the last menu.
    // if ( menuNumber === 10 && $menuCaret.hasClass('fa-caret-up') ) {
    //   $('#project-nav-slideout .scrollable').eq(0).animate( {
    //     scrollTop: $('#project-nav-slideout .menu-container').eq(0).height() + 61
    //   }, 0.5 );
    // }
    $targetDropdownContent.slideToggle();
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
    });
    return parentHash;
  },

  scrollIt = function(destinationHash) {
    const curAnchor = MainNav.getCurAnchor(),
          curParent = getParentAnchor($(curAnchor)),
          destinationParent = getParentAnchor($(destinationHash)),
          newPosition = $(destinationHash).offset().top,
          destinationOffset = Math.abs(newPosition - Global.getScrollPosition()),
          scrollThreshold = 3 * window.innerHeight;

    if ( curParent === destinationParent ||
         destinationOffset < scrollThreshold ||
         destinationHash === '#contact' ||
         destinationHash === '#top-anchor' ) {
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
    }
  },

  renderShadow = function() {
    // This is very hacky, but the only way I found that renders the shadow
    // properly in Safary is to add a transparent outline to the element and
    // refresh it on scroll...
    $('.shadow-black-box').toggleClass('refresh');
    return false;
  },

  init = function() {
    refreshNavHandle();
    return;
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
  return;
});

window.addEventListener('scroll', function() {
  ProjectNav.refreshNavHandle();
  return;
});

if ( Global.browserIsSafari() ) {
  window.addEventListener('scroll', function() {
    ProjectNav.renderShadow();
  });
}
