import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import UserContent from "@/models/UserContent";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  await dbConnect();

  try {
    // 1. Get all users who have content
    const contentUsers = await UserContent.find(
      {},
      "userId movies anime shows books songs games"
    ).limit(50); // Limit for performance

    // 2. Get user details from Clerk
    const client = await clerkClient();
    const usersList = await client.users.getUserList({
      userId: contentUsers.map((u) => u.userId),
      limit: 50,
    });

    // 3. Merge data
    const mergedUsers = contentUsers
      .map((contentUser) => {
        const clerkUser = usersList.data.find(
          (u) => u.id === contentUser.userId
        );
        if (!clerkUser) return null;

        // Calculate total items
        const totalItems =
          (contentUser.movies?.completed?.length || 0) +
          (contentUser.shows?.completed?.length || 0) +
          (contentUser.anime?.completed?.length || 0) +
          (contentUser.books?.completed?.length || 0) +
          (contentUser.songs?.completed?.length || 0) +
          (contentUser.games?.completed?.length || 0);

        // Determine top category
        const counts = {
          movies: contentUser.movies?.completed?.length || 0,
          shows: contentUser.shows?.completed?.length || 0,
          anime: contentUser.anime?.completed?.length || 0,
          books: contentUser.books?.completed?.length || 0,
          songs: contentUser.songs?.completed?.length || 0,
          games: contentUser.games?.completed?.length || 0,
        };

        const topCategory = Object.entries(counts).sort(
          (a, b) => b[1] - a[1]
        )[0][0];

        return {
          id: contentUser.userId,
          username: clerkUser.username || clerkUser.firstName || "Anonymous",
          imageUrl: clerkUser.imageUrl,
          totalItems,
          topCategory,
        };
      })
      .filter(Boolean);

    return NextResponse.json(mergedUsers);
  } catch (error) {
    console.error("Community users fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
