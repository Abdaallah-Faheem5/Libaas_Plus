import { db } from "../../drizzle/db.js";
import { users } from "../../schema/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

//register new user
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // check existing user
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // insert
    await db.insert(users).values({
      firstName,
      lastName,
      email,
      passwordHash: hashed,
      role: "customer",
      provider: "local",
    });

    return res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

//login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const found = await db.select().from(users).where(eq(users.email, email));

    if (found.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = found[0];

    if (user.provider === "google") {
      return res
        .status(400)
        .json({
          message:
            "This account uses Google sign-in. Use Google login instead.",
        });
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
