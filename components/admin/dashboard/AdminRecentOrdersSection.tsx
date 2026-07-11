"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  adminCurrencyFormatter,
  adminDateFormatter,
  adminSelectClassName,
  EmptyState,
  formatLabel,
  StatusPill,
} from "@/components/admin/AdminPagePrimitives";
import { cn } from "@/lib/utils";
import type { AdminOverviewData } from "@/lib/admin-pages";

type Props = {
  recentOrders: AdminOverviewData["recentOrders"];
};

type Order = AdminOverviewData["recentOrders"][number];

type SortKey =
  | "orderNumber"
  | "customerName"
  | "orderDate"
  | "totalPrice"
  | "paymentStatus"
  | "deliveryStatus"
  | "deliveryCompany"
  | "deliveryPersonName"
  | "driverPhoneNumber"
  | "status";

type SortState = {
  key: SortKey;
  direction: "asc" | "desc";
};

const pageSize = 10;

const csvEscape = (value: string | number | null | undefined) => {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
};

const getDeliveryCompany = (order: Order) => order.deliveryCompany || "Non renseigne";
const getDeliveryPerson = (order: Order) => order.deliveryPersonName || "Non renseigne";
const getDriverPhone = (order: Order) => order.driverPhoneNumber || "Non renseigne";

const getSortValue = (order: Order, key: SortKey) => {
  switch (key) {
    case "orderDate":
      return new Date(order.orderDate).getTime();
    case "totalPrice":
      return order.totalPrice;
    case "deliveryCompany":
      return getDeliveryCompany(order).toLowerCase();
    case "deliveryPersonName":
      return getDeliveryPerson(order).toLowerCase();
    case "driverPhoneNumber":
      return getDriverPhone(order).toLowerCase();
    default:
      return String(order[key] || "").toLowerCase();
  }
};

const SortButton = ({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSort: (key: SortKey) => void;
}) => {
  const active = sort.key === sortKey;
  const Icon = !active ? ArrowUpDown : sort.direction === "asc" ? ArrowUp : ArrowDown;

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className="inline-flex items-center gap-1 text-left font-semibold text-slate-700 hover:text-slate-950"
    >
      {label}
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
};

