import "express";

declare module "express" {
  export interface DefaultToken {
    iss: string;
    nameUser: string;
    sub: string;
    roles: string[];
    iat: number;
    exp: number;
  }
}
