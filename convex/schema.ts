import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  quotes: defineTable({
    // Client information
    clientName: v.string(),
    clientRut: v.string(),

    // Project information
    projectTitle: v.string(),
    projectDescription: v.string(),
    scope: v.string(),

    // Recommendation
    recommendation: v.optional(v.string()),
    recommendationReason: v.optional(v.string()),

    // Notes
    notes: v.optional(v.string()),

    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
    totalValue: v.optional(v.number()),
  }),

  lineItems: defineTable({
    quoteId: v.id("quotes"),
    title: v.string(),
    description: v.string(),
    value: v.optional(v.string()), // Could be a range or single value
    materials: v.optional(v.string()),
    note: v.optional(v.string()),
    conditional: v.optional(v.boolean()),
    order: v.number(),
  }),

  lineItemOptions: defineTable({
    lineItemId: v.id("lineItems"),
    label: v.string(),
    value: v.string(),
    order: v.number(),
  }),

  // Payment summary data
  paymentSummaries: defineTable({
    quoteId: v.id("quotes"),
    title: v.string(),
    amount: v.string(),
    order: v.number(),
  }),

  // Regularization sections
  regularizationSections: defineTable({
    quoteId: v.id("quotes"),
    title: v.string(),
    content: v.string(),
    order: v.number(),
  }),

  // Options comparison
  optionsComparison: defineTable({
    quoteId: v.id("quotes"),
    optionName: v.string(),
    description: v.string(),
    cost: v.string(),
    order: v.number(),
  }),

  // Annex sections
  annexSections: defineTable({
    quoteId: v.id("quotes"),
    title: v.string(),
    content: v.string(),
    order: v.number(),
  }),
});
