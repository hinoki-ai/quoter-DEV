"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calculator,
  Check,
  AlertTriangle,
  TrendingDown,
  Info,
  ChevronRight,
  MessageCircle,
  Mail,
  ExternalLink,
  Zap,
  Wrench,
  Shield,
  Clock,
  DollarSign,
} from "lucide-react";
import {
  BillingCycle,
  pricingPlans,
  findPricingPlan,
  isValidBillingCycle,
  billingCycleDiscount,
  formatCLP,
  findPlanByProjectValue,
  validatePlanForProject,
  calculateProjectPriceBreakdown,
  compareBillingCycles,
  type ProjectPriceBreakdown,
  type BillingCycleComparison,
  projectComplexityFactors,
  materialQualityFactors,
  brandPreferenceFactors,
  urgencyFactors,
} from "@/lib/pricing-plans";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const numberFormatter = new Intl.NumberFormat("es-CL");

interface AdvancedCalculatorProps {
  className?: string;
}

type ProjectComplexity = keyof typeof projectComplexityFactors;
type MaterialQuality = keyof typeof materialQualityFactors;
type BrandPreference = keyof typeof brandPreferenceFactors;
type UrgencyLevel = keyof typeof urgencyFactors;

// Contact information for quotes
const contactInfo = {
  whatsapp: "+56912345678",
  email: "contacto@electricalenterprise.cl",
  whatsappDisplay: "+56 9 1234 5678",
};

