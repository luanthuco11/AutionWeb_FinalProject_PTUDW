import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import {
  Clock,
  CheckCircle2,
  Truck,
  CheckSquare,
  XCircle,
  MessageSquare,
  LucideProps,
} from "lucide-react";
import clsx from "clsx";
import { OrderStatus } from "../../../shared/src/types";

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    dot: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }
> = {
  pending: {
    label: "Chờ thanh toán",
    color: "text-amber-600 bg-amber-50 border-amber-100",
    dot: "bg-amber-400",
    icon: Clock,
  },
  paid: {
    label: "Chờ xác nhận",
    color: "text-blue-600 bg-blue-50 border-blue-100",
    dot: "bg-blue-400",
    icon: CheckCircle2,
  },
  confirmed: {
    label: "Đang giao hàng",
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    dot: "bg-indigo-400",
    icon: Truck,
  },
  shipped: {
    label: "Hoàn thành",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    dot: "bg-emerald-500",
    icon: CheckSquare,
  },
  completed: {
    // Không dùng tới
    label: "Hoàn thành",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    dot: "bg-emerald-500",
    icon: CheckSquare,
  },
  cancelled: {
    label: "Đã hủy",
    color: "text-red-600 bg-red-50 border-red-100",
    dot: "bg-red-500",
    icon: XCircle,
  },
};

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div
      className={clsx(
        "flex items-center gap-2 px-2.5 py-1 rounded-full border w-fit",
        config.color
      )}
    >
      {/* <span
        className={clsx("h-1.5 w-1.5 rounded-full animate-pulse", config.dot)}
      /> */}
      <Icon className="w-3 h-3 md:w-3.5 md:h-3.5" />
      <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-tight">
        {config.label}
      </span>
    </div>
  );
};

export default OrderStatusBadge;
