import A_TopData from '@/components/Dashboard/A_TopData';
import ForumPage from '@/components/Dashboard/Forum/ForumPage';
import React from 'react';

export default function page() {
  return (
    <div className='space-y-6'>
      <A_TopData title='Forum Moderation' />
      <ForumPage />
    </div>
  );
}