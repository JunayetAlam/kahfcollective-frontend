'use client'
import Container from "../Global/Container";
import TopTitle from "../Global/TopTitle";
import ArticleCard from "./ArticleCard";
import React from "react";
import { TQueryParam } from "@/types";
import { useGetAllContentsQuery } from "@/redux/api/contentApi";
import { useSearchParams } from "next/navigation";
import { Pagination } from "../Global/Pagination";
import Loading from "../Global/Loading";

export default function Articles() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || ''
  const args: TQueryParam[] = [
    { name: "contentType", value: "ARTICLE" }
  ]
  if (page) args.push({ name: 'page', value: page })
  const { data, isLoading } = useGetAllContentsQuery(args);
  if (isLoading) {
    return <Loading/>
  }
  const articles = data?.data || []
  return (
    <Container className="pb-20 pt-5">
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

      {
        articles.length < 1 && <p className="text-center py-20">Article Not Found</p>
      }

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {articles.map((item) => (
          <ArticleCard key={item.id} article={item} />
        ))}
      </div>
      <Pagination totalPages={data?.meta?.totalPage || 0} />
    </Container>
  );
}
