import type { NewsArticle } from "@/types";

export async function getMarketNews(): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey || apiKey === "your_newsapi_key_here") {
    // Return mock data if API key is not configured
    return getMockNews();
  }

  try {
    const url = new URL("https://newsapi.org/v2/top-headlines");
    url.searchParams.set("category", "business");
    url.searchParams.set("language", "en");
    url.searchParams.set("pageSize", "10");
    url.searchParams.set("apiKey", apiKey);

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) throw new Error("NewsAPI request failed");

    const data = await response.json();

    return data.articles.slice(0, 10).map(
      (article: {
        title: string;
        description: string;
        url: string;
        publishedAt: string;
        source: { name: string };
      }) => ({
        title: article.title,
        description: article.description ?? "",
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source.name,
      })
    );
  } catch {
    return getMockNews();
  }
}

function getMockNews(): NewsArticle[] {
  return [
    {
      title: "Markets rally as inflation data comes in below expectations",
      description: "Global markets surged today after consumer price index data showed inflation cooling faster than anticipated.",
      url: "#",
      publishedAt: new Date().toISOString(),
      source: "Financial Times",
    },
    {
      title: "Tech stocks lead gains in morning trading session",
      description: "Major technology companies saw significant gains as investor sentiment improved.",
      url: "#",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      source: "Bloomberg",
    },
    {
      title: "Central bank signals potential rate cuts in coming months",
      description: "Fed officials hinted at possible interest rate reductions if inflation continues to ease.",
      url: "#",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      source: "Reuters",
    },
    {
      title: "Oil prices stabilize after weeks of volatility",
      description: "Crude oil futures steadied as supply concerns eased following OPEC+ production agreement.",
      url: "#",
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      source: "MarketWatch",
    },
    {
      title: "Emerging markets attract record inflows",
      description: "Investors poured capital into emerging market funds at record pace this quarter.",
      url: "#",
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      source: "WSJ",
    },
  ];
}
