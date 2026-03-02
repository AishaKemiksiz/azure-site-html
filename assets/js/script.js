/*-----------------------------------------------------------------------------------
    Template Name: DAX - IT solutions & Services HTML Template
    Template URI: https://ultimatewebsolutions.net/dax/
    Author: WebTend
    Author URI:  https://ultimatewebsolutions.net/
    Version: 1.0

    Note: This is Main JS File.
-----------------------------------------------------------------------------------
    CSS INDEX
    ===================
    ## Header Style
    ## Dropdown menu
    ## Submenu
    ## Video Popup
    ## Timeline Images
    ## Timeline Content
    ## SlideShow Images
    ## Feature Content
    ## Achievements Counter
    ## Scroll to Top
    ## Nice Select
    ## WOW Animation
    ## Preloader
    
-----------------------------------------------------------------------------------*/

(function ($) {

    "use strict";

    // Single source of truth: which filename is "main index" (any language)
    // Matches index.html, index-ru.html, index-ka.html, index-tr.html and root "/"
    function getCurrentIndexPage() {
        var path = window.location.pathname || '';
        var filename = path.split('/').filter(Boolean).pop() || '';
        if (filename === 'index.html' || filename === 'index-ru.html' || filename === 'index-ka.html' || filename === 'index-tr.html') return filename;
        if (path === '/' || path === '' || path.endsWith('/')) return 'index.html';
        return filename;
    }

    function isIndexPage() {
        var page = getCurrentIndexPage();
        var base = (page || '').replace(/\.html$/, '');
        return base === 'index' || base === 'index-ru' || base === 'index-ka' || base === 'index-tr';
    }

    // Normalize path for comparison (absolute vs relative: /index-ka.html vs index-ka.html vs ./index-ka.html vs full URL)
    function normalizePath(path) {
        if (!path) return 'index.html';
        // Full URL (e.g. https://site.com/index-ka.html) — take pathname only
        if (path.indexOf('://') !== -1) {
            try {
                path = new URL(path, window.location.origin).pathname;
            } catch (e) {}
        }
        path = path.replace(/^\.\/?/, '');
        path = path.replace(/^\//, '');
        path = path.replace(/\/$/, '');
        if (path === '' || path === '#') return 'index.html';
        return path;
    }

    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Prevent browser's automatic scroll to anchor on page load
    // This must run immediately, before browser tries to auto-scroll
    (function() {
        // Always scroll to top on page load (unless there's a hash to scroll to)
        // This prevents browser from restoring previous scroll position
        if (!window.location.hash) {
            window.scrollTo(0, 0);
        } else {
            var hash = window.location.hash;
            // Scroll to top immediately to prevent browser's auto-scroll
            window.scrollTo(0, 0);
            // Store hash for later use
            window._pendingHash = hash;
            // Remove hash from URL temporarily to prevent browser from scrolling
            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, null, window.location.pathname + window.location.search);
            }
        }
    })();

    // ## Header Style and Scroll to Top - Shared function
    function headerStyle() {
        if ($('.main-header').length) {
            var windowpos = $(window).scrollTop();
            var siteHeader = $('.main-header');
            var scrollLink = $('.scroll-top');
            if (windowpos >= 100) {
                siteHeader.addClass('fixed-header');
                scrollLink.fadeIn(300);
            } else {
                siteHeader.removeClass('fixed-header');
                scrollLink.fadeOut(300);
            }
        }
    }

    $(document).ready(function () {

        // Ensure page starts at top if no hash (prevent browser scroll restoration)
        if (!window.location.hash && !window._pendingHash) {
            window.scrollTo(0, 0);
            $('html, body').scrollTop(0);
        }

        // Initial header style check
        headerStyle();


        // ## Dropdown menu
        var mobileWidth = 992;
        var navcollapse = $('.navigation li.dropdown');

        navcollapse.hover(function () {
            if ($(window).innerWidth() >= mobileWidth) {
                $(this).children('ul').stop(true, false, true).slideToggle(300);
                $(this).children('.megamenu').stop(true, false, true).slideToggle(300);
            }
        });

        // ## Submenu Dropdown Toggle
        if ($('.main-header .navigation li.dropdown ul').length) {
            $('.main-header .navigation li.dropdown').append('<div class="dropdown-btn"><span class="fas fa-chevron-down"></span></div>');

            //Dropdown Button
            $('.main-header .navigation li.dropdown .dropdown-btn').on('click', function () {
                $(this).prev('ul').slideToggle(500);
                $(this).prev('.megamenu').slideToggle(800);
            });

            //Disable dropdown parent link
            $('.navigation li.dropdown > a').on('click', function (e) {
                e.preventDefault();
            });
        }

        //Submenu Dropdown Toggle
        if ($('.main-header .main-menu').length) {
            $('.main-header .main-menu .navbar-toggle').click(function () {
                $(this).prev().prev().next().next().children('li.dropdown').hide();
            });
        }



        // ## Smooth scroll to anchor links (especially #residences)
        function scrollToAnchor(targetId, offset) {
            var targetElement = $(targetId);
            if (targetElement.length) {
                // Try to find the section-title inside the section for more precise positioning
                var sectionTitle = targetElement.find('.section-title').first();
                var scrollTarget = sectionTitle.length > 0 ? sectionTitle : targetElement;
                
                // Get header height - check if it's fixed
                var headerHeight = 0;
                var $header = $('.main-header');
                if ($header.length) {
                    headerHeight = $header.outerHeight() || 0;
                    // If header is fixed, add extra padding
                    if ($header.hasClass('fixed-header') || $(window).scrollTop() > 100) {
                        headerHeight = headerHeight + 10; // Reduced padding
                    }
                }
                // Add extra offset to ensure element is fully visible below fixed header
                var extraOffset = offset || 20; // Reduced from 60 to 20 for better positioning
                var scrollOffset = scrollTarget.offset().top - headerHeight - extraOffset;
                
                $('html, body').animate({
                    scrollTop: Math.max(0, scrollOffset) // Ensure we don't scroll to negative position
                }, 800);
            }
        }

        // Close mobile menu when clicking navigation links
        $('.navigation a').on('click', function () {
            $('.navbar-collapse').removeClass('show');
        });

        // Handle clicks on anchor links in navigation (especially #residences)
        $('.navigation a[href*="#"]').on('click', function (e) {
            var href = $(this).attr('href');
            
            // Check if it's an anchor link
            if (href.indexOf('#') !== -1) {
                var parts = href.split('#');
                var pagePath = parts[0];
                var hash = parts[1];
                var targetId = '#' + hash;
                var currentPage = getCurrentIndexPage();
                if (currentPage === '' || currentPage === 'index.html') currentPage = 'index.html';

                // Strip .html for comparison: Netlify uses pretty URLs (/index-ru) while href has index-ru.html
                var cleanPagePath = normalizePath(pagePath).replace(/\.html$/, '');
                var cleanCurrentPage = normalizePath(currentPage).replace(/\.html$/, '');
                var isSamePageLink = (cleanPagePath === cleanCurrentPage) || (pagePath === '' || pagePath === '#');
                
                // If clicking on #residences link
                if (hash === 'residences') {
                    if (isIndexPage() && isSamePageLink) {
                        e.preventDefault();
                        
                        // Close mobile menu
                        $('.navbar-collapse').removeClass('show');
                        
                        // Smooth scroll to target
                        scrollToAnchor(targetId);
                    }
                    // If we're on another page, let browser navigate to index…#residences (scroll after load)
                }
            }
        });

        // Robust hash fallback: scroll to #residences when hash changes (e.g. if click handler did not prevent navigation)
        window.addEventListener('hashchange', function () {
            if (window.location.hash === '#residences') {
                var el = document.querySelector('#residences');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });

        // ## Video Popup
        if ($('.video-play').length) {
            $('.video-play').magnificPopup({
                type: 'video',
            });
        }

        // ## Video Popup two
        if ($('.video-play-two').length) {
            $('.video-play-two').magnificPopup({
                type: 'video',
            });
        }




        // ## Timeline Images
        if ($('.timeline-images').length) {
            $('.timeline-images').slick({
                dots: false,
                infinite: true,
                autoplay: false,
                autoplaySpeed: 5000,
                arrows: false,
                vertical: false,
                speed: 1000,
                fade: true,
                variableWidth: false,
                focusOnSelect: false,
                slidesToShow: 1,
                slidesToScroll: 1,
            });
        }

        // ## Timeline Content - Static (no slider)
        // Timeline items are now static, no scrolling animation, but clicking changes images
        if ($('.timeline-content').length) {
            // Handle timeline item clicks - toggle active state and change corresponding image
            $(document).on('click', '.timeline-item', function() {
                var $item = $(this);
                var index = $item.data('index');
                
                // Remove is-active from all items
                $('.timeline-item').removeClass('is-active');
                
                // Add is-active to clicked item
                $item.addClass('is-active');
                
                // Change timeline image to corresponding slide
                if ($('.timeline-images').length && typeof $('.timeline-images').slick !== 'undefined') {
                    $('.timeline-images').slick('slickGoTo', index);
                }
            });
        }


        // ## SlideShow Images
        if ($('.slideshow-images').length) {
            var $statuss = $('.slideshowpagi.paginginfo');
            var $slickElementt = $('.slideshow-images');

            $slickElementt.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
                //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
                var i = (currentSlide ? currentSlide : 0) + 1;
                $statuss.text(i + ' / ' + slick.slideCount);
            });

            $slickElementt.slick({
                autoplay: true,
                dots: false,
                prevArrow: '.slideshow-prev',
                nextArrow: '.slideshow-next',
            });
        }

        // ## Feature Content Slider
        if ($('.features-content-slider').length) {
            var $status = $('.featurepagi.paginginfo');
            var $slickElement = $('.features-content-slider');

            $slickElement.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
                //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
                var i = (currentSlide ? currentSlide : 0) + 1;
                $status.text(i + ' / ' + slick.slideCount);
            });

            $slickElement.slick({
                autoplay: true,
                dots: false,
                prevArrow: '.feature-prev',
                nextArrow: '.feature-next',
            });
        }


        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })




        /* ## Achievements Counter */
        if ($('.counter-text-wrap').length) {
            $('.counter-text-wrap').appear(function () {

                var $t = $(this),
                    n = $t.find(".count-text").attr("data-stop"),
                    r = parseInt($t.find(".count-text").attr("data-speed"), 10);

                if (!$t.hasClass("counted")) {
                    $t.addClass("counted");
                    var $countText = $t.find(".count-text");
                    $({
                        countNum: $countText.text()
                    }).animate({
                        countNum: n
                    }, {
                        duration: r,
                        easing: "linear",
                        step: function () {
                            $countText.text(Math.floor(this.countNum));
                        },
                        complete: function () {
                            $countText.text(this.countNum);
                            if ($countText.attr("data-suffix") === "+") {
                                $countText.addClass("has-plus");
                            }
                        }
                    });
                }

            }, {
                accY: 0
            });
        }



        // ## Scroll to Top
        if ($('.scroll-to-target').length) {
            $(".scroll-to-target").on('click', function () {
                var target = $(this).attr('data-target');
                // animate
                $('html, body').animate({
                    scrollTop: $(target).offset().top
                }, 0);

            });
        }


        // ## Nice Select
        $('select').niceSelect();


        // ## WOW Animation
        if ($('.wow').length) {
            var wow = new WOW({
                boxClass: 'wow', // animated element css class (default is wow)
                animateClass: 'animated', // animation css class (default is animated)
                offset: 0, // distance to the element when triggering the animation (default is 0)
                mobile: false, // trigger animations on mobile devices (default is true)
                live: true // act on asynchronously loaded content (default is true)
            });
            wow.init();
        }



    });


    /* ==========================================================================
       When document is resize, do
       ========================================================================== */

    // Throttle function for performance
    function throttle(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            if (!timeout) {
                timeout = setTimeout(function() {
                    timeout = null;
                    func.apply(context, args);
                }, wait);
            }
        };
    }

    $(window).on('resize', throttle(function () {
        var mobileWidth = 992;
        var navcollapse = $('.navigation li.dropdown');
        navcollapse.children('ul').hide();
        navcollapse.children('.megamenu').hide();
    }, 150));


    /* ==========================================================================
       When document is scroll, do
       ========================================================================== */

    $(window).on('scroll', throttle(function () {
        // Header Style and Scroll to Top
        headerStyle();
    }, 16)); // ~60fps

    /* ==========================================================================
       When document is loaded, do
       ========================================================================== */

    $(window).on('load', function () {

        // Scroll to #residences when URL has hash (used when preloader is missing, e.g. on Netlify)
        function scrollToResidencesIfNeeded() {
            var hashToScroll = window.location.hash || window._pendingHash;
            if (!hashToScroll || hashToScroll !== '#residences') return;
            var targetElement = $(hashToScroll);
            if (!targetElement.length) return;
            var sectionTitle = targetElement.find('.section-title').first();
            var scrollTarget = sectionTitle.length ? sectionTitle : targetElement;
            var headerHeight = $('.main-header').outerHeight() || 0;
            var scrollPosition = Math.max(0, scrollTarget.offset().top - headerHeight - 20);
            window.scrollTo(0, scrollPosition);
            $('html, body').scrollTop(scrollPosition);
            if (window._pendingHash && window.history && window.history.replaceState) {
                window.history.replaceState(null, null, window.location.pathname + window.location.search + window._pendingHash);
                delete window._pendingHash;
            }
        }

        // ## Preloader
        function handlePreloader() {
            // Early return if no preloader - still scroll to hash then exit
            if (!$('.preloader').length) {
                scrollToResidencesIfNeeded();
                // Show WhatsApp button immediately
                $('.whatsapp-float').addClass('show');
                
                // Add loaded class for smooth fade-in
                $('.page-wrapper').addClass('loaded');
                $('.hero-area').addClass('loaded');
                $('.hero-content').addClass('loaded');
                return; // Exit early - no preloader, no scroll manipulation needed
            }
            
            // Calculate scroll position BEFORE preloader is removed (if hash exists)
            var hashToScroll = window.location.hash || window._pendingHash;
            var scrollPosition = null;
            
            if (hashToScroll) {
                var targetElement = $(hashToScroll);
                if (targetElement.length) {
                    // Try to find the section-title inside the section for more precise positioning
                    var sectionTitle = targetElement.find('.section-title').first();
                    var scrollTarget = sectionTitle.length > 0 ? sectionTitle : targetElement;
                    
                    // Calculate scroll position - we want to show the section title
                    var headerHeight = 0;
                    var $header = $('.main-header');
                    if ($header.length) {
                        headerHeight = $header.outerHeight() || 0;
                    }
                    // Scroll to section title (or section start if title not found)
                    // Add small offset to show title properly below header
                    scrollPosition = Math.max(0, scrollTarget.offset().top - headerHeight - 20);
                }
            }
            
            // Use requestAnimationFrame to ensure DOM is ready, then immediately start fade-out
            // No fixed delay - preloader disappears right after window load
            requestAnimationFrame(function() {
                // Set scroll position IMMEDIATELY while preloader is still visible
                // This ensures user doesn't see wrong content when preloader disappears
                if (scrollPosition !== null) {
                    // Temporarily disable smooth scroll behavior
                    var originalScrollBehavior = $('html').css('scroll-behavior');
                    $('html, body').css('scroll-behavior', 'auto');
                    
                    // Restore hash in URL
                    if (window._pendingHash && window.history && window.history.replaceState) {
                        window.history.replaceState(null, null, window.location.pathname + window.location.search + window._pendingHash);
                        delete window._pendingHash;
                    }
                    
                    // Recalculate position right before setting (layout is now stable)
                    var targetElement = $(hashToScroll);
                    if (targetElement.length) {
                        // Try to find the section-title inside the section for more precise positioning
                        var sectionTitle = targetElement.find('.section-title').first();
                        var scrollTarget = sectionTitle.length > 0 ? sectionTitle : targetElement;
                        
                        var headerHeight = $('.main-header').outerHeight() || 0;
                        // Position to show section title properly
                        scrollPosition = Math.max(0, scrollTarget.offset().top - headerHeight - 20);
                    }
                    
                    // Set scroll position immediately (synchronously, no animation)
                    // This happens while preloader is still visible
                    window.scrollTo(0, scrollPosition);
                    $('html, body').scrollTop(scrollPosition);
                    
                    // Restore original scroll behavior after a short delay
                    setTimeout(function() {
                        if (originalScrollBehavior) {
                            $('html, body').css('scroll-behavior', originalScrollBehavior);
                        }
                    }, 50);
                } else {
                    // If no hash, ensure we're at the top
                    window.scrollTo(0, 0);
                    $('html, body').scrollTop(0);
                }
                
                // Start preloader fade-out immediately (short 250ms fade-out)
                $('.preloader').addClass('fade-out');
                
                // Remove preloader from DOM after fade-out completes
                setTimeout(function() {
                    $('.preloader').remove();
                    
                    // Ensure scroll position is still correct after preloader removal
                    if (scrollPosition !== null) {
                        // Recalculate position one more time after preloader is removed (layout is fully stable)
                        var targetElement = $(hashToScroll);
                        if (targetElement.length) {
                            // Try to find the section-title inside the section for more precise positioning
                            var sectionTitle = targetElement.find('.section-title').first();
                            var scrollTarget = sectionTitle.length > 0 ? sectionTitle : targetElement;
                            
                            var headerHeight = $('.main-header').outerHeight() || 0;
                            // Position to show section title properly
                            var finalPosition = Math.max(0, scrollTarget.offset().top - headerHeight - 20);
                            $('html, body').scrollTop(finalPosition);
                        } else {
                            $('html, body').scrollTop(scrollPosition);
                        }
                    } else {
                        // If no hash, ensure we're at the top
                        window.scrollTo(0, 0);
                        $('html, body').scrollTop(0);
                    }
                    
                    // Show WhatsApp button after preloader is removed
                    $('.whatsapp-float').addClass('show');
                    
                    // Add loaded class for smooth fade-in
                    $('.page-wrapper').addClass('loaded');
                    $('.hero-area').addClass('loaded');
                    $('.hero-content').addClass('loaded');
                }, 250); // Short fade-out: 250ms (smooth transition)
            });
        }
        handlePreloader();

        // Fallback: scroll to #residences again after a short delay (helps on Netlify / slow layout)
        setTimeout(function() {
            scrollToResidencesIfNeeded();
        }, 400);

        // ## Active Navigation Highlighting - Residences Anchor
        // Highlight "Residences" when user is on #residences section, otherwise highlight "Home" on index page
        function updateActiveNavItem() {
            if (!isIndexPage()) return;
            
            var currentPage = getCurrentIndexPage();
            if (currentPage === '' || currentPage === 'index.html') currentPage = 'index.html';
            var $navHome = $('.navigation a[href="' + currentPage + '"]').first();
            var $navResidences = $('#nav-residences');
            var residencesSection = document.getElementById('residences');
                var heroSection = document.querySelector('.hero-area');
                
                if (!residencesSection || !$navResidences.length || !$navHome.length) {
                    return; // Exit if section or nav link doesn't exist
                }

                // Use IntersectionObserver to detect when #residences is in view
                var observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                            // Residences section is in view - highlight Residences
                            $navHome.removeClass('active');
                            $navResidences.addClass('active');
                        }
                    });
                }, { threshold: 0.3 });

                // Also observe hero section to switch back to Home
                var heroObserver = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                            // Hero section is in view - highlight Home
                            $navResidences.removeClass('active');
                            $navHome.addClass('active');
                        }
                    });
                }, { threshold: 0.3 });

                observer.observe(residencesSection);
                if (heroSection) {
                    heroObserver.observe(heroSection);
                }

                // Check hash on load
                if (window.location.hash === '#residences') {
                    $navHome.removeClass('active');
                    $navResidences.addClass('active');
                } else {
                    $navResidences.removeClass('active');
                    $navHome.addClass('active');
                }

                // Update on hash change
                $(window).on('hashchange', function() {
                    if (window.location.hash === '#residences') {
                        $navHome.removeClass('active');
                        $navResidences.addClass('active');
                    } else {
                        $navResidences.removeClass('active');
                        $navHome.addClass('active');
                    }
                });
        }

        // Initialize active nav highlighting after DOM is ready
        updateActiveNavItem();

    });

})(window.jQuery);


