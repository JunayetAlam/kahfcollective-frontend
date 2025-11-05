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

      setMessage(""); // clear textarea
      toast.success("Your post is under review, admin will approve it if it's okay.");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create post");
    }
  };

  return (
    <div className="p-4 lg:p-8 border border-gray-200 rounded-xl">
      <RichTextEditor
        hideLevel
        name="What's on your mind?"
        label="What's on your mind?"
        content={message}
        onChangeHandler={(e) => setMessage(e)}
        required
        disable={isLoading}
      />
      <div className="flex justify-end mt-4">
        <Button
          size={"lg"}
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
