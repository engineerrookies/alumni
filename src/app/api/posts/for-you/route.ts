import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log("Received request:", req.url);

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    console.log("Cursor:", cursor);
    const pageSize = 10;

    const { user } = await validateRequest();
    console.log("Validated user:", user);

    if (!user) {
      console.warn("Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    console.log("Fetched posts:", posts);

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;
    console.log("Next cursor:", nextCursor);

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    console.log("Response data:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}