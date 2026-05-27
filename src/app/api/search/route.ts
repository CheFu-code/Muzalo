import { NextRequest, NextResponse } from "next/server";
import { searchMusic } from "../../data/musicData";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({ artists: [], songs: [] });
  }

  try {
    const results = await searchMusic(query);
    return NextResponse.json(results, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        artists: [],
        songs: [],
        error: error instanceof Error ? error.message : "Search failed.",
      },
      { status: 502 },
    );
  }
}
