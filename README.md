[![support](https://img.shields.io/badge/support-GitHub-white)](https://github.com/sponsors/dr-dimitru)
[![support](https://img.shields.io/badge/support-PayPal-white)](https://paypal.me/veliovgroup)
<a href="https://ostr.io/info/built-by-developers-for-developers">
  <img src="https://ostr.io/apple-touch-icon-60x60.png" height="20">
</a>

# Reactive meta tags, JavaScript and CSSs

Change meta tags on the fly within [`flow-router-extra`](https://github.com/veliovgroup/flow-router). This package can create `meta` tags, `script` and `link` tags as well.

## Features:

- 👷‍♂️ 100% tests coverage;
- 🎛 Per route, per group, and default (*all routes*) `meta` tags;
- 🎛 Per route, per group, and default (*all routes*) `script`s;
- 🎛 Per route, per group, and default (*all routes*) `link`, like CSS files.

Various ways to set `meta`, `script` and `link` tags, ordered by prioritization:

- `FlowRouter.route()` [*overrides all below*]
- `FlowRouter.group()`
- `FlowRouter.globals`
- Head template `<meta/>`, `<link/>`, `<script/>` tags [*might be overridden by any above*]

## ToC:

- [Installation](https://github.com/veliovgroup/Meteor-flow-router-meta#install)
- [Demo application](https://github.com/veliovgroup/Meteor-flow-router-meta#demo-application)
- [Set CSS and JS per route](https://github.com/veliovgroup/Meteor-flow-router-meta#set-css-and-js-per-route)
- [Set `application/ld+json`](https://github.com/veliovgroup/Meteor-flow-router-meta#ldjson)
- [Use function as value](https://github.com/veliovgroup/Meteor-flow-router-meta#use-function-as-value)
- [Use function's context](https://github.com/veliovgroup/Meteor-flow-router-meta#use-function-context)
- [Bootstrap configuration](https://github.com/veliovgroup/Meteor-flow-router-meta#bootstrap-configuration)
- [Other examples](https://github.com/veliovgroup/Meteor-flow-router-meta#other-examples)
- [Support this project](https://github.com/veliovgroup/Meteor-flow-router-meta#support-this-project)

## Install:

```shell
meteor add ostrio:flow-router-meta
```

__Note__: this package implies [`ostrio:flow-router-title`](https://atmospherejs.com/ostrio/flow-router-title) package.

## Demos / Tests:

- [Demo source](https://github.com/veliovgroup/Meteor-flow-router-meta/tree/master/demo)
- [Tests](https://github.com/veliovgroup/Meteor-flow-router-meta/tree/master/tests.js)

## ES6 Import:

```js
import { FlowRouterMeta } from 'meteor/ostrio:flow-router-meta';
// This library implies ostrio:flow-router-title package, and both can be imported in single line:
import { FlowRouterMeta, FlowRouterTitle } from 'meteor/ostrio:flow-router-meta';
```

## Related Packages:

- [flow-router-title](https://github.com/veliovgroup/Meteor-flow-router-title#reactive-page-title) - Change document.title on the fly within FlowRouter-Extra
- [flow-router-extra](https://github.com/veliovgroup/flow-router#flowrouter-extra) - Carefully extended FlowRouter

## Usage:

You need to initialize `FlowRouterMeta` and `FlowRouterTitle` classes by passing `FlowRouter` object. Right after creating all your routes:

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { FlowRouterMeta, FlowRouterTitle } from 'meteor/ostrio:flow-router-meta';

FlowRouter.route('/', {
  action() { /* ... */ },
  title: 'Title'
  /* ... */
});

new FlowRouterMeta(FlowRouter);
new FlowRouterTitle(FlowRouter);
```

### Set CSS and JS per route:

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Set default JS and CSS for all routes
FlowRouter.globals.push({
  link: {
    twbs: {
      rel: 'stylesheet',
      href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css'
    }
  },
  script: {
    twbs: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js'
  }
});

// Rewrite default JS and CSS, for second route, via controller:
FlowRouter.route('/secondPage', {
  name: 'secondPage',
  action() {
    return this.render('layout', 'secondPage');
  },
  link: {
    twbs: {
      rel: 'stylesheet',
      href: 'https://maxcdn.bootstrapcdn.com/bootstrap/2.2.0/css/bootstrap.min.css'
    }
  },
  script: {
    twbs: 'https://maxcdn.bootstrapcdn.com/bootstrap/2.2.0/js/bootstrap.min.js'
  }
});

// Unset defaults, via controller:
FlowRouter.route('/secondPage', {
  name: 'secondPage',
  action() {
    return this.render('layout', 'secondPage');
  },
  link: {
    twbs: null
  },
  script: {
    twbs: null
  }
});

// Rewrite default JS and CSS, for route group:
const group = FlowRouter.group({
  link: {
    twbs: {
      rel: 'stylesheet',
      href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha/css/bootstrap.min.css'
    }
  },
  script: {
    twbs: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha/js/bootstrap.min.js'
  }
});

group.route('/groupPage1', {
  name: 'groupPage1',
  action() {
    return this.render('layout', 'groupPage1');
  }
});
```

### ldjson:

This method uses special property named `innerHTML` which set script's content instead of attribute. This method and property can be used in the any other case when you need to set script's contents.

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/fourthPage', {
  name: 'fourthPage',
  title: 'Fourth Page title',
  script: {
    ldjson: {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'http://schema.org/',
        '@type': 'Recipe',
        name: 'Grandma\'s Holiday Apple Pie',
        author: 'Elaine Smith',
        image: 'http://images.edge-generalmills.com/56459281-6fe6-4d9d-984f-385c9488d824.jpg',
        description: 'A classic apple pie.',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4',
          reviewCount: '276',
          bestRating: '5',
          worstRating: '1'
        }
      })
    }
  },
  action() { /*...*/ }
});
```

### Use function as value:

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/routePath', {
  name: 'routeName',
  meta: {
    url: {
      property: 'og:url',
      itemprop: 'url',
      content() {
        return document.location.href;
      }
    }
  },
  link: {
    canonical() {
      return document.location.href;
    }
  }
});
```

### Use function context:

*Read about* [`data`](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/data.md) *hook.*

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/post/:_id', {
  name: 'post',
  waitOn(params) {
    return [Meteor.subscribe('post', params._id)];
  },
  data(params) {
    return Collection.Posts.findOne(params._id);
  },
  meta: {
    keywords: {
      name: 'keywords',
      itemprop: 'keywords',
      content(params, query, data = {}) {
        return data.keywords;
      }
    }
  },
  title(params, query, data = {}) {
    if (data) {
      return data.title;
    }
    return '404: Page not found';
  }
});
```

### Other examples:

Set only `name` and `content` attributes on `meta` tag:

```js
FlowRouter.route('/routePath', {
  name: 'routeName',
  meta: {
    name: 'content'
  }
});
```

Set only `rel` and `href` attributes on `link` tag:

```js
FlowRouter.route('/routePath', {
  name: 'routeName',
  link: {
    rel: 'http://example.com'
  }
});
```

Set multiple attributes on `meta` tag:

```js
FlowRouter.route('/routePath', {
  name: 'routeName',
  meta: {
    uniqueName: {
      name: 'name',
      content: 'value',
      property: 'og:name',
      itemprop: 'name'
    }
  }
});
```

Set multiple attributes on `link` tag:

```js
FlowRouter.route('/routePath', {
  name: 'routeName',
  link: {
    uniqueName: {
      rel: 'name',
      sizes: 'value',
      href: 'value',
      type: 'value'
    }
  }
});
```

### Bootstrap configuration:

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/routePath', {
  name: 'routeName',
  meta: {
    // <meta charset="UTF-8">
    charset: {
      charset: 'UTF-8'
    },

    // <meta name="keywords" content="Awes..">
    keywords: {
      name: 'keywords',
      itemprop: 'keywords',
      content: 'Awesome, Meteor, based, app'
    },

    // <meta name="description" itemprop="description" property="og:description" content="Default desc..">
    description: {
      name: 'description',
      itemprop: 'description',
      property: 'og:description',
      content: 'Default description'
    },
    image: {
      name: 'twitter:image',
      itemprop: 'image',
      property: 'og:image',
      content: 'http://example.com'
    },
    'og:type': 'website',
    'og:title'() {
      return document.title;
    },
    'og:site_name': 'My Awesome Site',
    url: {
      property: 'og:url',
      itemprop: 'url',
      content() {
        return window.location.href;
      }
    },
    'twitter:card': 'summary',
    'twitter:title'() {
      return document.title;
    },
    'twitter:description': 'Default description',
    'twitter:site': {
      name: 'twitter:site',
      value: '@twitterAccountName'
    },
    'twitter:creator': {
      name: 'twitter:creator',
      value: '@twitterAccountName'
    },
    'http-equiv': {
      'http-equiv': 'X-UA-Compatible',
      content: 'IE=edge,chrome=1'
    },
    robots: 'index, follow',
    google: 'notranslate'
  },
  link: {
    // <link href="https://maxcdn.bootstrapcdn.com/..." rel="stylesheet">
    stylesheet: 'https://maxcdn.bootstrapcdn.com/bootstrap/2.3.2/css/bootstrap.min.css',

    // <link rel="canonical" href="http://example.com">
    canonical() {
      return document.location.href;
    },

    // <link rel="image" sizes="500x500" href="http://example.com">
    image: {
      rel: 'image',
      sizes: '500x500',
      href: 'http://example.com'
    },
    publisher: 'http://plus.google...',
    'shortcut icon': {
      rel: 'shortcut icon',
      type: 'image/x-icon',
      href: 'http://example.com'
    },
    'icon': {
      rel: 'icon',
      type: 'image/png',
      href: 'http://example.com'
    },
    'apple-touch-icon-144': {
      rel: 'apple-touch-icon',
      sizes: '144x144',
      href: 'http://example.com'
    },
    'apple-touch-icon-114': {
      rel: 'apple-touch-icon',
      sizes: '114x114',
      href: 'http://example.com'
    },
    'apple-touch-icon-72': {
      rel: 'apple-touch-icon',
      sizes: '72x72',
      href: 'http://example.com'
    },
    'apple-touch-icon-57': {
      rel: 'apple-touch-icon',
      sizes: '57x57',
      href: 'http://example.com'
    }
  },
  script: {
    twbs: 'https://maxcdn.bootstrapcdn.com/bootstrap/2.3.2/js/bootstrap.min.js',
    d3: {
      src: 'https://d3js.org/d3.v3.min.js',
      charset: 'utf-8'
    }
  }
});
```

## Running Tests

1. Clone this package
2. In Terminal (*Console*) go to directory where package is cloned
3. Then run:

### Meteor/Tinytest

```shell
# Default
meteor test-packages ./

# With custom port
meteor test-packages ./ --port 8888

# With local MongoDB and custom port
MONGO_URL="mongodb://127.0.0.1:27017/flow-router-meta-tests" meteor test-packages ./ --port 8888
```

## Support this project:

- [Sponsor via GitHub](https://github.com/sponsors/dr-dimitru)
- [Support via PayPal](https://paypal.me/veliovgroup) — support my open source contributions once or on regular basis
- Use [ostr.io](https://ostr.io) — [Monitoring](https://snmp-monitoring.com), [Analytics](https://ostr.io/info/web-analytics), [WebSec](https://domain-protection.info), [Web-CRON](https://web-cron.info) and [Pre-rendering](https://prerendering.com) for a website
