$lines = Get-Content "assets\css\style.css"
$errors = @()

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    $num = $i + 1

    # Check for // comments (not valid in standard CSS)
    if ($line -match "^\s*//") {
        $errors += "Line ${num} - Invalid JS-style comment: $line"
    }

    # Check for missing semicolon in properties (excluding lines with { or } or comments)
    if ($line -match "^\s*[a-zA-Z\-]+\s*:[^;\{\}]+$" -and $line -notmatch "@" -and $line -notmatch "/\*") {
        $errors += "Line ${num} - Missing semicolon: $line"
    }

    # Check for unmatched quotes
    $singleQuotes = ([regex]::Matches($line, "'")).Count
    $doubleQuotes = ([regex]::Matches($line, '"')).Count
    if (($singleQuotes % 2 -ne 0) -or ($doubleQuotes % 2 -ne 0)) {
        if ($line -notmatch "/\*") {
            $errors += "Line ${num} - Unmatched quotes: $line"
        }
    }
}

Write-Host "Found $($errors.Count) potential syntax issues:"
$errors | ForEach-Object { Write-Host "  $_" }
