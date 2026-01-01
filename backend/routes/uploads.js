const express = require("express");
const multer = require("multer");
const r2 = require("../utils/r2");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// POST /api/upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const folder = req.body.folder || "general";
    const key = `${folder}/${Date.now()}-${file.originalname}`;

    await r2
      .putObject({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    res.json({ url: publicUrl });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
