"use client";
import { Pagination } from "@/components/Global/Pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetAllContentsQuery,
} from "@/redux/api/contentApi";
import { TQueryParam } from "@/types";
import { useSearchParams } from "next/navigation";
import CreateContent from "./CreateContent";
import SearchContent from "./SearchContent";
import ContentRow from "./ContentRow";

export default function ContentTable() {
  const searchParams = useSearchParams();

  const page = searchParams?.get("page") || "";
  const role = searchParams?.get("role") || "";
  const searchTerm = searchParams?.get("searchTerm") || "";
  const status = searchParams?.get("status") || "";
  const groupId = searchParams?.get("groupId") || "";

  const queryFilter: TQueryParam[] = [
    { name: "page", value: page },
    { name: "role", value: role },
    { name: "searchTerm", value: searchTerm },
    { name: "status", value: status },
    { name: "groupId", value: groupId },
  ].filter((item) => item.value);

  const { data, isLoading } = useGetAllContentsQuery(queryFilter);


  const contents = data?.data || [];




  return (
    <div className="rounded-lg">
      <SearchContent />
      <div className="my-4 flex justify-end">
        <CreateContent />
      </div>

      <div className="mt-4 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody colSpan={5}>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                </TableRow>
              ))
            ) : !contents.length ? (
              <TableRow>
                <TableCell colSpan={5} className="py-4 text-center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              contents.map((content) => {
                return (
                  <ContentRow key={content.id} content={content} />
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination totalPages={data?.meta?.totalPage ?? 1} />
    </div>
  );
}
