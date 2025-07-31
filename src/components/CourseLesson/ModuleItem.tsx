'use client'

import { cn, handleSetSearchParams } from '@/lib/utils';
import { ModuleCourseItem } from '@/types';
import { FileText, PlayCircle, HelpCircle } from 'lucide-react'; // Assuming HelpCircle for quiz
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

export default function ModuleItem({
  moduleItem,
  moduleId
}: {
  moduleItem: ModuleCourseItem;
  moduleId: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Choose icon based on module item type
  let Icon;
  switch (moduleItem.type) {
    case 'video':
      Icon = PlayCircle;
      break;
    case 'document':
      Icon = FileText;
      break;
    case 'quiz':
      Icon = HelpCircle;
      break;
    default:
      Icon = FileText;
  }

  const handleChangeModuleItem = () => {
    handleSetSearchParams(
      { module: moduleId, moduleItem: moduleItem.id },
      searchParams,
      router
    );
  };

  const searchedModule = searchParams.get('module') || '';
  const searchedModuleItem = searchParams.get('moduleItem') || '';
  const isSelected = searchedModule === moduleId && searchedModuleItem === moduleItem.id;

  return (
    <div
      onClick={handleChangeModuleItem}
      className={cn(
        'flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors',
        isSelected ? 'bg-primary text-white' : 'bg-secondary/10'
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <div className="flex-1 text-sm font-medium">{moduleItem.title}</div>
      <div className="text-xs">{moduleItem.duration}</div>
    </div>
  );
}
