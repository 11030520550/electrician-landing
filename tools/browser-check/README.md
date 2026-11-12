# בדיקת דפדפן אוטומטית (Chrome Headless)

הכלי ששימש לבדיקת האתר בכל שלב: פותח את הדף ב־Chrome ללא חלון, בגדלי מסך שונים, מצלם מסך, מריץ בדיקות JavaScript ומדפיס שגיאות Console.

## הרצה

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\browser-check\cdp.ps1 `
  -Url "file:///C:/path/to/electrician-landing/index.html" `
  -OutDir "C:\temp\browser-check-out" `
  -Plan ".\tools\browser-check\example-plan.json"
```

- `-Url`: כתובת הדף (קובץ מקומי או כתובת אתר).
- `-OutDir`: תיקייה לצילומי המסך ולפרופיל Chrome זמני. כדאי מחוץ לפרויקט.
- `-Plan`: קובץ JSON עם רשימת גדלי מסך, צילומים וקטעי JavaScript לבדיקה (ראו `example-plan.json`).

## דרישות

- Windows עם PowerShell 5.1 ומעלה.
- Google Chrome בנתיב `C:\Program Files\Google\Chrome\Application\chrome.exe`. אם Chrome מותקן במקום אחר, יש לעדכן את המשתנה `$chrome` בראש הסקריפט.
- פורט 9333 פנוי במחשב.

## שרת מקומי (`serve.ps1`)

שרת סטטי מינימלי לבדיקה דרך `http://` במקום `file://`. הוא מחזיר 404 לבקשות POST, כמו Netlify לפני שהופעל זיהוי הטפסים, וכך אפשר לבדוק את הודעת השגיאה של הטופס.

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\browser-check\serve.ps1 -Root "C:\path\to\electrician-landing" -Port 8765
```

אחר כך פותחים `http://localhost:8765/`. לעצירה: Ctrl+C.

תוכניות בדיקה ישנות מכל שלבי הפיתוח נמצאות ב־`archive/dev-history-2026-11-11/test-plans/`.

הכלי אינו משנה את קובצי האתר, ואינו שולח מידע החוצה מלבד טעינת הדף עצמו.
