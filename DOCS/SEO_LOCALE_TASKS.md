# Soundboard locale tasks

Edit `locales/home-seo.json` and `locales/home-copy.json`. Then rebuild. Do not hand-edit `*/index.html`. A rebuild writes `{{metaTitle}}` straight from `home-seo.json` (`scripts/home.template.html`, `scripts/build-locale-pages.mjs`). The live prefix `Soundboard App | ` and the description lead-in `Soundboard app and sound board app.` are not in the JSON, so the next build deletes them.

The two main words in every title are **Soundboard** and **Sound Board**. Do not replace either with a translation. The pattern is `Soundboard App | Sound Board — {local phrase}`.

JSON keys: `pt` on the site is `pt-BR`, `zh` is `zh-Hans`, `zh-tw` is `zh-Hant`, `fr-ca` is `fr-CA`, `es-mx` is `es-MX`, `pt-pt` is `pt-PT`.

## Do once

1. In every `metaDescription` in `locales/home-seo.json`, start the string with `Soundboard app and sound board app. ` when that sentence is missing.
2. Set every `metaTitle` to the value in the table below. Both `Soundboard` and `Sound Board` lead the title.
3. In `fr` `home-copy.json`, copy the Canada wording that is already correct:
   - `deck`: replace `samples audio` with `échantillons audio`
   - `f6Desc`: replace `d'un tap` with `d'un toucher` (fr-CA already says this)
4. In `zh-Hans.ctaBody` and `zh-Hant.ctaBody`, replace `播客` with `播客主` in the people list `主播、播客、DJ`. Leave `播客` where it means the show.

## Titles

Write this into `home-seo.json` → `metaTitle`.

| Locale | Write this |
|---|---|
| en | `Soundboard App \| Sound Board — Live Shows, Creators and DJs` |
| it | `Soundboard App \| Sound Board — show dal vivo, creator e DJ` |
| de | `Soundboard App \| Sound Board — Live-Shows, Creator und DJs` |
| fr | `Soundboard App \| Sound Board — spectacles live, créateurs et DJs` |
| fr-CA | `Soundboard App \| Sound Board — spectacles live, créateurs et DJ` |
| es | `Soundboard App \| Sound Board — shows en vivo, creadores y DJs` |
| es-MX | `Soundboard App \| Sound Board — shows en vivo, creadores y DJs en México` |
| pt-BR | `Soundboard App \| Sound Board — shows ao vivo, criadores e DJs` |
| pt-PT | `Soundboard App \| Sound Board — espetáculos ao vivo, criadores e DJs` |
| nl | `Soundboard App \| Sound Board — live shows, contentmakers en DJ's` |
| pl | `Soundboard App \| Sound Board — show na żywo, dla creatorów i DJ-ów` |
| cs | `Soundboard App \| Sound Board — živé show, tvůrce obsahu a DJe` |
| sk | `Soundboard App \| Sound Board — živé šou, tvorcov obsahu a DJov` |
| da | `Soundboard App \| Sound Board — liveshows, indholdsskabere og DJ's` |
| sv | `Soundboard App \| Sound Board — liveshower, innehållsskapare och DJ:ar` |
| nb | `Soundboard App \| Sound Board — liveshows, innholdsskapere og DJ-er` |
| ca | `Soundboard App \| Sound Board — espectacles en viu, creadors i DJs` |
| ja | `Soundboard App \| Sound Board — ライブ、クリエイター、DJ向けサウンドボード` |
| ko | `Soundboard App \| Sound Board — 라이브, 크리에이터, DJ를 위한 사운드 보드` |
| zh-Hans | `Soundboard App \| Sound Board — 现场演出、创作者、DJ 与音效` |
| zh-Hant | `Soundboard App \| Sound Board — 現場演出、創作者、DJ 與音效` |
| ar | `Soundboard App \| Sound Board — لوحة أصوات للعروض الحية وصنّاع المحتوى والدي جي` |
| he | `Soundboard App \| Sound Board — לוח צלילים להופעות חיות, יוצרי תוכן ו-DJ` |
| hi | `Soundboard App \| Sound Board — लाइव शो, क्रिएटर और DJ के लिए साउंड बोर्ड` |
| th | `Soundboard App \| Sound Board — บอร์ดเสียงสำหรับโชว์สด ครีเอเตอร์ และ DJ` |
| ru | `Soundboard App \| Sound Board — звуковая панель для живых шоу, креаторов и DJ` |
| uk | `Soundboard App \| Sound Board — звукова панель для живих шоу, креаторів і DJ` |
| el | `Soundboard App \| Sound Board — πίνακας ήχου για ζωντανές εκδηλώσεις, creators και DJ` |
| fi | `Soundboard App \| Sound Board — äänitaulu live-esityksiin, sisällöntuottajille ja DJ:ille` |
| hu | `Soundboard App \| Sound Board — hangtábla élő műsorokhoz, tartalomgyártóknak és DJ-knek` |
| hr | `Soundboard App \| Sound Board — zvučna ploča za nastupe uživo, kreatore i DJ-e` |
| ro | `Soundboard App \| Sound Board — panou de sunete pentru spectacole live, creatori și DJ` |
| tr | `Soundboard App \| Sound Board — canlı şovlar, içerik üreticileri ve DJ'ler için` |
| id | `Soundboard App \| Sound Board — papan suara untuk pertunjukan live, kreator, dan DJ` |
| ms | `Soundboard App \| Sound Board — papan bunyi untuk persembahan langsung, pencipta dan DJ` |
| vi | `Soundboard App \| Sound Board — bảng âm thanh cho biểu diễn trực tiếp, creator và DJ` |

es and es-MX stay different after the shared keyword line: Mexico ends with `en México`. fr and fr-CA stay different by `DJs` vs `DJ`, and fr-CA keeps `balado` in the description.

## Body, per locale

| Locale | File key | Now | Write |
|---|---|---|---|
| tr | `home-seo.json` `tr.metaTitle` | `Canlı şov, içerik üreticisi ve DJ ses panosu` | the tr row above. `içerik üreticisi` is singular and `DJ ses panosu` does not parse. |
| pl | `home-seo.json` `pl.metaTitle` | `Soundboard na show na żywo, creatorów i DJ-ów` | the pl row above. `creatorów` has no preposition. The H1 already uses `dla`. |
| sv | `home-copy.json` `sv.ctaTitle` | `Hämta den kostnadsfria ljudtavle-appen` | `Hämta den kostnadsfria ljudtavelappen` |
| es-MX | `home-copy.json` `es-MX.f2Desc` | ends with `trabaja con precisión` | `trabaja de forma eficiente`. Spain (`es.f2Desc`) already says `eficiente`. Leave Spain's `afina el tiempo con precisión` alone. That sentence is about timing. |
| ru | `home-copy.json` `ru.f2Desc` | `работайте точно` | `работайте эффективно` |
| zh-Hans | `home-copy.json` `zh-Hans.ctaBody` | `适合主播、播客、DJ` | `适合主播、播客主、DJ` |
| zh-Hant | `home-copy.json` `zh-Hant.ctaBody` | same people-list use of `播客` | `適合主播、播客主、DJ` |
| fr | `home-copy.json` `fr.deck`, `fr.f6Desc` | `samples`, `tap` | `échantillons`, `toucher` |
| en, it | `metaTitle` | the two words are split across the live HTML prefix and the JSON | write the en and it rows above into `home-seo.json` so a rebuild keeps both |

After the rebuild, check one Latin page, one CJK page, and `tr/index.html`. Each `<title>` must contain `Soundboard` and `Sound Board`.
