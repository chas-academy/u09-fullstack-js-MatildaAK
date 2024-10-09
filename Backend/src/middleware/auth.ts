import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { IUser } from "../interface/IUser";

export interface CustomRequest extends Request {
  user?: IUser;
  token?: string;
}

interface DecodedToken {
  _id: string;
}

export const auth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Autentiseringen misslyckades. Token saknas.");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error("Autentiseringen misslyckades. Användaren hittades inte.");
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: "Autentiseringen misslyckades." });
  }
};

export const admin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await auth(req, res, async () => {
      if (req.user && req.user.role === 2) {
        next();
      } else {
        res.status(403).send({ error: "Åtkomst nekad. Användaren är inte en administratör." });
      }
    });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).send({ error: "Autentiseringen misslyckades." });
  }
};
