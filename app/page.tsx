import { DocumentHeader } from "@/components/document-header"
import { ProjectInfo } from "@/components/project-info"
import { PartidasTable } from "@/components/partidas-table"
import { RegularizacionSection } from "@/components/regularizacion-section"
import { OptionsComparison } from "@/components/options-comparison"
import { AnexoSection } from "@/components/anexo-section"
import { ResumenCobros } from "@/components/resumen-cobros"
import { DocumentFooter } from "@/components/document-footer"
import { PrintButton } from "@/components/print-button"

export default function ProyectoGraciela() {
  return (
    <div className="min-h-screen bg-background">
      <PrintButton />

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
