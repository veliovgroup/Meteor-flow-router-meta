class FlowRouterMeta
  constructor: (@router) -> 
    _self     = @
    @defaults = {}

    if @router.globals.length
      for option in @router.globals
        if _.isObject option
          @setDefaults 'meta', option.meta     if _.has option, 'meta'
          @setDefaults 'link', option.link     if _.has option, 'link'
          @setDefaults 'script', option.script if _.has option, 'script'


    @metaHandler = (context, redirect, stop, data) =>
      existent   = []
      used       = []
      _context   = _.extend context, {query: context.queryParams}
      _arguments = [context.params, context.queryParams, data]
      $('[data-link-name]').each -> existent.push "link-#{$(@).attr('data-link-name')}"
      $('[data-meta-name]').each -> existent.push "meta-#{$(@).attr('data-meta-name')}"
      $('[data-script-name]').each -> existent.push "script-#{$(@).attr('data-script-name')}"

      for type in ['link', 'meta', 'script']
        value = {}
        if @defaults?[type]
          _def  = @defaults[type]
          _def  = _def.apply _context, _arguments if _.isFunction _def
          value = _.clone _def

        if context.route?.group?.options?[type]
          _crgo = context.route.group.options[type]
          _crgo = _crgo.apply _context, _arguments if _.isFunction _crgo
          value = _.extend value, _.clone _crgo

        if context.route?.options?[type]
          _cro  = context.route.options[type]
          _cro  = _cro.apply _context, _arguments if _.isFunction _cro
          value = _.extend value, _.clone _cro

        if not _.isEmpty value
          used = _.union used, @traverse type, value, context, data

      toRemove = _.difference existent, used
      for attr in toRemove
        _attr = attr.split '-'
        $(_attr[0] + '[data-' + _attr[0] + '-name="' + _attr[1] + '"]').remove()
    
    @router.triggers.enter [@metaHandler]

    _orig = @router._notfoundRoute
    @router._notfoundRoute = (context) ->
      _NFRcontext = route: options: {}
      for type in ['link', 'meta', 'script']
        _NFRcontext.route.options[type] = (_self.router.notFound or _self.router.notfound)?[type]
      if not _.isEmpty _self.router._current
        Meteor.setTimeout ->
          _self.metaHandler _.extend _self.router._current, _.clone _NFRcontext
        , 2
      else
        Meteor.setTimeout ->
          _self.metaHandler _.clone _NFRcontext
        , 2
      _orig.apply @, arguments

  updateNode: (type, name, values, context, data) ->
    change      = false
    currentNode = false
    _context    = _.extend context, {query: context.queryParams}
    _arguments  = [context.params, context.queryParams, data]

    if $('head').has(type + '[data-' + type + '-name="' + name + '"]')[0]
      currentNode = $ type + '[data-' + type + '-name="' + name + '"]'

    if currentNode
      for attrName, content of values
        content = content.apply _context, _arguments if _.isFunction content

        if currentNode.attr(attrName) isnt content
          if content
            currentNode.attr attrName, content 
          else
            currentNode.removeAttr attrName 
    else
      element = $ '<' + type + ' data-' + type + '-name="' + name + '">'
      for attrName, content of values
        content = content.apply _context, _arguments if _.isFunction content
        element.attr attrName, content if content
      $('head').prepend element

  traverse: (type, settings, context, data) ->
    used       = []
    _context   = _.extend context, {query: context.queryParams}
    _arguments = [context.params, context.queryParams, data]
    settings   = settings.apply _context, _arguments if _.isFunction settings

    for name, values of settings
      values = values.apply _context, _arguments if _.isFunction values
      if _.isString values
        values = {content: values, name: name} if type is 'meta'
        values = {href: values, rel: name} if type is 'link'
        values = {src: values} if type is 'script'
      used.push "#{type}-#{name}"
      @updateNode type, name, values, context, data
    return used

  setDefaults: (type, settings) -> @defaults[type] = settings