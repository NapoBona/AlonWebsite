[System.Net.ServicePointManager]::Expect100Continue = $false
$base = "http://localhost:3210"
$password = "harish2174"
$shekel = [char]0x20AA
$q = [char]0x22

$body = @{
  password = $password
  event = @{
    date = "2026-04-01"
    name = @{ he = "מכניסים אביב"; en = "Welcoming Spring" }
    subtitle = @{ he = "דרך יוגה וצלילים מרפאים"; en = "Through Yoga and Healing Sounds" }
    location = "מכמורת"
    locationLink = "https://maps.app.goo.gl/VqxHBRWVhJxHcAvz5?g_st=awb"
    description = @{
      he = "מוזמנים ומוזמנות להצטרף אלינו לקבל את חג פסח בדרך קצת אחרת,`nדרך תרגול יוגה רך ותומך אל תוך שוואסנה ומנוחה.`nכשלאחריה ניכנס לסדנאת סאונד הילינג וצלילים מרפאים בשילוב פאנטמים וכלים מכל העולם.`n`nיש עגלת קפה, ממ${q}ד צמוד ואוויר הים."
      en = "Invited to join us to welcome Passover in a slightly different way,`nthrough soft and supportive yoga practice into Savasana and rest.`nFollowed by a sound healing workshop and healing sounds combining Pantams and instruments from around the world.`n`nThere is a coffee cart, an adjacent shelter, and sea air."
    }
    details = @{
      he = "בבוקר של ליל הסדר,`nיום רביעי, 1.4`n10:00-12:30`n${q}סטודיו יוגה מאלה${q}`nמכמורת`n`nמחיר 140${shekel}`nמחיר לזוג 250${shekel}"
      en = "Morning of Seder Night,`nWednesday, April 1st`n10:00-12:30`n${q}Mala Yoga Studio${q}`nMichmoret`n`nPrice 140${shekel}`nPrice for couple 250${shekel}"
    }
    longDescription = @{ he = ""; en = "" }
    whatsappMessage = @{
      he = "היי, אשמח לפרטים נוספים על אירוע יוגה וצלילים מרפאים במכמורת (פסח)"
      en = "Hi, I'd like more details about the Yoga and Healing Sounds event in Michmoret (Passover)"
    }
    link = "#"
    image = "/events/mihmoret.jpg"
  }
} | ConvertTo-Json -Depth 5

$putRes = Invoke-RestMethod -Uri "$base/api/events/2026-04-01-seed1" -Method PUT -Body $body -ContentType "application/json; charset=utf-8"
$restored = $putRes | Where-Object { $_.id -eq "2026-04-01-seed1" }
"Restored name.en: $($restored.name.en)" | Out-File revert-out.txt
"Restored subtitle.he: $($restored.subtitle.he)" | Out-File revert-out.txt -Append
"Restored whatsappMessage.he: $($restored.whatsappMessage.he)" | Out-File revert-out.txt -Append
"Restored details.he length: $($restored.details.he.Length)" | Out-File revert-out.txt -Append
