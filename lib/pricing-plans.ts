export type BillingCycle = "monthly" | "quarterly" | "semestral" | "annual";

type PlanFeatureValue = boolean | number | string | null;

export interface PlanFeatures {
  // Core electrical services
  basicWiring: boolean;
  advancedWiring: boolean;
  electricalPanel: boolean;
  grounding: boolean;
  lighting: boolean;
  outlets: boolean;
  emergencySystems: boolean;

  // Project complexity factors
  complexityLevel: number; // 1-5 scale
  projectSize: string; // 'small', 'medium', 'large', 'industrial'

  // Materials and quality
  materialQuality: string; // 'standard', 'premium', 'luxury'
  brandPreference: string; // 'economic', 'standard', 'premium'

  // Support and warranty
  warranty: number; // months
  responseTime: string; // '24hrs', '12hrs', '6hrs', '2hrs'
  emergencySupport: boolean;

  // Additional services
  maintenance: boolean;
  monitoring: boolean;
  certification: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  minProjectValue: number;
  maxProjectValue: number | null;
  badge: string | null;
  features: PlanFeatures;
}

// Pricing factors based on project characteristics
export const projectComplexityFactors = {
  small: { factor: 0.85, description: "Proyectos residenciales básicos hasta 100m²" },
  medium: { factor: 1.0, description: "Proyectos residenciales/comerciales medianos 100-500m²" },
  large: { factor: 1.15, description: "Proyectos comerciales grandes 500-2000m²" },
  industrial: { factor: 1.35, description: "Instalaciones industriales y proyectos complejos" },
};

export const materialQualityFactors = {
  standard: { factor: 1.0, description: "Materiales estándar de calidad certificada" },
  premium: { factor: 1.25, description: "Materiales premium con mejores especificaciones" },
  luxury: { factor: 1.5, description: "Materiales de lujo y soluciones personalizadas" },
};

export const brandPreferenceFactors = {
  economic: { factor: 0.9, description: "Marcas económicas con garantía básica" },
  standard: { factor: 1.0, description: "Marcas reconocidas con buena relación precio-calidad" },
  premium: { factor: 1.3, description: "Marcas premium con máxima confiabilidad" },
};

export const urgencyFactors = {
  normal: { factor: 1.0, description: "Plazo estándar 2-4 semanas" },
  priority: { factor: 1.15, description: "Plazo prioritario 1-2 semanas" },
  urgent: { factor: 1.35, description: "Ejecución inmediata 3-5 días hábiles" },
};

export const billingCycleDiscount: Record<BillingCycle, number> = {
  monthly: 0,
  quarterly: 0.03,
  semestral: 0.08,
  annual: 0.15,
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "basico",
    name: "Plan Básico",
    description: "Instalaciones eléctricas esenciales hasta $2.500.000",
    basePrice: 150000,
    minProjectValue: 300000,
    maxProjectValue: 2500000,
    badge: "Más económico",
    features: {
      basicWiring: true,
      advancedWiring: false,
      electricalPanel: true,
      grounding: true,
      lighting: true,
      outlets: true,
      emergencySystems: false,
      complexityLevel: 1,
      projectSize: 'small',
      materialQuality: 'standard',
      brandPreference: 'economic',
      warranty: 12,
      responseTime: '24hrs',
      emergencySupport: false,
      maintenance: false,
      monitoring: false,
      certification: true,
    },
  },
  {
    id: "estandar",
    name: "Plan Estándar",
    description: "Instalaciones completas hasta $8.000.000",
    basePrice: 220000,
    minProjectValue: 2500001,
    maxProjectValue: 8000000,
    badge: null,
    features: {
      basicWiring: true,
      advancedWiring: true,
      electricalPanel: true,
      grounding: true,
      lighting: true,
      outlets: true,
      emergencySystems: false,
      complexityLevel: 3,
      projectSize: 'medium',
      materialQuality: 'standard',
      brandPreference: 'standard',
      warranty: 24,
      responseTime: '12hrs',
      emergencySupport: true,
      maintenance: false,
      monitoring: false,
      certification: true,
    },
  },
  {
    id: "premium",
    name: "Plan Premium",
    description: "Soluciones avanzadas hasta $15.000.000",
    basePrice: 350000,
    minProjectValue: 8000001,
    maxProjectValue: 15000000,
    badge: "Más completo",
    features: {
      basicWiring: true,
      advancedWiring: true,
      electricalPanel: true,
      grounding: true,
      lighting: true,
      outlets: true,
      emergencySystems: true,
      complexityLevel: 4,
      projectSize: 'large',
      materialQuality: 'premium',
      brandPreference: 'standard',
      warranty: 36,
      responseTime: '6hrs',
      emergencySupport: true,
      maintenance: true,
      monitoring: false,
      certification: true,
    },
  },
  {
    id: "empresarial",
    name: "Plan Empresarial",
    description: "Proyectos industriales y corporativos",
    basePrice: 500000,
    minProjectValue: 15000001,
    maxProjectValue: null,
    badge: "Industrial",
    features: {
      basicWiring: true,
      advancedWiring: true,
      electricalPanel: true,
      grounding: true,
      lighting: true,
      outlets: true,
      emergencySystems: true,
      complexityLevel: 5,
      projectSize: 'industrial',
      materialQuality: 'luxury',
      brandPreference: 'premium',
      warranty: 60,
      responseTime: '2hrs',
      emergencySupport: true,
      maintenance: true,
      monitoring: true,
      certification: true,
    },
  },
];

