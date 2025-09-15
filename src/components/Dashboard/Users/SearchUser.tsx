"use client";
import React, { useEffect, useState } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { handleSetSearchParams } from "@/lib/utils";
export default function SearchUser() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("searchTerm") || "";
  const status = searchParams.get("status") || "";
  const role = searchParams.get("role") || "";

  const [search, setSearch] = useState(searchTerm);

  const router = useRouter();

  const handleSetUrl = React.useCallback(
    (data: Record<string, string>) => {
      handleSetSearchParams(data, searchParams, router);
    },
    [searchParams, router]
  );

  useEffect(() => {
    setTimeout(() => {
      handleSetUrl({ searchTerm: search });
    }, 500);

    return () => {};
  }, [search, handleSetUrl]);

  return (
    <div className="flex gap-4">
      <Input
        name="searchTerm"
        placeholder="Search Keyword"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className=""
      />

      <Select
        value={role}
        onValueChange={(value) =>
          handleSetUrl({ role: value === "all" ? "" : value })
        }
      >
        <SelectTrigger className="min-w-[120px]">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Role</SelectLabel>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
            <SelectItem value="USER">Student</SelectItem>
            <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={status}
        onValueChange={(value) =>
          handleSetUrl({ status: value === "all" ? "" : value })
        }
      >
        <SelectTrigger className="min-w-[120px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="BLOCKED">Blocked</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
