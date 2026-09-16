// Desktop counterpart to StaffRegistrationCards; keep the two in step.
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
import Skeleton from "../../components/ui/Skeleton";
import { GROUP_STATUS, PaymentToggle, ExpandedDetail } from "./parts";

// The head stays put while the body scrolls, so a roster past one screen keeps
// its columns labelled. It needs an opaque surface, because a translucent one lets the
// rows read through it.
const HEADER_CELL_CLASS = "sticky top-0 z-base bg-ds-surface-2";

// The waiting roster is the roster with its values not in yet: the same cells,
// the same two-line stacks, the same line boxes. Six rows is a screen's worth.
const WAITING_ROWS = [0, 1, 2, 3, 4, 5];

const Bar = ({ width }) => (
  <Skeleton as="span" className={`inline-block h-[0.7em] align-middle ${width}`} />
);

const WaitingRow = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-7 w-7" />
    </TableCell>
    <TableCell>
      <Text size="sm" weight="semibold" as="p">
        <Bar width="w-32" />
      </Text>
      <Text size="xs" tone="faint" as="p">
        <Bar width="w-12" />
      </Text>
    </TableCell>
    <TableCell>
      <Text size="sm" tone="muted" as="p">
        <Bar width="w-24" />
      </Text>
    </TableCell>
    <TableCell>
      <Text size="xs" tone="muted" as="p">
        <Bar width="w-24" />
      </Text>
      <Text size="xs" tone="faint" as="p">
        <Bar width="w-28" />
      </Text>
    </TableCell>
    <TableCell>
      <Text size="sm" tone="muted" as="p">
        <Bar width="w-16" />
      </Text>
      <Text size="xs" tone="faint" as="p">
        <Bar width="w-20" />
      </Text>
    </TableCell>
    <TableCell numeric>
      <Text size="sm" weight="semibold" as="p" className="tabular-nums">
        <Bar width="w-12" />
      </Text>
    </TableCell>
    <TableCell>
      <Skeleton className="h-5 w-20" />
    </TableCell>
    <TableCell>
      <Text size="xs" tone="faint" as="p" className="tabular-nums">
        <Bar width="w-24" />
      </Text>
    </TableCell>
  </TableRow>
);

const StaffRegistrationsTable = ({
  groups,
  loading,
  expandedRows,
  onToggleExpand,
  updatingPayment,
  onTogglePayment,
}) => (
  <TableContainer
    data-scroll-region
    className="card-flat max-h-[70dvh] overflow-x-auto overflow-y-auto"
  >
    <Table className="table-fixed">
      <caption className="sr-only">
        Camp sign-ups by camper, with parent contact, shirt order, total, and payment status.
      </caption>
      <TableHead>
        <TableRow>
          <TableHeaderCell scope="col" className={`${HEADER_CELL_CLASS} w-10`}>
            <span className="sr-only">Expand</span>
          </TableHeaderCell>
          <TableHeaderCell scope="col" className={HEADER_CELL_CLASS}>
            Camper
          </TableHeaderCell>
          <TableHeaderCell scope="col" className={`${HEADER_CELL_CLASS} w-[13%]`}>
            Parent
          </TableHeaderCell>
          <TableHeaderCell scope="col" className={`${HEADER_CELL_CLASS} w-[16%]`}>
            Contact
          </TableHeaderCell>
          <TableHeaderCell scope="col" className={`${HEADER_CELL_CLASS} w-[15%]`}>
            Shirts
          </TableHeaderCell>
          <TableHeaderCell scope="col" className={`${HEADER_CELL_CLASS} w-[9%]`}>
            Total
          </TableHeaderCell>
          <TableHeaderCell scope="col" className={`${HEADER_CELL_CLASS} w-[10%]`}>
            Status
          </TableHeaderCell>
          <TableHeaderCell scope="col" className={`${HEADER_CELL_CLASS} w-[11%]`}>
            Date
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading && WAITING_ROWS.map((row) => <WaitingRow key={row} />)}
        {!loading &&
          groups.map((group) => {
            const { primary, combined, hasMultiple, key } = group;
            const isExpanded = expandedRows.has(key);
            const groupStatus = GROUP_STATUS[combined.status] ?? GROUP_STATUS.pending;

            return (
              <Fragment key={key}>
                <TableRow
                  className="control-row hover:[&>td]:bg-ds-surface-2 active:[&>td]:bg-ds-surface-3"
                  onClick={() => onToggleExpand(key)}
                >
                  <TableCell>
                    <IconButton
                      label={`${isExpanded ? "Collapse" : "Expand"} ${primary.kid_name}`}
                      variant="ghost"
                      size="sm"
                      className="control"
                      aria-expanded={isExpanded}
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleExpand(key);
                      }}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Text size="sm" weight="semibold" as="span">
                        {primary.kid_name}
                      </Text>
                      {hasMultiple && (
                        <Badge tone="accent" variant="soft" size="sm">
                          <Shirt className="h-3 w-3" aria-hidden="true" /> {group.orders.length}{" "}
                          orders
                        </Badge>
                      )}
                    </div>
                    <Text size="xs" tone="faint">
                      Age {primary.age}
                      {primary.nickname && ` · "${primary.nickname}"`}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text size="sm" tone="muted" truncate title={primary.parent_name}>
                      {primary.parent_name}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text size="xs" tone="muted" truncate title={primary.parent_phone}>
                      {primary.parent_phone}
                    </Text>
                    <Text size="xs" tone="faint" truncate title={primary.parent_email}>
                      {primary.parent_email}
                    </Text>
                  </TableCell>
                  <TableCell>
                    {hasMultiple ? (
                      <>
                        <Text size="sm" tone="muted">
                          {combined.totalShirts} shirts
                        </Text>
                        <Text size="xs" tone="faint" truncate title={combined.sizes.join(", ")}>
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
                  <TableCell numeric>
                    <Text size="sm" weight="semibold" as="span" className="tabular-nums">
                      {formatCurrency(hasMultiple ? combined.totalCost : primary.total_cost)}
                    </Text>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Text size="xs" tone="faint" className="tabular-nums">
                      {formatDate(primary.created_at)}
                    </Text>
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow>
                    <TableCell colSpan={8} className="p-0">
                      <ExpandedDetail
                        group={group}
                        updatingPayment={updatingPayment}
                        onToggle={onTogglePayment}
                      />
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
