$css = Get-Content "assets\css\style.css" -Raw

# 1. Check balanced parentheses in every line
$lines = $css -split "`n"
for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    $num = $i + 1
    
    # Strip string literals and comments
    $stripped = $line -replace '"[^"]*"', '""' -replace "'[^']*'", "''" -replace '/\*.*?\*/', ''
    
    $openParen = ([regex]::Matches($stripped, '\(')).Count
    $closeParen = ([regex]::Matches($stripped, '\)'))).Count
    if ($openParen -ne $closeParen) {
        # Might be multi-line paren, but let's check
        # Write-Host "Multi-line or mismatched paren at line $num: $line"
    }

    # Check for double closing paren like ))
    if ($line -match '\)\s*\)\s*;') {
        # Check if there were 2 open parens
        $opens = ([regex]::Matches($line, '\(')).Count
        $closes = ([regex]::Matches($line, '\)')).Count
        if ($opens -ne $closes) {
            Write-Host "Suspicious double closing paren at line ${num}: $line"
        }
    }

    # Check for double semicolon
    if ($line -match ';\s*;') {
        Write-Host "Double semicolon at line ${num}: $line"
    }

    # Check for empty property value
    if ($line -match '^\s*[a-zA-Z\-]+\s*:\s*;') {
        Write-Host "Empty property at line ${num}: $line"
    }
}

# 2. Check overall balanced parens, brackets, and braces in the whole file
$openB = ([regex]::Matches($css, '\{')).Count
$closeB = ([regex]::Matches($css, '\}')).Count
$openP = ([regex]::Matches($css, '\(')).Count
$closeP = ([regex]::Matches($css, '\)')).Count
$openSq = ([regex]::Matches($css, '\[')).Count
$closeSq = ([regex]::Matches($css, '\]')).Count

Write-Host "Total Braces   {}: Open=$openB, Close=$closeB"
Write-Host "Total Parens   (): Open=$openP, Close=$closeP"
Write-Host "Total Brackets []: Open=$openSq, Close=$closeSq"
