/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from "react"
import { FileText, Loader } from "lucide-react"
import * as pdfjsLib from "pdfjs-dist"

// Set worker source from node_modules
if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
    ).toString()
}

interface PDFViewerProps {
    pdfUrl: string
    title: string
}

export default function PDFViewer({ pdfUrl, title }: PDFViewerProps) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null)
    const [totalPages, setTotalPages] = useState(0)
    const canvasRefs = useState(() => new Map<number, HTMLCanvasElement>())[0]
    const svgRefs = useState(() => new Map<number, SVGSVGElement>())[0]

    // Load PDF document
    useEffect(() => {
        const loadPdf = async () => {
            try {
                setLoading(true)
                setError(null)
                
                const pdfDoc = await pdfjsLib.getDocument({
                    url: pdfUrl,
                    withCredentials: false,
                }).promise
                
                setPdf(pdfDoc)
                setTotalPages(pdfDoc.numPages)
            } catch (err) {
                console.error("PDF loading error:", err)
                setError("Failed to load PDF. Please check the URL and try again.")
            } finally {
                setLoading(false)
            }
        }

        if (pdfUrl) {
            loadPdf()
        }
    }, [pdfUrl])

    // Render all pages
    useEffect(() => {
        if (!pdf || totalPages === 0) return

        const renderAllPages = async () => {
            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                const canvas = canvasRefs.get(pageNum)
                const svg = svgRefs.get(pageNum)
                if (!canvas || !svg) continue

                try {
                    const page = await pdf.getPage(pageNum)
                    const viewport = page.getViewport({ scale: 2.5 })

                    // Render canvas
                    canvas.width = viewport.width
                    canvas.height = viewport.height

                    const renderContext = {
                        canvasContext: canvas.getContext("2d")!,
                        viewport: viewport,
                        canvas: canvas,
                    }

                    await page.render(renderContext).promise

                    // Render SVG text layer
                    svg.setAttribute("width", String(viewport.width))
                    svg.setAttribute("height", String(viewport.height))
                    svg.setAttribute("viewBox", `0 0 ${viewport.width} ${viewport.height}`)
                    svg.innerHTML = ""

                    const textContent = await page.getTextContent()
                    const textItems = textContent.items as any[]

                    textItems.forEach((item) => {
                        const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
                        text.setAttribute("x", String(item.transform[4]))
                        text.setAttribute("y", String(viewport.height - item.transform[5]))
                        text.setAttribute("font-size", String(Math.max(item.height * 0.8, 8)))
                        text.setAttribute("fill", "transparent")
                        text.setAttribute("font-family", "Arial, sans-serif")
                        text.setAttribute("style", "cursor: text; user-select: text;")
                        text.textContent = item.str

                        svg.appendChild(text)
                    })
                } catch (err) {
                    console.error(`Page ${pageNum} rendering error:`, err)
                }
            }
        }

        renderAllPages()
    }, [pdf, totalPages])

    if (loading) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <Loader className="w-8 h-8 text-gray-400 animate-spin" />
                <p className="text-gray-500 text-sm">Loading PDF...</p>
            </div>
        )
    }

    if (error || !pdf) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <FileText className="w-12 h-12 text-gray-300" />
                <p className="text-gray-500 text-center max-w-sm">{error || "Unable to load PDF"}</p>
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col bg-white overflow-y-auto">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <div key={pageNum} className="w-full flex items-center justify-center bg-white p-0 relative">
                    <div className="relative inline-block w-full" style={{ maxWidth: "100%" }}>
                        <canvas 
                            ref={(el) => {
                                if (el) {
                                    canvasRefs.set(pageNum, el)
                                }
                            }}
                            className="w-full h-auto block"
                            style={{ maxWidth: "100%", display: "block" }}
                        />
                        <svg
                            ref={(el) => {
                                if (el) {
                                    svgRefs.set(pageNum, el)
                                }
                            }}
                            className="absolute top-0 left-0 w-full h-full"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                pointerEvents: "auto",
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}