import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
      const { user } = await validateRequest();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { postData } = await req.json();
      console.log(postData);
        
      const createdPost = await prisma.post.create({
        data: postData,
      });
  
      return NextResponse.json({ postId: createdPost.id });
    } catch (error) {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }