// Mobile counterpart to StaffRegistrationsTable; keep the two in step.
import { ChevronRight, ChevronDown, Shirt, Phone, Mail } from "lucide-react";
import { Card, Badge, Separator, Text, Eyebrow } from "@bradley-t-t/sunday-design-system";
import { formatDate, formatCurrency } from "../../utils/helpers";
import { GROUP_STATUS, PaymentToggle, OrderLine } from "./parts";

const StaffRegistrationCards = ({
  groups,
  expandedRows,
  onToggleExpand,
  updatingPayment,
  onTogglePayment,
}) => (
  <div className="space-y-4">
    {groups.map((group) => {
      const { primary, combined, hasMultiple, key } = group;
      const isExpanded = expandedRows.has(key);
      const groupStatus = GROUP_STATUS[combined.status] ?? GROUP_STATUS.pending;

      return (
        <Card key={key} variant="surface" padding="none" className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-ds-border pr-4">
            <button
              type="button"
              onClick={() => onToggleExpand(key)}
              aria-expanded={isExpanded}
              className="control flex flex-1 items-center gap-3 p-4 text-left"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 shrink-0 text-ds-text-faint" aria-hidden="true" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 text-ds-text-faint" aria-hidden="true" />
              )}
              <span className="block">
                <span className="flex items-center gap-2">
                  <Text size="sm" weight="semibold" as="span">
                    {primary.kid_name}
                  </Text>
                  {hasMultiple && (
                    <Badge tone="accent" variant="soft" size="sm">
                      <Shirt className="h-3 w-3" aria-hidden="true" /> {group.orders.length}
                    </Badge>
                  )}
                </span>
                <Text size="xs" tone="faint" as="span" className="block">
                  Age {primary.age}
                </Text>
              </span>
            </button>
            {hasMultiple ? (
              <Badge tone={groupStatus.tone} variant="soft">
                {groupStatus.label}
              </Badge>
            ) : (
              <PaymentToggle
                status={primary.payment_status}
                camper={primary.kid_name}
                busy={updatingPayment === primary.id}
                onToggle={() => onTogglePayment(primary.id, primary.payment_status)}
              />
            )}
          </div>

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
                <div className="space-y-2">
                  <Text size="sm" tone="muted" className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-ds-text-faint" aria-hidden="true" />{" "}
                    {primary.parent_phone}
                  </Text>
                  <Text size="sm" tone="muted" className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-ds-text-faint" aria-hidden="true" />
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
