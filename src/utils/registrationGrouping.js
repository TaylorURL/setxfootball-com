/**
 * @module registrationGrouping
 * @description Domain logic for collapsing multiple shirt orders that belong to
 * the same family + camper into a single combined row for staff views.
 *
 * Pure functions, no React or data-access concerns — a registration in, a
 * grouped structure out.
 */
import { PAYMENT_STATUSES } from "./constants";

/** Lowercases, trims, and collapses internal whitespace for loose comparison. */
const normalize = (value) => (value || "").toLowerCase().trim().replace(/\s+/g, " ");

/**
 * Whether two camper names are close enough to be treated as the same child:
 * an exact match, one containing the other, or any shared name part (>2 chars).
 */
const namesMatch = (a, b) => {
  const left = normalize(a);
  const right = normalize(b);
  if (left === right) return true;
  if (left.includes(right) || right.includes(left)) return true;
  const rightParts = right.split(" ");
  return left.split(" ").some((part) => part.length > 2 && rightParts.includes(part));
};

/** Derives a combined payment status from a set of orders. */
const combinedStatus = (orders) => {
  const isPaid = (order) => order.payment_status === PAYMENT_STATUSES.PAID;
  if (orders.every(isPaid)) return "paid";
  if (orders.some(isPaid)) return "partial";
  return "pending";
};

/** Buckets a family's registrations into sub-groups of the same camper. */
const groupByCamper = (registrations) => {
  const subGroups = [];
  for (const registration of registrations) {
    const match = subGroups.find((group) => namesMatch(registration.kid_name, group[0].kid_name));
    if (match) match.push(registration);
    else subGroups.push([registration]);
  }
  return subGroups;
};

/** Builds the combined-row view model for one camper's orders. */
const toGroup = (email, orders) => {
  const sorted = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return {
    key: `${email}|${normalize(sorted[0].kid_name)}`,
    orders: sorted,
    primary: sorted[0],
    hasMultiple: sorted.length > 1,
    combined: {
      totalShirts: sorted.reduce((sum, order) => sum + (order.shirt_quantity || 0), 0),
      totalCost: sorted.reduce((sum, order) => sum + (order.total_cost || 0), 0),
      status: combinedStatus(sorted),
      sizes: sorted.map((order) => `${order.shirt_size} x${order.shirt_quantity}`),
    },
  };
};

/**
 * Groups registrations by parent email and similar camper name so that multiple
 * shirt orders for the same child collapse into one combined row.
 * @param {Array<object>} registrations
 * @returns {Array<object>} Combined-row view models.
 */
export const groupOrders = (registrations) => {
  const byEmail = new Map();
  for (const registration of registrations) {
    const email = normalize(registration.parent_email);
    if (!byEmail.has(email)) byEmail.set(email, []);
    byEmail.get(email).push(registration);
  }

  const groups = [];
  for (const [email, registrations] of byEmail) {
    for (const camperOrders of groupByCamper(registrations)) {
      groups.push(toGroup(email, camperOrders));
    }
  }
  return groups;
};