export default function AdminRecentOrdersSection({ recentOrders }: Props) {
  const [query, setQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [orderFilter, setOrderFilter] = useState("all");
  const [sort, setSort] = useState<SortState>({
    key: "orderDate",
    direction: "desc",
  });
  const [page, setPage] = useState(1);

  const paymentStatuses = useMemo(
    () => Array.from(new Set(recentOrders.map((order) => order.paymentStatus))).sort(),
    [recentOrders]
  );
  const deliveryStatuses = useMemo(
    () => Array.from(new Set(recentOrders.map((order) => order.deliveryStatus))).sort(),
    [recentOrders]
  );
  const orderStatuses = useMemo(
    () => Array.from(new Set(recentOrders.map((order) => order.status))).sort(),
    [recentOrders]
  );

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return recentOrders
      .filter((order) => {
        if (paymentFilter !== "all" && order.paymentStatus !== paymentFilter) {
          return false;
        }

        if (deliveryFilter !== "all" && order.deliveryStatus !== deliveryFilter) {
          return false;
        }

        if (orderFilter !== "all" && order.status !== orderFilter) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        return [
          order.orderNumber,
          order.customerName,
          order.email,
          order.totalPrice,
          order.paymentStatus,
          order.deliveryStatus,
          getDeliveryCompany(order),
          getDeliveryPerson(order),
          getDriverPhone(order),
          order.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => {
        const aValue = getSortValue(a, sort.key);
        const bValue = getSortValue(b, sort.key);
        const multiplier = sort.direction === "asc" ? 1 : -1;

        if (aValue < bValue) return -1 * multiplier;
        if (aValue > bValue) return 1 * multiplier;
        return 0;
      });
  }, [deliveryFilter, orderFilter, paymentFilter, query, recentOrders, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: SortKey) => {
    setSort((current) =>
      current.key === key
        ? {
            key,
            direction: current.direction === "asc" ? "desc" : "asc",
          }
        : {
            key,
            direction: "asc",
          }
    );
  };

  const exportCsv = () => {
    const header = [
      "Order Number",
      "Customer",
      "Date",
      "Total",
      "Payment Status",
      "Delivery Status",
      "Carrier",
      "Delivery Person",
      "Driver Phone Number",
      "Order Status",
    ];
    const rows = filteredOrders.map((order) => [
      order.orderNumber,
      order.customerName,
      adminDateFormatter.format(new Date(order.orderDate)),
      order.totalPrice,
      order.paymentStatus,
      order.deliveryStatus,
      getDeliveryCompany(order),
      getDeliveryPerson(order),
      getDriverPhone(order),
      order.status,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => csvEscape(value)).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "admin-orders.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const resetToFirstPage = (setter: (value: string) => void, value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_46px_-40px_rgba(15,23,42,0.32)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Execution
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            Recent Orders
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {filteredOrders.length} commande(s) dans la vue courante.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportCsv}
            disabled={!filteredOrders.length}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          <Link
            href="/admin/orders#orders-list"
            className="inline-flex h-10 items-center rounded-xl bg-shop_btn_dark_green px-3 text-sm font-semibold text-white transition-colors hover:bg-shop_btn_dark_green/90"
          >
            Voir tout
          </Link>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="relative md:col-span-2 xl:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search orders"
            className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9"
          />
        </label>

        <select
          value={paymentFilter}
          onChange={(event) => resetToFirstPage(setPaymentFilter, event.target.value)}
          className={cn(adminSelectClassName, "h-10 rounded-xl bg-white px-3")}
        >
          <option value="all">Tous les paiements</option>
          {paymentStatuses.map((status) => (
            <option key={status} value={status}>
              {formatLabel(status)}
            </option>
          ))}
        </select>

        <select
          value={deliveryFilter}
          onChange={(event) => resetToFirstPage(setDeliveryFilter, event.target.value)}
          className={cn(adminSelectClassName, "h-10 rounded-xl bg-white px-3")}
        >
          <option value="all">Toutes les livraisons</option>
          {deliveryStatuses.map((status) => (
            <option key={status} value={status}>
              {formatLabel(status)}
            </option>
          ))}
        </select>

        <select
          value={orderFilter}
          onChange={(event) => resetToFirstPage(setOrderFilter, event.target.value)}
          className={cn(adminSelectClassName, "h-10 rounded-xl bg-white px-3")}
        >
          <option value="all">Tous les statuts</option>
          {orderStatuses.map((status) => (
            <option key={status} value={status}>
              {formatLabel(status)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 hidden xl:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton label="Order Number" sortKey="orderNumber" sort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortButton label="Customer" sortKey="customerName" sort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortButton label="Date" sortKey="orderDate" sort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortButton label="Total" sortKey="totalPrice" sort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortButton label="Payment Status" sortKey="paymentStatus" sort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortButton label="Delivery Status" sortKey="deliveryStatus" sort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortButton label="Carrier" sortKey="deliveryCompany" sort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortButton label="Delivery Person" sortKey="deliveryPersonName" sort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortButton label="Driver Phone Number" sortKey="driverPhoneNumber" sort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortButton label="Order Status" sortKey="status" sort={sort} onSort={handleSort} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-shop_light_green/5">
                <TableCell className="font-semibold text-slate-900">
                  #{order.orderNumber.slice(-8).toUpperCase()}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-slate-800">{order.customerName}</p>
                    <p className="text-xs text-slate-500">{order.email}</p>
                  </div>
                </TableCell>
                <TableCell>{adminDateFormatter.format(new Date(order.orderDate))}</TableCell>
                <TableCell className="font-semibold text-slate-900">
                  {adminCurrencyFormatter.format(order.totalPrice)}
                </TableCell>
                <TableCell>
                  <StatusPill value={order.paymentStatus} />
                </TableCell>
                <TableCell>
                  <StatusPill value={order.deliveryStatus} />
                </TableCell>
                <TableCell>{getDeliveryCompany(order)}</TableCell>
                <TableCell>{getDeliveryPerson(order)}</TableCell>
                <TableCell>{getDriverPhone(order)}</TableCell>
                <TableCell>
                  <StatusPill value={order.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-5 grid gap-3 xl:hidden">
        {pageOrders.map((order) => (
          <article
            key={order.id}
            className="rounded-[20px] border border-slate-200 bg-slate-50/70 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">
                  #{order.orderNumber.slice(-8).toUpperCase()}
                </p>
                <p className="mt-1 truncate text-sm text-slate-600">{order.customerName}</p>
              </div>
              <StatusPill value={order.status} />
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              <p>{adminDateFormatter.format(new Date(order.orderDate))}</p>
              <p className="font-semibold text-slate-950">
                {adminCurrencyFormatter.format(order.totalPrice)}
              </p>
              <p>Carrier: {getDeliveryCompany(order)}</p>
              <p>Delivery person: {getDeliveryPerson(order)}</p>
              <p>Driver phone: {getDriverPhone(order)}</p>
              <div className="flex flex-wrap gap-2">
                <StatusPill value={order.paymentStatus} />
                <StatusPill value={order.deliveryStatus} />
              </div>
            </div>
          </article>
        ))}
      </div>

      {!pageOrders.length ? (
        <div className="mt-5">
          <EmptyState
            title="Aucune commande"
            description="Aucune commande ne correspond aux filtres actifs."
          />
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Page {currentPage} / {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={currentPage === 1}
            className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Prec.
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Suiv.
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
