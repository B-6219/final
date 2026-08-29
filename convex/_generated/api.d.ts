/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as addresses from "../addresses.js";
import type * as bikes from "../bikes.js";
import type * as brands from "../brands.js";
import type * as categories from "../categories.js";
import type * as coupons from "../coupons.js";
import type * as notifications from "../notifications.js";
import type * as orders from "../orders.js";
import type * as ratings from "../ratings.js";
import type * as recentlyViewed from "../recentlyViewed.js";
import type * as reviews from "../reviews.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";
import type * as vehicles from "../vehicles.js";
import type * as wishlist from "../wishlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  addresses: typeof addresses;
  bikes: typeof bikes;
  brands: typeof brands;
  categories: typeof categories;
  coupons: typeof coupons;
  notifications: typeof notifications;
  orders: typeof orders;
  ratings: typeof ratings;
  recentlyViewed: typeof recentlyViewed;
  reviews: typeof reviews;
  seed: typeof seed;
  users: typeof users;
  vehicles: typeof vehicles;
  wishlist: typeof wishlist;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
