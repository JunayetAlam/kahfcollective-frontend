"use client"

import { Search, X } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { handleSetSearchParams } from "@/lib/utils"

interface FilterItem {
    id: string;
    name: string;
}

interface FilterSectionProps {
    title: string;
    items: FilterItem[];
    selectedItems: string[];
    onItemChange: (itemId: string) => void;
}

interface C_SearchProps {
    className?: string;
}

const categories: FilterItem[] = [
    { id: "aqeedah", name: "Aqeedah" },
    { id: "fiqh", name: "Fiqh" },
    { id: "tafsir", name: "Tafsir" },
    { id: "hadith", name: "Hadith" },
    { id: "arabic", name: "Arabic" },
];

const pricingOptions: FilterItem[] = [
    { id: "awaken", name: "Awaken" },
    { id: "ascend", name: "Ascend" },
    { id: "actualize", name: "Actualize" },
];

export default function C_Search({ className = "" }: C_SearchProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get current values from URL params
    const searchTerm = searchParams.get("searchTerm") || "";
    const selectedCategories = searchParams.get("category")?.split(",").filter(Boolean) || [];
    const selectedLevels = searchParams.get("level")?.split(",").filter(Boolean) || [];
    const selectedPricing = searchParams.get("pricing")?.split(",").filter(Boolean) || [];

    // Check if any filters are active
    const hasActiveFilters = selectedCategories.length > 0 || selectedLevels.length > 0 || selectedPricing.length > 0;

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;

        handleSetSearchParams(
            { searchTerm: newSearchTerm },
            searchParams,
            router
        );
    };
    // Handle category selection
    const handleCategoryChange = (categoryId: string) => {
        const newCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(id => id !== categoryId)
            : [...selectedCategories, categoryId];

        handleSetSearchParams(
            { category: newCategories.join(',') },
            searchParams,
            router
        );
    };

    // // Handle level selection
    // const handleLevelChange = (levelId: string) => {
    //     const newLevels = selectedLevels.includes(levelId)
    //         ? selectedLevels.filter(id => id !== levelId)
    //         : [...selectedLevels, levelId];

    //     handleSetSearchParams('level', newLevels.join(','), searchParams, router)
    // };

    const handlePricingChange = (pricingId: string) => {
        const newPricing = selectedPricing.includes(pricingId)
            ? selectedPricing.filter(id => id !== pricingId)
            : [...selectedPricing, pricingId];

        handleSetSearchParams(
            { pricing: newPricing.join(',') },
            searchParams,
            router
        );
    };

    // Handle clear all filters
    const handleClearAllFilters = () => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('category');
        newSearchParams.delete('level');
        newSearchParams.delete('pricing');

        // Keep the search term if it exists
        if (searchTerm) {
            newSearchParams.set('searchTerm', searchTerm);
        }

        router.push(`?${newSearchParams.toString()}`, { scroll: false });
    };

    return (
        <div className={`${className} p-4 h-full`}>
            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10 h-10 bg-gray-50 border-gray-200"
                />
            </div>

            {/* Clear All Filters Button */}
            {hasActiveFilters && (
                <div className="mb-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearAllFilters}
                        className="w-full text-gray-600 border-gray-200 hover:bg-gray-50"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Clear All Filters
                    </Button>
                </div>
            )}

            {/* Categories */}
            <FilterSection
                title="Categories"
                items={categories}
                selectedItems={selectedCategories}
                onItemChange={handleCategoryChange}
            />

            <div className="border-t mb-5 border-gray-200 w-full"></div>


            <div className="border-t mb-5 border-gray-200 w-full"></div>

            {/* Pricing */}
            <FilterSection
                title="Pricing"
                items={pricingOptions}
                selectedItems={selectedPricing}
                onItemChange={handlePricingChange}
            />
        </div>
    );
}

function FilterSection({ title, items, selectedItems, onItemChange }: FilterSectionProps) {
    return (
        <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
            <div className="space-y-3">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                        <Checkbox
                            id={item.id}
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => onItemChange(item.id)}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label
                            htmlFor={item.id}
                            className="text-sm text-gray-700 cursor-pointer"
                        >
                            {item.name}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );
}