/**
 * @module shirtOrders
 * @description Single source of truth for how a multi-shirt order is encoded
 * into — and decoded out of — the `shirt_size` text column.
 *
 * The registration form collects structured per-shirt entries (size, recipient,
 * type); the database stores them as one compact string; staff views decode
 * them back into structure. Keeping both directions here prevents the producer
 * and consumer formats from silently drifting apart.
 */

/** @enum {string} Who a shirt is for, as stored in the encoded string. */
export const SHIRT_RECIPIENT_TYPES = { CAMPER: "Camper", FAMILY: "Family" };

/** Normalizes a recipient-type token (form value or stored label) to its label. */
const toRecipientTypeLabel = (type) =>
  String(type).toLowerCase() === "family"
    ? SHIRT_RECIPIENT_TYPES.FAMILY
    : SHIRT_RECIPIENT_TYPES.CAMPER;

/**
 * Encodes structured shirt entries into the stored `shirt_size` string.
 * @param {Array<{size: string, recipient: string, type: string}>} shirts
 * @param {string} fallbackRecipient - Used when a shirt has no recipient name.
 * @returns {string} e.g. "Youth M (John - Camper), Adult L (Mom - Family)"
 */
export const encodeShirtOrders = (shirts, fallbackRecipient) =>
  shirts
    .map((shirt) => {
      const recipient = shirt.recipient.trim() || fallbackRecipient;
      return `${shirt.size} (${recipient} - ${toRecipientTypeLabel(shirt.type)})`;
    })
    .join(", ");

const SHIRT_ENTRY_PATTERN = /^(.+?)\s*\((.+?)\s*-\s*(Camper|Family)\)$/i;

/**
 * Decodes a stored `shirt_size` string into structured entries. Tolerates plain
 * "Youth M" values that predate recipient encoding.
 * @param {string} shirtSize
 * @returns {Array<{size: string, recipient: string|null, type: string|null}>}
 */
export const parseShirtOrders = (shirtSize) => {
  if (!shirtSize) return [];
  return shirtSize.split(",").map((part) => {
    const trimmed = part.trim();
    const match = trimmed.match(SHIRT_ENTRY_PATTERN);
    if (match) {
      return { size: match[1].trim(), recipient: match[2].trim(), type: match[3] };
    }
    return { size: trimmed, recipient: null, type: null };
  });
};
