import { db, type Db } from "@repo/db";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { verifyToken } from "./lib/jwt.js";
import type { Request, Response } from "express";

function getCookie(req: Request, name: string) {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const cookie = cookies.find((entry) => entry.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}

export interface Context {
  db: Db;
  user: null | {
    id: string;
    role: "user" | "admin";
  };
  req: Request;
  res: Response;
}

export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions): Promise<Context> => {
  const authHeader = req.headers.authorization;

  let user: Context["user"] = null;

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : (req.cookies?.jwt ?? getCookie(req, "jwt"));

  if (token) {
    try {
      const decoded = verifyToken(token);

      if (decoded) {
        user = {
          id: decoded.id,
          role: decoded.role,
        };
      }
    } catch (err) {
      user = null;
    }
  }

  return {
    db,
    user,
    req,
    res,
  };
};
