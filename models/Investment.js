const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    investmentType: {
      type: String,
      required: true,
      enum: [
        "LIC",
        "Post Office",
        "Mutual Fund",
        "HDFC Life",
        "General Insurance",
        "Health Insurance",
      ],
    },

    // =========================
    // LIC DETAILS
    // =========================

    policyNumber: {
      type: String,
      trim: true,
    },

    planName: {
      type: String,
      trim: true,
    },

    planType: {
      type: String,
      enum: [
        "Endowment",
        "Term",
        "ULIP",
        "Money Back",
      ],
    },

    policyStatus: {
      type: String,
      enum: [
        "Active",
        "Paid Up",
        "Lapsed",
        "Matured",
      ],
      default: "Active",
    },

    // =========================
    // POLICY HOLDER
    // =========================

    policyHolderName: {
      type: String,
      trim: true,
    },

    nomineeName: {
      type: String,
      trim: true,
    },

    nomineeRelationship: {
      type: String,
      enum: [
        "Spouse",
        "Child",
        "Parent",
        "Sibling",
        "Other",
      ],
    },

    appointeeName: {
      type: String,
      trim: true,
    },

    // =========================
    // PREMIUM DETAILS
    // =========================

    sumAssured: {
      type: Number,
      min: 0,
    },

    annualPremium: {
      type: Number,
      min: 0,
    },

    premiumPayingTerm: {
      type: Number,
      min: 0,
    },

    policyTerm: {
      type: Number,
      min: 0,
    },

    premiumFrequency: {
      type: String,
      enum: [
        "Monthly",
        "Quarterly",
        "Half-Yearly",
        "Yearly",
      ],
    },

    modeOfPayment: {
      type: String,
      enum: [
        "UPI / Net Banking",
        "Cash / Cheque",
        "Direct Debit (NACH)",
      ],
    },

    // =========================
    // IMPORTANT DATES
    // =========================

    policyCommencement: {
      type: Date,
    },

    riskCommencement: {
      type: Date,
    },

    nextPremiumDue: {
      type: Date,
    },

    lastPremiumPaid: {
      type: Date,
    },

    maturityDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Investment",
  investmentSchema
);