import A_TopData from '@/components/Dashboard/A_TopData';
import QuizTable from '@/components/Dashboard/Quiz/QuizTable';
import React from 'react';

export default function page() {
  return (
    <div className='space-y-6'>
      <A_TopData />
      <QuizTable/>
    </div>
  );
}