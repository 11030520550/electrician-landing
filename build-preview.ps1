# Builds a clean client-preview folder (netlify-preview/) for manual upload to
# Netlify Drop. The site source is not modified.
#
# Same file set as build-dist.ps1, plus one preview-only change in the copied
# index.html: the Netlify form (not yet connected to a verified service) and
# its developer comment are removed, so the preview can never show a submit
# success. Visitors see exactly what they see today: the direct e-mail link,
# phone and WhatsApp.
#
#   powershell -ExecutionPolicy Bypass -File .\build-preview.ps1

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$out = Join-Path $root "netlify-preview"

$files = @(
  "index.html",
  "styles.css",
  "script.js",
  "_headers",
  "assets/images/service-home-lighting.jpg",
  "assets/images/electrician-portrait.png"
)

if (Test-Path $out) { Remove-Item -Recurse -Force $out }
New-Item -ItemType Directory -Path $out | Out-Null

foreach ($file in $files) {
  $source = Join-Path $root $file
  if (-not (Test-Path $source)) { throw "Missing source file: $file" }
  $target = Join-Path $out $file
  New-Item -ItemType Directory -Force -Path (Split-Path $target) | Out-Null
  Copy-Item $source $target
}

# Remove the unconnected form and the developer note above it.
$indexPath = Join-Path $out "index.html"
$html = [IO.File]::ReadAllText($indexPath, [Text.Encoding]::UTF8)
$formCount = ([regex]::Matches($html, '(?s)\s*<form class="contact-form".*?</form>')).Count
if ($formCount -ne 1) { throw "Expected exactly one contact form, found $formCount" }
$html = [regex]::Replace($html, '(?s)\s*<form class="contact-form".*?</form>', '')
$html = [regex]::Replace($html, '(?s)\s*<!--\s*Netlify Forms\..*?-->', '')
if ($html -match '<form|data-netlify|form-test') { throw "Form remnants left in preview index.html" }
[IO.File]::WriteAllText($indexPath, $html, (New-Object Text.UTF8Encoding $false))

# Every local src/href in index.html must exist in the folder.
$clean = [regex]::Replace($html, '(?s)<!--.*?-->', '')
$refs = [regex]::Matches($clean, '(?:src|href)="([^"#:]+)"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
foreach ($ref in $refs) {
  if (-not (Test-Path (Join-Path $out $ref))) { throw "index.html references a missing file: $ref" }
}

Write-Host "netlify-preview/ is ready:" -ForegroundColor Green
Get-ChildItem -Recurse -File $out | ForEach-Object { "  " + $_.FullName.Substring($out.Length + 1) + "  (" + [math]::Round($_.Length / 1KB) + " KB)" }
