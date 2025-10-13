import Container from "../Global/Container";
import SCF_MembersList from "./SCF_MembersList";
import SCFPost from "./SCFPost";
import SCF_CreatePost from "./SCF_CreatePost";
import TopTitle from "../Global/TopTitle";
import { useGetAllPostForSpecificForumQuery } from "@/redux/api/postApi";
import { useParams, useSearchParams } from "next/navigation";
import { TQueryParam } from "@/types";
import { Pagination } from "../Global/Pagination";
import Loading from "../Global/Loading";

export default function StudyCircleFeed() {
  const { slug: forumId } = useParams();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || ''
  const args: TQueryParam[] = [
  ]
  if (page) args.push({ name: 'page', value: page })
  const { data, isLoading } = useGetAllPostForSpecificForumQuery({ forumId: forumId as string, args })
  if (isLoading) {
    return <Loading/>
  }
  const posts = data?.data || []
  return (
    <Container className="py-20 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
      <div className="space-y-6">
        <TopTitle hideLine className="font-bold">Group Feed</TopTitle>
        <SCF_CreatePost />

        <div className="space-y-4">
          {posts.map((post, index) => (
            <SCFPost
              key={index}
              post={post}
            />
          ))}
          <Pagination totalPages={data?.meta?.totalPage || 0} />
        </div>
      </div>
      <SCF_MembersList />

    </Container>
  );
}