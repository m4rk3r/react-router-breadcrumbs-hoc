(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-router')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-router'], factory) :
	(factory((global['react-router-breadcrumbs-hoc'] = {}),global.React,global.ReactRouter));
}(this, (function (exports,react,reactRouter) { 'use strict';

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var DEFAULT_MATCH_OPTIONS = { exact: true };

// if user is passing a function (component) as a breadcrumb, make sure we
// pass the match object into it. Else just return the string.
var renderer = function renderer(_ref) {
  var breadcrumb = _ref.breadcrumb,
      match = _ref.match;

  if (typeof breadcrumb === 'function') {
    return react.createElement(breadcrumb, { match: match });
  }
  return breadcrumb;
};

var getBreadcrumbs = function getBreadcrumbs(_ref2) {
  var routes = _ref2.routes,
      pathname = _ref2.pathname;

  var matches = [];
  var segments = [];

  /* remove trailing slash "/" from pathname unless it's a base route
     (avoids multiple of the same match) */
  var newPath = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;

  while (newPath.length) {
    // check whether next segment is a splat matched url
    if (newPath.startsWith('http')) {
      segments.push(newPath);
      newPath = '';
    } else {
      // grab next segment
      var part = newPath.split('/', 1)[0];
      segments.push(part);

      // remove segment + slash from path
      newPath = newPath.substr(part.length + 1);
    }
  }

  segments
  // reduce over the sections and find matches from `routes` prop
  .reduce(function (previous, current) {
    // combine the last route section with the current
    // ex `pathname = /1/2/3 results in match checks for
    // `/1`, `/1/2`, `/1/2/3`
    var pathSection = !current ? '/' : previous + '/' + current;

    var breadcrumbMatch = void 0;

    routes.some(function (_ref3) {
      var breadcrumb = _ref3.breadcrumb,
          matchOptions = _ref3.matchOptions,
          path = _ref3.path,
          getLocation = _ref3.getLocation;

      if (!path) {
        throw new Error('withBreadcrumbs: `path` must be provided in every route object');
      }

      if (!breadcrumb) {
        return false;
      }

      var match = reactRouter.matchPath(pathSection, _extends({}, matchOptions || DEFAULT_MATCH_OPTIONS, { path: path }));

      // if a route match is found ^ break out of the loop with a rendered breadcumb
      // and match object to add to the `matches` array
      if (match) {
        breadcrumbMatch = {
          breadcrumb: renderer({ breadcrumb: breadcrumb, match: match }),
          path: path,
          match: match,
          getLocation: getLocation
        };
        return true;
      }

      return false;
    });

    /* istanbul ignore else */
    if (breadcrumbMatch) {
      matches.push(breadcrumbMatch);
    }

    return pathSection === '/' ? '' : pathSection;
  }, null);

  return matches;
};

var withBreadcrumbs = function withBreadcrumbs(routes) {
  return function (Component) {
    return reactRouter.withRouter(function (props) {
      return react.createElement(Component, _extends({}, props, {
        breadcrumbs: getBreadcrumbs({
          pathname: props.location.pathname,
          routes: routes
        })
      }));
    });
  };
};

exports.getBreadcrumbs = getBreadcrumbs;
exports.withBreadcrumbs = withBreadcrumbs;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map