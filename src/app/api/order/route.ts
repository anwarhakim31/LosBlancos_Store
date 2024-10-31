import connectDB from "@/lib/db";
import Transaction from "@/lib/models/transaction-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("user");
    const statusPayment = searchParams.get("payment");
    const statusTransaction = searchParams.get("transaction");

    const now = new Date();

    await Transaction.deleteMany({
      userId,
      paymentStatus: "tertunda",
      transactionStatus: "tertunda",
      expired: { $lt: now },
    });

    console.log(userId, statusPayment, statusTransaction);

    const filter: {
      userId: string;
      transactionStatus: string;
      paymentStatus?: string;
    } = {
      userId: userId as string,
      transactionStatus: statusTransaction as string,
    };

    if (statusPayment) {
      filter.paymentStatus = statusPayment as string;
    }

    const transaction = await Transaction.find(filter)
      .populate("items.productId")
      .skip(0)
      .limit(8)
      .sort({ transactionDate: -1 });

    return NextResponse.json({
      success: true,
      message: "Data berhasil diambil",
      transaction,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}