export const featureLabels: Array<{ key: keyof PlanFeatures; label: string; category: string }> = [
  // Core Services
  { key: "basicWiring", label: "Cableado básico e instalación", category: "Servicios Eléctricos" },
  { key: "advancedWiring", label: "Cableado avanzado y automatización", category: "Servicios Eléctricos" },
  { key: "electricalPanel", label: "Tablero eléctrico principal", category: "Servicios Eléctricos" },
  { key: "grounding", label: "Sistema de puesta a tierra", category: "Servicios Eléctricos" },
  { key: "lighting", label: "Instalación de iluminación", category: "Servicios Eléctricos" },
  { key: "outlets", label: "Toma corrientes y enchufes", category: "Servicios Eléctricos" },
  { key: "emergencySystems", label: "Sistemas de emergencia y respaldo", category: "Servicios Eléctricos" },

  // Support & Warranty
  { key: "warranty", label: "Garantía del servicio", category: "Garantía y Soporte" },
  { key: "responseTime", label: "Tiempo de respuesta", category: "Garantía y Soporte" },
  { key: "emergencySupport", label: "Soporte de emergencias", category: "Garantía y Soporte" },

  // Additional Services
  { key: "maintenance", label: "Mantenimiento preventivo", category: "Servicios Adicionales" },
  { key: "monitoring", label: "Monitoreo remoto del sistema", category: "Servicios Adicionales" },
  { key: "certification", label: "Certificación SEC y municipal", category: "Servicios Adicionales" },
];

export const findPricingPlan = (planId: string) =>
  pricingPlans.find((plan) => plan.id === planId);

export const isValidBillingCycle = (
  value: string | null | undefined,
): value is BillingCycle =>
  value === "monthly" || value === "quarterly" || value === "semestral" || value === "annual";

export const formatCLP = (amount: number) =>
  `$${amount.toLocaleString("es-CL")}`;

export const calculateBaseProjectPrice = (
  plan: PricingPlan,
  projectValue: number,
  complexity: keyof typeof projectComplexityFactors,
  materialQuality: keyof typeof materialQualityFactors,
  brandPreference: keyof typeof brandPreferenceFactors,
  urgency: keyof typeof urgencyFactors,
) => {
  const complexityFactor = projectComplexityFactors[complexity].factor;
  const materialFactor = materialQualityFactors[materialQuality].factor;
  const brandFactor = brandPreferenceFactors[brandPreference].factor;
  const urgencyFactor = urgencyFactors[urgency].factor;

  // Base calculation with project value scaling
  const scaledBasePrice = plan.basePrice * (projectValue / 1000000); // Scale based on millions

  // Apply all factors
  return Math.round(scaledBasePrice * complexityFactor * materialFactor * brandFactor * urgencyFactor);
};

export const calculateBillingPrice = (
  basePrice: number,
  billingCycle: BillingCycle,
) => {
  const discount = billingCycleDiscount[billingCycle];
  return Math.round(basePrice * (1 - discount));
};

export const isPlanFeatureEnabled = (value: PlanFeatureValue) => {
  if (typeof value === "boolean") {
    return value;
  }
  return Boolean(value);
};

/**
 * Finds the appropriate pricing plan for a given project value
 */
export const findPlanByProjectValue = (projectValue: number): PricingPlan => {
  const matchingPlan = pricingPlans.find((plan) => {
    if (plan.maxProjectValue === null) {
      return projectValue >= plan.minProjectValue;
    }
    return projectValue >= plan.minProjectValue && projectValue <= plan.maxProjectValue;
  });

  if (!matchingPlan) {
    if (projectValue < pricingPlans[0].minProjectValue) {
      return pricingPlans[0];
    }
    return pricingPlans[pricingPlans.length - 1];
  }

  return matchingPlan;
};

/**
 * Validates if a project value is within the range of a given plan
 */
export const validatePlanForProject = (
  plan: PricingPlan,
  projectValue: number,
): {
  isValid: boolean;
  reasonKey?: string;
  reasonParams?: Record<string, any>;
} => {
  if (projectValue < plan.minProjectValue) {
    return {
      isValid: false,
      reasonKey: "calculator.plan_min_value_error",
      reasonParams: {
        plan: plan.name,
        min: formatCLP(plan.minProjectValue)
      },
    };
  }
  if (plan.maxProjectValue !== null && projectValue > plan.maxProjectValue) {
    return {
      isValid: false,
      reasonKey: "calculator.plan_max_value_error",
      reasonParams: {
        plan: plan.name,
        max: formatCLP(plan.maxProjectValue)
      },
    };
  }
  return { isValid: true };
};

