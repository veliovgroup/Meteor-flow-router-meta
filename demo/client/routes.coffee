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

FlowRouter.notFound = 
  action: -> BlazeLayout.render '_layout', content: '_404'
  title: '404: Page not found'
  meta: description: "Non-existent route"

FlowRouter.route '/'
,
  name: 'index'
  action: -> BlazeLayout.render '_layout', content: 'index', rand: Random.id()

FlowRouter.route '/secondPage'
,
  name: 'secondPage'
  title: 'Second Page title'
  meta: description: "Second Page description"
  link:
    twbs: 
      rel: 'stylesheet'
      href: 'https://maxcdn.bootstrapcdn.com/bootstrap/2.2.0/css/bootstrap.min.css'
  script: twbs: 'https://maxcdn.bootstrapcdn.com/bootstrap/2.2.0/js/bootstrap.min.js'
  action: -> BlazeLayout.render '_layout', content: 'secondPage', rand: Random.id()

FlowRouter.route '/thirdPage/:something'
,
  name: 'thirdPage'
  title: -> "Third Page Title > #{@params.something}"
  action: (params, query) -> BlazeLayout.render '_layout', content: 'thirdPage', rand: params.something

group = FlowRouter.group 
  prefix: '/group'
  title: "GROUP TITLE"
  titlePrefix: 'Group > '
  link:
    twbs:
      rel: 'stylesheet'
      href: "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha/css/bootstrap.min.css"
  script: twbs: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha/js/bootstrap.min.js'

group.route '/groupPage1/'
,
  name: 'groupPage1'
  action: (params, query) -> BlazeLayout.render '_layout', content: 'groupPage1', rand: Random.id()

group.route '/groupPage2/'
,
  name: 'groupPage2'
  title: 'Group page 2'
  action: (params, query) -> BlazeLayout.render '_layout', content: 'groupPage2', rand: Random.id()

FlowRouter.route '/post',
  name: 'post'
  title: (params, query, post) -> post?.title
  action: (params, query, post) -> BlazeLayout.render '_layout', content: 'post', post: post, rand: Random.id
  waitOn: -> [Meteor.subscribe('posts')]
  data: -> Collections.posts.findOne()
  whileWaiting: -> BlazeLayout.render '_layout', content: '_loading'
  meta: (params, query, post) ->
    keywords: post?.keywords
    description: post?.description

new FlowRouterMeta FlowRouter
new FlowRouterTitle FlowRouter