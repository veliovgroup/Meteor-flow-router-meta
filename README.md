[![support](https://img.shields.io/badge/support-GitHub-white)](https://github.com/sponsors/dr-dimitru)
[![support](https://img.shields.io/badge/support-PayPal-white)](https://paypal.me/veliovgroup)
<a href="https://ostr.io/info/built-by-developers-for-developers?ref=github-flowroutermeta-repo-top"><img src="https://ostr.io/apple-touch-icon-60x60.png" height="20"></a>
<a href="https://meteor-files.com/?ref=github-flowroutermeta-repo-top"><img src="https://meteor-files.com/apple-touch-icon-60x60.png" height="20"></a>

# Reactive `meta`, `link`, and `script` tags

Change meta tags on the fly in [Meteor.js](https://docs.meteor.com/?utm_source=dr.dimitru&utm_medium=online&utm_campaign=Q2-2022-Ambassadors) apps via [`flow-router-extra`](https://github.com/veliovgroup/flow-router) API. This package manages `meta` tags, `script` and `link` via simple router object definitions.

## Features:

- 👷‍♂️ 100% tests coverage;
- 🎛 Per route, per group, and default (*all routes*) `meta` tags;
- 🎛 Per route, per group, and default (*all routes*) `script`s;
- 🎛 Per route, per group, and default (*all routes*) `link`, like CSS files.

Various ways to set `meta`, `script` and `link` tags, *ordered by priority*:

- `FlowRouter.route()` [*overrides all below*]
- `FlowRouter.group()`
- `FlowRouter.globals`
- Head template `<meta/>`, `<link/>`, `<script/>` tags [*superseded by any above*]

## ToC

- [Installation](#install)
- [Demos](#demos)
- [ES6 Import](#es6-import)
- [Related Packages](#related-packages)
- [API](#api)
- [Usage](#usage)
  - [Basic examples](#basic-examples)
  - [Set `application/ld+json`](#ldjson)
  - [Use function as value](#use-function-as-value)
  - [Use function's context](#use-function-context)
  - [Set CSS and JS per route](#set-css-and-js-per-route)
  - [Bootstrap configuration](#bootstrap-configuration)
- [Running tests](#running-tests)
- [Support this project](#support-this-project)

## Install

```shell
meteor add ostrio:flow-router-meta
```

> [!NOTE]
> This package implies [`ostrio:flow-router-title`](https://atmospherejs.com/ostrio/flow-router-title) package.

## Demos

- [Real app usage example](https://github.com/veliovgroup/meteor-files-website/blob/master/imports/client/router/router.js#L18)
- [Demo source](https://github.com/veliovgroup/Meteor-flow-router-meta/tree/master/demo)
- [Tests](https://github.com/veliovgroup/Meteor-flow-router-meta/tree/master/tests.js)

## ES6 Import

```js
import { FlowRouterMeta } from 'meteor/ostrio:flow-router-meta';
// This library implies ostrio:flow-router-title package, and both can be imported in single line:
import { FlowRouterMeta, FlowRouterTitle } from 'meteor/ostrio:flow-router-meta';
```

## Related Packages

`flow-router-meta` performs the best when used with the next packages:

- [flow-router-title](https://github.com/veliovgroup/Meteor-flow-router-title#reactive-page-title) - Change document.title on the fly within FlowRouter-Extra
- [flow-router-extra](https://github.com/veliovgroup/flow-router#flowrouter-extra) - Carefully extended FlowRouter

## API

- `new FlowRouterMeta(FlowRouter)` — The main `FlowRouterMeta` constructor that accepts `FlowRouter` as the only argument

After `new FlowRouterMeta(FlowRouter)` instance is initiated it extends `FlowRouter.router()` and `FlowRouter.group()` methods and `FlowRouter.globals` with support of:

- `meta: Object` — Object with meta-tags
- `meta: function(params, qs, data) => object` — Method returning object with meta-tags
- `link: Object` — Object with link-tags
- `link: function(params, qs, data) => object` — Method returning object with link-tags
- `script: Object` — Object with script-tags
- `script: function(params, qs, data) => object` — Method returning object with script-tags

## Usage

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

### Basic examples

Set only `name` and `content` attributes on `meta` tag:

```js
FlowRouter.route('/routePath', {
  name: 'routeName',
  meta: {
    name: 'content'
  }
});
// Will generate
// <meta name="name" content="content">

FlowRouter.route('/routePath', {
  name: 'routeName',
  meta: {
    'og:title': 'Page title'
  }
});
// Will generate
// <meta name="og:title" content="Page-title">
```

Set only `rel` and `href` attributes on `link` tag:

```js
FlowRouter.route('/routePath', {
  name: 'routeName',
  link: {
    canonical: 'http://example.com'
  }
});
// Will generate
// <link rel="canonical" href="http://example.com">

FlowRouter.route('/routePath', {
  name: 'routeName',
  link: {
    rel: 'canonical',
    href: 'http://example.com'
  }
});
// Will generate
// <link rel="canonical" href="http://example.com">
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
// Will generate
// <meta name="name" content="value" property="og:name" itemprop="name">
```

Set multiple attributes on `link` tag:

```js
FlowRouter.route('/routePath', {
  name: 'routeName',
  link: {
    uniqueName: {
      rel: 'name',
      sizes: 'value',
      href: 'http://value',
      type: 'value-type'
    }
  }
});
// Will generate
// <link rel="name" sizes="value" href="http://value" type="value-type">
```

### ldjson

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

### Use function as value

Properties of `meta`, `link`, and `script` tags can be a function that will execute upon navigation

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

### Use function context

`data` can get passed from `data()` hook. *Read about [`data`](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/data.md) hook.*

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/post/:_id', {
  name: 'post',
  waitOn(params) {
    return [Meteor.subscribe('post', params._id)];
  },
  async data(params) {
    return await Collection.Posts.findOneAsync(params._id);
  },
  meta: {
    keywords: {
      name: 'keywords',
      itemprop: 'keywords',
      content(params, query, data) {
        return data?.keywords || 'default, key, words';
      }
    }
  },
  title(params, query, data) {
    if (data) {
      return data.title;
    }
    return '404: Page not found';
  }
});
```

### Set CSS and JS per route

Load CSS and JS files on per route and per group basis.

> [!IMPORTANT]
> Once CSS or JS is loaded there's no way to "unload" its code. This package will remove tags from head when navigated to other routes, but contents of loaded JS and CSS files will remain in browser's memory

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

### Bootstrap configuration

Push default `meta`, `link`, or `script` tags to `FlowRouter.globals`

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.globals.push({
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

- Upload and share files using [☄️ meteor-files.com](https://meteor-files.com/?ref=github-flowroutermeta-repo-footer) — Continue interrupted file uploads without losing any progress. There is nothing that will stop Meteor from delivering your file to the desired destination
- Use [▲ ostr.io](https://ostr.io?ref=github-flowroutermeta-repo-footer) for [Server Monitoring](https://snmp-monitoring.com), [Web Analytics](https://ostr.io/info/web-analytics?ref=github-flowroutermeta-repo-footer), [WebSec](https://domain-protection.info), [Web-CRON](https://web-cron.info) and [SEO Pre-rendering](https://prerendering.com) of a website
- Star on [GitHub](https://github.com/veliovgroup/Meteor-flow-router-meta)
- Star on [Atmosphere](https://atmospherejs.com/ostrio/flow-router-meta)
- [Sponsor via GitHub](https://github.com/sponsors/dr-dimitru)
- [Support via PayPal](https://paypal.me/veliovgroup)
