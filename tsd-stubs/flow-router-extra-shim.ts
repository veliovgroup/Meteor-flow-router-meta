/**
 * Minimal `Router` shape for tsd only (`meteor/ostrio:flow-router-extra` is not an npm package).
 */
export interface Router {
  globals: unknown[];
  triggers: {
    enter: (handlers: unknown[]) => void;
    exit: (handlers: unknown[]) => void;
  };
  _notfoundRoute?: (...args: unknown[]) => unknown;
  _current?: unknown;
  notFound?: { options?: { title?: string }; title?: string };
}