/**
 * Calculates comprehensive price breakdown including all factors
 */
export interface ProjectPriceBreakdown {
  basePrice: number;
  projectValueFactor: number;
  complexityFactor: number;
  complexityMultiplier: number;
  materialFactor: number;
  materialMultiplier: number;
  brandFactor: number;
  brandMultiplier: number;
  urgencyFactor: number;
  urgencyMultiplier: number;
  adjustedBasePrice: number;
  billingCycleDiscount: number;
  billingCycleDiscountAmount: number;
  finalPrice: number;
  monthlyEquivalent: number;
  savings: {
    fromBillingCycle: number;
    fromUrgency: number;
    total: number;
  };
}

export const calculateProjectPriceBreakdown = (
  plan: PricingPlan,
  projectValue: number,
  complexity: keyof typeof projectComplexityFactors,
  materialQuality: keyof typeof materialQualityFactors,
  brandPreference: keyof typeof brandPreferenceFactors,
  urgency: keyof typeof urgencyFactors,
  billingCycle: BillingCycle,
): ProjectPriceBreakdown => {
  const complexityData = projectComplexityFactors[complexity];
  const materialData = materialQualityFactors[materialQuality];
  const brandData = brandPreferenceFactors[brandPreference];
  const urgencyData = urgencyFactors[urgency];

  // Base price calculation
  const basePrice = plan.basePrice;
  const projectValueFactor = projectValue / 1000000; // Scale factor

  // Individual multipliers
  const complexityMultiplier = complexityData.factor;
  const materialMultiplier = materialData.factor;
  const brandMultiplier = brandData.factor;
  const urgencyMultiplier = urgencyData.factor;

  // Calculate adjusted base price with all factors
  const adjustedBasePrice = Math.round(
    basePrice * projectValueFactor * complexityMultiplier * materialMultiplier * brandMultiplier * urgencyMultiplier
  );

  // Apply billing cycle discount
  const cycleDiscount = billingCycleDiscount[billingCycle];
  const billingCycleDiscountAmount = Math.round(adjustedBasePrice * cycleDiscount);
  const finalPrice = adjustedBasePrice - billingCycleDiscountAmount;

  // Calculate monthly equivalent (assuming billing cycle is the period)
  const monthsInCycle = billingCycle === "monthly" ? 1 :
                       billingCycle === "quarterly" ? 3 :
                       billingCycle === "semestral" ? 6 : 12;
  const monthlyEquivalent = Math.round(finalPrice / monthsInCycle);

  // Calculate savings
  const baseWithoutUrgency = Math.round(
    basePrice * projectValueFactor * complexityMultiplier * materialMultiplier * brandMultiplier
  );
  const savingsFromUrgency = baseWithoutUrgency - adjustedBasePrice;
  const savingsFromBillingCycle = billingCycleDiscountAmount;

  return {
    basePrice,
    projectValueFactor,
    complexityFactor: complexityData.factor,
    complexityMultiplier,
    materialFactor: materialData.factor,
    materialMultiplier,
    brandFactor: brandData.factor,
    brandMultiplier,
    urgencyFactor: urgencyData.factor,
    urgencyMultiplier,
    adjustedBasePrice,
    billingCycleDiscount: cycleDiscount,
    billingCycleDiscountAmount,
    finalPrice,
    monthlyEquivalent,
    savings: {
      fromBillingCycle: Math.max(0, savingsFromBillingCycle),
      fromUrgency: Math.max(0, savingsFromUrgency),
      total: Math.max(0, savingsFromBillingCycle + savingsFromUrgency),
    },
  };
};

/**
 * Compares billing cycles and returns the best option
 */
export interface BillingCycleComparison {
  cycle: BillingCycle;
  totalCost: number;
  monthlyCost: number;
  savings: number;
  savingsPercent: number;
}

export const compareBillingCycles = (
  basePrice: number,
): BillingCycleComparison[] => {
  const cycles: BillingCycle[] = ["monthly", "quarterly", "semestral", "annual"];

  const comparisons: BillingCycleComparison[] = cycles.map((cycle) => {
    const discountedPrice = calculateBillingPrice(basePrice, cycle);
    const months = cycle === "monthly" ? 1 :
                  cycle === "quarterly" ? 3 :
                  cycle === "semestral" ? 6 : 12;

    // Normalize to 12 months for fair comparison
    const normalizedCost = discountedPrice * (12 / months);
    const monthlyCost = Math.round(normalizedCost / 12);

    // Calculate savings compared to monthly (most expensive)
    const monthlyCostFull = basePrice;
    const savings = monthlyCostFull - normalizedCost;
    const savingsPercent = (savings / monthlyCostFull) * 100;

    return {
      cycle,
      totalCost: discountedPrice,
      monthlyCost,
      savings: Math.max(0, Math.round(savings)),
      savingsPercent: Math.max(0, Math.round(savingsPercent * 100) / 100),
    };
  });

  return comparisons.sort((a, b) => a.monthlyCost - b.monthlyCost);
};
