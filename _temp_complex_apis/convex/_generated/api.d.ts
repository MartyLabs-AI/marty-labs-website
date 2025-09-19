/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as billing from "../billing.js";
import type * as conversations from "../conversations.js";
import type * as files from "../files.js";
import type * as flows from "../flows.js";
import type * as generationCleanup from "../generationCleanup.js";
import type * as generationCleanupImpl from "../generationCleanupImpl.js";
import type * as generations from "../generations.js";
import type * as http from "../http.js";
import type * as migrations_fixSubscriptions from "../migrations/fixSubscriptions.js";
import type * as seedPlans from "../seedPlans.js";
import type * as subscriptions from "../subscriptions.js";
import type * as updateLipsyncFlow from "../updateLipsyncFlow.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  billing: typeof billing;
  conversations: typeof conversations;
  files: typeof files;
  flows: typeof flows;
  generationCleanup: typeof generationCleanup;
  generationCleanupImpl: typeof generationCleanupImpl;
  generations: typeof generations;
  http: typeof http;
  "migrations/fixSubscriptions": typeof migrations_fixSubscriptions;
  seedPlans: typeof seedPlans;
  subscriptions: typeof subscriptions;
  updateLipsyncFlow: typeof updateLipsyncFlow;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
