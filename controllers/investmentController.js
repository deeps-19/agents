const Investment = require("../models/Investment");
const Client = require("../models/Client");

// =====================================================
// CREATE
// =====================================================

exports.createInvestment = async (req, res) => {
  try {
    const {
      clientId,
      investmentType,
    } = req.body;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    if (!investmentType) {
      return res.status(400).json({
        success: false,
        message: "Investment type is required",
      });
    }

    // Check client
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // =================================================
    // LIC
    // =================================================

    if (investmentType === "LIC") {

      if (!req.body.policyNumber) {
        return res.status(400).json({
          success: false,
          message: "Policy number is required",
        });
      }

      if (!req.body.planName) {
        return res.status(400).json({
          success: false,
          message: "Plan name is required",
        });
      }

      // Duplicate LIC policy
      const existingPolicy =
        await Investment.findOne({
          investmentType: "LIC",
          policyNumber:
            req.body.policyNumber.trim(),
        });

      if (existingPolicy) {
        return res.status(409).json({
          success: false,
          message:
            "This LIC policy number already exists.",
        });
      }
    }

    // =================================================
    // POST OFFICE
    // =================================================

    if (investmentType === "Post Office") {

      if (!req.body.scheme) {
        return res.status(400).json({
          success: false,
          message:
            "Post Office scheme is required",
        });
      }

      if (!req.body.accountNumber) {
        return res.status(400).json({
          success: false,
          message:
            "Account number is required",
        });
      }

      // Duplicate account
      const existingAccount =
        await Investment.findOne({
          investmentType: "Post Office",
          accountNumber:
            req.body.accountNumber.trim(),
        });

      if (existingAccount) {
        return res.status(409).json({
          success: false,
          message:
            "This Post Office account number already exists.",
        });
      }
    }

    // =================================================
    // CREATE
    // =================================================

    const investment =
      await Investment.create(req.body);

    return res.status(201).json({
      success: true,
      message:
        "Investment created successfully",
      data: investment,
    });

  } catch (error) {

    console.error(
      "Create Investment Error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Duplicate investment record.",
        field:
          Object.keys(
            error.keyPattern || {}
          )[0],
        value:
          Object.values(
            error.keyValue || {}
          )[0],
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to create investment",
      error: error.message,
    });
  }
};


// =====================================================
// GET SINGLE
// =====================================================

exports.getInvestment = async (req, res) => {
  try {

    const investment =
      await Investment
        .findById(req.params.id)
        .populate("clientId");

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: investment,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message:
        "Failed to get investment",
      error: error.message,
    });
  }
};


// =====================================================
// GET CLIENT INVESTMENTS
// =====================================================

exports.getClientInvestments = async (
  req,
  res
) => {
  try {

    const investments =
      await Investment
        .find({
          clientId: req.params.clientId,
        })
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: investments.length,
      data: investments,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message:
        "Failed to get investments",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE
// =====================================================

exports.updateInvestment = async (
  req,
  res
) => {
  try {

    const investment =
      await Investment.findById(
        req.params.id
      );

    if (!investment) {
      return res.status(404).json({
        success: false,
        message:
          "Investment not found",
      });
    }

    // LIC duplicate check
    if (
      req.body.investmentType === "LIC" &&
      req.body.policyNumber
    ) {

      const duplicate =
        await Investment.findOne({
          investmentType: "LIC",
          policyNumber:
            req.body.policyNumber.trim(),

          _id: {
            $ne: req.params.id,
          },
        });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "This LIC policy number already exists.",
        });
      }
    }

    // Post Office duplicate check
    if (
      req.body.investmentType === "Post Office" &&
      req.body.accountNumber
    ) {

      const duplicate =
        await Investment.findOne({
          investmentType: "Post Office",
          accountNumber:
            req.body.accountNumber.trim(),

          _id: {
            $ne: req.params.id,
          },
        });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "This Post Office account number already exists.",
        });
      }
    }

    Object.assign(
      investment,
      req.body
    );

    await investment.save();

    return res.status(200).json({
      success: true,
      message:
        "Investment updated successfully",
      data: investment,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message:
        "Failed to update investment",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE
// =====================================================

exports.deleteInvestment = async (
  req,
  res
) => {
  try {

    const investment =
      await Investment.findByIdAndDelete(
        req.params.id
      );

    if (!investment) {
      return res.status(404).json({
        success: false,
        message:
          "Investment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Investment deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete investment",
      error: error.message,
    });
  }
};