import { NextRequest, NextResponse } from "next/server";
import { getSpotifyCatalogIssue, searchMusic } from "../../data/musicData";

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
    const catalogIssue = getSpotifyCatalogIssue(error);

    return NextResponse.json(
      {
        artists: [],
        songs: [],
        catalogIssue,
      },
      { headers: searchCacheHeaders },
    );
  }
}
