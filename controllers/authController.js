const Agent = require("../models/Agent");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
exports.registerAgent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAgent = await Agent.findOne({ email });
    if (existingAgent)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const agent = await Agent.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "Agent registered successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.loginAgent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const agent = await Agent.findOne({ email });
    if (!agent)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: agent._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};