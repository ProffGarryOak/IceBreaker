import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import UserContent from "@/models/UserContent";
import Upvote from "@/models/Upvote";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  await dbConnect();

  try {
    // 1. Fetch recent user content to aggregate "Most Watched"
    const allContent = await UserContent.find({}).limit(50);

    // 2. Aggregate counts manually (simplest for non-uniform schemas)
    const itemCounts = {};

    allContent.forEach((user) => {
      ["movies", "shows", "anime", "books", "songs", "games"].forEach(
        (category) => {
          const list = user[category]?.completed || [];
          list.forEach((item) => {
            const key = `${category}:${item.title}`;
            if (!itemCounts[key]) {
              itemCounts[key] = {
                title: item.title,
                category,
                image: item.image, // naive: take first image found
                description: item.description,
                watchCount: 0,
              };
            }
            itemCounts[key].watchCount += 1;
          });
        }
      );
    });

    // 3. Fetch explicit upvotes
    const upvotes = await Upvote.find({});
    const upvoteMap = upvotes.reduce((acc, curr) => {
      acc[`${curr.category}:${curr.contentTitle}`] = curr;
      return acc;
    }, {});

    // 4. Merge and sort
    const trending = Object.values(itemCounts)
      .map((item) => {
        const upvoteDoc = upvoteMap[`${item.category}:${item.title}`];
        const explicitUpvotes = upvoteDoc ? upvoteDoc.count : 0;
        const upvotedBy = upvoteDoc ? upvoteDoc.upvotedBy : [];

        return {
          ...item,
          upvotes: explicitUpvotes,
          totalScore: item.watchCount + explicitUpvotes,
          upvotedBy,
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 20); // Top 20

    return NextResponse.json(trending);
  } catch (error) {
    console.error("Trending fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnect();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, category } = await req.json();

    // Find or create upvote doc
    let upvoteStr = await Upvote.findOne({ contentTitle: title, category });

    if (!upvoteStr) {
      upvoteStr = new Upvote({
        contentTitle: title,
        category,
        count: 0,
        upvotedBy: [],
      });
    }

    // Toggle logic
    const hasUpvoted = upvoteStr.upvotedBy.includes(userId);

    if (hasUpvoted) {
      upvoteStr.count = Math.max(0, upvoteStr.count - 1);
      upvoteStr.upvotedBy = upvoteStr.upvotedBy.filter((id) => id !== userId);
    } else {
      upvoteStr.count += 1;
      upvoteStr.upvotedBy.push(userId);
    }

    await upvoteStr.save();

    return NextResponse.json({
      success: true,
      count: upvoteStr.count,
      upvoted: !hasUpvoted,
    });
  } catch (error) {
    console.error("Upvote error:", error);
    return NextResponse.json({ error: "Failed to upvote" }, { status: 500 });
  }
}