export function AdvancedCalculator({ className }: AdvancedCalculatorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters
  const [selectedPlanId, setSelectedPlanId] = useState<string>(() => {
    const planParam = searchParams.get('plan');
    return planParam ? findPricingPlan(planParam)?.id || pricingPlans[0].id : pricingPlans[0].id;
  });

  const [projectValue, setProjectValue] = useState<number>(() => {
    const valueParam = searchParams.get('value');
    const parsed = valueParam ? parseInt(valueParam, 10) : NaN;
    return isNaN(parsed) ? 1000000 : Math.max(300000, Math.min(50000000, parsed));
  });

  const [billingCycle, setBillingCycleState] = useState<BillingCycle>(() => {
    const billingParam = searchParams.get('billing');
    return isValidBillingCycle(billingParam) ? billingParam : "monthly";
  });

  const [complexity, setComplexity] = useState<ProjectComplexity>(() => {
    const complexityParam = searchParams.get('complexity') as ProjectComplexity;
    return complexityParam && complexityParam in projectComplexityFactors ? complexityParam : 'medium';
  });

  const [materialQuality, setMaterialQuality] = useState<MaterialQuality>(() => {
    const materialParam = searchParams.get('material') as MaterialQuality;
    return materialParam && materialParam in materialQualityFactors ? materialParam : 'standard';
  });

  const [brandPreference, setBrandPreference] = useState<BrandPreference>(() => {
    const brandParam = searchParams.get('brand') as BrandPreference;
    return brandParam && brandParam in brandPreferenceFactors ? brandParam : 'standard';
  });

  const [urgency, setUrgency] = useState<UrgencyLevel>(() => {
    const urgencyParam = searchParams.get('urgency') as UrgencyLevel;
    return urgencyParam && urgencyParam in urgencyFactors ? urgencyParam : 'normal';
  });

  const [manualPlanOverride, setManualPlanOverride] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(String(projectValue));
  const isEditingInput = useRef(false);

  // Get selected plan
  const selectedPlan = useMemo(() => {
    return findPricingPlan(selectedPlanId) || pricingPlans[0];
  }, [selectedPlanId]);

  // Auto-select plan based on project value if not manually overridden
  useEffect(() => {
    if (!manualPlanOverride) {
      const recommendedPlan = findPlanByProjectValue(projectValue);
      if (recommendedPlan.id !== selectedPlan.id) {
        setSelectedPlanId(recommendedPlan.id);
      }
    }
  }, [projectValue, manualPlanOverride, selectedPlan.id]);

  // Update URL when state changes
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    params.set('plan', selectedPlan.id);
    params.set('value', projectValue.toString());
    params.set('billing', billingCycle);
    params.set('complexity', complexity);
    params.set('material', materialQuality);
    params.set('brand', brandPreference);
    params.set('urgency', urgency);

    router.replace(`/advanced-calculator?${params.toString()}`, { scroll: false });
  }, [selectedPlan.id, projectValue, billingCycle, complexity, materialQuality, brandPreference, urgency, router]);

  // Update URL when state changes
  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  // Plan validation
  const planValidation = useMemo(() =>
    validatePlanForProject(selectedPlan, projectValue),
    [selectedPlan, projectValue]
  );

  // Check if there's a better plan for current project value
  const recommendedPlan = useMemo(() =>
    findPlanByProjectValue(projectValue),
    [projectValue]
  );

  const shouldRecommendPlan = useMemo(() =>
    !manualPlanOverride &&
    recommendedPlan.id !== selectedPlan.id &&
    planValidation.isValid,
    [manualPlanOverride, recommendedPlan.id, selectedPlan.id, planValidation.isValid]
  );

  // Calculate price breakdown
  const priceBreakdown = useMemo(() =>
    calculateProjectPriceBreakdown(
      selectedPlan,
      projectValue,
      complexity,
      materialQuality,
      brandPreference,
      urgency,
      billingCycle
    ),
    [selectedPlan, projectValue, complexity, materialQuality, brandPreference, urgency, billingCycle]
  );

  // Billing cycle comparison
  const billingComparisons = useMemo(() =>
    compareBillingCycles(priceBreakdown.adjustedBasePrice),
    [priceBreakdown.adjustedBasePrice]
  );

  const bestBillingCycle = useMemo(() =>
    billingComparisons[0],
    [billingComparisons]
  );

  // Handle project value input
  const handleProjectValueChange = useCallback((value: string) => {
    isEditingInput.current = true;
    if (value === "" || value === "-") {
      setInputValue(value);
      return;
    }

    const numeric = parseInt(value.replace(/\D/g, ""), 10);
    if (!isNaN(numeric)) {
      setInputValue(value.replace(/\D/g, ""));
      const clamped = Math.max(300000, Math.min(50000000, numeric));
      setProjectValue(clamped);
    }
  }, []);

  const handleProjectValueBlur = useCallback(() => {
    isEditingInput.current = false;
    const numeric = parseInt(inputValue, 10);
    if (isNaN(numeric) || inputValue === "") {
      setInputValue(String(projectValue));
    } else {
      const clamped = Math.max(300000, Math.min(50000000, numeric));
      setProjectValue(clamped);
      setInputValue(String(clamped));
    }
  }, [inputValue, projectValue]);

  const adjustProjectValue = useCallback((delta: number) => {
    const newValue = projectValue + delta;
    const clamped = Math.max(300000, Math.min(50000000, newValue));
    setProjectValue(clamped);
    setInputValue(String(clamped));
  }, [projectValue]);

  // Show validation toast
  useEffect(() => {
    if (!planValidation.isValid && planValidation.reasonKey) {
      const message = planValidation.reasonKey
        .replace("{plan}", planValidation.reasonParams?.plan || "")
        .replace("{min}", planValidation.reasonParams?.min || "")
        .replace("{max}", planValidation.reasonParams?.max || "");
      toast.warning(message);
    }
  }, [planValidation]);

  // Generate contact messages
  const contactMessage = useMemo(() => {
    const complexityInfo = projectComplexityFactors[complexity];
    const materialInfo = materialQualityFactors[materialQuality];
    const brandInfo = brandPreferenceFactors[brandPreference];
    const urgencyInfo = urgencyFactors[urgency];

    return `Hola, me gustaría solicitar una cotización para un proyecto eléctrico:

🏗️ *Proyecto:* ${selectedPlan.name}
💰 *Valor estimado:* ${formatCLP(projectValue)}
📏 *Complejidad:* ${complexityInfo.description}
🛠️ *Materiales:* ${materialInfo.description}
🏷️ *Marcas:* ${brandInfo.description}
⏰ *Urgencia:* ${urgencyInfo.description}
💳 *Modalidad:* ${billingCycle === 'monthly' ? 'Pago mensual' :
                  billingCycle === 'quarterly' ? 'Pago trimestral' :
                  billingCycle === 'semestral' ? 'Pago semestral' : 'Pago anual'}
💵 *Total estimado:* ${formatCLP(priceBreakdown.finalPrice)}

¿Podrían contactarme para agendar una visita técnica?`;
  }, [selectedPlan.name, projectValue, complexity, materialQuality, brandPreference, urgency, billingCycle, priceBreakdown.finalPrice]);

  const whatsappUrl = `https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(contactMessage)}`;
  const emailSubject = `Cotización Proyecto Eléctrico - ${selectedPlan.name}`;
  const emailBody = contactMessage;

  const cycleOptions = [
    { value: "monthly", label: "Mensual", description: "Pago mes a mes" },
    { value: "quarterly", label: "Trimestral", description: "Pago cada 3 meses (3% descuento)" },
    { value: "semestral", label: "Semestral", description: "Pago cada 6 meses (8% descuento)" },
    { value: "annual", label: "Anual", description: "Pago anual (15% descuento)" },
  ] as const;

  return (
    <div className={`max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* Header */}
      <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Calculadora Avanzada de Proyectos
              </CardTitle>
              <CardDescription className="text-lg">
                Obtén una cotización precisa basada en las características de tu proyecto
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Plan de Servicio
              </CardTitle>
              <CardDescription>
                Selecciona el plan que mejor se adapte a tu proyecto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {pricingPlans.map((plan) => (
                  <Button
                    key={plan.id}
                    variant={selectedPlan.id === plan.id ? "default" : "outline"}
                    className={`h-auto p-4 flex flex-col items-start gap-2 ${
                      selectedPlan.id === plan.id
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedPlanId(plan.id);
                      setManualPlanOverride(true);
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold">{plan.name}</span>
                      {plan.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {plan.badge}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-left text-muted-foreground">
                      {plan.description}
                    </span>
                    <span className="text-sm font-medium">
                      Desde {formatCLP(plan.basePrice)}
                    </span>
                  </Button>
                ))}
              </div>

              {/* Plan Validation */}
              {!planValidation.isValid && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {planValidation.reasonKey
                      ?.replace("{plan}", planValidation.reasonParams?.plan || "")
                      .replace("{min}", planValidation.reasonParams?.min || "")
                      .replace("{max}", planValidation.reasonParams?.max || "")}
                  </AlertDescription>
                </Alert>
              )}

              {/* Plan Recommendation */}
              {shouldRecommendPlan && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Recomendación:</strong> Para un proyecto de {formatCLP(projectValue)},
                    sugerimos el plan <strong>{recommendedPlan.name}</strong>.
                    <Button
                      variant="link"
                      className="p-0 h-auto font-normal underline"
                      onClick={() => {
                        setSelectedPlanId(recommendedPlan.id);
                        setManualPlanOverride(false);
                      }}
                    >
                      Cambiar a plan recomendado
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Project Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Configuración del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Value */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Valor Estimado del Proyecto
                </Label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      $
                    </span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={inputValue}
                      onChange={(e) => handleProjectValueChange(e.target.value)}
                      onBlur={handleProjectValueBlur}
                      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                      className="pl-8 text-lg font-semibold"
                      placeholder="1.000.000"
                    />
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => adjustProjectValue(-500000)}
                      disabled={projectValue <= 300000}
                    >
                      -500k
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => adjustProjectValue(500000)}
                      disabled={projectValue >= 50000000}
                    >
                      +500k
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCLP(projectValue)} - Rango recomendado: {formatCLP(selectedPlan.minProjectValue)}
                  {selectedPlan.maxProjectValue && ` - ${formatCLP(selectedPlan.maxProjectValue)}`}
                </p>
              </div>

              {/* Project Characteristics */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Complejidad del Proyecto</Label>
                  <Select value={complexity} onValueChange={(value: ProjectComplexity) => setComplexity(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(projectComplexityFactors).map(([key, data]) => (
                        <SelectItem key={key} value={key}>
                          <div>
                            <div className="font-medium capitalize">{key}</div>
                            <div className="text-xs text-muted-foreground">{data.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Calidad de Materiales</Label>
                  <Select value={materialQuality} onValueChange={(value: MaterialQuality) => setMaterialQuality(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(materialQualityFactors).map(([key, data]) => (
                        <SelectItem key={key} value={key}>
                          <div>
                            <div className="font-medium capitalize">{key}</div>
                            <div className="text-xs text-muted-foreground">{data.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Preferencia de Marcas</Label>
                  <Select value={brandPreference} onValueChange={(value: BrandPreference) => setBrandPreference(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(brandPreferenceFactors).map(([key, data]) => (
                        <SelectItem key={key} value={key}>
                          <div>
                            <div className="font-medium capitalize">{key}</div>
                            <div className="text-xs text-muted-foreground">{data.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Nivel de Urgencia
                  </Label>
                  <Select value={urgency} onValueChange={(value: UrgencyLevel) => setUrgency(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(urgencyFactors).map(([key, data]) => (
                        <SelectItem key={key} value={key}>
                          <div>
                            <div className="font-medium capitalize">{key}</div>
                            <div className="text-xs text-muted-foreground">{data.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Modalidad de Pago
              </CardTitle>
              <CardDescription>
                Selecciona la frecuencia de pago que mejor se adapte a tu presupuesto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {cycleOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={billingCycle === option.value ? "default" : "outline"}
                    className={`h-auto p-4 flex flex-col items-start gap-2 ${
                      billingCycle === option.value ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setBillingCycleState(option.value)}
                  >
                    <span className="font-semibold">{option.label}</span>
                    <span className="text-xs text-left text-muted-foreground">
                      {option.description}
                    </span>
                  </Button>
                ))}
              </div>

              {/* Savings Recommendation */}
              {bestBillingCycle && bestBillingCycle.cycle !== billingCycle && bestBillingCycle.savings > 0 && (
                <Alert className="mt-4">
                  <TrendingDown className="h-4 w-4" />
                  <AlertDescription>
                    <strong>💰 Ahorra {formatCLP(bestBillingCycle.savings)}</strong> cambiando a pago {cycleOptions.find(c => c.value === bestBillingCycle.cycle)?.label.toLowerCase()}.
                    <Button
                      variant="link"
                      className="p-0 h-auto font-normal underline ml-2"
                      onClick={() => setBillingCycleState(bestBillingCycle.cycle)}
                    >
                      Aplicar ahorro
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Price Breakdown */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-center">Cotización Detallada</CardTitle>
              <CardDescription className="text-center">
                {selectedPlan.name} - {formatCLP(projectValue)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Price */}
              <div className="text-center p-6 bg-primary/5 rounded-lg border">
                <div className="text-3xl font-bold text-primary mb-2">
                  {formatCLP(priceBreakdown.finalPrice)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {billingCycle === 'monthly' ? 'Pago mensual' :
                   billingCycle === 'quarterly' ? 'Pago trimestral' :
                   billingCycle === 'semestral' ? 'Pago semestral' : 'Pago anual'}
                </div>
                {billingCycle !== 'monthly' && (
                  <div className="text-xs text-green-600 mt-1">
                    Equivalente a {formatCLP(priceBreakdown.monthlyEquivalent)}/mes
                  </div>
                )}
              </div>

              {/* Savings */}
              {priceBreakdown.savings.total > 0 && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-green-800 dark:text-green-200 font-semibold text-center">
                    🎉 Ahorras {formatCLP(priceBreakdown.savings.total)}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-300 text-center mt-1">
                    {priceBreakdown.savings.fromBillingCycle > 0 && `Pago programado: ${formatCLP(priceBreakdown.savings.fromBillingCycle)}`}
                    {priceBreakdown.savings.fromUrgency > 0 && ` • Urgencia: ${formatCLP(priceBreakdown.savings.fromUrgency)}`}
                  </div>
                </div>
              )}

              {/* Key Features */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Características Incluidas:</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Garantía: {selectedPlan.features.warranty} meses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Respuesta: {selectedPlan.features.responseTime}</span>
                  </div>
                  {selectedPlan.features.emergencySupport && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Soporte de emergencias 24/7</span>
                    </div>
                  )}
                  {selectedPlan.features.certification && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Certificación SEC incluida</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3 pt-4 border-t">
                <Button asChild className="w-full" size="lg">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Solicitar Cotización por WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <a href={`mailto:${contactInfo.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar por Email
                  </a>
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Respuesta estimada: 2-4 horas hábiles
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
