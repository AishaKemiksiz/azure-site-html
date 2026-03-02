/**
 * Unified Multi-Language Switching System
 * EN default (unsuffixed), RU (-ru.html), TR (-tr.html)
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'siteLang';
  var SUPPORTED_LANGS = ['en', 'ru', 'tr', 'ka'];

  /**
   * Build a safe target filename for a language
   * - Ensures we always have a non-empty base
   * - Prevents generating paths that start with "-"
   */
  function buildTargetFile(base, lang) {
    if (!base || typeof base !== 'string') {
      base = 'index';
    }

    // Strip any leading dashes just in case
    base = base.replace(/^\-+/, '');
    if (!base) base = 'index';

    var targetFile = lang === 'en' ? base + '.html' : base + '-' + lang + '.html';

    // Absolute safety guard: never allow filenames starting with "-"
    if (!targetFile || targetFile.charAt(0) === '-') {
      return 'index.html';
    }

    return targetFile;
  }

  /**
   * Get current language from pathname
   * - endsWith("-ru.html") => "ru"
   * - endsWith("-tr.html") => "tr"
   * - otherwise (unsuffixed or legacy EN variants) => "en"
   */
  function getCurrentLang() {
    var path = window.location.pathname || '';
    var filename = path.split('/').pop() || path;
    if (filename.endsWith('-ru.html')) return 'ru';
    if (filename.endsWith('-tr.html')) return 'tr';
    if (filename.endsWith('-ka.html')) return 'ka';
    return 'en';
  }

  /**
   * Get base page name (strip -ru/-tr/-en before .html)
   * e.g. "projects-ru.html" => "projects", "index.html" => "index"
   * Never returns empty or a string starting with "-" (avoids https://-tr.html/ on Netlify).
   */
  function getBasePageName() {
    var path = window.location.pathname || '';
    var filename = path.split('/').pop() || path;
    var base = filename.replace(/\.html$/, '');
    base = base.replace(/-ru$|-tr$|-en$|-ka$/, '');
    base = (base && base.replace) ? base.replace(/^\-+/, '') : '';
    return (base && base.charAt(0) !== '-') ? base : 'index';
  }

  /**
   * Build target URL for a language.
   * Never returns a URL that could resolve to https://-ru.html/ or https://-tr.html/
   */
  function getUrlForLang(base, lang) {
    base = (base && typeof base === 'string') ? base.replace(/^\-+/, '') : '';
    if (!base || base.charAt(0) === '-') base = 'index';

    var targetFile = buildTargetFile(base, lang);
    var search = window.location.search || '';
    var hash = window.location.hash || '';
    var path = window.location.pathname || '';

    if (!targetFile || targetFile.charAt(0) === '-') {
      targetFile = 'index.html';
    }

    var url;
    if (window.location.protocol === 'file:') {
      var dir = path.substring(0, path.lastIndexOf('/') + 1);
      url = dir + targetFile + search + hash;
    } else {
      url = '/' + targetFile + search + hash;
    }

    if (url.indexOf('/-') !== -1 || url.indexOf('//-') !== -1) {
      url = (window.location.protocol === 'file:' ? path.substring(0, path.lastIndexOf('/') + 1) : '/') + 'index.html' + search + hash;
    }
    return url;
  }

  /**
   * Update mobile inline language row active state
   */
  function updateMobileInline(currentLang) {
    var rows = document.querySelectorAll('.nav-lang-inline');
    rows.forEach(function (row) {
      var items = row.querySelectorAll('[data-lang]');
      items.forEach(function (item) {
        if (item.getAttribute('data-lang') === currentLang) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });
  }

  /**
   * Handle language switch click
   */
  function handleSwitch(e) {
    var btn = e.target.closest('[data-lang]');
    if (!btn) return;
    var targetLang = btn.getAttribute('data-lang');
    if (!targetLang || !SUPPORTED_LANGS.includes(targetLang)) return;

    var currentLang = getCurrentLang();
    if (targetLang === currentLang) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, targetLang);
    } catch (err) {}

    var base = getBasePageName();
    var url = getUrlForLang(base, targetLang);
    if (url.indexOf('/-') !== -1 || url.indexOf('//-') !== -1) {
      url = (window.location.protocol === 'file:' ? (window.location.pathname || '').substring(0, (window.location.pathname || '').lastIndexOf('/') + 1) : '/') + 'index.html' + (window.location.search || '') + (window.location.hash || '');
    }
    window.location.href = url;
  }

  /**
   * Check if href is a local HTML link we should rewrite
   */
  function isLocalHtmlLink(href) {
    if (!href || typeof href !== 'string') return false;
    var trimmed = href.trim();
    if (!trimmed) return false;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return false;
    if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) return false;
    if (trimmed.startsWith('#')) return false;
    if (trimmed.startsWith('javascript:')) return false;
    var pathPart = trimmed.split('?')[0].split('#')[0];
    return pathPart.endsWith('.html');
  }

  /**
   * Extract base name from an href
   * e.g. "about.html" => "about", "projects-ru.html#section" => "projects"
   * Never returns empty or a string starting with "-".
   */
  function getBaseFromHref(href) {
    var pathPart = href.split('?')[0].split('#')[0];
    var filename = pathPart.split('/').pop() || pathPart;
    var base = filename.replace(/\.html$/, '');
    base = base.replace(/-ru$|-tr$|-en$|-ka$/, '');
    base = (base && base.replace) ? base.replace(/^\-+/, '') : '';
    return (base && base.charAt(0) !== '-') ? base : 'index';
  }

  /**
   * Rewrite href to target language version
   */
  function rewriteHref(href, currentLang) {
    var base = getBaseFromHref(href);
    var pathOnly = href.split('?')[0].split('#')[0];
    var hasLeadingSlash = pathOnly.charAt(0) === '/';

    var query = '';
    var hash = '';
    var idx = href.indexOf('?');
    if (idx !== -1) {
      query = href.substring(idx);
      var hashIdx = query.indexOf('#');
      if (hashIdx !== -1) {
        hash = query.substring(hashIdx);
        query = query.substring(0, hashIdx);
      }
    } else {
      idx = href.indexOf('#');
      if (idx !== -1) hash = href.substring(idx);
    }

    var targetFile = buildTargetFile(base, currentLang);

    // Extra guard so we never return something like "-ru.html"
    if (!targetFile || targetFile.charAt(0) === '-') {
      targetFile = 'index.html';
    }

    var targetPath = (hasLeadingSlash ? '/' : '') + targetFile;
    return targetPath + query + hash;
  }

  /**
   * Rewrite all local HTML links on page to stay in current language.
   * Also fixes any broken hrefs like "-tr.html", "/-tr.html", "//-tr.html" that could cause https://-tr.html/
   */
  function rewriteInternalLinks(currentLang) {
    var links = document.querySelectorAll('a[href]');
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || typeof href !== 'string') return;
      var trimmed = href.trim();
      var segment = trimmed.split('?')[0].split('#')[0].split('/').pop() || '';
      var isBroken = trimmed.indexOf('/-') !== -1 || trimmed.indexOf('//-') !== -1 || (segment.length && segment.charAt(0) === '-' && segment.endsWith('.html'));
      if (isBroken) {
        a.setAttribute('href', (trimmed.charAt(0) === '/' ? '/' : '') + (currentLang === 'en' ? 'index' : 'index-' + currentLang) + '.html');
        return;
      }
      if (!isLocalHtmlLink(href)) return;

      var newHref = rewriteHref(href, currentLang);
      if (newHref.indexOf('/-') !== -1 || newHref.indexOf('//-') !== -1) {
        newHref = (newHref.charAt(0) === '/' ? '/' : '') + (currentLang === 'en' ? 'index' : 'index-' + currentLang) + '.html';
      }
      if (newHref !== href) {
        a.setAttribute('href', newHref);
      }
    });
  }

  /**
   * Optional: Redirect EN default page to stored language preference
   * Only when URL has no -ru/-tr (i.e. EN page) and localStorage says ru/tr
   */
  function maybeRedirectFromStoredPref() {
    var currentLang = getCurrentLang();
    if (currentLang !== 'en') return;

    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (!stored || stored === 'en') return;
      if (!SUPPORTED_LANGS.includes(stored)) return;

      var base = getBasePageName();
      var url = getUrlForLang(base, stored);
      if (url.indexOf('/-') !== -1 || url.indexOf('//-') !== -1) {
        url = (window.location.protocol === 'file:' ? (window.location.pathname || '').substring(0, (window.location.pathname || '').lastIndexOf('/') + 1) : '/') + 'index.html' + (window.location.search || '') + (window.location.hash || '');
      }
      window.location.replace(url);
    } catch (err) {}
  }

  /**
   * Init: run on DOMContentLoaded
   */
  function init() {
    var currentLang = getCurrentLang();

    maybeRedirectFromStoredPref();

    updateMobileInline(currentLang);

    // Bind mobile inline language clicks
    var mobileItems = document.querySelectorAll('.nav-lang-inline [data-lang]');
    mobileItems.forEach(function (item) {
      item.addEventListener('click', handleSwitch);
    });

    rewriteInternalLinks(currentLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
