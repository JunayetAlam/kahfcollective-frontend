/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handleSetSearchParams } from "@/lib/utils";
import { useGetAllClassesQuery } from "@/redux/api/classApi";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SearchUser() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("searchTerm") || "";
  const group = searchParams.get("groupId") || "";

  const [search, setSearch] = useState(searchTerm);

  const router = useRouter();

  const { data: classesData } = useGetAllClassesQuery([]);
  const classes = classesData?.data || [];

  const handleSetUrl = React.useCallback(
    (data: Record<string, string>) => {
      handleSetSearchParams(data, searchParams, router);
    },
    [searchParams, router],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSetUrl({ searchTerm: search });
    }, 500);

    return () => clearTimeout(timer);
  }, [search, handleSetUrl]);

  return (
    <div className="flex gap-4">
      <Input
        name="searchTerm"
        placeholder="Search Keyword"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Select
        value={group}
        onValueChange={(value) =>
          handleSetUrl({ groupId: value === "all" ? "" : value })
        }
      >
        <SelectTrigger className="min-w-[120px]">
          <SelectValue placeholder="Class" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Class</SelectLabel>
            <SelectItem value="all">All</SelectItem>
            {classes.map((t: any) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
