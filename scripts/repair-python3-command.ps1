#Requires -RunAsAdministrator
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-PythonExecutable {
  $launcher = Get-Command py.exe -ErrorAction Stop
  $candidate = & $launcher.Source -3 -c "import sys; print(sys.executable)"

  if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($candidate)) {
    throw 'Não foi possível localizar o interpretador Python 3 pelo Python Launcher (py -3).'
  }

  $resolved = (Resolve-Path -LiteralPath $candidate.Trim()).Path
  if (-not (Test-Path -LiteralPath $resolved -PathType Leaf)) {
    throw "O interpretador localizado não existe: $resolved"
  }

  return $resolved
}

$pythonExecutable = Get-PythonExecutable
$pythonDirectory = Split-Path -Parent $pythonExecutable
$wrapperPath = Join-Path $pythonDirectory 'python3.cmd'

# Um wrapper .cmd é preferível a um hard link .exe: atualizações do Python podem
# substituir python.exe, e o wrapper continuará chamando a versão atual.
$wrapper = "@echo off`r`n`"%~dp0python.exe`" %*`r`n"
Set-Content -LiteralPath $wrapperPath -Value $wrapper -Encoding Ascii -NoNewline

$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
$pathEntries = @($userPath -split ';' | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
$withoutPythonDirectory = @(
  $pathEntries | Where-Object {
    -not [string]::Equals($_.TrimEnd('\'), $pythonDirectory.TrimEnd('\'), [StringComparison]::OrdinalIgnoreCase)
  }
)
[Environment]::SetEnvironmentVariable(
  'Path',
  (($pythonDirectory) + $withoutPythonDirectory -join ';'),
  'User'
)

# A sessão que chamou o script também fica pronta; novos terminais receberão o
# PATH persistido do usuário.
$env:Path = "$pythonDirectory;$env:Path"

$version = & "$env:SystemRoot\System32\cmd.exe" /d /c 'python3 --version'
if ($LASTEXITCODE -ne 0 -or $version -notmatch '^Python 3\.') {
  throw "A validação falhou. Saída recebida: $version"
}

Write-Host "python3 corrigido: $version"
Write-Host "Wrapper persistente criado em: $wrapperPath"
Write-Host 'Abra um novo terminal para que outros projetos recebam o PATH atualizado.'
