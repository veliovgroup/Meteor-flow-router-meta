# Agent notes: `ostrio:flow-router-meta`

Use when **editing this package**, **wiring head tags in Meteor apps** with `ostrio:flow-router-extra`, or **debugging `<head>` / SEO / JSON-LD** on the client. Upstream canonical repo: [Meteor-flow-router-meta](https://github.com/veliovgroup/Meteor-flow-router-meta). Companion router doc: `ostrio:flow-router-extra` (`flow-router` repo `AGENTS.md`).

---

## Package identity

| Item | Detail |
|------|--------|
| **Atmosphere** | `ostrio:flow-router-meta` — [Atmosphere](https://atmospherejs.com/ostrio/flow-router-meta) |
| **Version** | `Package.describe` in **`package.js`** (keep README compatibility in sync when releasing) |
| **Arch** | **Client-only** — `api.mainModule('flow-router-meta.js', 'client')`; no server entry |
| **Role** | Syncs `<head>` **`meta`**, **`link`**, **`script`** from Flow Router **route / group / globals** options |
| **Implies** | `ostrio:flow-router-title@3.5.0` — re-exports **`FlowRouterTitle`** from `meteor/ostrio:flow-router-meta` so apps can use one import line |

### Peer expectations (apps)

- Router: **`ostrio:flow-router-extra@3.13.0+`** (constructor takes same **`FlowRouter`** / **`Router`** instance you use for routes).
- Typings: optional **`zodern:types`** + app **`typescript`** (weak in package); published **`index.d.ts`** is a **client asset** (`api.addAssets('index.d.ts', 'client')`).
- **`FlowRouterMeta` / `FlowRouterTitle`**: construct from **client** code after routes exist (same as `mainModule`).

---

## `package.js` surface

| Item | Detail |
|------|--------|
| **Meteor** | `api.versionsFrom(['1.4', '2.8.0', '3.0.1', '3.4'])` |
| **Use** | `ecmascript`, `ostrio:flow-router-title@3.5.0` on **client** |
| **Weak** | `zodern:types@1.0.13`, `typescript` on **client** |
| **Tests** | `Package.onTest`: `tinytest`, `jquery`, `random`, `ostrio:flow-router-extra@3.13.0`, `ostrio:flow-router-title@3.5.0`, **`tests.js`** on client |

---

## Repo / file layout (upstream mirror)

| Path | Role |
|------|------|
| **`flow-router-meta.js`** | `FlowRouterMeta` class, exports `FlowRouterTitle` re-export |
| **`index.d.ts`** | `FlowRouterMeta(router: Router)` + `FlowRouterTitle` re-export (`Router` from `meteor/ostrio:flow-router-extra`) |
| **`tests.js`** | Tinytest: globals, routes, `null` unset, nested groups, `application/ld+json`, `FlowRouter.notFound` vs catch-all `*` |
| **`README.md`** | User-facing API, examples, `meteor test-packages` instructions |

---

## Public API

```js
import { FlowRouterMeta, FlowRouterTitle } from 'meteor/ostrio:flow-router-meta';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// After all FlowRouter.route / group definitions:
new FlowRouterMeta(FlowRouter);
new FlowRouterTitle(FlowRouter);
```

- **`new FlowRouterMeta(router)`** — registers **`router.triggers.enter`** with **`metaHandler`**; wraps **`router._notfoundRoute`** so 404 / not-found still runs head sync.
- Does **not** monkey-patch **`FlowRouter.route`** / **`group`** — reads **`context.route.options`**, **`context.route.group`**, **`router.globals`** at enter time.

Allowed option keys (same shapes on **`FlowRouter.route`**, **`FlowRouter.group`**, objects in **`FlowRouter.globals.push({...})`**):

- **`meta`**, **`link`**, **`script`** — each: plain object, **`(params, queryParams, data) => object`**, or (for leaf values) nested functions resolved by **`_getValue`**.
- Per-key values: string shorthand, attribute object, or functions; **`null`** or empty resolved object removes that **logical key**’s DOM node (see **`tests.js`** “Unset via null”).

---

## How it attaches to the router

1. **`triggers.enter`** — **`metaHandler(context, _redirect, _stop, data)`** receives **`data`** from the route **`data()`** hook (same idea as title package). Fourth argument is what Flow Router passes into enter triggers after data resolves.
2. **`_notfoundRoute` wrap** — copies **`meta` / `link` / `script`** from **`FlowRouter.notFound`** or **`FlowRouter.notfound`** (object or **`options`** sub-object) into a synthetic **`context.route.options`**, then calls **`metaHandler`** on a **`setTimeout(..., 5)`** (with or without merging **`router._current`**). Supports both catch-all **`FlowRouter.route('*', …)`** and legacy **`FlowRouter.notFound = { … }`** (see README “404 / notFound compatibility”).
3. **Debounce** — **`metaHandler`** clears/restarts a **5ms** timer so rapid navigations coalesce to one DOM pass.

---

## Merge and resolution order (implementation)

Source: **`_setTags`** in **`flow-router-meta.js`**.

1. **`FlowRouter.globals`** — array iterated **from last index down to `0`**. Each object’s `meta` / `link` / `script` is merged with **`Object.assign({}, previous, resolved)`**, so **earlier `globals.push()` wins** over later pushes for the same logical key.
2. **Group** — **`_fromParent(context.route.group, tagType, …)`**: walks **`group.parent`** chain. If a group’s **`options`** has the tag key (`meta`, `link`, or `script`), that branch **returns immediately** with **`Object.assign({}, resolvedGroupValue, result)`** (default **`result`** `{}`). So the **innermost group that defines that tag type** supplies the group contribution for that tag family — not a deep merge of every ancestor’s separate `meta` objects. Nested routes that only override part of SEO often rely on **route-level** `meta`, **globals**, or repeating keys on the child group.
3. **Route** — **`context.route.options[tagType]`** merged last (**route wins** over globals + group for same logical keys).

**Logical names** — object keys under `meta` / `link` / `script` (e.g. `description`, `canonical`, `ldjson`). DOM nodes get **`data-name="<key>"`** for idempotent updates.

**Stale keys** — the update loop only iterates keys present in the **merged** `elements[tagType]` object. Logical keys **absent** from the merged result are **not** automatically removed on navigation; use **`null`** (or empty resolved value) for a logical name to remove its tag. See **`tests.js`** for explicit unsets.

---

## Attribute shorthand (`_getAttrs`)

| Tag | String value for key `K` | Object value |
|-----|---------------------------|--------------|
| **`meta`** | `name="K"`, `content="<string>"` | Defaults **`name: K`**, then spreads your attrs (override `name` / `content` as needed) |
| **`link`** | `rel="K"`, `href="<string>"` | Defaults **`rel: K`**, then spreads attrs |
| **`script`** | `src="<string>"` | Object used as-is (no default `rel`/`name`) |

**`innerHTML`** — special-cased: sets **`element.innerHTML`** (used for **`type: 'application/ld+json'`** + JSON string). Other attrs use **`setAttribute`**.

**Cleanup** — after applying attrs, attributes not in the resolved object (except **`data-name`**) are **removed** from the element.

**Types** — only **string** attribute values are applied (non-strings skipped in the attr loop).

---

## `_getValue` (functions & nesting)

- Functions receive **`_arguments`** = **`[context.params, context.queryParams, data]`**; **`this`** inside handlers is **`_context`** (merged from `context` with **`query`** alias for `queryParams`).
- Resolves **nested** functions on objects/arrays recursively.
- **`null`** propagates; used to drop a keyed tag.

---

## Practical constraints (tell users / agents)

- **Client-only** — no SSR head injection from this package; for SSR SEO use Fast Render / prerender / server head separately.
- **CSS/JS `link`/`script`** — tags can be removed from DOM on route change, but **loaded scripts and styles stay in memory**; README warns you cannot fully “unload” global side effects.
- **Initialization order** — define routes (including **`*`** 404 if used) and **globals**, then **`new FlowRouterMeta` / `new FlowRouterTitle`** (typically end of client router module).

---

## TypeScript

- Import **`Router`** type from **`meteor/ostrio:flow-router-extra`** in the app so **`FlowRouterMeta`** constructor resolves.
- Package **`index.d.ts`** documents **client-only** behavior.

---

## Running tests (maintainers)

From package root (versions must satisfy **`package.onTest`** constraints):

```bash
meteor test-packages ./
# meteor test-packages ./ --port 8888
```

Uses **Tinytest** + **`tests.js`** (jQuery selectors on `document`).

Type-only assertions (**`tsd`**): `npm install` once, then **`npm run test:tsd`** (checks **`index.d.ts`** vs **`index.test-d.ts`**; stubs under **`tsd-stubs/`** replace Meteor **`meteor/*`** modules).

---

## Related

- **`ostrio:flow-router-title`** — document title; implied and re-exported here.
- **`ostrio:flow-router-extra`** — routing, `globals`, `data()`, triggers, not-found APIs.
