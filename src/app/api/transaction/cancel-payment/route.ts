import Stock from "@/lib/models/stock-model";
import Transaction from "@/lib/models/transaction-model";
import { ResponseError } from "@/lib/response-error";

import { NextRequest, NextResponse } from "next/server";

const MIDTRANS_BASE_URL = process.env.MIDTRANS_BASE_URL;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SECRET_KEY;

const getAuthHeader = () => {
  return `Basic ${Buffer.from(MIDTRANS_SERVER_KEY as string).toString(
    "base64"
  )}`;
};

export async function POST(req: NextRequest) {
  try {
    const { order_id } = await req.json();

    const res = await fetch(`${MIDTRANS_BASE_URL}/${order_id}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: getAuthHeader(),
      },
    });
    const data = await res.json();

    if (data.status_code === "200") {
      const transaction = await Transaction.findOneAndUpdate(
        {
          invoice: order_id,
        },
        {
          $unset: {
            paymentStatus: "dibatalkan",
            transactionStatus: "dibatalkan",
          },
        }
      ).select("_id items");

      for (const item of transaction.items) {
        await Stock.findOneAndUpdate(
          {
            productId: item.productId,
            attribute: item.atribute,
            value: item.atributeValue,
          },
          {
            $inc: {
              stock: item.quantity,
            },
          }
        );
      }

      return NextResponse.json({
        status: "success",
        message: "Transaksi berhasil dibatalkan",
      });
    } else {
      return ResponseError(400, data.status_message);
    }
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal server error");
  }
}