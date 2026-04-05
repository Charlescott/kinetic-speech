import { Router } from "express";
import { insertContactSubmission } from "../services/forms.js";

const router = Router();

router.post("/contact", async (req, res) => {
  const { name, email, phone, message, pagePath } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields: name, email, message" });
  }

  try {
    const submission = await insertContactSubmission({
      name: String(name),
      email: String(email),
      phone: phone ? String(phone) : null,
      message: String(message),
      pagePath: pagePath ? String(pagePath) : null,
    });

    return res.status(201).json({ ok: true, submission });
  } catch (err) {
    return res.status(500).json({ error: "Failed to store submission" });
  }
});

export default router;