// ## Get Current Date
function getCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

// ## Schedule Calendar
document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    // Only initialize if calendar element exists and FullCalendar is loaded
    if (!calendarEl || typeof FullCalendar === 'undefined') {
        return;
    }
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialDate: getCurrentDate(),
        firstDay: 1,
        editable: false,
        selectable: false,
        businessHours: true,
        dayMaxEvents: true, // allow "more" link when too many events
        events: [
            {
                title: '09:00 AM - 05:00 PM',
                start: '2023-05-29',
                end: '2023-06-02'
            },
            {
                title: '09:00 AM - 01:00 PM',
                start: '2023-06-02',
                end: '2023-06-04'
            },
            {
                title: 'Day Off',
                start: '2023-06-04',
                end: '2023-06-04',
                color: '#D9DFE7',
                textColor: '#4A515B'
            },
            {
                title: '09:00 AM - 05:00 PM',
                start: '2023-06-05',
                end: '2023-06-09'
            },
            {
                title: '09:00 AM - 01:00 PM',
                start: '2023-06-09',
                end: '2023-06-11'
            },
            {
                title: 'Day Off',
                start: '2023-06-11',
                end: '2023-06-11',
                color: '#D9DFE7',
                textColor: '#4A515B'
            },
            {
                title: '09:00 AM - 05:00 PM',
                start: '2023-06-12',
                end: '2023-06-16'
            },
            {
                title: '09:00 AM - 01:00 PM',
                start: '2023-06-16',
                end: '2023-06-18'
            },
            {
                title: 'Day Off',
                start: '2023-06-18',
                end: '2023-06-18',
                color: '#D9DFE7',
                textColor: '#4A515B'
            },
            {
                title: '09:00 AM - 05:00 PM',
                start: '2023-06-19',
                end: '2023-06-22'
            },
            {
                title: 'Day Off',
                start: '2023-06-22',
                end: '2023-06-22',
                color: '#D9DFE7',
                textColor: '#4A515B'
            },
            {
                title: '09:00 AM - 01:00 PM',
                start: '2023-06-23',
                end: '2023-06-25'
            },
            {
                title: 'Day Off',
                start: '2023-06-25',
                end: '2023-06-25',
                color: '#D9DFE7',
                textColor: '#4A515B'
            },
            {
                title: 'Holiday',
                start: '2023-06-26',
                end: '2023-07-03',
                color: '#D9DFE7',
                textColor: '#4A515B'
            },
            // End of June
        ]
    });

    calendar.render();
});

