# Builds a clean deploy folder (dist/) for Netlify Drop.
# Only the files the site actually uses are copied: no Git data, reference
# images, backups, notes or scripts.
#
#   powershell -ExecutionPolicy Bypass -File .\build-dist.ps1

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$dist = Join-Path $root "dist"

$files = @(
  "index.html",
  "styles.css",
  "script.js",
  "_headers",
  "assets/images/service-home-lighting.jpg",
  "assets/images/electrician-portrait.png"
)

if (Test-Path $dist) { Remove-Item -Recurse -Force $dist }
New-Item -ItemType Directory -Path $dist | Out-Null

foreach ($file in $files) {
  $source = Join-Path $root $file
  if (-not (Test-Path $source)) { throw "Missing source file: $file" }
  $target = Join-Path $dist $file
  New-Item -ItemType Directory -Force -Path (Split-Path $target) | Out-Null
  Copy-Item $source $target
}

# Every local src/href in index.html must exist in dist.
$html = Get-Content (Join-Path $dist "index.html") -Raw -Encoding UTF8
$html = [regex]::Replace($html, '(?s)<!--.*?-->', '')
$refs = [regex]::Matches($html, '(?:src|href)="([^"#:]+)"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
foreach ($ref in $refs) {
  if (-not (Test-Path (Join-Path $dist $ref))) { throw "index.html references a missing file: $ref" }
}

Write-Host "dist/ is ready:" -ForegroundColor Green
Get-ChildItem -Recurse -File $dist | ForEach-Object { "  " + $_.FullName.Substring($dist.Length + 1) + "  (" + [math]::Round($_.Length / 1KB) + " KB)" }
