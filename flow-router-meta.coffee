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
      existent = []
      used = []
      $('[data-link-name]').each -> existent.push "link-#{$(@).attr('data-link-name')}"
      $('[data-meta-name]').each -> existent.push "meta-#{$(@).attr('data-meta-name')}"
      $('[data-script-name]').each -> existent.push "script-#{$(@).attr('data-script-name')}"

      for type in ['link', 'meta', 'script']
        value = {}
        value = _.clone @defaults[type] if @defaults?[type]
        value = _.extend value, _.clone context.route.group.options[type] if context.route?.group?.options?[type]
        value = _.extend value, _.clone context.route.options[type] if context.route?.options?[type]
        if not _.isEmpty value
          used = _.union used, @traverse type, value, context, data

      toRemove = _.difference existent, used
      for attr in toRemove
        _attr = attr.split '-'
        $(_attr[0] + '[data-' + _attr[0] + '-name="' + _attr[1] + '"]').remove()
    
    @router.triggers.enter [@metaHandler]

    _orig = @router._notfoundRoute
    @router._notfoundRoute = (context) ->
      for type in ['link', 'meta', 'script']
        _context = route: options: {}
        _context.route.options[type] = _self.router.notFound?[type]
        if not _.isEmpty _self.router._current
          _self.metaHandler _.extend _self.router._current, _context
        else
          _self.metaHandler _context
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