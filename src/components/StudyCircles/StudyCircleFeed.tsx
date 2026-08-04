"use client";

import Container from "../Global/Container";
import SCF_MembersList from "./SCF_MembersList";
import SCFPost from "./SCFPost";
import SCF_CreatePost from "./SCF_CreatePost";
import { useGetAllPostForSpecificGroupQuery } from "@/redux/api/postApi";
import { useParams, useSearchParams } from "next/navigation";
import { TQueryParam } from "@/types";
import { Pagination } from "../Global/Pagination";
import Loading from "../Global/Loading";

export default function StudyCircleFeed() {
  const { slug: forumId } = useParams();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "";
  const args: TQueryParam[] = [];
  if (page) args.push({ name: "page", value: page });
  const { data, isLoading } = useGetAllPostForSpecificGroupQuery({
    forumId: forumId as string,
    args,
  });

  if (isLoading) {
    return (
      <Container className="py-16">
        <Loading />
      </Container>
    );
  }

  const posts = data?.data || [];

  return (
    <Container className="grid grid-cols-1 gap-10 py-14 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.8fr)] lg:gap-12">
      <div className="min-w-0 space-y-8">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-[#6f7f63] uppercase">
            Conversation
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[#304437]">Discussion</h2>
          <p className="mt-2 max-w-xl text-sm text-[#5c6b55]">
            Share thoughtfully. New messages appear after review; comments are visible immediately.
          </p>
        </div>

        <SCF_CreatePost />

        <div className="space-y-0 divide-y divide-[#dce3d4] border-y border-[#dce3d4]">
          {posts.length === 0 ? (
            <p className="py-12 text-center text-sm text-[#5c6b55]">
              No published messages yet. Be the first to start the discussion.
            </p>
          ) : (
            posts.map((post) => <SCFPost key={post.id} post={post} />)
          )}
        </div>

        <Pagination totalPages={data?.meta?.totalPage || 0} />
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <SCF_MembersList />
      </aside>
    </Container>
  );
}
