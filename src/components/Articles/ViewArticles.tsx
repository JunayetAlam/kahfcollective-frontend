"use client"

import type React from "react"
import { useState } from "react"
import type { NormalContent } from "@/types/normal-content.type"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, User, FileText } from "lucide-react"
import Image from "next/image"
import PDFViewer from "../Global/PDFViewer"

interface ViewArticleProps {
  article: NormalContent
  trigger?: React.ReactNode
}

export default function ViewArticle({ article, trigger }: ViewArticleProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "pdf">("overview")

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const pdf = article.articlePDF

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
            View Article
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-white border-0 shadow-2xl overflow-hidden flex flex-col">
        {/* Header Section */}
        <DialogHeader className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-3">{article.title}</DialogTitle>
              {/* Metadata Section */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                {article.author?.fullName && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{article.author.fullName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{formatDate(article.createdAt)}</span>
                </div>
                {pdf && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span>PDF Available</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Tab Navigation */}
        {pdf && (
          <div className="px-6 pt-4 border-b border-gray-200 flex gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors ${
                activeTab === "overview" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("pdf")}
              className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === "pdf" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FileText className="w-4 h-4" />
              PDF Document
            </button>
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {activeTab === "overview" ? (
            <div className="space-y-6">
              {/* Cover Image */}
              {article.coverImage && (
                <div className="w-full aspect-video relative rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={article.coverImage || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Article Description */}
              <div className="prose prose-sm max-w-full text-gray-700 leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: article.description }} />
              </div>
            </div>
          ) : (
            <div className="w-full h-full">
              {pdf ? (
                <PDFViewer pdfUrl={pdf} title={article.title} />
              ) : (
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No PDF available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
