export class FlowRouterMeta
  constructor: (@router) -> 
    _self     = @
    @defaults = {}

    if @router.globals.length
      for option in @router.globals
        if _.isObject option
          @setDefaults 'meta',   option.meta   if _.has option, 'meta'
          @setDefaults 'link',   option.link   if _.has option, 'link'
          @setDefaults 'script', option.script if _.has option, 'script'

    @metaHandler = (context, redirect, stop, data) =>
      head       = document.getElementsByTagName('head')?[0]
      _context   = _.extend context, {query: context.queryParams}
      _arguments = [context.params, context.queryParams, data]

      for type in ['link', 'meta', 'script']
        existent = []
        used     = []
        if head
          _oldElements = head.querySelectorAll "#{type}[data-name]"
          if _oldElements.length
            _.each _oldElements, (element) -> existent.push element.dataset.name

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

        unless _.isEmpty value
          used = @traverse type, value, context, data

        if used.length and existent.length
          for name in _.difference existent, used
            _element = head.querySelector "#{type}[data-name=\"#{name}\"]"
            head.removeChild(_element) if _element
    
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
    head = document.getElementsByTagName('head')?[0]
    if head
      _context    = _.extend context, {query: context.queryParams}
      _arguments  = [context.params, context.queryParams, data]
      currentNode = head.querySelector(type + '[data-name="' + name + '"]')
      if currentNode
        usedAttrs   = ['data-name']
        oldAttrs    = []
        _attributes = currentNode.attributes
        if _attributes.length
          i = _attributes.length
          while i-- > 0
            oldAttrs.push _attributes[i].name
        
        for attrName, content of values
          content = content.apply _context, _arguments if _.isFunction content
          if content
            usedAttrs.push attrName
            if content isnt currentNode.getAttribute attrName
              currentNode.setAttribute attrName, content

        if usedAttrs.length and oldAttrs.length
          for attrName in _.difference oldAttrs, usedAttrs
            currentNode.removeAttribute attrName
      else
        element = document.createElement type
        element.dataset['name'] = name
        for attrName, content of values
          content = content.apply _context, _arguments if _.isFunction content
          element.setAttribute(attrName, content) if content
        head.appendChild element

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
      used.push name
      @updateNode type, name, values, context, data
    return used

  setDefaults: (type, settings) -> @defaults[type] = settings