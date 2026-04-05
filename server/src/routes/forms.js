import { Router } from "express";
import { insertContactSubmission } from "../services/forms.js";

const router = Router();

router.post("/contact", async (req, res) => {
  const { name, email, phone, message, pagePath, details } = req.body || {};

  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Missing required fields: name, email, phone" });
  }

  try {
    const submission = await insertContactSubmission({
      name: String(name),
      email: String(email),
      phone: String(phone),
      message: message ? String(message) : "New contact inquiry",
      pagePath: pagePath ? String(pagePath) : null,
      details:
        details && typeof details === "object"
          ? Object.fromEntries(
              Object.entries(details).map(([key, value]) => [key, value == null ? null : String(value)]),
            )
          : {},
    });

    return res.status(201).json({ ok: true, submission });
  } catch (err) {
    return res.status(500).json({ error: "Failed to store submission" });
  }
});

export default router;
