import { TokenType } from "@/lib/constants";

import { Role } from "./others";

export type TokenPayload = {
  userId: number;
  role: Role;
  tokenType: (typeof TokenType)[keyof typeof TokenType];
  exp: number;
  iat: number;
};

export type TableTokenPayload = {
  number: number;
  tokenType: (typeof TokenType)["TableToken"];
  iat: number;
};
