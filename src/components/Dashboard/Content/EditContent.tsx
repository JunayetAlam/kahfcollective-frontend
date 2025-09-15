"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import CustomForm from "@/components/Forms/CustomForm";
import ContentForm from "./ContentForm";


const defaultValues = {
    contentType: "blog",
    title: "Here we go",
    author: "Karim",
    content: "its the place where we will must go",
    tags: "jannah",
    coverImage: null,
};

export default function EditContent() {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: FieldValues) => {
        setIsSubmitting(true);

        try {
            console.log("Publishing article:", data);


            toast.success("✅ Article published successfully!");

            setOpen(false);
        } catch (error) {
            console.error("Article submission error:", error);
            toast.error("❌ Oops! Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"outline"} >Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Article</DialogTitle>
                </DialogHeader>

                <CustomForm
                    onSubmit={handleSubmit}
                    defaultValues={defaultValues}
                    className="space-y-6 py-4"
                >
                    <ContentForm />

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Editing...
                                </>
                            ) : (
                                "Edit"
                            )}
                        </Button>
                    </div>
                </CustomForm>
            </DialogContent>
        </Dialog>
    );
}