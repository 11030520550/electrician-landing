# אינדקס ארכיון

מה נשמר מחוץ לקוד הפעיל, איפה, ולמה. שום דבר בארכיון לא נטען על ידי האתר.

## נשמר בתיקייה `archive/`

### `archive/electrician-landing-copy-2026-11-09/`

- **המקור**: התיקייה `\u200F\u200Felectrician-landing - עותק` שעל שולחן העבודה. בשם המקורי יש שני תווי כיווניות בלתי נראים (U+200F) בהתחלה, ולכן התיקייה נשמרה בשם נקי.
- **מה יש בה**:
  - `index.html`, `script.js`, `styles.css`: עותק עבודה מוקדם של האתר מ־9.11.2026. הוא לא זהה לאף Commit, ולכן נשמר כפי שהוא.
  - `חשמלאי מוסמך – מקצועיות ואמינות.png`: סקיצת עיצוב של הסקשן הראשון ושל סקשן הערכים, מ־11.11.2026.
- **שימוש**: עיון בלבד. כדי לצפות בגרסה, פותחים את `index.html` מתוך התיקייה.

## נשמר בתיקייה `reference/` (תמונות השראה)

- **שמורות ב־Git מקודם**:
  - `lamp-with-fantasy-futuristic-design.jpg`
  - `modern-3d-lamp-design.jpg`
  - `photovoltaic-solar-power-panel-field-…jpg`
  - `sun-energy-captured-solar-panel-farm-generated-by-ai.jpg`
- **נוספו בגיבוי הזה**:
  - `luxury-modern-living-room-with-comfortable-sofa-generated-by-ai.jpg`
  - `view-contemporary-photorealistic-lamp.jpg`
- **קבצים בגודל 2×2 פיקסלים**: `man-engaged-household-tasks-scenery.jpg` ו־`variety-people-multitasking-3d-cartoon-scene.jpg`. כנראה הורדות שלא הושלמו. נשמרו כמו שהם.

## גרסאות היסטוריות שנמצאות כבר ב־Git

- **התיקייה `electrician-landing-backup-2026-11-11`** (על שולחן העבודה): Clone נקי של ה־Repository הזה ב־Commit `a6a5f7a`, "Initial website version". אין בה שינויים או קבצים נוספים. לכן היא לא הועתקה. לשחזור:
  ```
  git checkout backup-before-light-redesign
  ```
  (התג מצביע על אותו Commit.)
- **כל ההיסטוריה**: `git log --oneline`.

## תיקיות שנבנות מחדש (לא נשמרות)

- `dist/` ו־`netlify-preview/`: נבנות מחדש על ידי `build-dist.ps1` ו־`build-preview.ps1`.

## לא נשמר ב־Git (ממתין להחלטה)

| קובץ | למה לא הועלה |
|---|---|
| `reference/פרסום רבע עמוד (1).pdf` | מודעת דפוס אמיתית של הלקוח. ייתכן שהיא שייכת ללקוח או לגורם שעיצב אותה. ממתינה לאישור לפני שמירה. |
| `reference/a_clean_web_banner_style_layout_on_a_cream_backgro.png` ו־`(1).png` | שני קבצים זהים בגודל 2×2 פיקסלים (79 בייט): הורדה שנכשלה, בלי תוכן. |
