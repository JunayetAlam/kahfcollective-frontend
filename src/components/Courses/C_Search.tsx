"use client"

import { Search } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { handleSetSearchParams } from "@/lib/utils"
import React, { useEffect, useState } from "react"

interface C_SearchProps {
    className?: string;
}

export default function C_Search({ className = "" }: C_SearchProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [searchValue, setSearchValue] = useState('')

   
    const handleSetUrl = React.useCallback(
        (data: Record<string, string>) => {
            handleSetSearchParams(data, searchParams, router);
        },
        [searchParams, router]
    );


    useEffect(() => {
        setTimeout(() => {
            handleSetUrl({ searchTerm: searchValue });
        }, 500);

        return () => { };
    }, [searchValue, handleSetUrl]);

    return (
        <div className={`${className} p-4 h-full`}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search courses..."
                    value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-10 h-10 bg-gray-50 border-gray-200"
                />
            </div>
        </div>
    );
}
