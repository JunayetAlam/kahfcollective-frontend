/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { IoMdSend } from "react-icons/io";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreatePostMutation } from "@/redux/api/postApi";
import RichTextEditor from "../Forms/RichTextEditor";

export default function SCF_CreatePost() {
  const { slug: forumId } = useParams();
  const [message, setMessage] = useState("");

  const [createPost, { isLoading }] = useCreatePostMutation();

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    try {
      await createPost({
        id: forumId,
        data: { message },
      }).unwrap();

      setMessage("");
      toast.success("Your post is under review, admin will approve it if it's okay.");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create post");
    }
  };

  return (
    <div className="border border-[#d7ded0] bg-white p-5 md:p-6">
      <p className="mb-4 text-sm font-medium text-[#304437]">Share a message</p>
      <RichTextEditor
        hideLevel
        name="What's on your mind?"
        label="What's on your mind?"
        content={message}
        onChangeHandler={(e) => setMessage(e)}
        required
        disable={isLoading}
      />
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-xs text-[#6f7f63]">
          Posts are reviewed before they appear in the discussion.
        </p>
        <Button
          size="lg"
          className="!px-8 flex items-center gap-2"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Posting...
            </>
          ) : (
            <>
              <IoMdSend size={20} />
              Share
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
