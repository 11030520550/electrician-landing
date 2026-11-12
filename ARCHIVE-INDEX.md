# אינדקס ארכיון

מה נשמר מחוץ לקוד הפעיל, איפה ולמה. האתר לא טוען שום קובץ מהארכיון, ו־`build-preview.ps1` ו־`build-dist.ps1` מעתיקים רק את קובצי האתר.

עודכן: 12.11.2026, גיבוי מלא לפני מעבר מחשב.

## `archive/electrician-landing-copy-2026-11-09/`

- **מקור**: התיקייה `\u200F\u200Felectrician-landing - עותק` שעל שולחן העבודה. בשם המקורי יש שני תווי כיווניות בלתי נראים (U+200F), ולכן התיקייה נשמרה בשם נקי.
- **תוכן**:
  - `index.html`, `script.js`, `styles.css`: עותק עבודה מוקדם של האתר מ־9.11.2026. הוא לא זהה לאף Commit.
  - `חשמלאי מוסמך – מקצועיות ואמינות.png`: סקיצת העיצוב של הסקשן הראשון ושל סקשן הערכים (11.11.2026).
- **צפייה**: פותחים את `index.html` מתוך התיקייה.

## `archive/desktop-files/`

- **`פרסום רבע עמוד.pdf`**: הגרסה המוקדמת של מודעת הדפוס של הלקוח (9.11.2026). הקובץ היה מונח ישירות על שולחן העבודה. הגרסה המאוחרת נמצאת ב־`reference/פרסום רבע עמוד (1).pdf`, ובה נוספו "הטבת החודש" וכתובת המייל. שתי הגרסאות שונות, ולכן שתיהן נשמרו.

## `archive/dev-history-2026-11-11/`

חומרי העבודה מתהליך הפיתוח. הם נשמרו מהתיקייה הזמנית של סשן Claude, שאינה חלק מהפרויקט.

| תיקייה | תוכן |
|---|---|
| `test-plans/` | `plan1.json` עד `plan12.json` ו־`plan-preview.json`: תוכניות הבדיקה שהורצו עם `tools/browser-check/cdp.ps1` בכל שלב. אפשר להריץ אותן שוב. |
| `hero-experiments/` | `hero.css` ו־`hero-type.css`: ניסויי CSS לסקשן הראשון שקדמו לגרסה הסופית. |
| `typography-proposals/` | שלוש הצעות הטיפוגרפיה שהוצגו לבחירה: `typography-options.jpg` וקובצי ה־HTML שיצרו אותה (`compare`, `survey`, `hero-fonts`, `nib`, `nib2`). |
| `screenshots/shots1` … `shots15` | צילומי מסך מכל סבב בדיקות, לפי הסדר הכרונולוגי: מחשב, נייד, ריחוף, השוואות. |
| `screenshots/out-preview` | הבדיקה של תיקיית `netlify-preview`. |
| `screenshots/restore-test-out` | הבדיקה של האתר מתוך Clone חדש (בדיקת השחזור). |

לא נשמרו פרופילי Chrome זמניים (Cache) שנוצרו בזמן הבדיקות, ולא טיוטות של הודעות Commit, שכבר נמצאות ב־`git log`.

## `reference/` (חומרי השראה וחומרי לקוח)

- **תמונות השראה**:
  - `lamp-with-fantasy-futuristic-design.jpg`
  - `modern-3d-lamp-design.jpg`
  - `photovoltaic-solar-power-panel-field-…jpg`
  - `sun-energy-captured-solar-panel-farm-generated-by-ai.jpg`
  - `luxury-modern-living-room-with-comfortable-sofa-generated-by-ai.jpg`
  - `view-contemporary-photorealistic-lamp.jpg`
- **`פרסום רבע עמוד (1).pdf`**: מודעת הדפוס של הלקוח, הגרסה המאוחרת.
- **קבצים בגודל 2×2 פיקסלים** (תמונות תקינות אבל ריקות מתוכן; נשמרו כמו שהן):
  - `a_clean_web_banner_style_layout_on_a_cream_backgro.png` ו־`… (1).png`: שני עותקים זהים.
  - `man-engaged-household-tasks-scenery.jpg`
  - `variety-people-multitasking-3d-cartoon-scene.jpg`

## גרסאות היסטוריות ב־Git

- **התיקייה `electrician-landing-backup-2026-11-11`** (על שולחן העבודה): נבדקה קובץ־קובץ, וכל 21 הקבצים בה זהים ל־Commit `a6a5f7a` ("Initial website version"). לכן לא שוכפלה. לשחזור:
  ```
  git checkout backup-before-light-redesign
  ```
  (התג מצביע על אותו Commit.)
- **כל ההיסטוריה**: `git log --oneline`.

## תיקיות שנבנות מחדש (מוחרגות מ־Git)

- `dist/` ו־`netlify-preview/`: נבנות מחדש על ידי `build-dist.ps1` ו־`build-preview.ps1`. אומת שהבנייה מ־Clone חדש מפיקה קבצים זהים.
