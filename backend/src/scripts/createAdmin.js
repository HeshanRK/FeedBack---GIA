import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";

async function resetAdminPassword() {
  const username = "admin";
  const password = "admin123"; // Your new password
  const hash = await bcrypt.hash(password, 10);

  try {
    const [result] = await pool.query(
      "UPDATE users SET password_hash = ? WHERE username = ?",
      [hash, username]
    );
    
    if (result.affectedRows > 0) {
      console.log("✅ Admin password reset successfully!");
      console.log("Username:", username);
      console.log("Password:", password);
    } else {
      console.log("❌ Admin user not found");
    }
  } catch (err) {
    console.error("Error:", err);
  }
  process.exit();
}

resetAdminPassword();