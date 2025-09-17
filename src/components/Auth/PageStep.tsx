import { setCurrentPage, useCurrentSignUpData } from '@/redux/signUpSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import React from 'react';

export default function PageStep({ disable }: { disable?: boolean }) {
    const { currentPage } = useAppSelector(useCurrentSignUpData)
    const dispatch = useAppDispatch()
    const handlePrevPages = (page: number) => {
        dispatch(setCurrentPage({ currentPage: page }))
    }
    return (
        <div className="flex justify-center items-center space-x-4 mt-8">
            {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                    <button
                        onClick={() => {
                            if (!disable) {
                                if (step < currentPage) {
                                    handlePrevPages(step)
                                }
                            }

                        }}
                        type={((currentPage + 1 === step) || !disable) ? "submit" : "button"}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium !cursor-default
                                       ${currentPage === step
                                ? "bg-primary text-white"
                                : currentPage > step
                                    ? "bg-gray-300 text-gray-600"
                                    : "bg-gray-200 text-gray-400"
                            } 
                                       ${currentPage + 1 === step && "!cursor-pointer"}
                                       ${currentPage > step && "!cursor-pointer"}
                                       `}
                    >
                        {step}
                    </button>
                    {step < 3 && (
                        <div
                            className={`w-8 h-0.5 ${currentPage > step ? "bg-gray-300" : "bg-gray-200"
                                }`}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}