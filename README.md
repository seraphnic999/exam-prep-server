# exam-prep-server

Node.js/Express API server for the exam prep app. Serves Hebrew exam questions from JSON files.

## Local setup

```bash
npm install
npm start
# Runs on http://localhost:3001
```

## Adding questions

Files live in `questions/<subject-slug>/<topic-slug>.json`. Folder/file names are **English slugs** to avoid cross-platform encoding issues. The Hebrew display names are stored **inside** each JSON file.

### File format

```json
{
  "subject": "מדעים",
  "topic": "ביולוגיה בסיסית",
  "questions": [
    {
      "id": "q1",
      "question": "מה תפקידה העיקרי של מערכת הדם?",
      "options": ["עיכול מזון", "הובלת חמצן", "סינון פסולת", "ייצור הורמונים"],
      "correct": 1
    }
  ]
}
```

- `correct` = 0-based index of the correct answer
- 2–6 options supported
- New files are picked up automatically — no restart needed

## Deployment on Railway

See the deployment guide in the client README.
