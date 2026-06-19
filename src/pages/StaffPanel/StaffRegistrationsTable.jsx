/**
 * StaffRegistrationsTable — the desktop (lg+) grouped registrations table.
 * Each grouped row expands to reveal contact details and individual orders.
 */
import { Fragment } from "react";
import { ChevronRight, ChevronDown, Shirt } from "lucide-react";
import {
  IconButton,
  Badge,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Text,
} from "@bradley-t-t/sunday-design-system";
import { formatDate, formatCurrency } from "../../utils/helpers";
import { GROUP_STATUS, PaymentToggle, ExpandedDetail } from "./parts";

const StaffRegistrationsTable = ({ groups, expandedRows, onToggleExpand, updatingPayment, onTogglePayment }) => (
  <TableContainer>
    <Table className="table-fixed">
      <TableHead>
        <TableRow>
          <TableHeaderCell className="w-10" />
          <TableHeaderCell>Camper</TableHeaderCell>
          <TableHeaderCell className="w-[13%]">Parent</TableHeaderCell>
          <TableHeaderCell className="w-[16%]">Contact</TableHeaderCell>
          <TableHeaderCell className="w-[15%]">Shirts</TableHeaderCell>
          <TableHeaderCell className="w-[9%]">Total</TableHeaderCell>
          <TableHeaderCell className="w-[10%]">Status</TableHeaderCell>
          <TableHeaderCell className="w-[11%]">Date</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {groups.map((group) => {
          const { primary, combined, hasMultiple, key } = group;
          const isExpanded = expandedRows.has(key);
          const groupStatus = GROUP_STATUS[combined.status] ?? GROUP_STATUS.pending;

          return (
            <Fragment key={key}>
              <TableRow interactive onClick={() => onToggleExpand(key)}>
                <TableCell>
                  <IconButton
                    label={isExpanded ? "Collapse" : "Expand"}
                    variant="ghost"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleExpand(key);
                    }}
                  >
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </IconButton>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Text size="sm" weight="semibold" as="span">
                      {primary.kid_name}
                    </Text>
                    {hasMultiple && (
                      <Badge tone="accent" variant="soft" size="sm">
                        <Shirt className="h-3 w-3" /> {group.orders.length} orders
                      </Badge>
                    )}
                  </div>
                  <Text size="xs" tone="faint">
                    Age {primary.age}
                    {primary.nickname && ` · "${primary.nickname}"`}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text size="sm" tone="muted" truncate>
                    {primary.parent_name}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text size="xs" tone="muted" truncate>
                    {primary.parent_phone}
                  </Text>
                  <Text size="xs" tone="faint" truncate>
                    {primary.parent_email}
                  </Text>
                </TableCell>
                <TableCell>
                  {hasMultiple ? (
                    <>
                      <Text size="sm" tone="muted">
                        {combined.totalShirts} shirts
                      </Text>
                      <Text size="xs" tone="faint" truncate>
                        {combined.sizes.join(", ")}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text size="sm" tone="muted">
                        {primary.shirt_size}
                      </Text>
                      <Text size="xs" tone="faint">
                        x{primary.shirt_quantity}
                      </Text>
                    </>
                  )}
                </TableCell>
                <TableCell>
                  <Text size="sm" weight="semibold" as="span">
                    {formatCurrency(hasMultiple ? combined.totalCost : primary.total_cost)}
                  </Text>
                </TableCell>
                <TableCell onClick={(event) => event.stopPropagation()}>
                  {hasMultiple ? (
                    <Badge tone={groupStatus.tone} variant="soft">
                      {groupStatus.label}
                    </Badge>
                  ) : (
                    <PaymentToggle
                      status={primary.payment_status}
                      busy={updatingPayment === primary.id}
                      onToggle={() => onTogglePayment(primary.id, primary.payment_status)}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Text size="xs" tone="faint">
                    {formatDate(primary.created_at)}
                  </Text>
                </TableCell>
              </TableRow>
              {isExpanded && (
                <TableRow>
                  <TableCell colSpan={8} className="p-0">
                    <ExpandedDetail group={group} updatingPayment={updatingPayment} onToggle={onTogglePayment} />
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

export default StaffRegistrationsTable;
