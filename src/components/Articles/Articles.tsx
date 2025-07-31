import { articles } from "@/data";
import Container from "../Global/Container";
import TopTitle from "../Global/TopTitle";
import ArticleCard from "./ArticleCard";
import React from "react";

export default function Articles() {
  return (
    <Container className="pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-end pb-4 sm:pb-8 space-y-8 sm:space-y-0">
        <div className="space-y-2 w-full">
          <TopTitle className="justify-center sm:justify-start">All Articles</TopTitle>
        </div>
        {/* Optional "See All" Button */}
        {/* 
        <Link href="/articles">
          <Button size="lg" variant="outline" className="px-10 border-primary text-primary">
            See All
          </Button>
        </Link> 
        */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {articles.map((item) => (
          <ArticleCard key={item.id} article={item} />
        ))}
      </div>
    </Container>
  );
}
