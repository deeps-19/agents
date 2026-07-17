const Client = require("../models/Client");

// Create Client
exports.createClient = async (req, res) => {
  try {
    const {
      fullName,
      dob,
      gender,
      mobile,
      email,
      address,
      notes,
    } = req.body;

    if (!fullName || !dob || !mobile || !email) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const exists = await Client.findOne({
      $or: [{ email }, { mobile }],
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Client already exists",
      });
    }

    const client = await Client.create({
      fullName,
      dob,
      gender,
      mobile,
      email,
      address,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All Clients
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: clients,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Single Client
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.json({
      success: true,
      data: client,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json({
      success: true,
      message: "Client updated successfully",
      data: client,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Client
exports.deleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};