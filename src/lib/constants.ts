export const HttpStatus = {
  NetworkError: 0,
  Ok: 200,
  Unauthorized: 401,
  UnprocessableEntity: 422,
  InternalServerError: 500,
} as const;

export const StorageKey = {
  AccessToken: "access_token",
  RefreshToken: "refresh_token",
  Account: "account",
} as const;

export const SearchParamKey = {
  Redirect: "redirect",
  RefreshToken: "refresh_token",
  ClearTokens: "clear_tokens",
  Page: "page",
  Limit: "limit",
};

export const TokenType = {
  ForgotPasswordToken: "ForgotPasswordToken",
  AccessToken: "AccessToken",
  RefreshToken: "RefreshToken",
  TableToken: "TableToken",
} as const;

export const Role = {
  Owner: "Owner",
  Employee: "Employee",
  Guest: "Guest",
} as const;

export const RoleValues = [Role.Owner, Role.Employee, Role.Guest] as const;

export const DishStatus = {
  Available: "Available",
  Unavailable: "Unavailable",
  Hidden: "Hidden",
} as const;

export const DishStatusValues = [
  DishStatus.Available,
  DishStatus.Unavailable,
  DishStatus.Hidden,
] as const;

export const TableStatus = {
  Available: "Available",
  Hidden: "Hidden",
  Reserved: "Reserved",
} as const;

export const TableStatusValues = [
  TableStatus.Available,
  TableStatus.Hidden,
  TableStatus.Reserved,
] as const;

export const OrderStatus = {
  Pending: "Pending",
  Processing: "Processing",
  Rejected: "Rejected",
  Delivered: "Delivered",
  Paid: "Paid",
} as const;

export const OrderStatusValues = [
  OrderStatus.Pending,
  OrderStatus.Processing,
  OrderStatus.Rejected,
  OrderStatus.Delivered,
  OrderStatus.Paid,
] as const;

export const ManagerRoom = "manager" as const;

export const SocketEvent = {
  Connect: "connect",
  Disconnect: "disconnect",
  NewOrder: "new-order",
  UpdateOrder: "update-order",
  Payment: "payment",
} as const;
