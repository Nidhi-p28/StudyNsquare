import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

console.log("🧩 authRoutes loaded successfully!");

// ✅ Test route
router.get("/check", (req, res) => {
  res.json({ message: "Auth route working ✅" });
});

// ✅ Register route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, field, goalHours  } = req.body;
    console.log("📥 Register attempt:", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, field, goalHours  });
    await newUser.save();

    console.log("✅ User saved successfully:", newUser.email);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Error registering user:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// ✅ Login route
/*router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📥 Login attempt:", email);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    console.log("✅ Login success:", email);
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("❌ Error logging in:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;*/
// ✨ LOGIN route
router.post("/login", async (req, res) => {
  console.log("📥 Login attempt received:", req.body);
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("🔍 Found user:", user ? user.email : "no user found");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🧩 Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    console.error("🔥 Error during login:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});


export default router;


