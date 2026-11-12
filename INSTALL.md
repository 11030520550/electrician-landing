# התקנת סביבת עבודה במחשב חדש

## תוכנות נדרשות

| תוכנה | למה | חובה? |
|---|---|---|
| Git | שחזור הפרויקט ושמירת שינויים | כן |
| גישה לחשבון GitHub `11030520550` | ה־Repository פרטי | כן |
| דפדפן עדכני (Chrome מומלץ) | צפייה באתר | כן |
| PowerShell 5.1+ (מובנה ב־Windows) | הרצת `build-preview.ps1`, `build-dist.ps1` וכלי הבדיקה | לבנייה ולבדיקה |
| Google Chrome | כלי הבדיקה ב־`tools/browser-check` | לבדיקות בלבד |
| עורך קוד (למשל VS Code) | עריכה | מומלץ |

אין Node.js, npm, Python או מסד נתונים. אין קובצי `.env` ואין מפתחות API.

במחשב Mac או Linux אפשר להריץ את הסקריפטים עם PowerShell 7 (`pwsh`), אבל כלי הבדיקה מניח את נתיב Chrome של Windows.

## שחזור

```powershell
git clone https://github.com/11030520550/electrician-landing.git
cd electrician-landing
git config user.name  "<השם שלך>"
git config user.email "<המייל שלך ב-GitHub>"
```

ההתחברות ל־GitHub נעשית דרך Git Credential Manager (חלון התחברות בדפדפן). לא שומרים Token בקובץ.

## שירותים חיצוניים

- **Google Fonts**: נטען מהאינטרנט בכל פתיחה. אין צורך בהגדרה.
- **Netlify**: פרסום ידני דרך Netlify Drop. הגדרות האתר והטופס נשמרות בחשבון Netlify, לא ב־Git.
- **WhatsApp / חיוג / מייל**: קישורים רגילים, בלי הגדרה.
