$css = Get-Content "assets\css\style.css"
$propPattern = '^\s*([a-zA-Z\-]+)\s*:'
$props = @{}

for ($i = 0; $i -lt $css.Count; $i++) {
    $line = $css[$i]
    if ($line -match $propPattern) {
        $p = $matches[1].ToLower()
        if (-not $props.ContainsKey($p)) {
            $props[$p] = @()
        }
        $props[$p] += ($i + 1)
    }
}

Write-Host "Total unique properties: $($props.Keys.Count)"
$props.Keys | Sort-Object | ForEach-Object {
    Write-Host "$_ (lines: $($props[$_] -join ', '))"
}
