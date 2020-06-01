var ProjectNav = function() {
  const $projectNav = $('#project-nav'),
        $projectNavHandle = $('#project-nav-handle'),
        $projectNavSlideout = $('#project-nav-slideout'),
        $overviewSection = $('#overview-anchor'),
        navHandleOffset = - 50;

  const outerLinkClickEvent = function() {
      $('.outer-link').map(function(i, link) {
        $(link).click(function() {
          const newUrl = this.href;

          if ( !MainNav.hamburgerIsDisabled() && Global.menuIsVisible(MainNav.$nav) ) {
            Hamburger.closeNav();
          }

          $('.reveal-page').fadeIn("slow");
          $('.nav-background.current').eq(0).animate({ width: '0%'}, "slow", function() {
            MainNav.goToUrl(newUrl);
          });
          return false;
        });
      });
    };

  const innerLinkClickEvent = function() {
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
            MainNav.scrollNavigate(newHash);
            // MainNav.scrollNavigate(newHash, newUrl);
          } else {
            fadeNavigate(newHash, newUrl);
          }
          refreshNavHandle();
          return false;
      });
    });
    return;
  };

  const refreshNavHandle = function() {
    if ( !Global.menuIsVisible($projectNav) ) {
      return Global.makeVisibleBelow($projectNavHandle, $overviewSection.offset().top + navHandleOffset);
    }
  };

  const cloneProjectNav = function() {
    $projectNavSlideout.html($projectNav.html());
  };

  const openProjectNav = function() {
    Global.makeInvisible($projectNavHandle);
    Global.showMenu($projectNavSlideout);
    $projectNavSlideout.animate({ width: 'toggle'});
    expandCurrentSection();
  };

  const closeProjectNav = function() {
    if ( $projectNavSlideout.hasClass('show-menu') ) {
      Global.makeVisibleBelow($projectNavHandle, $overviewSection.offset().top + navHandleOffset);
      $projectNavSlideout.animate({ width: 'toggle'}, function() {
        Global.hideMenu($projectNavSlideout);
      });
      return true; // projectNav was just closed
    } else {
      return false; // projectNav was already closed
    }
  };

  const expandCurrentSection = function() {
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
  };


  const getMenuCaret = function($targetDropdown) {
    if ($targetDropdown.find('.fa').length) {
      return $targetDropdown.find('.fa').eq(0);
    } else {
      return false;
    }
  };

  const dropdownIsExpanded = function($targetDropdown) {
    const $menuCaret = getMenuCaret($targetDropdown);

    if ( $menuCaret.hasClass('fa-caret-up') ) {
      return true;
    } else {
      return false;
    }
  };

  const toggleDropdown = function($targetDropdown) {
    $targetDropdown = $targetDropdown || $(event.target).parents('.dropdown');

    const $targetDropdownContent = $targetDropdown.find('.dropdown-content').eq(0),
          $menuCaret = getMenuCaret($targetDropdown);

    $menuCaret.toggleClass('fa-caret-down');
    $menuCaret.toggleClass('fa-caret-up');

    // NOTE: Doesn't work...
    // I was trying to scroll the bottom of the pullout nav when the user
    // expands the last menu.
    // if ( menuNumber === 10 && $menuCaret.hasClass('fa-caret-up') ) {
    //   $('#project-nav-slideout .scrollable').eq(0).animate( {
    //     scrollTop: $('#project-nav-slideout .menu-container').eq(0).height() + 61
    //   }, 0.5 );
    // }
    $targetDropdownContent.slideToggle();
  };

  const getParentAnchor = function(linkElement) {
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
  };

  const scrollIt = function(destinationHash) {
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
  };

  const fadeNavigate = function(destinationHash) {
    const targetElement = $(destinationHash),
          revealPage = $('.reveal-page');

    if ( targetElement.hasClass('section-anchor') ) {
      revealPage.fadeIn(400, function() {
        MainNav.refreshLocation(destinationHash);
        revealPage.fadeOut(800);
      });
    } else {
      const targetParent = getParentAnchor($(destinationHash));

      revealPage.fadeIn(400, function() {
        MainNav.refreshLocation(targetParent);
        revealPage.fadeOut(500, function() {
          MainNav.scrollNavigate(destinationHash);
        });
      });
    }
  };

  const init = function() {
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
    cloneProjectNav: cloneProjectNav
  };

} ();



