$css = Get-Content "assets\css\style.css"
$sectionHeaders = @()
for ($i = 0; $i -lt $css.Count; $i++) {
    if ($css[$i] -match "^\s*/\*\s*([0-9]+\.\s*[^*-]+)") {
        $sectionHeaders += "Line $($i+1): $($matches[1].Trim())"
    }
}
$sectionHeaders | ForEach-Object { Write-Host $_ }
