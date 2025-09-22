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
import { useGetAllTiersQuery } from "@/redux/api/tierApi";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SearchUser() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("searchTerm") || "";
  const tier = searchParams.get("tierId") || "";

  const [search, setSearch] = useState(searchTerm);

  const router = useRouter();

  const { data: tiersData } = useGetAllTiersQuery([]);
  const tiers = tiersData?.data || [];

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
        value={tier}
        onValueChange={(value) =>
          handleSetUrl({ tierId: value === "all" ? "" : value })
        }
      >
        <SelectTrigger className="min-w-[120px]">
          <SelectValue placeholder="Tier" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tier</SelectLabel>
            <SelectItem value="all">All</SelectItem>
            {tiers.map((t: any) => (
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
