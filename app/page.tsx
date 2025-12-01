import { DocumentHeader } from "@/components/document-header"
import { ProjectInfo } from "@/components/project-info"
import { PartidasTable } from "@/components/partidas-table"
import { RegularizacionSection } from "@/components/regularizacion-section"
import { OptionsComparison } from "@/components/options-comparison"
import { AnexoSection } from "@/components/anexo-section"
import { ResumenCobros } from "@/components/resumen-cobros"
import { DocumentFooter } from "@/components/document-footer"
import { PrintButton } from "@/components/print-button"
import { QuoteManager } from "@/components/quote-manager"
import { Button } from "@/components/ui/button"
import { Calculator, FileText } from "lucide-react"
import Link from "next/link"

export default function ProyectoGraciela() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold">Proyecto Graciela - Cotización Estática</h1>
          </div>
          <Link href="/advanced-calculator">
            <Button className="gap-2">
              <Calculator className="w-4 h-4" />
              Calculadora Avanzada
            </Button>
          </Link>
        </div>
      </header>

      <PrintButton />
      <QuoteManager />

      <main className="max-w-4xl mx-auto">
        {/* Page 1 */}
        <article className="bg-card shadow-sm">
          <DocumentHeader />
          <div className="px-10 py-8 space-y-8">
            <ProjectInfo />
            <PartidasTable />
          </div>
        </article>

        {/* Page 2 */}
        <article className="bg-card shadow-sm mt-4 page-break">
          <div className="px-10 py-8 space-y-8">
            <RegularizacionSection />
            <OptionsComparison />
          </div>
        </article>

        {/* Page 3 - Anexo */}
        <article className="bg-card shadow-sm mt-4 page-break">
          <div className="px-10 py-8 space-y-8">
            <AnexoSection />
          </div>
        </article>

        {/* Page 4 - Resumen */}
        <article className="bg-card shadow-sm mt-4 page-break">
          <div className="px-10 py-8 space-y-8">
            <ResumenCobros />
            <DocumentFooter />
          </div>
        </article>
      </main>
    </div>
  )
}
