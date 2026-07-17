const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
{
    // Agent who created this investment
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent",      // or "Agent" if you have a separate Agent model
        required: true,
        index: true
    },

    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },

    investmentType: {
        type: String,
        enum: [
            "LIC",
            "Post Office",
            "Mutual Fund",
            "HDFC Life",
            "General Insurance",
            "Health Insurance"
        ],
        required: true
    },

    companyName: {
        type: String,
        required: true
    },

    policyNumber: {
        type: String,
        required: true,
        unique: true
    },

    planName: String,

    nominee: String,

    premiumAmount: {
        type: Number,
        required: true
    },

    frequency: {
        type: String,
        enum: ["Monthly", "Quarterly", "Half Yearly", "Yearly"],
        default: "Yearly"
    },

    status: {
        type: String,
        enum: ["Active", "Closed", "Lapsed"],
        default: "Active"
    },

    startDate: Date,

    nextPremiumDate: Date,

    maturityDate: Date,

    remarks: String,
    lastReminder: {
    type: Date,
    default: null,
},

},
{
    timestamps: true
});

module.exports = mongoose.model("Investment", investmentSchema);