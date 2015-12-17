Reactive meta tags, JavaScript links and CSS for meteor within flow-router-extra
========
Change meta tags on the fly within [flow-router-extra](https://github.com/VeliovGroup/flow-router). This package can create `meta` tags, `script` and `link` tags as well.

This package may also help to use dynamic CSSs, so you may use different style sheets - for different routes.

__!!!Important Notice: This package oriented to work with [flow-router-extra](https://github.com/VeliovGroup/flow-router).__ It is extended fork of [kadira:flow-router](https://github.com/kadirahq/flow-router).

This package supports `meta`, `script` and `link` options (properties) defined on methods below, ordered by prioritization:
 - `FlowRouter.route()` [*overrides all*]
 - `FlowRouter.group()`
 - `FlowRouter.globals` [*might be overridden by any above*]

__Note__: this package implies [ostrio:flow-router-title](https://atmospherejs.com/ostrio/flow-router-title) package.

Install:
========
```shell
meteor add ostrio:flow-router-meta
```

Demo application:
========
##### [flow-router-meta.meteor.com](http://flow-router-meta.meteor.com)

Usage:
========

Change CSS per route:
```coffeescript
# Set default JS and CSS for all routes
FlowRouter.globals.push 
  link:
    twbs: 
      rel: 'stylesheet'
      href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css'
  script:
    twbs: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js'

# Rewrite default JS and CSS, for second route, via controller:
FlowRouter.route '/secondPage',
  name: 'secondPage'
  action: (params, query) -> BlazeLayout.render 'layout', content: 'secondPage'
  link:
    twbs: 
      rel: 'stylesheet'
      href: 'https://maxcdn.bootstrapcdn.com/bootstrap/2.2.0/css/bootstrap.min.css'
  script:
    twbs: 'https://maxcdn.bootstrapcdn.com/bootstrap/2.2.0/js/bootstrap.min.js'

# Rewrite default JS and CSS, for route group:
group = FlowRouter.group 
  link:
    twbs: 
      rel: 'stylesheet'
      href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha/css/bootstrap.min.css'
  script:
    twbs: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha/js/bootstrap.min.js'

group.route '/groupPage1',
  name: 'groupPage1'
  action: (params, query) -> BlazeLayout.render 'layout', content: 'groupPage1'
```

Set only `name` and `content` attributes on `meta` tag:
```coffeescript
FlowRouter.route '/routePath',
  name: 'routeName'
  meta: name: 'content'
```

Set only `rel` and `href` attributes on `link` tag:
```coffeescript
FlowRouter.route '/routePath',
  name: 'routeName'
  link: rel: 'http://...'
```

Set multiple attributes on `meta` tag:
```coffeescript
FlowRouter.route '/routePath',
  name: 'routeName'
  meta:
    uniqueName: 
      name: 'name'
      content: 'content'
      value: 'value'
      'og:prop': 'value'
      itemprop: 'value'
```

Set multiple attributes on `link` tag:
```coffeescript
FlowRouter.route '/routePath',
  name: 'routeName'
  link:
    uniqueName: 
      rel: 'name'
      sizes: 'value'
      href: 'value'
      type: 'value'
```

You can pass functions as value:
```coffeescript
FlowRouter.route '/routePath',
  name: 'routeName'
  meta:
    url:
      property: 'og:url'
      itemprop: 'url'
      content: -> document.location.href
  link:
    canonical: -> document.location.href
```

Use function context (with [`data`](https://github.com/VeliovGroup/flow-router#data-hook) hook):
```coffeescript
FlowRouter.route '/post/:_id',
  name: 'post'
  waitOn: (params) -> [Meteor.subscribe('post', params._id)]
  data: (params) -> Collection.Posts.findOne(params._id)
  meta:
    keywords: 
      name: 'keywords'
      itemprop: 'keywords'
      content: (params, query, data = {}) -> data.keywords
  title: (params, query, data = {}) -> if data then data.title else '404: Page not found'
```

#### Sample config
```coffeescript
FlowRouter.route '/routePath',
  name: 'routeName'
  meta:
    # <meta charset="UTF-8">
    charset:
      charset: 'UTF-8'

    # <meta name="keywords" content="Awes..">
    keywords: 
      name: 'keywords'
      itemprop: 'keywords'
      content: 'Awesome, Meteor, based, app' 
    
    # <meta name="description" itemprop="description" property="og:description" content="Default desc..">
    description:
      name: 'description'
      itemprop: 'description'
      property: 'og:description'
      content:  'Default description'

    image:
      name: 'twitter:image'
      itemprop: 'image'
      property: 'og:image'
      content: 'http://doma..'

    'og:type': 'website'
    'og:title': -> document.title
    'og:site_name': 'My Awesome Site'

    url:
      property: 'og:url'
      itemprop: 'url'
      content: -> window.location.href

    'twitter:card': 'summary'
    'twitter:title': -> document.title
    'twitter:description': 'Default description'
    'twitter:site': 
      name: 'twitter:site'
      value: '@twitterAccountName'
    'twitter:creator': 
      name: 'twitter:creator'
      value: '@twitterAccountName'

    'http-equiv':
      'http-equiv': 'X-UA-Compatible'
      content: 'IE=edge,chrome=1'

    robots: 'index, follow'
    google: 'notranslate'
  

  link:
    # <link href="https://maxcdn.bootstrapcdn.com/..." rel="stylesheet">
    stylesheet: "https://maxcdn.bootstrapcdn.com/bootstrap/2.3.2/css/bootstrap.min.css"

    # <link rel="canonical" href="http://doma..">
    canonical: -> document.location.href

    # <link rel="image" sizes="500x500" href="http://doma..">
    image:
      rel: 'image'
      sizes: '500x500'
      href: 'http://doma..'

    publisher: 'http://plus.google...'

    'shortcut icon':
      rel: 'shortcut icon'
      type: 'image/x-icon'
      href: 'http://domai...'

    'icon':
      rel: 'icon'
      type: 'image/png'
      href: 'http://domai...'

    'apple-touch-icon-144':
      rel: 'apple-touch-icon'
      sizes: '144x144'
      href: 'http://doma..'
    'apple-touch-icon-114':
      rel: 'apple-touch-icon'
      sizes: '114x114'
      href: 'http://doma..'
    'apple-touch-icon-72':
      rel: 'apple-touch-icon'
      sizes: '72x72'
      href: 'http://doma..'
    'apple-touch-icon-57':
      rel: 'apple-touch-icon'
      sizes: '57x57'
      href: 'http://doma..'

  script:
    twbs: 'https://maxcdn.bootstrapcdn.com/bootstrap/2.3.2/js/bootstrap.min.js'
    d3: 
      src: 'https://d3js.org/d3.v3.min.js'
      charset: 'utf-8'
```