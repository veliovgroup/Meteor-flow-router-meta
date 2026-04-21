import type { Router } from 'meteor/ostrio:flow-router-extra';

/**
 * Client-only: registers a `triggers.enter` handler on the given router to sync
 * `<head>` `meta`, `link`, and `script` tags from `FlowRouter.globals`, group
 * options, and route options (including not-found handling).
 */
export class FlowRouterMeta {
  constructor(router: Router);
}

export { FlowRouterTitle } from 'meteor/ostrio:flow-router-title';
