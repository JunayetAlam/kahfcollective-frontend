import { Play } from "lucide-react";
import Container from "../Global/Container";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";
import SCF_MembersList from "./SCF_MembersList";
import SCFPost from "./SCFPost";
import SCF_CreatePost from "./SCF_CreatePost";
import { posts } from "@/data";
import TopTitle from "../Global/TopTitle";

export default function StudyCircleFeed() {
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
        </div>
      </div>
      <SCF_MembersList />

    </Container>
  );
}