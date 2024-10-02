import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import Category from "@/lib/models/category-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    verifyToken(req);
    const { id } = params;

    const isExis = await Category.findById(id);

    if (!isExis) {
      return ResponseError(404, "Gagal. Kategori tidak ditemukan");
    }
    const publicId = isExis?.image.split("/")[7];
    await cloudinary.uploader.destroy(publicId);

    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Berhasil menghapus kategori",
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    verifyToken(req);
    const { id } = params;
    const data = await req.json();

    const isExist = await Category.findById(id);

    if (!isExist) {
      return ResponseError(404, "Kategori tidak ditemukan");
    }

    await Category.findByIdAndUpdate(id, data);

    return NextResponse.json({
      success: true,
      message: "Berhasil mengubah kategori",
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
