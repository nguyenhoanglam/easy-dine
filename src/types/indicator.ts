import { Dish } from "./dish";

export type DashboardIndicatorsQueryParams = {
  fromDate: Date;
  toDate: Date;
};

export type DashboardIndicatorsResData = {
  revenue: number;
  guestCount: number;
  orderCount: number;
  servingTableCount: number;
  dishIndicator: (Dish & { successOrders: number })[];
  revenueByDate: {
    date: string;
    revenue: number;
  }[];
};