// Facility Cards Click Handler (Facilities page)
document.addEventListener('DOMContentLoaded', function() {
    const facilityCards = document.querySelectorAll('.facility-category-card');
    if (facilityCards.length === 0) return; // Only run on facilities page
    
    let activeCard = null;
    
    facilityCards.forEach(function(card) {
        card.addEventListener('click', function(e) {
            // If clicking on active card, close it
            if (card === activeCard) {
                card.classList.remove('card-panel-active');
                activeCard = null;
                return;
            }
            
            // Remove active state from previous card
            if (activeCard) {
                activeCard.classList.remove('card-panel-active');
            }
            
            // Add active state to current card
            card.classList.add('card-panel-active');
            activeCard = card;
        });
    });
});

// Project Cards ScrollTrigger Animation (Projects page) - точно как в My Expertise
(function($) {
    "use strict";
    
    // Ждем загрузки всех скриптов, включая GSAP
    $(window).on('load', function() {
        // Проверяем, что GSAP и ScrollTrigger загружены
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP or ScrollTrigger not loaded');
            return;
        }
        
        // Регистрируем плагин ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        
        let projectCardsContainer = document.querySelector(".project-cards-items");
        if (projectCardsContainer) {
            ScrollTrigger.matchMedia({
                "(min-width: 992px)": function() {
                    let projectCards = gsap.utils.toArray(".project-card");
                    if (projectCards.length === 0) return;
                    
                    const spacer = 0;
                    
                    let cardHeight = projectCards[0].offsetHeight + 120;
                    projectCards.forEach((card, i) => {
                        // Устанавливаем начальную позицию
                        gsap.set(card, {
                            top: i * 0
                        });
                        
                        // Анимация масштабирования при скролле
                        const tween = gsap.to(card, {
                            scrollTrigger: {
                                trigger: card,
                                start: () => `top bottom-=100`,
                                end: () => `top top+=40`,
                                scrub: true,
                                invalidateOnRefresh: true
                            },
                            ease: "none",
                            // Масштабирование карточек (последние меньше)
                            scale: () => 1 - (projectCards.length - i) * 0.035
                        });
                        
                        // Закрепление карточек при скролле
                        ScrollTrigger.create({
                            trigger: card,
                            start: () => "top 140px",
                            endTrigger: '.project-cards-items',
                            end: `bottom top+=${cardHeight + (projectCards.length * spacer)}`,
                            pin: true,
                            pinSpacing: false,
                        });
                    });
                },
                "(max-width: 991px)": function() {
                    // На мобильных устройствах отключаем анимацию
                    ScrollTrigger.getAll().forEach(trigger => {
                        if (trigger.vars && trigger.vars.trigger && trigger.vars.trigger.classList && trigger.vars.trigger.classList.contains('project-card')) {
                            trigger.kill(true);
                        }
                    });
                }
            });
        }
    });
})(jQuery);
