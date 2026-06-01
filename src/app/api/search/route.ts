import { NextRequest, NextResponse } from "next/server";
import { searchMusic } from "../../data/musicData";
import { checkRateLimit } from "../../../lib/rate-limit";

const searchCacheHeaders = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800",
};

export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(request, {
    keyPrefix: "muzalo-search",
    limit: 120,
    windowMs: 60_000,
  });

  if (rateLimit.limited) {
    return NextResponse.json(
      { error: "Too many search requests. Please wait a moment and try again." },
      { headers: rateLimit.headers, status: 429 },
    );
  }

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
