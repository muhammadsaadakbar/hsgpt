import jwt, { Secret, SignOptions } from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;

export function sign_token(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "15d",
  });
}

export function verify_token(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export const generate_reset_token = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashed };
};

export const hash_token = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
