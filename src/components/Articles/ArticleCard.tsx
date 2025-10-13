import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import TopTitle from '../Global/TopTitle';
import { Badge } from '../ui/badge';
import { NormalContent } from '@/types/normal-content.type';
import ViewArticle from './ViewArticles';

export default function ArticleCard({ article }: { article: NormalContent }) {
  return (
    <Card className="w-full rounded-xl overflow-hidden bg-white p-0 gap-y-0 shadow-none border border-gray-200 max-w-[450px] sm:max-w-full mx-auto">
      {/* --- Header with Image and Type Badge --- */}
      <CardHeader className="p-0 relative">
        <div className="relative w-full aspect-[7/4] flex items-center justify-center">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
          />
          {article.type && (
            <Badge
              variant="secondary"
              className="absolute top-3 left-3 bg-primary/90 text-white font-medium text-xs px-3 py-1 rounded-full shadow-md"
            >
              {article.type.replaceAll('_', ' ')}
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* --- Article Details --- */}
      <CardContent className="space-y-3 px-6 py-4">
        <TopTitle hideLine className="text-center justify-center line-clamp-2">
          {article.title}
        </TopTitle>

        <div
          className="text-sm text-gray-700"
          dangerouslySetInnerHTML={{ __html: article.description.slice(0, 100) }}
        />

        <div className="flex items-center text-sm text-gray-500 border-t border-gray-200 pt-3">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>

        <p className="text-sm">
          By <span className="font-semibold">{article.author.fullName}</span>
        </p>
      </CardContent>

      {/* --- Footer with Read More Button --- */}
      <CardFooter className="p-6 pt-3 mt-auto">
        <ViewArticle
          article={article}
          trigger={
            <Button variant="secondary" size="lg" className="w-full">
              Read More
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
