import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import sermonImg from '@/assets/sermon.jpg'
import TopTitle from '../Global/TopTitle';
import { NormalContent } from '@/types/normal-content.type';
import ViewArticle from './ViewArticles';
export default function ArticleCard({ article }: { article: NormalContent }) {
  return (
    <Card className="w-full rounded-xl overflow-hidden bg-white p-0 gap-y-0 shadow-none border border-gray-200 max-w-[450px] sm:max-w-full mx-auto">
      <CardHeader className="p-0 ">
        <div className="relative w-full aspect-[7/4] flex items-center justify-center">
          <Image
            src={article.coverImage}
            alt="Sermon Illustration"
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <TopTitle hideLine className='text-center justify-center line-clamp-2' >{article.title}</TopTitle>
        <div dangerouslySetInnerHTML={{ __html: article.description.slice(0, 100) }}></div>
        <div className="flex items-center text-sm text-gray-500 border-t border-gray-200 pt-3">

          <Calendar className="w-4 h-4 mr-2" />
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>
        <p className='text-sm'>By <span className='font-semibold'>{article.author.fullName}</span></p>

      </CardContent>
      <CardFooter className="p-6 pt-3 mt-auto">
        <ViewArticle article={article} trigger={<Button variant={'secondary'} size={'lg'} className='w-full' >
          Read More
        </Button>} />
      </CardFooter>
    </Card>
  );
}