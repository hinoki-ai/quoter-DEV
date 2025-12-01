"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Save, FolderOpen, Plus } from "lucide-react";

export function QuoteManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newQuoteName, setNewQuoteName] = useState("");

  // Convex hooks
  const quotes = useQuery(api.quotes.getAllQuotes);
  const createQuote = useMutation(api.quotes.createQuote);
  const saveCurrentQuote = useMutation(api.quotes.createQuote);

  const handleCreateQuote = async () => {
    if (!newQuoteName.trim()) return;

    // This would save the current hardcoded data as a new quote
    await createQuote({
      clientName: "Sra. Lorena Paris Briones",
      clientRut: "9.014.976-8",
      projectTitle: "Proyecto Graciela - Finalización Aumento Potencia",
      projectDescription: "Finalización de aumento de potencia, recableado de circuitos (luces y enchufes), revisión del segundo piso y obras civiles asociadas. Todos los valores incluyen materiales.",
      scope: "El alcance se limita a la instalación de subalimentadores (troncales), separación de circuitos y reparación de fallas críticas. No incluye cambio de cableado en todos los enchufes, excepto en la habitación principal.",
      recommendation: "Opción B",
      recommendationReason: "Para dejar líneas matrices de ambos pisos en norma y operativas.",
      notes: "La renovación total de la casa requiere una cotización nueva.",
    });

    setNewQuoteName("");
    setIsCreateDialogOpen(false);
  };

  const handleSaveCurrent = async () => {
    await saveCurrentQuote({
      clientName: "Sra. Lorena Paris Briones",
      clientRut: "9.014.976-8",
      projectTitle: "Proyecto Graciela - Finalización Aumento Potencia",
      projectDescription: "Finalización de aumento de potencia, recableado de circuitos (luces y enchufes), revisión del segundo piso y obras civiles asociadas. Todos los valores incluyen materiales.",
      scope: "El alcance se limita a la instalación de subalimentadores (troncales), separación de circuitos y reparación de fallas críticas. No incluye cambio de cableado en todos los enchufes, excepto en la habitación principal.",
      recommendation: "Opción B",
      recommendationReason: "Para dejar líneas matrices de ambos pisos en norma y operativas.",
      notes: "La renovación total de la casa requiere una cotización nueva.",
    });
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex gap-2">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Quote
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Quote</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="quote-name">Quote Name</Label>
                <Input
                  id="quote-name"
                  value={newQuoteName}
                  onChange={(e) => setNewQuoteName(e.target.value)}
                  placeholder="Enter quote name..."
                />
              </div>
              <Button onClick={handleCreateQuote} className="w-full">
                Create Quote
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button size="sm" variant="outline" onClick={handleSaveCurrent}>
          <Save className="w-4 h-4 mr-2" />
          Save Current
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <FolderOpen className="w-4 h-4 mr-2" />
              Load Quote
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Load Quote</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {quotes?.length ? (
                quotes.map((quote) => (
                  <Card key={quote._id} className="cursor-pointer hover:bg-accent">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{quote.projectTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">{quote.clientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No quotes saved yet
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
