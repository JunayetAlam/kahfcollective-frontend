"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination } from "@/components/Global/Pagination";
import Loading from "@/components/Global/Loading";
import { formatTime } from "@/lib/formateTime";
import { Post, Reply, TQueryParam } from "@/types";
import { useGetSingleGroupQuery } from "@/redux/api/groupApi";
import {
  useTogglePublishMutation,
  useToggleDeletePostMutation,
  useGetAllReplyForSpecificPostQuery,
  useDeleteReplyMutation,
  useGetAllPostForSpecificGroupQuery,
} from "@/redux/api/postApi";
import RichTextContent from "@/components/Forms/RichTextContent";

function AdminReply({ comment }: { comment: Reply }) {
  const [deleteReply, { isLoading }] = useDeleteReplyMutation();

  const handleDelete = async () => {
    try {
      await deleteReply(comment.id).unwrap();
      toast.success("Reply deleted");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete reply");
    }
  };

  return (
    <div className="flex items-start justify-between gap-3 rounded-md bg-muted/40 px-3 py-2">
      <div className="min-w-0">
        <p className="text-sm font-medium">{comment.user?.fullName || "Unknown"}</p>
        <RichTextContent
          html={(comment.message || "").replace(/\n/g, "<br>")}
          size="sm"
          className="text-muted-foreground"
        />
        <p className="mt-1 text-xs text-muted-foreground">{formatTime(comment.createdAt)}</p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="shrink-0 text-destructive"
        disabled={isLoading}
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  );
}

function AdminPostCard({ post }: { post: Post }) {
  const [showReplies, setShowReplies] = useState(false);
  const [togglePublish, { isLoading: publishing }] = useTogglePublishMutation();
  const [toggleDelete, { isLoading: deleting }] = useToggleDeletePostMutation();

  const { data: repliesData, isLoading: repliesLoading } =
    useGetAllReplyForSpecificPostQuery(
      {
        postId: post.id,
        args: [{ name: "limit", value: "100" }],
      },
      { skip: !showReplies },
    );

  const replies = repliesData?.data || [];

  const handlePublish = async () => {
    try {
      await togglePublish(post.id).unwrap();
      toast.success(post.isPublished ? "Post unpublished" : "Post published");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update publish status");
    }
  };

  const handleDelete = async () => {
    try {
      await toggleDelete(post.id).unwrap();
      toast.success(post.isDeleted ? "Post restored" : "Post deleted");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update post");
    }
  };

  return (
    <article className="space-y-4 rounded-lg border border-border bg-background p-4 md:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.user?.profile || ""} alt={post.user?.fullName || ""} />
            <AvatarFallback>{post.user?.fullName?.slice(0, 2) || "NA"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.user?.fullName || "Unknown"}</p>
            <p className="text-xs text-muted-foreground">{formatTime(post.createdAt)}</p>
          </div>
        </div>
        <Badge variant={post.isPublished ? "secondary" : "outline"}>
          {post.isPublished ? "Published" : "Pending"}
        </Badge>
      </div>

      <RichTextContent
        html={(post.message || "").replace(/\n/g, "<br>")}
        size="sm"
      />

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
        <Button size="sm" variant="outline" disabled={publishing} onClick={handlePublish}>
          {post.isPublished ? "Unpublish" : "Publish"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive"
          disabled={deleting}
          onClick={handleDelete}
        >
          {post.isDeleted ? "Restore" : "Delete"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setShowReplies((v) => !v)}>
          {showReplies ? "Hide replies" : `Replies (${post._count?.replies || 0})`}
        </Button>
        <span className="ml-auto text-xs text-muted-foreground">
          {post._count?.reacts || 0} reacts
        </span>
      </div>

      {showReplies ? (
        <div className="space-y-2 border-t border-border pt-3">
          {repliesLoading ? (
            <p className="text-sm text-muted-foreground">Loading replies…</p>
          ) : replies.length === 0 ? (
            <p className="text-sm text-muted-foreground">No replies yet.</p>
          ) : (
            replies.map((reply) => <AdminReply key={reply.id} comment={reply} />)
          )}
        </div>
      ) : null}
    </article>
  );
}

export default function GroupDetails({ id }: { id: string }) {
  const { data: groupData, isLoading: groupLoading } = useGetSingleGroupQuery(id);
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "";
  const args: TQueryParam[] = [{ name: "limit", value: "20" }];
  if (page) args.push({ name: "page", value: page });

  const { data: postsData, isLoading: postsLoading } = useGetAllPostForSpecificGroupQuery({
    forumId: id,
    args,
  });

  const group = groupData?.data;
  const posts = postsData?.data || [];

  if (groupLoading) return <Loading />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/discussion"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Groups
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium">Details</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{group?.title}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {group?.description}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {group?.course?.title ? <span>Course: {group.course.title}</span> : null}
            {group?.group?.name ? <span>Class: {group.group.name}</span> : null}
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/feed/${id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Public view
          </Link>
        </Button>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Posts</h2>
          <p className="text-sm text-muted-foreground">
            Publish pending messages. Replies are visible without approval — delete only when needed.
          </p>
        </div>

        {postsLoading ? (
          <Loading />
        ) : posts.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            No posts in this group yet.
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <AdminPostCard key={post.id} post={post} />
            ))}
            <Pagination totalPages={postsData?.meta?.totalPage || 0} />
          </div>
        )}
      </section>
    </div>
  );
}
