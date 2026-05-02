const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
const QUESTIONS_DIR = path.join(__dirname, "questions");

app.use(cors());
app.use(express.json());

/**
 * GET /api/subjects
 * Returns all subjects and their topics.
 * Folder/file names are English slugs; display names come from inside each JSON file.
 */
app.get("/api/subjects", (req, res) => {
  try {
    const subjects = [];
    const subjectDirs = fs.readdirSync(QUESTIONS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const subjectSlug of subjectDirs) {
      const subjectPath = path.join(QUESTIONS_DIR, subjectSlug);
      const topicFiles = fs.readdirSync(subjectPath).filter((f) => f.endsWith(".json"));

      let subjectDisplayName = subjectSlug;
      const topics = [];

      for (const f of topicFiles) {
        try {
          const data = JSON.parse(fs.readFileSync(path.join(subjectPath, f), "utf8"));
          if (data.subject) subjectDisplayName = data.subject;
          topics.push({
            file: f.replace(".json", ""),
            displayName: data.topic,
            questionCount: data.questions.length,
          });
        } catch {
          // skip malformed files
        }
      }

      subjects.push({ slug: subjectSlug, name: subjectDisplayName, topics });
    }

    res.json({ subjects });
  } catch (err) {
    console.error("Error reading subjects:", err);
    res.status(500).json({ error: "Failed to load subjects" });
  }
});

/**
 * GET /api/questions/:subject/:topic
 * Returns all questions for a given subject slug + topic slug.
 */
app.get("/api/questions/:subject/:topic", (req, res) => {
  try {
    const { subject, topic } = req.params;
    const filePath = path.join(QUESTIONS_DIR, subject, `${topic}.json`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.json(data);
  } catch (err) {
    console.error("Error reading questions:", err);
    res.status(500).json({ error: "Failed to load questions" });
  }
});

app.listen(PORT, () => {
  console.log(`Exam server running on http://localhost:${PORT}`);
});
