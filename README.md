# OT Manager — Android PWA + Google Sheets Cloud

This is an installable Android web app (PWA) starter backed by Google Sheets through Google Apps Script. It is not a signed APK.

## Setup
1. Create a Google Sheet named OT Manager Database.
2. Open Extensions > Apps Script.
3. Paste Code.gs into the script editor. Create an HTML file named Index and paste Index.html.
4. In Code.gs, replace PASTE_GOOGLE_SHEET_ID_HERE with the spreadsheet ID from its URL.
5. Run setup() once and approve permissions.
6. Deploy > New deployment > Web app. Execute as Me. Choose access appropriate for your team.
7. Copy the /exec URL into API_URL in app-config.js. Set TEAM_PIN to a strong private team PIN. Set the same PIN in the Settings sheet.
8. Host all files on an HTTPS static host (GitHub Pages or Firebase Hosting).
9. On Android Chrome, open the hosted URL > menu > Install app / Add to Home screen.

All team members use the same URL and PIN. The shared PIN is basic access control, not individual authentication. For sensitive payroll use, add per-user authentication and audit logging.

## Rules included
- Shifts: เช้า 08:00–17:00, บ่าย 13:00–22:00, ดึก 16:00–01:00.
- Default daily wage 600 THB, 8 normal hours, OT multiplier 1.5.
- Morning OT: scheduled start minus morning OT start.
- Evening OT: actual out minus scheduled end, supports midnight crossing.
- Deduct 1 hour from evening OT only when raw evening OT is strictly greater than 3 hours 30 minutes.
- Sick leave counts as attendance 1; other leave/absence choices count as 0.
- This is a configurable aid; verify company policy and Thai labor-law requirements before payroll use.
