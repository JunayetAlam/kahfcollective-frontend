import React from 'react';
import Spinner from './Spinner';

export default function Loading() {
    return (
        <div className='py-20 flex justify-center items-center'>
            <Spinner />
        </div>
    );
}