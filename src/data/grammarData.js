export const GRAMMAR_LESSONS = [
  {
    id: 1,
    icon: "🔤",
    title: "Artiklar: der, die, das",
    color: "#1cb0f6",
    intro: "Nemis tilida har bir otning artikli bor: der (erkak), die (ayol/ko'plik), das (neytral).",
    rules: [
      { rule: "der + erkak jins", example: "der Mann (erkak), der Hund (it), der Tisch (stol)" },
      { rule: "die + ayol jins / ko'plik", example: "die Frau (ayol), die Katze (mushuk), die Männer (erkaklar)" },
      { rule: "-ung, -heit, -keit, -ion → die", example: "die Wohnung, die Freiheit, die Nation" },
      { rule: "-chen, -lein, Ge- → das", example: "das Mädchen, das Brötchen, das Gebäude" },
      { rule: "-er, -ling, -ig → der", example: "der Lehrer, der Frühling, der König" },
    ],
    quiz: [
      { question: "___ Tisch (stol) — qaysi artikel?", options: ["der", "die", "das"], answer: "der" },
      { question: "___ Frau (ayol) — qaysi artikel?", options: ["der", "die", "das"], answer: "die" },
      { question: "___ Kind (bola) — qaysi artikel?", options: ["der", "die", "das"], answer: "das" },
      { question: "___ Wohnung — qaysi artikel?", options: ["der", "die", "das"], answer: "die" },
      { question: "___ Hund (it) — qaysi artikel?", options: ["der", "die", "das"], answer: "der" },
    ]
  },
  {
    id: 2,
    icon: "👤",
    title: "Shaxs Olmoshlari",
    color: "#a435f0",
    intro: "Nemis tilida shaxs olmoshlari: ich (men), du (sen), er/sie/es (u), wir (biz), ihr (sizlar), sie/Sie (ular/Siz).",
    rules: [
      { rule: "ich = men", example: "Ich bin Student. (Men studentman.)" },
      { rule: "du = sen (yaqin)", example: "Du bist nett. (Sen yaxshisan.)" },
      { rule: "er = u (erkak), sie = u (ayol), es = u (narsa)", example: "Er arbeitet. Sie schläft. Es regnet." },
      { rule: "wir = biz", example: "Wir lernen Deutsch. (Biz nemis tilini o'rganamiz.)" },
      { rule: "Sie = Siz (rasmiy murojaat, katta harf)", example: "Wie heißen Sie? (Ismingiz nima?)" },
    ],
    quiz: [
      { question: "'Men' nemischa?", options: ["ich", "du", "wir"], answer: "ich" },
      { question: "'Biz' nemischa?", options: ["ihr", "wir", "sie"], answer: "wir" },
      { question: "'Sen' nemischa (yaqin)?", options: ["Sie", "du", "er"], answer: "du" },
      { question: "Rasmiy 'Siz' nemischa?", options: ["du", "ihr", "Sie"], answer: "Sie" },
      { question: "'Ular' nemischa?", options: ["wir", "sie", "ihr"], answer: "sie" },
    ]
  },
  {
    id: 3,
    icon: "⚡",
    title: "Fe'l Tuslanishi: sein va haben",
    color: "#e5c158",
    intro: "'sein' (bo'lmoq) va 'haben' (ega bo'lmoq) — nemis tilining eng muhim fe'llari.",
    rules: [
      { rule: "sein: ich bin, du bist, er/sie/es ist", example: "Ich bin Lehrer. Du bist jung. Er ist groß." },
      { rule: "sein: wir sind, ihr seid, sie/Sie sind", example: "Wir sind Freunde. Ihr seid nett. Sie sind hier." },
      { rule: "haben: ich habe, du hast, er/sie/es hat", example: "Ich habe ein Auto. Du hast Zeit. Er hat Hunger." },
      { rule: "haben: wir haben, ihr habt, sie/Sie haben", example: "Wir haben Glück. Ihr habt Recht. Sie haben Kinder." },
      { rule: "Ko'p fe'llar: ich -e, du -st, er -t", example: "ich lerne, du lernst, er lernt (o'rganmoq)" },
    ],
    quiz: [
      { question: "'Ich ___ Student.' — qaysi?", options: ["bin", "bist", "ist"], answer: "bin" },
      { question: "'Er ___ ein Buch.' (ega) — qaysi?", options: ["habe", "hast", "hat"], answer: "hat" },
      { question: "'Wir ___ in Berlin.' — qaysi?", options: ["sind", "seid", "bin"], answer: "sind" },
      { question: "'Du ___ Hunger.' — qaysi?", options: ["habe", "hast", "hat"], answer: "hast" },
      { question: "'Sie (ular) ___ Freunde.' — qaysi?", options: ["sind", "seid", "ist"], answer: "sind" },
    ]
  },
  {
    id: 4,
    icon: "🎯",
    title: "Modal Fe'llar",
    color: "#ff9600",
    intro: "Modal fe'llar imkoniyat, majburiyat, xohish ifodalaydi. Ular doim boshqa fe'l bilan birga keladi.",
    rules: [
      { rule: "können = qila olmoq", example: "Ich kann Deutsch sprechen. (Nemischa gapira olaman.)" },
      { rule: "müssen = kerak, majbur", example: "Ich muss lernen. (O'rganishim kerak.)" },
      { rule: "wollen = xohlamoq", example: "Ich will reisen. (Sayohat qilmoqchiman.)" },
      { rule: "dürfen = ruxsat bo'lmoq", example: "Darf ich fragen? (So'rasam bo'ladimi?)" },
      { rule: "Modal + infinitiv = oxirda", example: "Ich kann gut kochen. ('kochen' oxirda turadi)" },
    ],
    quiz: [
      { question: "'Qila olmoq' = ?", options: ["können", "müssen", "wollen"], answer: "können" },
      { question: "'Xohlamoq' = ?", options: ["dürfen", "wollen", "sollen"], answer: "wollen" },
      { question: "'Ich ___ schlafen.' (kerak) — qaysi?", options: ["kann", "muss", "will"], answer: "muss" },
      { question: "'Darf ich ...?' nimani anglatadi?", options: ["Qila olamanmi?", "Ruxsat bormi?", "Xohlamanmi?"], answer: "Ruxsat bormi?" },
      { question: "Modal fe'l bilan boshqa fe'l qayerda turadi?", options: ["Boshida", "O'rtada", "Oxirida"], answer: "Oxirida" },
    ]
  },
  {
    id: 5,
    icon: "📝",
    title: "Oddiy Gap Qurilishi",
    color: "#58cc02",
    intro: "Nemis tilida oddiy gapda tartib: Ega + Fe'l + Qolgan bo'laklar (SVO).",
    rules: [
      { rule: "Asosiy tartib: Ega + Fe'l + To'ldiruvchi", example: "Ich lerne Deutsch. (Men nemischa o'rganaman.)" },
      { rule: "So'roq gap: Fe'l + Ega + ...?", example: "Lernen Sie Deutsch? (Nemischa o'rganasizmi?)" },
      { rule: "Vaqt so'zlarida: Vaqt + Fe'l + Ega", example: "Heute lerne ich Deutsch." },
      { rule: "Inkor: nicht = emas", example: "Ich verstehe nicht. (Tushunmayapman.)" },
      { rule: "Kein + ot = yo'q", example: "Ich habe kein Auto. (Mashinam yo'q.)" },
    ],
    quiz: [
      { question: "To'g'ri tartib: Ich / Deutsch / lerne", options: ["Ich lerne Deutsch", "Lerne ich Deutsch", "Deutsch ich lerne"], answer: "Ich lerne Deutsch" },
      { question: "Inkorni qanday ifodalash?", options: ["kein", "nicht", "Ikkalasi ham"], answer: "Ikkalasi ham" },
      { question: "'Mashinam yo'q' = ?", options: ["Ich habe nicht Auto", "Ich habe kein Auto", "Ich kein habe Auto"], answer: "Ich habe kein Auto" },
      { question: "So'roq gapda fe'l qayerda?", options: ["Oxirda", "Boshida", "O'rtada"], answer: "Boshida" },
      { question: "'Bugun men ishlayapman' nemischa?", options: ["Heute ich arbeite", "Heute arbeite ich", "Ich heute arbeite"], answer: "Heute arbeite ich" },
    ]
  },
  {
    id: 6,
    icon: "❓",
    title: "W-So'roq So'zlari",
    color: "#ff4b4b",
    intro: "W-Fragen — kim, nima, qayer, qachon, nima uchun so'rash uchun so'roq so'zlari.",
    rules: [
      { rule: "Wer? = Kim?", example: "Wer bist du? (Sen kimsан?)" },
      { rule: "Was? = Nima?", example: "Was machst du? (Nima qilayapsan?)" },
      { rule: "Wo? = Qayerda?", example: "Wo wohnst du? (Qayerda yashaysan?)" },
      { rule: "Wann? = Qachon?", example: "Wann kommst du? (Qachon kelasan?)" },
      { rule: "Warum? = Nima uchun?", example: "Warum lernst du Deutsch? (Nima uchun nemischa o'rganayapsan?)" },
    ],
    quiz: [
      { question: "'Kim?' nemischa?", options: ["Was", "Wer", "Wo"], answer: "Wer" },
      { question: "'Qayerda?' nemischa?", options: ["Wann", "Warum", "Wo"], answer: "Wo" },
      { question: "'Nima uchun?' nemischa?", options: ["Wie", "Warum", "Welche"], answer: "Warum" },
      { question: "'Qachon?' nemischa?", options: ["Wann", "Was", "Wer"], answer: "Wann" },
      { question: "'Nima?' nemischa?", options: ["Wer", "Wo", "Was"], answer: "Was" },
    ]
  },
  {
    id: 7,
    icon: "📊",
    title: "Ko'plik (Plural) Qoidalari",
    color: "#6c5ce7",
    intro: "Nemis tilida ko'plik birlikdan farqli shakllanadi. Ko'plikda har doim 'die' artikl ishlatiladi.",
    rules: [
      { rule: "-e qo'shimcha (ko'p erkak otlar)", example: "der Tisch → die Tische (stollar)" },
      { rule: "-er qo'shimcha", example: "das Kind → die Kinder (bolalar)" },
      { rule: "-en / -n qo'shimcha (ko'p ayol otlar)", example: "die Frau → die Frauen, die Blume → die Blumen" },
      { rule: "-s qo'shimcha (chet so'zlar)", example: "das Auto → die Autos, das Hotel → die Hotels" },
      { rule: "Umlaut + o'zgarish", example: "der Mann → die Männer, der Vater → die Väter" },
    ],
    quiz: [
      { question: "'Bola' ko'pligi = ?", options: ["Kinds", "Kinder", "Kinde"], answer: "Kinder" },
      { question: "Ko'plikda qaysi artikel?", options: ["der", "die", "das"], answer: "die" },
      { question: "'Auto' ko'pligi = ?", options: ["Autoen", "Autos", "Autoe"], answer: "Autos" },
      { question: "'Frau' ko'pligi = ?", options: ["Fraue", "Fraus", "Frauen"], answer: "Frauen" },
      { question: "'Mann' ko'pligi = ?", options: ["Männer", "Manns", "Männen"], answer: "Männer" },
    ]
  },
  {
    id: 8,
    icon: "🔄",
    title: "Kelishiklar: Nominativ va Akkusativ",
    color: "#e63946",
    intro: "Nominativ = ega (kim/nima qiladi). Akkusativ = to'ldiruvchi (kimni/nimani).",
    rules: [
      { rule: "Nominativ: der/die/das (o'zgarmaydi)", example: "Der Mann liest. Die Frau schläft. Das Kind spielt." },
      { rule: "Akkusativ: der → den (erkak)", example: "Ich sehe den Mann. (Erkakni ko'raman.)" },
      { rule: "Akkusativ: die/das o'zgarmaydi", example: "Ich kaufe die Blume. Ich esse das Brot." },
      { rule: "Ein → einen (erkak Akkusativ)", example: "Ich habe einen Hund. (Itim bor.)" },
      { rule: "Kein → keinen (erkak Akkusativ)", example: "Ich habe keinen Hund. (Itim yo'q.)" },
    ],
    quiz: [
      { question: "'Men erkakni ko'raman' = ?", options: ["Ich sehe der Mann", "Ich sehe den Mann", "Ich sehe dem Mann"], answer: "Ich sehe den Mann" },
      { question: "Nominativ erkak artikel?", options: ["den", "der", "dem"], answer: "der" },
      { question: "'Itim bor' = ?", options: ["Ich habe ein Hund", "Ich habe einen Hund", "Ich habe einem Hund"], answer: "Ich habe einen Hund" },
      { question: "Akkusativ'da 'die' o'zgaradimi?", options: ["Ha, 'den' bo'ladi", "Yo'q, 'die' qoladi", "Ha, 'das' bo'ladi"], answer: "Yo'q, 'die' qoladi" },
      { question: "'Itim yo'q' = ?", options: ["Ich habe kein Hund", "Ich habe keinen Hund", "Ich habe nicht Hund"], answer: "Ich habe keinen Hund" },
    ]
  },
  {
    id: 9,
    icon: "⭐",
    title: "Sifat Darajalari",
    color: "#ffd700",
    intro: "Sifatlarning uch darajasi: oddiy (gut), qiyosiy (besser), orttirma (am besten).",
    rules: [
      { rule: "Qiyosiy: sifat + -er", example: "schnell → schneller (tezroq), alt → älter (kattaroq)" },
      { rule: "Orttirma: am + sifat + -sten", example: "am schnellsten (eng tez), am ältesten (eng katta)" },
      { rule: "Noto'g'ri shakl: gut/besser/am besten", example: "gut (yaxshi) → besser → am besten" },
      { rule: "Noto'g'ri shakl: viel/mehr/am meisten", example: "viel (ko'p) → mehr → am meisten" },
      { rule: "als = ...dan qaraganda", example: "Er ist größer als ich. (U mendan balandroq.)" },
    ],
    quiz: [
      { question: "'Yaxshi' → qiyosiy?", options: ["guter", "besser", "am besten"], answer: "besser" },
      { question: "'Eng tez' = ?", options: ["am schnellsten", "schneller", "am schnellsten"], answer: "am schnellsten" },
      { question: "'Ko'p' → qiyosiy?", options: ["vieler", "mehr", "am meisten"], answer: "mehr" },
      { question: "'...dan qaraganda' nemischa?", options: ["aber", "als", "wie"], answer: "als" },
      { question: "'Eng yaxshi' = ?", options: ["gut", "besser", "am besten"], answer: "am besten" },
    ]
  },
  {
    id: 10,
    icon: "🌍",
    title: "Aloqa Iboralari",
    color: "#00b4d8",
    intro: "Kundalik nemis muloqotida eng ko'p ishlatiladigan iboralar va ifodalar.",
    rules: [
      { rule: "Salomlashish", example: "Guten Morgen! / Guten Tag! / Guten Abend! / Hallo!" },
      { rule: "Xayrlashish", example: "Auf Wiedersehen! / Tschüss! / Bis später! / Bis morgen!" },
      { rule: "Minnatdorlik", example: "Danke! / Danke schön! / Vielen Dank! / Bitte!" },
      { rule: "Tushunmaslik", example: "Ich verstehe nicht. / Können Sie wiederholen? / Wie bitte?" },
      { rule: "Tanishish", example: "Wie heißen Sie? / Ich heiße... / Freut mich! / Woher kommen Sie?" },
    ],
    quiz: [
      { question: "'Xayr' nemischa (rasmiy)?", options: ["Tschüss", "Auf Wiedersehen", "Hallo"], answer: "Auf Wiedersehen" },
      { question: "'Rahmat' nemischa?", options: ["Bitte", "Danke", "Sorry"], answer: "Danke" },
      { question: "'Tushunmadim' nemischa?", options: ["Ich verstehe nicht", "Ich bin nicht", "Ich habe nicht"], answer: "Ich verstehe nicht" },
      { question: "'Ertalab xayrli' = ?", options: ["Guten Tag", "Guten Morgen", "Guten Abend"], answer: "Guten Morgen" },
      { question: "'Iltimos' / 'Marhamat' nemischa?", options: ["Danke", "Bitte", "Sorry"], answer: "Bitte" },
    ]
  },
];
