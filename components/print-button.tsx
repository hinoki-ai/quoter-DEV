"use client"

import { Printer, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export function PrintButton() {
  const [isGenerating, setIsGenerating] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    setIsGenerating(true)
    try {
      const mainElement = document.querySelector('main') as HTMLElement
      if (!mainElement) return

      // Get all articles (pages)
      const articles = mainElement.querySelectorAll('article')
      const pdf = new jsPDF('p', 'mm', 'a4')

      for (let i = 0; i < articles.length; i++) {
        const article = articles[i] as HTMLElement

        // Temporarily make the article visible and full width for capture
        const originalDisplay = article.style.display
        const originalWidth = article.style.width
        const originalMaxWidth = article.style.maxWidth

        article.style.display = 'block'
        article.style.width = '210mm' // A4 width
        article.style.maxWidth = '210mm'

        // Wait for any animations/transitions
        await new Promise(resolve => setTimeout(resolve, 100))

        const canvas = await html2canvas(article, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 794, // A4 width in pixels at 96 DPI
          height: 1123, // A4 height in pixels at 96 DPI
        })

        // Restore original styles
        article.style.display = originalDisplay
        article.style.width = originalWidth
        article.style.maxWidth = originalMaxWidth

        const imgData = canvas.toDataURL('image/png')

        if (i > 0) {
          pdf.addPage()
        }

        // Calculate dimensions to fit A4
        const imgWidth = 210 // A4 width in mm
        const pageHeight = 297 // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        let heightLeft = imgHeight
        let position = 0

        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)

        // If content is longer than one page, add additional pages
        while (heightLeft >= pageHeight) {
          position = heightLeft - imgHeight
          heightLeft -= pageHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight)
        }
      }

      // Download the PDF
      pdf.save('Proyecto-Graciela-2025.pdf')

    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error al generar el PDF. Inténtalo de nuevo.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
      <Button onClick={handlePrint} variant="outline" size="sm" className="bg-card shadow-lg hover:bg-secondary">
        <Printer className="w-4 h-4 mr-2" />
        Imprimir
      </Button>
      <Button
        onClick={handleDownloadPDF}
        disabled={isGenerating}
        variant="default"
        size="sm"
        className="bg-primary shadow-lg hover:bg-primary/90"
      >
        <Download className="w-4 h-4 mr-2" />
        {isGenerating ? 'Generando...' : 'PDF'}
      </Button>
    </div>
  )
}
