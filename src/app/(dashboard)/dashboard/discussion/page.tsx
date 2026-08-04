import A_TopData from '@/components/Dashboard/A_TopData';
import GroupPage from '@/components/Dashboard/Group/GroupPage';
import React from 'react';

export default function page() {
  return (
    <div className='space-y-6'>
      <A_TopData />
      <GroupPage />
    </div>
  );
}