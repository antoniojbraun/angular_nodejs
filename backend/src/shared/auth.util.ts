import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Request, Response } from "express";
import { getToken } from "../services/token.service";
const secretKey = process.env.JWT_SECRET!;

export function generateToken(userId: number, expiresIn = "1h"): string {
  const payload = { userId: userId };
  const token = jwt.sign(payload, secretKey, {
    expiresIn,
  });
  return token;
}

export function encryptPassword(password: string): string {
  const encryptedPasssowrd = jwt.sign(password, secretKey);
  return encryptedPasssowrd;
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
}

export async function authenticateJWT(
  req: Request,
  res: Response,
  next: Function
) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Access Denied. Token is not provided." });
    return;
  }
  const verified = verifyToken(token);
  const tokenExistsOnDb = await getToken(token);

  if (!verified || !tokenExistsOnDb) {
    res.status(401).json({ message: "Invalid Token" });
    return;
  }
  User.findByPk((verified as any).userId).then((user) => {
    if (user) {
      (req as any).user = user;
    } else {
      return res.status(401).json({ message: "User not found." });
    }
    next();
  });
}
