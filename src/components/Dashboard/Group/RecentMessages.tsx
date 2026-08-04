"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useGetAllPostQuery } from "@/redux/api/postApi";
import { formatTime } from "@/lib/formateTime";
import Loading from "@/components/Global/Loading";

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function RecentMessages() {
  const { data, isLoading } = useGetAllPostQuery([
    { name: "limit", value: "3" },
    { name: "sort", value: "-createdAt" },
    { name: "forumType", value: "STUDY_CIRCLES" },
  ]);

  const posts = data?.data || [];

  return (
    <section className="mb-8 rounded-lg border border-border bg-background p-5 md:p-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Recent messages</h2>
          <p className="text-sm text-muted-foreground">
            Last three Study Circle posts awaiting review or recently published.
          </p>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : posts.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No recent messages yet.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {posts.map((post) => {
            const preview = stripHtml(post.message).slice(0, 140);
            const forumId = post.forumId || post.forum?.id;

            return (
              <li key={post.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {preview || "Empty message"}
                    {stripHtml(post.message).length > 140 ? "…" : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {post.user?.fullName || "Unknown"}
                    {post.forum?.title ? ` · ${post.forum.title}` : ""}
                    {" · "}
                    {formatTime(post.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge variant={post.isPublished ? "secondary" : "outline"}>
                    {post.isPublished ? "Published" : "Pending"}
                  </Badge>
                  {forumId ? (
                    <Link
                      href={`/dashboard/discussion/${forumId}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Manage
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
