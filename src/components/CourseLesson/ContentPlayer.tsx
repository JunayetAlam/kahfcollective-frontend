"use client";

import { CourseContents } from "@/types";
import { ExternalLink } from "lucide-react";
import RichTextContent from "../Forms/RichTextContent";
import PDFViewer from "../Global/PDFViewer";
import VideoPlayer from "../Global/VideoPlayer";
import { Button } from "../ui/button";
import Quiz from "./Quiz/Quiz";

function TextContentPlayer({ contents }: { contents: CourseContents }) {
  if (!contents.text) {
    return (
      <p className="text-sm text-muted-foreground">No text content available.</p>
    );
  }

  return (
    <RichTextContent
      html={contents.text}
      className="rounded-lg border border-border/60 bg-background px-5 py-6"
    />
  );
}

function MeetingLinkPlayer({ contents }: { contents: CourseContents }) {
  const href = contents.meetingLink;
  if (!href) {
    return (
      <p className="text-sm text-muted-foreground">No meeting link available.</p>
    );
  }

  return (
    <div className="flex flex-col items-start gap-4 rounded-lg border border-border/60 bg-secondary/10 px-6 py-8">
      <p className="text-sm text-muted-foreground">
        This lesson takes place in an external meeting. Open the link below to join.
      </p>
      <Button asChild size="lg">
        <a href={href} target="_blank" rel="noopener noreferrer">
          Join Meeting
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}

function VideoLinkPlayer({ contents }: { contents: CourseContents }) {
  const url = contents.videoLink;
  if (!url) {
    return (
      <p className="text-sm text-muted-foreground">No video link available.</p>
    );
  }

  return (
    <VideoPlayer contents={{ ...contents, videoUrl: url }} />
  );
}

export default function ContentPlayer({
  contents,
}: {
  contents: CourseContents;
}) {
  switch (contents.type) {
    case "QUIZ":
      return <Quiz contents={contents} />;
    case "VIDEO":
      return <VideoPlayer contents={contents} />;
    case "VIDEO_LINK":
      return <VideoLinkPlayer contents={contents} />;
    case "PDF":
      return (
        <PDFViewer title={contents.title || "PDF"} pdfUrl={contents.pdfUrl || ""} />
      );
    case "TEXT":
      return <TextContentPlayer contents={contents} />;
    case "MEETING_LINK":
      return <MeetingLinkPlayer contents={contents} />;
    default:
      return (
        <p className="text-sm text-muted-foreground">
          Unsupported content type.
        </p>
      );
  }
}
