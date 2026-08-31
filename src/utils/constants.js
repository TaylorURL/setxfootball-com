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

/**
 * @type {string} The camp's phone number. Written the same way everywhere it
 * appears, including the `tel:` href and the structured data, because search
 * engines match a business citation on the exact name, address and phone.
 */
export const CAMP_PHONE = "+1-936-641-0681";

/** @type {string} The camp's contact email. */
export const CAMP_EMAIL = "hanksclayton81@gmail.com";

/** @type {string} The town the camp is held in. */
export const CAMP_LOCALITY = "Daisetta";

/**
 * @type {string} The season the camp runs, as every page writes it. Held here
 * rather than in each page, because the year appeared in nine places and a
 * season rolled in eight of them leaves the ninth advertising a date that has
 * already passed.
 */
export const CAMP_SEASON = "July 2027";

/** @type {string} The calendar year of {@link CAMP_SEASON}. */
export const CAMP_YEAR = "2027";

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
