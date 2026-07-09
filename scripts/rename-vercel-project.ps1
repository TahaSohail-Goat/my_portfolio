Param(
    [string]$SearchName = "my-portfolio",
    [string]$Domain = "my-portfolio-4ecr.vercel.app",
    [string]$NewName = "tahasohail"
)

$token = $env:VERCEL_TOKEN
if (-not $token) {
    Write-Error "Environment variable VERCEL_TOKEN is not set. Create a token at https://vercel.com/account/tokens and set it as VERCEL_TOKEN."
    exit 1
}

Write-Output "Listing projects..."
try {
    $projectsResponse = Invoke-RestMethod -Uri "https://api.vercel.com/v1/projects" -Headers @{ Authorization = "Bearer $token" }
} catch {
    Write-Error "Failed to list projects. Check that the token is valid and has project access."
    exit 1
}

$projects = $projectsResponse.projects
$project = $projects | Where-Object { $_.name -eq $SearchName } | Select-Object -First 1

if (-not $project) {
    Write-Output "No project matched name '$SearchName'. Checking aliases by domain..."
    foreach ($p in $projects) {
        try {
            $aliasesResp = Invoke-RestMethod -Uri "https://api.vercel.com/v1/projects/$($p.id)/aliases" -Headers @{ Authorization = "Bearer $token" }
            $aliases = $aliasesResp.aliases
            if ($aliases -ne $null) {
                foreach ($a in $aliases) {
                    if ($a.alias -eq $Domain) { $project = $p; break }
                }
            }
        } catch { }
        if ($project) { break }
    }
}

if (-not $project) {
    Write-Error "Could not find the project. Provide a project ID or ensure your token has access."
    exit 1
}

$projectId = $project.id
Write-Output "Found project '$($project.name)' (id: $projectId). Renaming to $NewName..."
$body = @{ name = $NewName } | ConvertTo-Json
try {
    $result = Invoke-RestMethod -Method Patch -Uri "https://api.vercel.com/v1/projects/$projectId" -Headers @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" } -Body $body
    Write-Output "Project renamed. New name: $($result.name)"
} catch {
    Write-Error "Failed to rename project. Response: $_"
    exit 1
}
