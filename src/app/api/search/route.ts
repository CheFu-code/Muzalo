import { NextRequest, NextResponse } from "next/server";
import { searchMusic } from "../../data/musicData";

const searchCacheHeaders = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800",
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({ artists: [], songs: [] });
  }

  try {
    const results = await searchMusic(query);
    return NextResponse.json(results, { headers: searchCacheHeaders });
  } catch (error) {
    return NextResponse.json(
      {
        artists: [],
        songs: [],
        embeds: [],
        catalogIssue: {
          title: "Search unavailable",
          description: error instanceof Error ? error.message : "Muzalo search failed.",
        },
      },
      { headers: searchCacheHeaders },
    );
  }
}
