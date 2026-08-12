[System.Net.ServicePointManager]::Expect100Continue = $false
$base = "http://localhost:3210"
$pwd = "harish2174"

$events = Invoke-RestMethod -Uri "$base/api/events" -Method GET
"GET count: $($events.Count)" | Out-File edit-test-out.txt
$target = $events[0]
"Target id: $($target.id)" | Out-File edit-test-out.txt -Append

$body = @{
  password = $pwd
  event = @{
    date = $target.date
    name = @{ he = "Updated He"; en = "Updated En" }
    location = ""
    locationLink = $null
    description = @{ he = "Desc He"; en = "Desc En" }
    longDescription = @{ he = ""; en = "" }
    whatsappMessage = $null
    link = "#"
    image = $null
  }
} | ConvertTo-Json -Depth 5

try {
  $putRes = Invoke-RestMethod -Uri "$base/api/events/$($target.id)" -Method PUT -Body $body -ContentType "application/json"
  "PUT success. New name.en for target: $(($putRes | Where-Object { $_.id -eq $target.id }).name.en)" | Out-File edit-test-out.txt -Append
} catch {
  "PUT failed: $($_.Exception.Message)" | Out-File edit-test-out.txt -Append
  if ($_.Exception.Response) {
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    "Body: $($reader.ReadToEnd())" | Out-File edit-test-out.txt -Append
  }
}

# wrong password test
$bodyBad = @{ password = "wrongpass"; event = $body | ConvertFrom-Json | Select-Object -ExpandProperty event } | ConvertTo-Json -Depth 5
try {
  Invoke-RestMethod -Uri "$base/api/events/$($target.id)" -Method PUT -Body $bodyBad -ContentType "application/json"
  "Wrong password did NOT fail (unexpected)" | Out-File edit-test-out.txt -Append
} catch {
  $resp = $_.Exception.Response
  "Wrong password status: $([int]$resp.StatusCode)" | Out-File edit-test-out.txt -Append
}
