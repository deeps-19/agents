const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    // =====================================================
    // COMMON
    // =====================================================

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

    // =====================================================
    // ====================== LIC ==========================
    // =====================================================

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
      trim: true,
    },

    appointeeName: {
      type: String,
      trim: true,
    },

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
      trim: true,
    },

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

    // =====================================================
    // ================= POST OFFICE =======================
    // =====================================================

    scheme: {
      type: String,
      enum: [
        "PPF",
        "NSC",
        "KVP",
        "MIS",
        "RD",
        "TD",
        "SCSS",
        "SSY",
      ],
    },

    accountNumber: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    primaryHolder: {
      type: String,
      trim: true,
    },

    nomineeDetails: {
      type: String,
      trim: true,
    },

    depositAmount: {
      type: Number,
      min: 0,
    },

    interestRate: {
      type: Number,
      min: 0,
    },

    investmentStatus: {
      type: String,
      enum: [
        "Active",
        "Matured",
        "Closed",
        "Premature Closed",
      ],
      default: "Active",
    },

    openingDate: {
      type: Date,
    },

    autoRenewal: {
      type: Boolean,
      default: false,
    },

    // =====================================================
    // PPF
    // =====================================================

    currentFYDeposit: {
      type: Number,
      min: 0,
    },

    ppfLockInPeriod: {
      type: Number,
    },

    ppfExtensionOption: {
      type: String,
    },

    partialWithdrawalEligible: {
      type: Boolean,
      default: false,
    },

    // =====================================================
    // RD
    // =====================================================

    monthlyInstallment: {
      type: Number,
      min: 0,
    },

    rdTenure: {
      type: Number,
      min: 0,
    },

    missedInstallments: {
      type: Number,
      min: 0,
      default: 0,
    },

    // =====================================================
    // MIS
    // =====================================================

    monthlyInterestAmount: {
      type: Number,
      min: 0,
    },

    interestCreditAccount: {
      type: String,
      trim: true,
    },

    // =====================================================
    // NSC
    // =====================================================

    certificateIssueDate: {
      type: Date,
    },

    certificateValue: {
      type: Number,
      min: 0,
    },

    // =====================================================
    // KVP
    // =====================================================

    certificateNumber: {
      type: String,
      trim: true,
    },

    amountDoublesOn: {
      type: Date,
    },

    // =====================================================
    // SCSS
    // =====================================================

    creditFrequency: {
      type: String,
      trim: true,
    },

    seniorCitizenId: {
      type: String,
      trim: true,
    },

    // =====================================================
    // SSY
    // =====================================================

    girlChildName: {
      type: String,
      trim: true,
    },

    girlChildDateOfBirth: {
      type: Date,
    },

    guardianName: {
      type: String,
      trim: true,
    },

    annualDeposit: {
      type: Number,
      min: 0,
    },

    // =====================================================
    // COMMON
    // =====================================================

    notes: {
      type: String,
      trim: true,
    },

    reminderEnabled: {
      type: Boolean,
      default: true,
    },

    reminderDaysBefore: {
      type: Number,
      default: 7,
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