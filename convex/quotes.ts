import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all quotes
export const getAllQuotes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quotes").order("desc");
  },
});

// Get a specific quote with all its related data
export const getQuoteWithDetails = query({
  args: { quoteId: v.id("quotes") },
  handler: async (ctx, args) => {
    const quote = await ctx.db.get(args.quoteId);
    if (!quote) return null;

    const lineItems = await ctx.db
      .query("lineItems")
      .withIndex("by_quote", (q) => q.eq("quoteId", args.quoteId))
      .collect();

    const lineItemIds = lineItems.map(item => item._id);
    const lineItemOptions = await Promise.all(
      lineItemIds.map(lineItemId =>
        ctx.db
          .query("lineItemOptions")
          .withIndex("by_line_item", (q) => q.eq("lineItemId", lineItemId))
          .collect()
      )
    );

    const paymentSummaries = await ctx.db
      .query("paymentSummaries")
      .withIndex("by_quote", (q) => q.eq("quoteId", args.quoteId))
      .collect();

    const regularizationSections = await ctx.db
      .query("regularizationSections")
      .withIndex("by_quote", (q) => q.eq("quoteId", args.quoteId))
      .collect();

    const optionsComparison = await ctx.db
      .query("optionsComparison")
      .withIndex("by_quote", (q) => q.eq("quoteId", args.quoteId))
      .collect();

    const annexSections = await ctx.db
      .query("annexSections")
      .withIndex("by_quote", (q) => q.eq("quoteId", args.quoteId))
      .collect();

    return {
      quote,
      lineItems: lineItems.map((item, index) => ({
        ...item,
        options: lineItemOptions[index] || [],
      })),
      paymentSummaries,
      regularizationSections,
      optionsComparison,
      annexSections,
    };
  },
});

// Create a new quote
export const createQuote = mutation({
  args: {
    clientName: v.string(),
    clientRut: v.string(),
    projectTitle: v.string(),
    projectDescription: v.string(),
    scope: v.string(),
    recommendation: v.optional(v.string()),
    recommendationReason: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("quotes", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a quote
export const updateQuote = mutation({
  args: {
    quoteId: v.id("quotes"),
    clientName: v.optional(v.string()),
    clientRut: v.optional(v.string()),
    projectTitle: v.optional(v.string()),
    projectDescription: v.optional(v.string()),
    scope: v.optional(v.string()),
    recommendation: v.optional(v.string()),
    recommendationReason: v.optional(v.string()),
    notes: v.optional(v.string()),
    totalValue: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { quoteId, ...updates } = args;
    await ctx.db.patch(quoteId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete a quote
export const deleteQuote = mutation({
  args: { quoteId: v.id("quotes") },
  handler: async (ctx, args) => {
    // Delete all related data first
    const lineItems = await ctx.db
      .query("lineItems")
      .withIndex("by_quote", (q) => q.eq("quoteId", args.quoteId))
      .collect();

    for (const item of lineItems) {
      const options = await ctx.db
        .query("lineItemOptions")
        .withIndex("by_line_item", (q) => q.eq("lineItemId", item._id))
        .collect();
      await Promise.all(options.map(option => ctx.db.delete(option._id)));
      await ctx.db.delete(item._id);
    }

    // Delete other related data
    const relatedTables = [
      "paymentSummaries",
      "regularizationSections",
      "optionsComparison",
      "annexSections"
    ];

    for (const table of relatedTables) {
      const records = await ctx.db
        .query(table)
        .withIndex("by_quote", (q) => q.eq("quoteId", args.quoteId))
        .collect();
      await Promise.all(records.map(record => ctx.db.delete(record._id)));
    }

    await ctx.db.delete(args.quoteId);
  },
});

// Create a complete quote with all default data
export const createCompleteQuote = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Create the main quote
    const quoteId = await ctx.db.insert("quotes", {
      clientName: "Sra. Lorena Paris Briones",
      clientRut: "9.014.976-8",
      projectTitle: "Proyecto Graciela - Finalización Aumento Potencia",
      projectDescription: "Finalización de aumento de potencia, recableado de circuitos (luces y enchufes), revisión del segundo piso y obras civiles asociadas. Todos los valores incluyen materiales.",
      scope: "El alcance se limita a la instalación de subalimentadores (troncales), separación de circuitos y reparación de fallas críticas. No incluye cambio de cableado en todos los enchufes, excepto en la habitación principal.",
      recommendation: "Opción B",
      recommendationReason: "Para dejar líneas matrices de ambos pisos en norma y operativas.",
      notes: "La renovación total de la casa requiere una cotización nueva.",
      createdAt: now,
      updatedAt: now,
    });

    // Add line items
    const lineItemsData = [
      {
        title: "Cambio de switch/conmutador",
        description: "Suministro e instalación de conmutador en tablero de 42 A para conexión de generador.",
        value: "$100.000",
        order: 0,
      },
      {
        title: "Preparación de pisos y obras civiles",
        description: "Recuperación de baldosas, visitas técnicas (Sodimac y vendedor de piedra laja) y asesoría.",
        value: "$70.000",
        order: 1,
      },
      {
        title: "Recableado de circuitos (norma SEC)",
        description: "Instalación de dos subalimentadores y división de ramales para separar enchufes y luces.",
        materials: "Cable EVA Nexans (2.5 mm / 1.5 mm), tierra de protección y canaletas Legrand.",
        order: 2,
      },
      {
        title: "Recableado habitación principal y baño",
        description: "Reinstalación de 4 enchufes y 1 luminaria. Definición del color de línea al momento de compra.",
        order: 3,
      },
      {
        title: "Inspección y reparación 2.º piso",
        description: "Revisión y arreglo de falla eléctrica.",
        value: "$50.000",
        note: "Se descuenta si se elige recableado completo – Opción B",
        conditional: true,
        order: 4,
      },
    ];

    const lineItemIds = await Promise.all(
      lineItemsData.map(item =>
        ctx.db.insert("lineItems", {
          quoteId,
          ...item,
        })
      )
    );

    // Add options for specific line items
    const circuitosLineItemId = lineItemIds[2]; // Recableado de circuitos
    await Promise.all([
      ctx.db.insert("lineItemOptions", {
        lineItemId: circuitosLineItemId,
        label: "Primer piso",
        value: "$650.000",
        order: 0,
      }),
      ctx.db.insert("lineItemOptions", {
        lineItemId: circuitosLineItemId,
        label: "Ambos pisos",
        value: "$850.000",
        order: 1,
      }),
    ]);

    const habitacionLineItemId = lineItemIds[3]; // Recableado habitación
    await Promise.all([
      ctx.db.insert("lineItemOptions", {
        lineItemId: habitacionLineItemId,
        label: "Solo habitación",
        value: "$190.000",
        order: 0,
      }),
      ctx.db.insert("lineItemOptions", {
        lineItemId: habitacionLineItemId,
        label: "Habitación + baño",
        value: "$250.000",
        order: 1,
      }),
    ]);

    return quoteId;
  },
});
