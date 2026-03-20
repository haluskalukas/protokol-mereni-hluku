import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ProtocolData {
  protocolNumber: string;
  issueDate: string;
  clientName: string;
  clientAddress: string;
  clientCity: string;
  measurementLocation: string;
  measurementAddress: string;
  measurementCity: string;
  measurementDate: string;
  measuredBy: string;
  preparedBy: string;
  heatPumpModel: string;
  heatPumpManufacturer: string;
  heatPumpPower: string;
  microphonePosition: string;
  distanceFromSource: string;
  measurementHeight: string;
  temperature: string;
  humidity: string;
  pressure: string;
  windSpeed: string;
  cloudiness: string;
  laeqT: string;
  l5: string;
  l10: string;
  l90: string;
  l95: string;
  backgroundNoise: string;
  correction: string;
  dayLimit: string;
  nightLimit: string;
  finalValue: string;
  conclusion: string;
}

export function generateProtocolPDF(data: ProtocolData) {
  const doc = new jsPDF();
  const pageCount = 8; // Celkem 8 stran jako v originálu
  let currentPage = 1;

  // Funkce pro přidání hlavičky a zápatí na každou stránku
  const addHeaderFooter = (pageNum: number) => {
    // Hlavička - logo a info o laboratoři (simulace)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Akustická laboratoř', 105, 15, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Autorizovaná dle zákona č. 258/2000 Sb., ve znění pozdějších předpisů', 105, 20, { align: 'center' });
    doc.text('Akulab s.r.o., Kavriánov 417/417, 683 52 Šaratice', 105, 25, { align: 'center' });
    doc.text('www.akulab.cz, e-mail: akulab@akulab.cz, tel.: 606 641 521', 105, 30, { align: 'center' });

    // Linka pod hlavičkou
    doc.setDrawColor(0);
    doc.line(15, 32, 195, 32);

    // Zápatí - číslo protokolu a stránka
    doc.setFontSize(8);
    doc.text(`Protokol o měření hluku č. ${data.protocolNumber}`, 15, 285);
    doc.text(`Strana ${pageNum} z 8`, 180, 285);
  };

  // ========== STRANA 1 ==========
  addHeaderFooter(1);
  let yPos = 45;

  // Objednatel
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Objednatel:', 15, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(data.clientName, 40, yPos - 7);
  yPos += 5;
  doc.text(data.clientAddress, 40, yPos - 7);
  yPos += 5;
  doc.text(data.clientCity, 40, yPos - 7);

  yPos += 15;

  // Nadpis protokolu
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Protokol o měření hluku č. ${data.protocolNumber}`, 105, yPos, { align: 'center' });
  yPos += 7;
  doc.setFontSize(11);
  doc.text('Hluk v mimopracovním prostředí', 105, yPos, { align: 'center' });
  yPos += 6;
  doc.text('Autorizační set G2', 105, yPos, { align: 'center' });

  yPos += 20;

  // Datum a místo měření
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Datum měření:`, 15, yPos);
  doc.text(formatDate(data.measurementDate), 60, yPos);
  yPos += 7;
  doc.text(`Místo měření:`, 15, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.measurementLocation} - ${data.measurementAddress}`, 60, yPos);

  yPos += 20;

  // Personál
  doc.setFont('helvetica', 'normal');
  doc.text('Měřil:', 15, yPos);
  doc.text(data.measuredBy, 60, yPos);
  yPos += 7;
  doc.text('Vyhotovil:', 15, yPos);
  doc.text(data.preparedBy, 60, yPos);
  yPos += 7;
  doc.text('', 60, yPos);
  doc.text(data.measuredBy, 60, yPos);

  yPos += 35;

  // Datum vyhotovení a podpis
  doc.text(`V Šaraticích dne:`, 15, yPos);
  doc.text(formatDate(data.issueDate), 60, yPos);
  doc.text('………………………………...', 140, yPos);
  yPos += 6;
  doc.setFontSize(9);
  doc.text(data.preparedBy, 140, yPos);
  yPos += 4;
  doc.text('Vedoucí akustické laboratoře', 140, yPos);
  yPos += 4;
  doc.text('Odborný vedoucí setu', 140, yPos);

  yPos += 15;

  // Poznámky na konci stránky
  doc.setFontSize(8);
  doc.text('Všechny výsledky se týkají pouze předmětu měření.', 15, yPos);
  yPos += 4;
  doc.text('Bez písemného souhlasu laboratoře není možno protokol reprodukovat jinak než celý.', 15, yPos);
  yPos += 8;
  doc.text(`Kontakt na zpracovatele: ${data.preparedBy}, e-mail: haluska@akulab.cz, tel.: 732 868 141`, 15, yPos);

  // ========== STRANA 2 - Značky, přístroje, normy ==========
  doc.addPage();
  addHeaderFooter(2);
  yPos = 45;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Použité značky, jednotky a veličiny', 15, yPos);
  yPos += 10;

  // Tabulka se značkami
  doc.autoTable({
    startY: yPos,
    head: [['značka', 'jednotka', 'veličina']],
    body: [
      ['LAeq,T', 'dB', 'ekvivalentní hladina akustického tlaku'],
      ['LN', 'dB', 'distribuční hladina udávající hladinu akustického tlaku\npřekračovanou v N procentech měřícího intervalu'],
      ['v', 'm/s', 'rychlost proudění vzduchu'],
      ['t', '°C', 'teplota vzduchu'],
      ['Rh', '%', 'relativní vlhkost vzduchu'],
      ['Pn', 'hPa', 'normální atmosférický tlak'],
      ['U', 'dB', 'kombinovaná rozšířená nejistota měření'],
      ['CHVePS', '-', 'chráněný venkovní prostor staveb'],
    ],
    theme: 'grid',
    styles: { fontSize: 9 },
    margin: { left: 15, right: 15 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Použité měřicí přístroje', 15, yPos);
  yPos += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Tabulka 1 – Měřicí aparatura', 15, yPos);
  yPos += 5;

  doc.autoTable({
    startY: yPos,
    head: [['měřidlo', 'výrobní číslo', 'ověření / kalibrace do']],
    body: [
      ['zvukoměr SVAN 971', '107544', '9. 9. 2027'],
      ['mikrofon ACO Pacific 7052E', '80031', '9. 9. 2027'],
      ['akustický kalibrátor LD Cal 200', '16763', '20. 1. 2028'],
      ['meteostanice WH 1080', '-', '19.02.2030'],
      ['měřicí pásmo 10 m Festa', 'K704', '28.01.2030'],
    ],
    theme: 'grid',
    styles: { fontSize: 9 },
    margin: { left: 15, right: 15 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 7;

  doc.setFontSize(9);
  doc.text('Měřicí aparatura byla před a po měření kontrolována uvedeným akustickým kalibrátorem.', 15, yPos);

  yPos += 12;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Použité normy a legislativa', 15, yPos);
  yPos += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Měření a hodnocení hluku bylo provedeno dle:', 15, yPos);
  yPos += 7;

  const normy = [
    '[1] ČSN ISO 1996-1: Akustika - Popis, měření a hodnocení hluku prostředí - Část 1: Základní veličiny a postupy pro hodnocení',
    '[2] ČSN ISO 1996-2: Akustika - Popis, měření a hodnocení hluku prostředí - Část 2: Určování hladin akustického tlaku',
    '[3] Zákon č. 258/2000 Sb., o ochraně veřejného zdraví a o změně některých souvisejících zákonů; ve znění pozdějších předpisů',
    '[4] Nařízení vlády č. 272/2011 Sb., o ochraně veřejného zdraví před nepříznivými účinky hluku a vibrací; ve znění pozdějších předpisů',
    '[5] Metodický návod pro měření a hodnocení hluku v mimopracovním prostředí. Věstník MZ ČR, částka 14/2023',
  ];

  normy.forEach(norma => {
    const lines = doc.splitTextToSize(norma, 180);
    doc.text(lines, 15, yPos);
    yPos += lines.length * 5;
  });

  // ========== STRANA 3 - Měření ==========
  doc.addPage();
  addHeaderFooter(3);
  yPos = 45;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('4. Měření', 15, yPos);
  yPos += 10;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const merenText = [
    `Bylo provedeno autorizované měření hluku, které má sloužit jako podklad pro příslušný Orgán ochrany veřejného zdraví k doložení hlukové zátěže v souvislosti s provozem tepelného čerpadla ${data.heatPumpModel}.`,
    '',
    `Měření bylo provedeno v době ${formatDate(data.measurementDate)}.`,
    '',
    'Měření byl přítomen zástupce objednatele. Nejprve byl nastaven chod posuzovaného zdroje hluku na maximální výkon a provedeno měření k posouzení správného nastavení zdroje hluku dle technického listu. Dále bylo provedeno měření v místě M1. Dále byl měřen zbytkový hluk lokality.',
  ];

  merenText.forEach(text => {
    if (text === '') {
      yPos += 5;
    } else {
      const lines = doc.splitTextToSize(text, 180);
      doc.text(lines, 15, yPos);
      yPos += lines.length * 5;
    }
  });

  yPos += 5;

  doc.setFont('helvetica', 'bold');
  doc.text('Měřený zdroj hluku', 15, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'normal');
  const zdrojText = `Měřeným zdrojem hluku je tepelné čerpadlo umístěné ${data.microphonePosition}. Jedná se o tepelné čerpadlo ${data.heatPumpModel}.`;
  const zdrojLines = doc.splitTextToSize(zdrojText, 180);
  doc.text(zdrojLines, 15, yPos);
  yPos += zdrojLines.length * 5 + 5;

  const charakterText = 'Zdroj hluku se vyznačuje ustáleným charakterem, přičemž v provozu bude nepravidelně v denní i noční době při proměnlivém výkonu.';
  const charakterLines = doc.splitTextToSize(charakterText, 180);
  doc.text(charakterLines, 15, yPos);
  yPos += charakterLines.length * 5 + 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Zbytkový hluk', 15, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'normal');
  const zbytkovyText = 'Z naměřeného vzorku byly odstraněny jasně identifikovatelné zdroje hluku (hovory lidí, zvuky zvířat, průjezdy automobilů). Měření zbytkového hluku proběhlo v místě M1 po uvedení posuzovaného zdroje hluku mimo provoz. Zbytkový hluk byl tvořen šuměním větru a vzdálenou automobilovou dopravou.';
  const zbytkovyLines = doc.splitTextToSize(zbytkovyText, 180);
  doc.text(zbytkovyLines, 15, yPos);
  yPos += zbytkovyLines.length * 5 + 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Meteorologické podmínky', 15, yPos);
  yPos += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Tabulka 2 – Meteorologické podmínky během měření', 15, yPos);
  yPos += 5;

  doc.autoTable({
    startY: yPos,
    head: [['čas', 't\n(°C)', 'Rh\n(%)', 'Pn\n(hPa)', 'v\n(km/h)', 'směr větru\n(-)']],
    body: [
      ['11:30', data.temperature, data.humidity, data.pressure, data.windSpeed, 'J'],
    ],
    theme: 'grid',
    styles: { fontSize: 9 },
    margin: { left: 15, right: 15 },
  });

  // ========== STRANA 6 - Výsledky měření ==========
  doc.addPage();
  addHeaderFooter(6);
  yPos = 45;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('5. Výsledky měření', 15, yPos);
  yPos += 10;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Tabulka 3 – Naměřené hodnoty v měřicím místě', 15, yPos);
  yPos += 5;

  doc.autoTable({
    startY: yPos,
    head: [['charakter měřeného\nhluku', '', 'ustálený', '', '', '', '']],
    body: [
      ['měřicí místo', 'čas\nměření', 'LAeq,T\n(dB)', 'L5\n(dB)', 'L10\n(dB)', 'L90\n(dB)', 'L95\n(dB)'],
      ['M1', '11:30 – 11:45', data.laeqT, data.l5, data.l10, data.l90, data.l95],
      ['zbytkový hluk', '11:45 – 12:00', data.backgroundNoise, '32,2', '32,2', '32,1', '32,1'],
    ],
    theme: 'grid',
    styles: { fontSize: 9 },
    margin: { left: 15, right: 15 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  doc.text('Rozdíl mezi naměřenou hladinou hluku v místě M1 a hladinou zbytkového hluku je méně než', 15, yPos);
  yPos += 5;
  doc.text('3,0 dB. Měřený zdroj hluku není možno jednoznačně odlišit od zbytkového hluku.', 15, yPos);

  yPos += 12;

  doc.setFont('helvetica', 'bold');
  doc.text('Nejistota měření', 15, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'normal');
  const nejistotaText = 'Měření bylo provedeno zvukoměrem třídy I, který byl zkontrolován kalibrátorem třídy I. Dle Metodického návodu pro měření a hodnocení hluku v mimopracovním prostředí [5] je při použité metodě nejistota měření stanovena následovně:';
  const nejistotaLines = doc.splitTextToSize(nejistotaText, 180);
  doc.text(nejistotaLines, 15, yPos);
  yPos += nejistotaLines.length * 5 + 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('U = 1,7 dB', 105, yPos, { align: 'center' });
  yPos += 15;

  doc.setFontSize(9);
  doc.text('Korekce na polohu mikrofonu u odrazivé plochy', 15, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'normal');
  const korekceFasadaText = 'Na základě místního šetření bylo zjištěno, že nebyla splněna kritéria pro přičtení korekce -3 dB na odrazivé plochy dle článku 8.3.1 písm. c normy ČSN ISO 1996-2 [2]. Proto bylo v souladu s Metodickým návodem [5] provedeno přičtení korekce k výsledné celkové hladině v místě měření M1:';
  const korekceFasadaLines = doc.splitTextToSize(korekceFasadaText, 180);
  doc.text(korekceFasadaLines, 15, yPos);
  yPos += korekceFasadaLines.length * 5 + 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Vliv odrazivé plochy: -2,0 dB', 105, yPos, { align: 'center' });

  // ========== STRANA 7 - Tónová složka a výsledné hodnoty ==========
  doc.addPage();
  addHeaderFooter(7);
  yPos = 45;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Tónová složka hluku', 15, yPos);
  yPos += 10;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Obrázek 3 - Spektrální analýza v místě M1', 15, yPos);
  yPos += 7;

  doc.text('[Graf spektrální analýzy - v této verzi nezahrnuto]', 15, yPos);
  yPos += 20;

  const tonovaText = 'V naměřených hodnotách v místě M1 nebyla dle Nařízení vlády č. 272/2011 Sb. [4] detekována tónová složka hluku, nebude proto přičtena korekce k hygienickému limitu.';
  const tonovaLines = doc.splitTextToSize(tonovaText, 180);
  doc.text(tonovaLines, 15, yPos);
  yPos += tonovaLines.length * 5 + 15;

  doc.setFont('helvetica', 'bold');
  doc.text('Výsledné hodnoty', 15, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'normal');
  doc.text(`Tabulka 4 – Výsledné hodnoty v měřicím místě M1`, 15, yPos);
  yPos += 5;

  doc.autoTable({
    startY: yPos,
    head: [[`M1 – ${data.measurementLocation} ${data.measurementAddress}`, '']],
    body: [
      ['naměřená hodnota LAeq,T nekorigovaná na zbytkový hluk (dB)', data.laeqT],
      ['korekce na zbytkový hluk (dB)', '0,0'],
      ['korekce na vliv odrazivé plochy (dB)', data.correction],
      ['výsledná dopadající hladina LAeq,T pro dobu provozu zdroje hluku (dB)', data.finalValue],
    ],
    theme: 'grid',
    styles: { fontSize: 9 },
    margin: { left: 15, right: 15 },
  });

  // ========== STRANA 8 - Závěr ==========
  doc.addPage();
  addHeaderFooter(8);
  yPos = 45;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('6. Závěr', 15, yPos);
  yPos += 10;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Tabulka 5 – Porovnání s hygienickým limitem', 15, yPos);
  yPos += 5;

  doc.autoTable({
    startY: yPos,
    head: [[`M1 – ${data.measurementLocation} ${data.measurementAddress}`, '']],
    body: [
      ['druh chráněného prostoru', 'CHVePS'],
      [{ content: 'denní doba', colSpan: 2, styles: { fontStyle: 'bold' } }],
      ['stanovený hygienický limit (dB)', data.dayLimit],
      ['výsledná dopadající hladina při provozu tepelného čerpadla,\nvčetně zbytkového hluku, stanovena pro referenční časový\ninterval LAeq,8 hod (dB)', data.finalValue],
      ['kombinovaná rozšířená nejistota měření (dB)', '1,7'],
      ['výsledná hodnota hladiny hluku po odečtení nejistoty měření,\nstanovena pro dobu provozu tepelného čerpadla LAeq,8 hod (dB)', '30,7'],
      [{ content: 'Hygienický limit není prokazatelně překročen', colSpan: 2, styles: { fillColor: [200, 255, 200], fontStyle: 'bold' } }],
      [{ content: `M1 – ${data.measurementLocation} ${data.measurementAddress}`, colSpan: 2, styles: { fontStyle: 'bold' } }],
      ['druh chráněného prostoru', 'CHVePS'],
      [{ content: 'noční doba', colSpan: 2, styles: { fontStyle: 'bold' } }],
      ['stanovený hygienický limit (dB)', data.nightLimit],
      ['výsledná dopadající hladina při provozu tepelného čerpadla,\nvčetně zbytkového hluku, stanovena pro referenční časový\ninterval LAeq,1 hod (dB)', data.finalValue],
      ['kombinovaná rozšířená nejistota měření (dB)', '1,7'],
      ['výsledná hodnota hladiny hluku po odečtení nejistoty měření,\nstanovena pro dobu provozu tepelného čerpadla LAeq,1 hod (dB)', '30,7'],
      [{ content: 'Hygienický limit není prokazatelně překročen', colSpan: 2, styles: { fillColor: [200, 255, 200], fontStyle: 'bold' } }],
    ],
    theme: 'grid',
    styles: { fontSize: 8 },
    margin: { left: 15, right: 15 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(9);
  doc.text('Výše použitých hygienických limitů byla stanovena dle Nařízení vlády č. 272/2011 Sb. [4].', 15, yPos);
  yPos += 10;

  doc.text('----------------------------------------------------konec protokolu--------------------------------------------------', 15, yPos);

  // Uložit PDF
  doc.save(`protokol-mereni-hluku-${data.protocolNumber}.pdf`);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
