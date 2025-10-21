"use client"

import { useState } from "react"
import { FileText, Loader, ExternalLink } from "lucide-react"
import { Button } from "../ui/button"

interface PDFViewerProps {
    pdfUrl: string
    title: string
}

export default function PDFViewer({ pdfUrl, title }: PDFViewerProps) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const handleLoad = () => {
        setLoading(false)
        setError(false)
    }

    const handleError = () => {
        setLoading(false)
        setError(true)
    }

    const openInNewTab = () => {
        window.open(pdfUrl, '_blank')
    }

    return (
        <div className="w-full h-full flex flex-col bg-gray-100 relative">
            {/* Header with title and open in new tab button */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 truncate">{title}</h2>
                <Button
                    onClick={openInNewTab}
                    title="Open in new tab"
                >
                    <ExternalLink />
                    <span className="hidden sm:inline">Open</span>
                </Button>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white z-10">
                    <Loader className="w-8 h-8 text-gray-400 animate-spin" />
                    <p className="text-gray-500 text-sm">Loading PDF...</p>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white z-10">
                    <FileText className="w-12 h-12 text-gray-300" />
                    <p className="text-gray-500 text-center max-w-sm px-4">
                        Unable to load PDF. Your browser may not support inline PDF viewing.
                    </p>
                    <button
                        onClick={openInNewTab}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Open PDF in new tab
                    </button>
                </div>
            )}

            {/* PDF iframe */}
            <iframe
                src={pdfUrl}
                className="w-full h-[60vh] border-0"
                title={title}
                onLoad={handleLoad}
                onError={handleError}
                style={{ display: error ? 'none' : 'block' }}
            />
        </div>
    )
}