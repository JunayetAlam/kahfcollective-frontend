"use client";
import { Pagination } from "@/components/Global/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteContentByIdMutation,
  useGetAllContentsQuery,
} from "@/redux/api/contentApi";
import { TQueryParam } from "@/types";
import { Trash } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import CreateContent from "./CreateContent";
import EditContent from "./EditContent";
import SearchContent from "./SearchContent";

export default function ContentTable() {
  const searchParams = useSearchParams();

  const page = searchParams?.get("page") || "";
  const role = searchParams?.get("role") || "";
  const searchTerm = searchParams?.get("searchTerm") || "";
  const status = searchParams?.get("status") || "";
  const tierId = searchParams?.get("tierId") || "";

  const queryFilter: TQueryParam[] = [
    { name: "page", value: page },
    { name: "role", value: role },
    { name: "searchTerm", value: searchTerm },
    { name: "status", value: status },
    { name: "tierId", value: tierId },
  ].filter((item) => item.value);

  const { data, isLoading } = useGetAllContentsQuery(queryFilter);
  const [deleteContent] = useDeleteContentByIdMutation();

  const [selectedContentId, setSelectedContentId] = useState<string | null>(
    null,
  );
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);

  const contents = data?.data || [];

  const handleConfirmDelete = async () => {
    if (!selectedContentId) return;
    try {
      setLoadingDeleteId(selectedContentId);
      await deleteContent(selectedContentId).unwrap();
      toast.success("Content deleted successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to delete content");
    } finally {
      setOpenConfirm(false);
      setSelectedContentId(null);
      setLoadingDeleteId(null);
    }
  };
  

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
              <TableHead>Tier</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
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
                const isDeletingThis = loadingDeleteId === content.id;
                return (
                  <TableRow key={content.id}>
                    <TableCell className="font-medium">
                      <Badge variant="secondary">{content.contentType}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {content.author.fullName}
                    </TableCell>
                    <TableCell className="truncate">{content.title}</TableCell>
                    <TableCell>{content.tier.name}</TableCell>
                    <TableCell className="flex flex-row items-center space-x-2">
                      <EditContent contentId={content.id} />
                      <Dialog
                        open={openConfirm && selectedContentId === content.id}
                        onOpenChange={setOpenConfirm}
                      >
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => {
                              setSelectedContentId(content.id);
                              setOpenConfirm(true);
                            }}
                            variant="destructive"
                            size="icon"
                            disabled={isDeletingThis}
                          >
                            <Trash />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[400px]">
                          <DialogHeader>
                            <DialogTitle>Confirm Delete</DialogTitle>
                            <p>
                              Are you sure you want to delete this content? This
                              action cannot be undone.
                            </p>
                          </DialogHeader>
                          <DialogFooter className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setOpenConfirm(false)}
                              disabled={isDeletingThis}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleConfirmDelete}
                              disabled={isDeletingThis}
                            >
                              {isDeletingThis ? "Deleting..." : "Delete"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
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
