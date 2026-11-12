param(
  [string]$Url,
  [string]$OutDir,
  [string]$Plan  # JSON: [{ "name":..., "w":..., "h":..., "mobile":bool, "shots":[{"name":..,"js":..,"wait":ms}] }]
)
$ErrorActionPreference = "Stop"
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$profile = Join-Path $OutDir "chrome-profile"
New-Item -ItemType Directory -Force $OutDir | Out-Null
$proc = Start-Process $chrome -ArgumentList "--headless=new","--remote-debugging-port=9333","--user-data-dir=$profile","--no-first-run","--hide-scrollbars","about:blank" -PassThru
try {
  $targets = $null
  for ($i = 0; $i -lt 40 -and -not $targets; $i++) {
    Start-Sleep -Milliseconds 250
    try { $targets = Invoke-RestMethod "http://127.0.0.1:9333/json" } catch {}
  }
  $page = $targets | Where-Object { $_.type -eq "page" } | Select-Object -First 1
  $ws = New-Object System.Net.WebSockets.ClientWebSocket
  $ws.Options.KeepAliveInterval = [TimeSpan]::FromSeconds(30)
  $ws.ConnectAsync([Uri]$page.webSocketDebuggerUrl, [Threading.CancellationToken]::None).Wait()
  $script:id = 0
  $script:events = New-Object System.Collections.ArrayList

  function Receive-Msg {
    $buf = New-Object byte[] 1048576
    $ms = New-Object System.IO.MemoryStream
    do {
      $seg = New-Object ArraySegment[byte] -ArgumentList (,$buf)
      $r = $ws.ReceiveAsync($seg, [Threading.CancellationToken]::None).Result
      $ms.Write($buf, 0, $r.Count)
    } while (-not $r.EndOfMessage)
    [Text.Encoding]::UTF8.GetString($ms.ToArray()) | ConvertFrom-Json
  }
  function Send-Cdp($method, $params = @{}) {
    $script:id++
    $msg = @{ id = $script:id; method = $method; params = $params } | ConvertTo-Json -Depth 10 -Compress
    $bytes = [Text.Encoding]::UTF8.GetBytes($msg)
    $ws.SendAsync((New-Object ArraySegment[byte] -ArgumentList (,$bytes)), "Text", $true, [Threading.CancellationToken]::None).Wait()
    while ($true) {
      $m = Receive-Msg
      if ($m.id -eq $script:id) { return $m }
      if ($m.method) { [void]$script:events.Add($m) }
    }
  }
  function Pump($ms) {
    $end = (Get-Date).AddMilliseconds($ms)
    while ((Get-Date) -lt $end) {
      [void](Send-Cdp "Runtime.evaluate" @{ expression = "1" })
      Start-Sleep -Milliseconds 100
    }
  }

  [void](Send-Cdp "Runtime.enable")
  [void](Send-Cdp "Log.enable")
  [void](Send-Cdp "Page.enable")

  $planObj = Get-Content $Plan -Raw | ConvertFrom-Json
  foreach ($vp in $planObj) {
    [void](Send-Cdp "Emulation.setDeviceMetricsOverride" @{ width = $vp.w; height = $vp.h; deviceScaleFactor = 1; mobile = [bool]$vp.mobile })
    if ($vp.mobile) { [void](Send-Cdp "Emulation.setTouchEmulationEnabled" @{ enabled = $true }) } else { [void](Send-Cdp "Emulation.setTouchEmulationEnabled" @{ enabled = $false }) }
    $nav = $Url
    if ($vp.query) { $nav = "$Url$($vp.query)" }
    [void](Send-Cdp "Page.navigate" @{ url = $nav })
    Pump 2500
    foreach ($shot in $vp.shots) {
      if ($shot.js) {
        $res = Send-Cdp "Runtime.evaluate" @{ expression = $shot.js; returnByValue = $true; awaitPromise = $true }
        if ($res.result.result.value -ne $null) { "[$($vp.name)/$($shot.name)] => $($res.result.result.value | ConvertTo-Json -Compress -Depth 6)" }
      }
      Pump ([int]($shot.wait))
      if (-not $shot.noshot) {
        $cap = Send-Cdp "Page.captureScreenshot" @{ format = "jpeg"; quality = 80 }
        [IO.File]::WriteAllBytes((Join-Path $OutDir "$($vp.name)-$($shot.name).jpg"), [Convert]::FromBase64String($cap.result.data))
      }
    }
  }

  "--- console / exceptions ---"
  foreach ($e in $script:events) {
    switch ($e.method) {
      "Runtime.exceptionThrown" { "EXCEPTION: " + ($e.params.exceptionDetails | ConvertTo-Json -Depth 5 -Compress) }
      "Runtime.consoleAPICalled" { "CONSOLE " + $e.params.type + ": " + (($e.params.args | ForEach-Object { $_.value }) -join " ") }
      "Log.entryAdded" { "LOG " + $e.params.entry.level + ": " + $e.params.entry.text + " " + $e.params.entry.url }
    }
  }
  "--- end ---"
} finally {
  try { $ws.Dispose() } catch {}
  Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
  Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like "*chrome-profile*" -and $_.CommandLine -like "*$OutDir*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
}
