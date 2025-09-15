"use client";

import React from "react";
import Title from "@/components/Global/Title";
import Subtitle from "@/components/Global/Subtitle";
import { Skeleton } from "@/components/ui/skeleton";

const StatCardSkeleton = () => (
  <div
    className={
      "bg-white border border-gray-200 rounded-lg px-4 py-6 flex justify-between items-center"
    }
  >
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-16" />
    </div>
    <Skeleton className="aspect-square w-11 rounded-full" />
  </div>
);

export default function A_TopData({ title }: { title: string }) {
  const isLoading = false
  const error = false
  if (isLoading) {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, idx) => (
            <StatCardSkeleton key={idx} />
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="text-center py-8">
          <p className="text-red-500">Failed to load dashboard statistics</p>
        </div>
      </>
    );
  }

  const statss = {
    totalUsers: 5,
    activeCourses: 5,
    monthlyRevenue: 10,
    supportTickets: 10
  };

  // Create dynamic stats array based on API data
  const stats = [
    {
      title: "Total Users",
      value: statss?.totalUsers || 0,
    },
    {
      title: "Active Courses",
      value: statss?.monthlyRevenue || 0,
    },
    {
      title: "Monthly Revenue",
      value: `$${statss?.activeCourses || 0}`,
    },
    {
      title: "Support Tickets",
      value: statss?.supportTickets || 0,
    },
  ];

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <Title>{title}</Title>
       

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className={
              "bg-white border border-gray-200 rounded-lg px-4 py-6 flex justify-between items-center"
            }
          >
            <div className="space-y-2">
              <Subtitle>{item.title}</Subtitle>
              <h4 className="text-foreground text-lg md:text-xl font-bold">
                {item.value}
              </h4>
            </div>
            
          </div>
        ))}
      </div>
    </>
  );
}
