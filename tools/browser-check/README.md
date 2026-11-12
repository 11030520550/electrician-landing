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

הכלי אינו משנה את קובצי האתר, ואינו שולח מידע החוצה מלבד טעינת הדף עצמו.