var Carousel = (function() {
  const $content = $('.carousel-content'),
        $carouselItems = $('.carousel-content li'),
        itemCount = $carouselItems.length,
        $prevButton = $('.carousel-wrapper button.previous'),
        $nextButton = $('.carousel-wrapper button.next'),
        $groupBar = $('.group-bar-wrapper'),
        $groups = $('.mockup-groups'),
        $prevGroupsButton = $groupBar.find('button.previous'),
        $nextGroupsButton = $groupBar.find('button.next');

  let itemFinalWidth = 0,
      itemsPerPage = 1,
      curItem = 1,
      carouselPaddingLeft = 0,
      availCarouselWidth = 0,
      groupClicked = false;

  const mockupGroupClick = function() {
    $('.mockup-groups li').each( function(index, group) {
      $(group).click( function() {
        groupClicked = true;
        let itemNum = $content.find('li[mockup-group="' + (index + 1) + '"]').index() + 1;
        slideCarousel(itemNum, true);
      })
    })
  };

  const disableButton = function($targetButton) {
    if ( !$targetButton.hasClass('disabled') ) {
      $targetButton.addClass('disabled');
    }
  };

  const enableButton = function($targetButton) {
    if ( $targetButton.hasClass('disabled') ) {
      $targetButton.removeClass('disabled');
    }
  };

  const getCurGroupPage = function() {
    return parseInt( $groupBar.attr('group-page') );
  };

  const goToPrevGroups = function() {
    const curGroupPage = getCurGroupPage();
    if ( curGroupPage > 1 ) {
      $groupBar.attr('group-page', curGroupPage - 1);
    }
  };

  const goToNextGroups = function() {
    const curGroupPage = getCurGroupPage();
    if ( curGroupPage < 5 ) {
      $groupBar.attr('group-page', curGroupPage + 1);
    }
  };

  const refreshButtons = function() {
    if ( curItem === 1 ) {
      disableButton($prevButton);
    } else {
      enableButton($prevButton);
    }
    if ( curItem + itemsPerPage -1 < itemCount ) {
      enableButton($nextButton);
    } else {
      disableButton($nextButton);
    }
  };

  const groupInWindow = function(groupNum) {
  // returns 0 if groupNum is within visible window
  // returns -1 if groupNum is to the left of visible window
  // returns 1 if groupNum is to the right of visible window

    const $group = $groups.find('li').eq(groupNum - 1),
          parentWidth = $groups.innerWidth(),
          parentLeft = Math.max($groups.offset().left, 0),
          groupStart = $group.offset().left - parentLeft + 1;

    if ( groupStart < 0 ) {
      return -1;
    } else if (groupStart > parentWidth ) {
      return 1;
    } else {
      return 0;
    }
  };

  const getGroupNum = function() {
    return parseInt($carouselItems.eq(curItem - 1).attr('mockup-group'), 10);
  };

  const refreshMockupGroup = function() {
    if ( curItem > 0 ) {
      let $curGroup = $groups.find('.selected'),
          curGroupNum = $curGroup.index() + 1,
          increment = 0,
          newGroupPosition = 0;

      const newGroupNum = getGroupNum(),
            groupJump = Math.abs(newGroupNum - curGroupNum);

      const goToGroup = function(targetGroupNum) {
        const groupPosition = groupInWindow(targetGroupNum);
        let wait = false,
            waitTime = 500;

        if ( groupPosition === -1 ) {
          goToPrevGroups();
          wait = true;
        } else if (groupPosition === 1) {
          goToNextGroups();
          wait = true;
        }

        if ( !wait ) { waitTime = 0; }
        setTimeout( function() {
          $groups.find('.selected').removeClass('selected');
          $groups.find('li').eq(targetGroupNum - 1).addClass('selected');
        }, waitTime);

      };

      const staggerGroups = function() {
        setTimeout( function() {
          curGroupNum += increment;

          goToGroup(curGroupNum);

          if ( curGroupNum !== newGroupNum ) {
            staggerGroups();
          }
        }, 750/groupJump)
      };

      if ( newGroupNum !== curGroupNum ) {
        increment = 1 - 2 * (newGroupNum < curGroupNum);

        if ( groupClicked || groupJump === 1 ) {
          goToGroup(newGroupNum);
        } else {
          staggerGroups();
        }
      }
    }
    groupClicked = false;
  };

  const slideCarousel = function(targetItem, slide) {
    const offset = (targetItem - 1) * itemFinalWidth;
    if ( slide ) {
      $content.css('transition','transform 0.75s ease');
    } else {
      $content.css('transition','none');
    }
    $content.css('transform', 'translateX(-' + offset + 'px)');
    curItem = targetItem;
    refreshMockupGroup()
    refreshButtons();
    return;
  };

  const init = function() {
    mockupGroupClick();
    carouselPaddingLeft = $content.innerWidth() - $content.width();
    availCarouselWidth = $content.width() - carouselPaddingLeft;
    const itemWidth = $carouselItems.eq(0).width();
    itemsPerPage = Math.trunc(availCarouselWidth / itemWidth);

    if ( itemsPerPage === 1 ) {
      itemFinalWidth = availCarouselWidth;
    } else {
      const itemMoreWidth = Math.round((availCarouselWidth - itemsPerPage * itemWidth) / (itemsPerPage - 1));
      itemFinalWidth = itemWidth + itemMoreWidth;
    }

    $content.css('grid-auto-columns', itemFinalWidth + 'px');
    slideCarousel(curItem, false);

    $groups.css('transition','none');
    $groupBar.attr('group-page', 1);

    const curGroupNum = getGroupNum();

    setTimeout(10);
    if ( groupInWindow(curGroupNum) !== 0) {

      for ( i = 2; i < 6; i++ ) {
        $groupBar.attr('group-page', i);
        if ( groupInWindow(curGroupNum) === 0 ) {
          break;
          return false;
        }
      }
    }
    $groups.removeAttr('style');
  };

  const prevPage = function() {
      if ( curItem !== 1 ) {
        curItem -= itemsPerPage;
        if (curItem < 1) {
          curItem = 1;
        }
        slideCarousel(curItem, true);
      }
    };

  const nextPage = function() {
      if ( curItem + itemsPerPage - 1 < itemCount ) {
        curItem += itemsPerPage;
        slideCarousel(curItem, true);
      }
    };

  return {
    init: init,
    prevPage: prevPage,
    nextPage: nextPage,
    goToPrevGroups: goToPrevGroups,
    goToNextGroups: goToNextGroups
  }

})();

$(document).ready(function() {
  ProjectNav.init();
  ProjectNav.cloneProjectNav();
  ProjectNav.innerLinkClickEvent();
  ProjectNav.outerLinkClickEvent();
  Carousel.init();
  return;
});

window.addEventListener('scroll', function() {
  ProjectNav.refreshNavHandle();
  Parallax.applyParallax($('#ia-transition'), 0.5);
  return;
}, {passive: true});

window.addEventListener('resize', function() {
  Carousel.init();
}, {passive: true});

// scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
