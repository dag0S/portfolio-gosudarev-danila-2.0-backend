import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateTokens = (user: User) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: "10m" }
  );

  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};
