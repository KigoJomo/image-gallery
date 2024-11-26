// app/api/rooms/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { uploadFileToStorage } from "@/lib/storage-utils";

export async function POST(request: NextRequest){
  const formData = await request.formData();
  const file = formData.get('roomImage') as File;
  
  try{
    const imageUrl = await uploadFileToStorage(file);

    return NextResponse.json({
      message: "Image Uploaded Successfully.",
      imageUrl
    });
  }catch(error){
    console.error('Upload error: ', error);
    return NextResponse.json({ error: 'Upload Failed' }, { status: 500 });
  }
}