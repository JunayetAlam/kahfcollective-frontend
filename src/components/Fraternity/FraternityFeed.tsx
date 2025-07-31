import Container from "../Global/Container";
import { posts } from "@/data";
import TopTitle from "../Global/TopTitle";
import FRF_CreatePost from "./FRF_CreatePost";
import FRFPost from "./FRFPost";
import FRF_MembersList from "./FRF_MembersList";

export default function FraternityFeed() {
  return (
    <Container className="py-20 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
      <div className="space-y-6">
        <TopTitle hideLine className="font-bold">Group Feed</TopTitle>
        <FRF_CreatePost />

        <div className="space-y-4">
          {posts.map((post, index) => (
            <FRFPost
              key={index}
              post={post}
            />
          ))}
        </div>
      </div>
      <FRF_MembersList />

    </Container>
  );
}