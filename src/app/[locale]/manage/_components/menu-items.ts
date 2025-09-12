import {
  Home,
  LucideProps,
  Salad,
  ShoppingCart,
  Table,
  Users2,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

import { Role } from "@/lib/constants";
import { I18nNavLinksKeys, Role as RoleType } from "@/types/others";

const menuItems: {
  key: I18nNavLinksKeys;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  href: string;
  roles: RoleType[];
}[] = [
  {
    key: "dashboard",
    Icon: Home,
    href: "/manage/dashboard",
    roles: [Role.Owner, Role.Employee],
  },
  {
    key: "orders",
    Icon: ShoppingCart,
    href: "/manage/orders",
    roles: [Role.Owner, Role.Employee],
  },
  {
    key: "tables",
    Icon: Table,
    href: "/manage/tables",
    roles: [Role.Owner, Role.Employee],
  },
  {
    key: "dishes",
    Icon: Salad,
    href: "/manage/dishes",
    roles: [Role.Owner, Role.Employee],
  },
  {
    key: "employees",
    Icon: Users2,
    href: "/manage/accounts",
    roles: [Role.Owner],
  },
];

export default menuItems;
