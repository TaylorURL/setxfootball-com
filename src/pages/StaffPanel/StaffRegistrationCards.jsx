// Mobile counterpart to StaffRegistrationsTable — keep the two in step.
import { ChevronRight, ChevronDown, Shirt, Phone, Mail } from "lucide-react";
import { Card, Badge, Separator, Text, Eyebrow } from "@bradley-t-t/sunday-design-system";
import { formatDate, formatCurrency } from "../../utils/helpers";
import { GROUP_STATUS, PaymentToggle, OrderLine } from "./parts";

const StaffRegistrationCards = ({ groups, expandedRows, onToggleExpand, updatingPayment, onTogglePayment }) => (
  <div className="space-y-4">
    {groups.map((group) => {
      const { primary, combined, hasMultiple, key } = group;
      const isExpanded = expandedRows.has(key);
      const groupStatus = GROUP_STATUS[combined.status] ?? GROUP_STATUS.pending;

      return (
        <Card key={key} variant="surface" padding="none" className="overflow-hidden">
          <button
            type="button"
            onClick={() => onToggleExpand(key)}
            className="ds-press flex w-full items-center justify-between gap-3 border-b border-ds-border p-4 text-left"
          >
            <div className="flex items-center gap-3">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 shrink-0 text-ds-text-faint" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 text-ds-text-faint" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <Text size="sm" weight="semibold" as="span">
                    {primary.kid_name}
                  </Text>
                  {hasMultiple && (
                    <Badge tone="accent" variant="soft" size="sm">
                      <Shirt className="h-3 w-3" /> {group.orders.length}
                    </Badge>
                  )}
                </div>
                <Text size="xs" tone="faint">
                  Age {primary.age}
                </Text>
              </div>
            </div>
            {hasMultiple ? (
              <Badge tone={groupStatus.tone} variant="soft">
                {groupStatus.label}
              </Badge>
            ) : (
              <span onClick={(event) => event.stopPropagation()}>
                <PaymentToggle
                  status={primary.payment_status}
                  busy={updatingPayment === primary.id}
                  onToggle={() => onTogglePayment(primary.id, primary.payment_status)}
                />
              </span>
            )}
          </button>

          <div className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Eyebrow strong className="mb-1">
                  Shirts
                </Eyebrow>
                {hasMultiple ? (
                  <>
                    <Text size="sm" weight="medium">
                      {combined.totalShirts} total
                    </Text>
                    <Text size="xs" tone="faint">
                      {combined.sizes.join(", ")}
                    </Text>
                  </>
                ) : (
                  <Text size="sm" weight="medium">
                    {primary.shirt_size} (x{primary.shirt_quantity})
                  </Text>
                )}
              </div>
              <div>
                <Eyebrow strong className="mb-1">
                  Amount
                </Eyebrow>
                <Text size="sm" weight="semibold">
                  {formatCurrency(hasMultiple ? combined.totalCost : primary.total_cost)}
                </Text>
              </div>
              <div>
                <Eyebrow strong className="mb-1">
                  Parent
                </Eyebrow>
                <Text size="sm" weight="medium">
                  {primary.parent_name}
                </Text>
              </div>
              <div>
                <Eyebrow strong className="mb-1">
                  CashApp
                </Eyebrow>
                <Text size="sm" tone={primary.cashapp_username ? "positive" : "faint"}>
                  {primary.cashapp_username || "Not provided"}
                </Text>
              </div>
            </div>

            {isExpanded && (
              <>
                <Separator />
                <div className="space-y-1.5">
                  <Text size="sm" tone="muted" className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-ds-text-faint" /> {primary.parent_phone}
                  </Text>
                  <Text size="sm" tone="muted" className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-ds-text-faint" />
                    <span className="truncate">{primary.parent_email}</span>
                  </Text>
                </div>
                <Separator />
                <div>
                  <Eyebrow strong className="mb-1">
                    Emergency Contact
                  </Eyebrow>
                  <Text size="sm" weight="medium">
                    {primary.emergency_name} ({primary.emergency_relation})
                  </Text>
                  <Text size="xs" tone="muted">
                    {primary.emergency_phone}
                  </Text>
                </div>

                {hasMultiple && (
                  <>
                    <Separator />
                    <div>
                      <Eyebrow strong className="mb-2">
                        Individual Orders
                      </Eyebrow>
                      <div className="space-y-2">
                        {group.orders.map((reg) => (
                          <OrderLine
                            key={reg.id}
                            reg={reg}
                            primary={primary}
                            busy={updatingPayment === reg.id}
                            onToggle={() => onTogglePayment(reg.id, reg.payment_status)}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />
                <Text size="xs" tone="faint">
                  Registered: {formatDate(primary.created_at)}
                </Text>
              </>
            )}
          </div>
        </Card>
      );
    })}
  </div>
);

export default StaffRegistrationCards;
