import A_TopData from '@/components/Dashboard/A_TopData';
import ContentTable from '@/components/Dashboard/Content/ContentTable';
import React from 'react';

export default function page() {
  return (
    <div className="w-full h-full space-y-8">
        <A_TopData />
        <ContentTable/>
    </div>
  );
}