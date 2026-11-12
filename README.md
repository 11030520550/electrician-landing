# צבי כצמאן | חשמלאי מוסמך — דף נחיתה

דף נחיתה סטטי בעברית (RTL) עבור צבי כצמאן, חשמלאי מוסמך. כרגע זו גרסת תצוגה ללקוח (`noindex`), שמתפרסמת ידנית ב־Netlify Drop.

## מבנה הפרויקט

| נתיב | תפקיד |
|---|---|
| `index.html` | הדף עצמו (קובץ הכניסה) |
| `styles.css` | כל העיצוב |
| `script.js` | תפריט, אנימציות גלילה, חוט השירותים, טופס Netlify |
| `_headers` | כותרות אבטחה ל־Netlify |
| `assets/images/` | תמונות האתר; מקור ורישוי ב־`assets/images/SOURCES.md` |
| `build-preview.ps1` | בונה את `netlify-preview/` להעלאה ידנית ל־Netlify Drop (בלי הטופס הלא־מחובר) |
| `build-dist.ps1` | בונה את `dist/` — אותם קבצים, כולל הטופס המוסתר |
| `tools/browser-check/` | כלי בדיקה אוטומטית ב־Chrome (ראו README בתיקייה) |
| `reference/` | תמונות השראה. לא בשימוש באתר |
| `archive/` | גרסאות וסקיצות ישנות. לא בשימוש באתר. פירוט ב־`ARCHIVE-INDEX.md` |

`dist/` ו־`netlify-preview/` נוצרות מחדש על ידי הסקריפטים ומוחרגות מ־Git.

## הרצה מקומית

אין תלויות ואין שלב בנייה.

1. `git clone https://github.com/11030520550/electrician-landing.git`
2. פתחו את `index.html` בדפדפן (לחיצה כפולה מספיקה).
   הפונטים נטענים מ־Google Fonts, ולכן נדרש חיבור לאינטרנט כדי לראות את הטיפוגרפיה הנכונה.

## הכנה לפרסום (ידני בלבד)

```powershell
powershell -ExecutionPolicy Bypass -File .\build-preview.ps1
```

מעלים את התיקייה `netlify-preview` שנוצרת ל־Netlify Drop. אין פרסום אוטומטי מ־GitHub, ואסור לחבר כזה בלי אישור.

## מסמכים נוספים

- `INSTALL.md` — מה להתקין במחשב חדש.
- `PROJECT-HANDOFF.md` — מצב הפרויקט, החלטות ומשימות פתוחות.
- `ARCHIVE-INDEX.md` — מה נשמר בארכיון ולמה.
- `AGENTS.md` — כללי עבודה ופרסום בפרויקט.
