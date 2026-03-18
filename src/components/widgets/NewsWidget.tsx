"use client";

import { useEffect, useState } from "react";
import type { NewsArticle } from "@/types";

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NewsWidget() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then(setArticles)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Market News</h2>
        <span className="text-xs text-gray-400">Top 10 today</span>
      </div>

      <div className="space-y-3">
        {loading &&
          [1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-full mb-1" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}

        {!loading &&
          articles.map((article, i) => (
            <a
              key={i}
              href={article.url === "#" ? undefined : article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 group cursor-pointer"
            >
              <span className="text-xs text-gray-300 font-bold mt-0.5 w-4 flex-shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                  {article.title}
                </p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs text-gray-400">{article.source}</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">
                    {timeAgo(article.publishedAt)}
                  </span>
                </div>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
}
