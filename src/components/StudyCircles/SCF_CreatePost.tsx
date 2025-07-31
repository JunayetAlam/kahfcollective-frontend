import React from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { IoMdSend } from 'react-icons/io';

export default function SCF_CreatePost() {
    return (
        <div className='p-4 lg:p-8 border border-gray-200 rounded-xl'>
            <Textarea
                placeholder="What's on your mind?"
                className="w-full min-h-[100px] resize-none border-gray-300 bg-white"
            />
            <div className="flex justify-end mt-4">
                <Button size={'lg'} className="!px-8">
                    <IoMdSend size={20} />
                    Share
                </Button>
            </div>
        </div>
    );
}