FlowRouter.globals.push title: 'Default title'
FlowRouter.globals.push
  link:
    twbs: 
      rel: 'stylesheet'
      href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css'
    canonical:
      rel: 'canonical'
      itemprop: 'url'
      href: -> Meteor.absoluteUrl (FlowRouter.current().path or document.location.pathname).replace /^\//g, ''

FlowRouter.globals.push
  script: twbs: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js'

FlowRouter.globals.push
  meta: 
    description:
      name:     'description'
      content:  'Default Demo FlowRouterMeta description'
      property: 'og:description'

FlowRouter.notFound = 
  action: ->
    @render '_layout', '_404', rand: Random.id()
    return
  title: '404: Page not found'
  meta: 
    robots: 'noindex, nofollow'
    description: 'Non-existent route'

FlowRouter.route '/',
  name: 'index'
  action: ->
    @render '_layout', 'index', rand: Random.id()
    return

FlowRouter.route '/secondPage',
  name: 'secondPage'
  title: 'Second Page title'
  meta: description: 'Second Page description'
  link:
    twbs: 
      rel: 'stylesheet'
      href: 'https://maxcdn.bootstrapcdn.com/bootstrap/2.2.0/css/bootstrap.min.css'
  script: twbs: 'https://maxcdn.bootstrapcdn.com/bootstrap/2.2.0/js/bootstrap.min.js'
  action: ->
    @render '_layout', 'secondPage', rand: Random.id()
    return

FlowRouter.route '/thirdPage/:something',
  name: 'thirdPage'
  title: (params) -> "Third Page Title > #{params.something}"
  action: (params) ->
    @render '_layout', 'thirdPage', rand: params.something
    return

group = FlowRouter.group 
  prefix: '/group'
  title: 'GROUP TITLE'
  titlePrefix: 'Group > '
  link:
    twbs:
      rel: 'stylesheet'
      href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha/css/bootstrap.min.css'
  script: 
    twbs: 
      src: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha/js/bootstrap.min.js'
      type: 'text/javascript'
      defer: true
      async: true
  meta: description: 'Group description'

group.route '/groupPage1',
  name: 'groupPage1'
  action: (params, query) ->
    @render '_layout', 'groupPage1', rand: Random.id()
    return

group.route '/groupPage2',
  name: 'groupPage2'
  title: 'Group page 2'
  action: (params, query) ->
    @render '_layout', 'groupPage2', rand: Random.id()
    return
  meta: description: 'Overridden group description by group member route'

FlowRouter.route '/post',
  name: 'post'
  title: (params, query, post) -> post?.title
  action: (params, query, post) ->
    @render '_layout', 'post', post: post, rand: Random.id()
    return
  waitOn: -> [Meteor.subscribe('posts')]
  data: -> Collections.posts.findOne()
  whileWaiting: ->
    @render '_layout', '_loading'
    return
  meta: (params, query, post) ->
    keywords: post?.keywords
    description: post?.description

new FlowRouterMeta FlowRouter
new FlowRouterTitle FlowRouter