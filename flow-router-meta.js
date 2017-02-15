export { FlowRouterTitle } from 'meteor/ostrio:flow-router-title';

export class FlowRouterMeta {
  constructor(router) {
    const self  = this;
    this.router = router;
    this.router.triggers.enter([this.metaHandler.bind(this)]);
    this.tags = ['link', 'meta', 'script'];

    const _orig = this.router._notfoundRoute;
    this.router._notfoundRoute = function() {
      let _context = {
        route: {
          options: {}
        }
      };

      const notFoundRoute = (self.router.notFound || self.router.notfound || null);
      for (let k = self.tags.length - 1; k >= 0; k--) {
        if (notFoundRoute[self.tags[k]]) {
          _context.route.options[self.tags[k]] = notFoundRoute[self.tags[k]];
        }
      }

      if (!_.isEmpty(self.router._current)) {
        setTimeout(() => {self.metaHandler.call(self, _.extend(self.router._current, _context));}, 5);
      } else {
        setTimeout(() => {self.metaHandler.call(self, _context);}, 5);
      }
      return _orig.apply(this, arguments);
    };
  }

  _fromParent(group, type, _context, _arguments, result = {}) {
    if (group) {
      if (group.options && _.has(group.options, type)) {
        result = _.extend(this._getValue(group.options[type], _context, _arguments), result);
      }

      if (group.parent) {
        result = this._fromParent(group.parent, type, _context, _arguments, result);
      }
    }
    return result;
  }

  _getValue(prop, _context, _arguments) {
    let result = {};
    if (_.isFunction(prop)) {
      result = this._getValue(prop.apply(_context, _arguments), _context, _arguments);
    } else if (_.isString(prop)) {
      result = prop;
    } else if (_.isArray(prop)) {
      for (var i = prop.length - 1; i >= 0; i--) {
        result[i] = this._getValue(prop[i], _context, _arguments, i);
      }
    } else if (_.isObject(prop)) {
      Object.keys(prop).forEach((key) => {
        result[key] = this._getValue(prop[key], _context, _arguments, key);
      });
    } else if (_.isNull(prop)) {
      result = null;
    }
    return result;
  }

  metaHandler(context, redirect, stop, data) {
    let elements = {};
    const _context = _.extend({
      query: context.queryParams,
      params: {}
    }, context);

    const _arguments = [context.params, context.queryParams, data];
    const head = document.getElementsByTagName('head')[0];
    if (!head) {
      return false;
    }

    for (let k = this.tags.length - 1; k >= 0; k--) {
      if (!elements[this.tags[k]]) {
        elements[this.tags[k]] = {};
      }

      if (this.router.globals && this.router.globals.length) {
        for (let i = this.router.globals.length - 1; i >= 0; i--) {
          if (_.has(this.router.globals[i], this.tags[k])) {
            elements[this.tags[k]] = _.extend(elements[this.tags[k]], this._getValue(this.router.globals[i][this.tags[k]], _context, _arguments));
          }
        }
      }

      if (context.route) {
        if (context.route.group) {
          elements[this.tags[k]] = _.extend(elements[this.tags[k]], this._fromParent(context.route.group, this.tags[k], _context, _arguments));
        }

        if (context.route.options) {
          if (_.has(context.route.options, this.tags[k])) {
            elements[this.tags[k]] = _.extend(elements[this.tags[k]], this._getValue(context.route.options[this.tags[k]], _context, _arguments));
          }
        }
      }

      for (let key in elements[this.tags[k]]) {
        let element = head.querySelectorAll(`${this.tags[k]}[data-name="${key}"]`)[0];
        let _stop    = false;
        if (!element) {
          element = document.createElement(this.tags[k]);
          head.appendChild(element);
        }

        if (_.isEmpty(elements[this.tags[k]][key]) || _.isNull(elements[this.tags[k]][key])) {
          head.removeChild(element);
          _stop = true;
        }

        if (!_stop) {
          element.dataset.name = key;
          let attributes = elements[this.tags[k]][key];
          if (_.isString(attributes)) {
            switch (this.tags[k]) {
            case 'meta':
              attributes = {
                content: attributes,
                name: key
              };
              break;
            case 'link':
              attributes = {
                href: attributes,
                rel: key
              };
              break;
            case 'script':
              attributes = {
                src: attributes
              };
              break;
            default:
              attributes = void 0;
              break;
            }
          } else if (_.isObject(attributes)) {
            let defaultAttrs = {};
            switch (this.tags[k]) {
            case 'meta':
              defaultAttrs = {
                name: key
              };
              break;
            case 'link':
              defaultAttrs = {
                rel: key
              };
              break;
            default:
              break;
            }

            attributes = _.extend(defaultAttrs, attributes);
          }

          if (attributes) {
            for (let attrName in attributes) {
              if (_.isString(attributes[attrName])) {
                element.setAttribute(attrName, attributes[attrName]);
              }
            }

            if (element.attributes && element.attributes.length) {
              for (let i = element.attributes.length - 1; i >= 0; i--) {
                if (element.attributes[i].name !== 'data-name' && !_.has(attributes, element.attributes[i].name)) {
                  element.removeAttribute(element.attributes[i].name);
                }
              }
            }

            if (!element.attributes.length || !element.attributes.length) {
              head.removeChild(element);
            }
          }
        }
      }
    }
  }
}
