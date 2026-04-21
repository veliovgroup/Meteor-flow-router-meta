/* eslint-disable no-new -- tsd exercises constructor signatures */
import { expectAssignable, expectError, expectType } from 'tsd';
import type { Router } from 'meteor/ostrio:flow-router-extra';
import { FlowRouterMeta, FlowRouterTitle } from 'meteor/ostrio:flow-router-meta';

function makeRouter(): Router {
  return {
    globals: [],
    triggers: {
      enter() {},
      exit() {},
    },
  };
}

const router = makeRouter();
const meta = new FlowRouterMeta(router);

expectType<FlowRouterMeta>(meta);
expectAssignable<FlowRouterTitle>(new FlowRouterTitle(router));

expectError(new FlowRouterMeta());
expectError(new FlowRouterMeta('not-a-router'));
