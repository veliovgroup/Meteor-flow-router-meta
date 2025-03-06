export { FlowRouterTitle } from 'meteor/ostrio:flow-router-title';

const helpers = {
  isObject(obj) {
    if (obj === null || this.isArray(obj) || this.isFunction(obj)) {
      return false;
    }
    return obj === Object(obj);
  },
  isArray(obj) {
    return Array.isArray(obj);
  },
  isFunction(obj) {
    return typeof obj === 'function';
  },
  isEmpty(obj) {
    if (this.isDate(obj)) {
      return false;
    }
    if (this.isObject(obj)) {
      return !Object.keys(obj).length;
    }
    if (this.isArray(obj) || this.isString(obj)) {
      return !obj.length;
    }
    return false;
  },
  has(obj, path) {
    if (!this.isObject(obj)) {
      return false;
    }
    if (!this.isArray(path)) {
      return this.isObject(obj) && Object.prototype.hasOwnProperty.call(obj, path);
    }
    return false;
  },
  isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
  },
  isDate(obj) {
    return Object.prototype.toString.call(obj) === '[object Date]';
  }
};

export class FlowRouterMeta {
  constructor(router) {
    const self = this;
    this.metaSetTimer = null;
    this.router = router;
    this.router.triggers.enter([this.metaHandler.bind(this)]);
    this.tags = ['link', 'meta', 'script'];

    const _orig = this.router._notfoundRoute;
    this.router._notfoundRoute = function () {
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

      if (!helpers.isEmpty(self.router._current)) {
        setTimeout(() => {
          self.metaHandler.call(self, Object.assign({}, self.router._current, _context));
        }, 5);
      } else {
        setTimeout(() => {
          self.metaHandler.call(self, _context);
        }, 5);
      }
      return _orig.apply(this, arguments);
    };
  }

  _fromParent(group, type, _context, _arguments, result = {}) {
    if (group) {
      if (group.options && helpers.has(group.options, type)) {
        return Object.assign({}, this._getValue(group.options[type], _context, _arguments), result);
      }
      if (group.parent) {
        return this._fromParent(group.parent, type, _context, _arguments, result);
      }
    }
    return result;
  }

  _getValue(prop, _context, _arguments) {
    if (helpers.isFunction(prop)) {
      return this._getValue(prop.apply(_context, _arguments), _context, _arguments);
    }
    if (helpers.isString(prop)) {
      return prop;
    }
    if (helpers.isArray(prop)) {
      return prop.reduce((acc, propVal, index) => {
        acc[index] = this._getValue(propVal, _context, _arguments);
        return acc;
      }, {});
    }
    if (helpers.isObject(prop)) {
      return Object.keys(prop).reduce((acc, key) => {
        acc[key] = this._getValue(prop[key], _context, _arguments);
        return acc;
      }, {});
    }
    if (prop === null) {
      return null;
    }
    return {};
  }

  _setTags(head, context, data) {
    this.metaSetTimer = null;

    const elements = {};
    const _context = Object.assign({}, { query: context.queryParams, params: {} }, context);
    const _arguments = [context.params, context.queryParams, data];

    for (let k = this.tags.length - 1; k >= 0; k--) {
      if (!elements[this.tags[k]]) {
        elements[this.tags[k]] = {};
      }

      if (this.router.globals && this.router.globals.length) {
        for (let i = this.router.globals.length - 1; i >= 0; i--) {
          if (helpers.has(this.router.globals[i], this.tags[k])) {
            elements[this.tags[k]] = Object.assign({}, elements[this.tags[k]], this._getValue(this.router.globals[i][this.tags[k]], _context, _arguments));
          }
        }
      }

      if (context.route) {
        if (context.route.group) {
          elements[this.tags[k]] = Object.assign({}, elements[this.tags[k]], this._fromParent(context.route.group, this.tags[k], _context, _arguments));
        }

        if (context.route.options) {
          if (helpers.has(context.route.options, this.tags[k])) {
            elements[this.tags[k]] = Object.assign({}, elements[this.tags[k]], this._getValue(context.route.options[this.tags[k]], _context, _arguments));
          }
        }
      }

      // eslint-disable-next-line guard-for-in
      for (const key in elements[this.tags[k]]) {
        let element = head.querySelectorAll(`${this.tags[k]}[data-name="${key}"]`)[0];
        if (elements[this.tags[k]][key] === null || helpers.isEmpty(elements[this.tags[k]][key])) {
          if (element) {
            head.removeChild(element);
          }
          continue;
        }

        if (!element) {
          element = document.createElement(this.tags[k]);
          head.appendChild(element);
        }

        element.dataset.name = key;
        let attributes = elements[this.tags[k]][key];
        if (helpers.isString(attributes)) {
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
        } else if (helpers.isObject(attributes)) {
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

          attributes = Object.assign({}, defaultAttrs, attributes);
        }

        if (!attributes) {
          continue;
        }

        for (const attrName in attributes) {
          if (helpers.isString(attributes[attrName])) {
            if (attrName === 'innerHTML') {
              element.innerHTML = attributes[attrName];
            } else {
              element.setAttribute(attrName, attributes[attrName]);
            }
          }
        }

        if (element.attributes && element.attributes.length) {
          for (let i = element.attributes.length - 1; i >= 0; i--) {
            if (element.attributes[i].name !== 'data-name' && !helpers.has(attributes, element.attributes[i].name)) {
              element.removeAttribute(element.attributes[i].name);
            }
          }
        }

        if (element.attributes.length === 0) {
          head.removeChild(element);
        }
      }
    }
  }

  metaHandler(context, _redirect, _stop, data) {
    const head = document.getElementsByTagName('head')[0];
    if (!head) {
      return;
    }

    if (this.metaSetTimer) {
      clearTimeout(this.metaSetTimer);
    }

    this.metaSetTimer = setTimeout(() => {
      this._setTags(head, context, data);
    }, 5);
  }
}
