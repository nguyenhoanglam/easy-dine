import { Dish } from "./dish";

export type DashboardIndicatorQueryParams = {
  fromDate?: Date;
  toDate?: Date;
};

export type DashboardIndicatorResData = {
  revenue: number;
  guestCount: number;
  orderCount: number;
  servingTableCount: number;
  dishIndicator: Dish & { successOrders: number }[];
  revenueByDate: {
    date: string;
    revenue: number;
  }[];
};
