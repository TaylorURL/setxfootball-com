/**
 * Shared presentational pieces for the StaffPanel, used by both the desktop
 * table and the mobile card list: the payment toggle, per-shirt recipient
 * lines, an individual order row, and the expanded contact/order detail.
 */
import { Shirt } from "lucide-react";
import {
  Card,
  Button,
  Badge,
  Separator,
  Text,
  Eyebrow,
} from "@bradley-t-t/sunday-design-system";
import { formatDate, formatCurrency } from "../../utils/helpers";
import { parseShirtOrders } from "../../utils/shirtOrders";

/** Combined-status badge tones and labels, keyed by grouped order status. */
export const GROUP_STATUS = {
  paid: { tone: "positive", label: "All Paid" },
  partial: { tone: "accent", label: "Partial" },
  pending: { tone: "warning", label: "Pending" },
};

export const PaymentToggle = ({ status, busy, onToggle }) => {
  const paid = status === "paid";
  return (
    <Button variant="ghost" size="xs" className="px-0" loading={busy} onClick={onToggle}>
      <Badge tone={paid ? "positive" : "warning"} variant="soft" dot>
        {paid ? "Paid" : "Pending"}
      </Badge>
    </Button>
  );
};

const RecipientLine = ({ detail }) => (
  <div className="flex flex-wrap items-center gap-1.5">
    <Text size="xs" weight="medium" as="span">
      {detail.size}
    </Text>
    <span className="text-ds-text-faint">—</span>
    <Text size="xs" tone="muted" as="span">
      {detail.recipient}
    </Text>
    {detail.type && (
      <Badge tone={detail.type.toLowerCase() === "camper" ? "indigo" : "violet"} variant="soft" size="sm">
        {detail.type}
      </Badge>
    )}
  </div>
);

export const OrderLine = ({ reg, primary, busy, onToggle }) => {
  const namesDiffer = reg.kid_name.trim().toLowerCase() !== primary.kid_name.trim().toLowerCase();
  const shirtDetails = parseShirtOrders(reg.shirt_size);
  const hasRecipients = shirtDetails.some((detail) => detail.recipient);
  return (
    <Card variant="outline" padding="sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Text size="sm" tone="muted" as="span" className="inline-flex items-center gap-1.5">
            <Shirt className="h-3.5 w-3.5 text-ds-text-faint" />
            {hasRecipients ? shirtDetails.map((detail) => detail.size).join(", ") : reg.shirt_size} x
            {reg.shirt_quantity}
          </Text>
          <Text size="sm" weight="semibold" as="span">
            {formatCurrency(reg.total_cost)}
          </Text>
          <Text size="xs" tone="faint" as="span">
            {formatDate(reg.created_at)}
          </Text>
        </div>
        <PaymentToggle status={reg.payment_status} busy={busy} onToggle={onToggle} />
      </div>
      {hasRecipients && (
        <div className="mt-2 space-y-1 pl-[22px]">
          {shirtDetails.map(
            (detail, index) => detail.recipient && <RecipientLine key={index} detail={detail} />,
          )}
        </div>
      )}
      {namesDiffer && !hasRecipients && (
        <Text size="xs" tone="faint" className="mt-1.5 pl-[22px]">
          Registered as: <span className="font-medium text-ds-text-muted">{reg.kid_name}</span>
        </Text>
      )}
    </Card>
  );
};

export const ExpandedDetail = ({ group, updatingPayment, onToggle }) => {
  const { primary, hasMultiple, orders } = group;
  return (
    <div className="space-y-4 bg-ds-surface-2 p-5">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <Eyebrow strong className="mb-1">
            Emergency Contact
          </Eyebrow>
          <Text size="sm" weight="medium">
            {primary.emergency_name}
          </Text>
          <Text size="xs" tone="muted">
            {primary.emergency_phone} · {primary.emergency_relation}
          </Text>
        </div>
        <div>
          <Eyebrow strong className="mb-1">
            CashApp
          </Eyebrow>
          {primary.cashapp_username ? (
            <Text size="sm" tone="positive">
              {primary.cashapp_username}
            </Text>
          ) : (
            <Text size="xs" tone="faint">
              Not provided
            </Text>
          )}
        </div>
        <div>
          <Eyebrow strong className="mb-1">
            Full Email
          </Eyebrow>
          <Text size="sm" tone="muted">
            {primary.parent_email}
          </Text>
        </div>
      </div>

      {hasMultiple && (
        <>
          <Separator />
          <div>
            <Eyebrow strong className="mb-3">
              Individual Orders ({orders.length})
            </Eyebrow>
            <div className="space-y-2">
              {orders.map((reg) => (
                <OrderLine
                  key={reg.id}
                  reg={reg}
                  primary={primary}
                  busy={updatingPayment === reg.id}
                  onToggle={() => onToggle(reg.id, reg.payment_status)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
