import jwt, { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import connect_db from "./db";
import crypto from "crypto";
const jwt_secret = process.env.JWT_SECRET;
if (!jwt_secret) throw new Error("Please Define jwt_secret in your env");

function sign_token(payload, expires_in = "15d") {
  return jwt.sign(payload, jwt_secret, { expiresIn: expires_in });
}
function verify_token(token) {
  return jwt.verify(token, jwt_secret);
}

const generate_reset_token = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashed };
};

const hash_token = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export { verify_token, sign_token, generate_reset_token, hash_token };
