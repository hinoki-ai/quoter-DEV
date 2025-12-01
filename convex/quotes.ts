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
