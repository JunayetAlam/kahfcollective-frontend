import { Star } from 'lucide-react';
import React from 'react';

export default function Rating({ rating }: {
    rating: number
}) {
    return (
        <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-gray-900">{rating.toFixed(1)}</span>
            <div className='flex gap-0.5'>
                {[0, 1, 2, 3, 4].map((star) => {
                    const ratingPercent = (rating - star) * 100;
                    return <div className='relative' key={star}>
                        <Star size={16} className='text-[#D4D6D8]' />
                        <div className='absolute h-full top-0 overflow-hidden' style={{
                            width: `${ratingPercent}%`
                        }}>
                            <Star size={16} className='text-[#F3122C]' fill='#F3122C' />
                        </div>
                    </div>
                })}
            </div>
        </div>
    );
}