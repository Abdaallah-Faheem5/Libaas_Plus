import  db  from "../../src/configs/db.config.js";
import { users } from "../../src/db/schema.js";
import { eq } from "drizzle-orm";

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const found = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id));

    if (found.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = found[0];

    return res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      imageUrl: user.imageUrl,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const file = req.file;
    const updates = {};

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id));

    if (existing.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (email !== undefined) updates.email = email;
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    updates.imageUrl = imageUrl;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    await db.update(users).set(updates).where(eq(users.id, req.user.id));

    const updated = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id));

    const user = updated[0];

    return res.json({
      message: "Profile updated",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        imageUrl: user.imageUrl,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
// Update profile image
// export const updateProfileImage = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "Image file is required" });
//     }

//     const found = await db
//       .select()
//       .from(users)
//       .where(eq(users.id, req.user.id));

//     if (found.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const imageUrl = `/uploads/${req.file.filename}`;

//     await db.update(users).set({ imageUrl }).where(eq(users.id, req.user.id));

//     return res.json({
//       message: "Profile image updated",
//       imageUrl,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Server error" });
//   }
// };
