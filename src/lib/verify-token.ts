import { NextRequest } from "next/server";
import { ResponseError } from "./response-error";
import jwt from "jsonwebtoken";

export const verifyToken = (req: NextRequest) => {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return ResponseError(
      401,
      "Sesi login telah habis. Jika ingin melanjutkan silahkan login kembali."
    );
  }
  console.log({ token });

  const verify = jwt.verify(token, process.env.NEXTAUTH_SECRET || "");

  if (verify && typeof verify === "object" && "role" in verify) {
    if (verify.role !== "admin") {
      return ResponseError(401, "Hak akses tidak diberikan");
    }
  }

  return verify;
};
