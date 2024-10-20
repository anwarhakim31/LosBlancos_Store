import Stock from "@/lib/models/stock-model";
import { ResponseError } from "@/lib/response-error";
import { v4 as uuid } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/lib/models/transaction-model";
import Cart from "@/lib/models/cart-model";
import { verifyTokenMember } from "@/lib/verify-token";
import { itemCartType } from "@/services/type.module";

export async function POST(req: NextRequest) {
  try {
    verifyTokenMember(req);
    const { items, total, userId } = await req.json();

    if (!userId || !total || !items) {
      return ResponseError(400, "Data tidak boleh kosong");
    }

    for (const item of items) {
      const stockDB = await Stock.findOne({
        productId: item.product,
        attribute: item.atribute,
        value: item.atributeValue,
      }).populate("productId");

      if (!stockDB) {
        return ResponseError(
          404,
          `Gagal. ${item.product.name} ${item.atribute} ${item.atributeValue}, stock sudah habis`
        );
      }

      if (item.quantity > stockDB.stock) {
        return ResponseError(
          400,
          `Gagal.${item.product.name} ${item.atribute} ${item.atributeValue}, stock tersisa kurang dari ${item.quantity}`
        );
      }
    }
    const previx = "INV";
    const Segment = uuid().split("-")[0];

    const invoice = `${previx}-${Segment}`;

    const newitem = items.map((item: itemCartType) => ({
      productId: item.product,
      atribute: item.atribute,
      atributeValue: item.atributeValue,
      quantity: item.quantity,
      price: item.price,
    }));

    const transaction = new Transaction({
      invoice,
      userId,
      items: newitem,
      subTotal: total,
      shippingCost: 0,
      totalPayment: total,
      paymnetStatus: "pending",
      transactionStatus: "pending",
    });

    await transaction.save();

    await Cart.findOneAndDelete({ userId });

    return NextResponse.json({
      success: true,
      message: "Berhasil menambahkan transaksi",
      id: transaction._id,
    });
  } catch (error) {
    console.log(error);

    return ResponseError(500, "Internal Server Error");
  }
}

export async function GET(req: NextRequest) {
  try {
    verifyTokenMember(req);

    const { searchParams } = new URL(req.url);

    const transactionId = searchParams.get("transactionId");
    const userId = searchParams.get("userId");

    const transaction = await Transaction.findOne({
      _id: transactionId,
      userId,
    }).populate({
      path: "items.productId",
      populate: {
        path: "collectionName",
      },
    });

    if (!transaction) {
      return ResponseError(404, "Transaksi tidak ditemukan dengan ID tersebut");
    }

    return NextResponse.json({
      success: true,
      message: "Data berhasil diambil",
      transaction,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}

// export async function DELETE(req: NextRequest) {
//   try {
//     const { userId, itemId } = await req.json();

//     if (!userId || !itemId) {
//       return ResponseError(400, "Data tidak boleh kosong");
//     }

//     const cart = await Cart.findOne({ userId });

//     if (!cart) {
//       return ResponseError(404, "Keranjang tidak ditemukan");
//     }

//     cart.items = cart.items.filter(
//       (item: CartItem) => item._id.toString() !== itemId
//     );

//     await cart.save();

//     const updateCart = await Cart.findOne({ userId }).populate({
//       path: "items.product",
//       populate: {
//         path: "collectionName",
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Berhasil menghapus dari keranjang",
//       cart: updateCart,
//     });
//   } catch (error) {
//     console.log(error);
//     return ResponseError(500, "Internal Server Error");
//   }
// }
