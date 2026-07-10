/**
 * @module constants
 * @description Application-wide constants for SETX Football camp registration.
 */

/** @type {string[]} Available shirt sizes. */
export const SHIRT_SIZES = [
  "Youth XS",
  "Youth S",
  "Youth M",
  "Youth L",
  "Youth XL",
  "Adult S",
  "Adult M",
  "Adult L",
  "Adult XL",
  "Adult 2XL",
];

/** @type {number} Price per shirt in USD. */
export const SHIRT_PRICE = 5;

/** @type {string} CashApp handle for payments. */
export const CASHAPP_USERNAME = "SETXYFC";

/** @type {number} Number of days after creation a registration can be edited. */
export const EDIT_WINDOW_DAYS = 3;

/** @type {string[]} Allowed emergency contact relationships. */
export const EMERGENCY_RELATIONS = [
  "Grandparent",
  "Aunt",
  "Uncle",
  "Sibling",
  "Family Friend",
  "Neighbor",
  "Coach",
  "Other",
];

/** @enum {string} Payment status values. */
export const PAYMENT_STATUSES = {
  PENDING: "pending",
  PAID: "paid",
  REFUNDED: "refunded",
};
