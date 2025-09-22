"use client";

import React from "react";
import { NormalContent } from "@/types/normal-content.type";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";
import Image from "next/image";

interface ViewArticleProps {
    article: NormalContent;
    trigger?: React.ReactNode; // optional custom trigger button
}

export default function ViewArticle({ article, trigger }: ViewArticleProps) {
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
                        View Article
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-w-4xl w-[95vw] p-6 bg-white border-0 shadow-2xl">
                <DialogHeader className="pb-4 border-b border-gray-100">
                    <DialogTitle className="text-xl font-bold text-gray-900">{article.title}</DialogTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                        {article.author?.fullName && (
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                <span>{article.author.fullName}</span>
                            </div>
                        )}
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{formatDate(article.createdAt)}</span>
                        </div>
                    </div>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    {article.coverImage && (
                        <div className="w-full aspect-video relative">
                            <Image
                                src={article.coverImage}
                                alt={article.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    <div
                        className="prose max-w-full text-gray-700"
                        dangerouslySetInnerHTML={{ __html: article.description }}
                    ></div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
