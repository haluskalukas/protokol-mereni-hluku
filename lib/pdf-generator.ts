import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from 'pdf-lib';

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

export async function generateProtocolPDF(data: ProtocolData) {
  try {
    const pdfDoc = await PDFDocument.create();

    // Načíst fonty
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helveticaItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    // Barvy
    const black = rgb(0, 0, 0);
    const gray = rgb(0.4, 0.4, 0.4);
    const lightGray = rgb(0.9, 0.9, 0.9);
    const blue = rgb(0.2, 0.4, 0.8);

    // Funkce pro konverzi českých znaků do WinAnsi kódování
    const toWinAnsi = (text: string): string => {
      const replacements: { [key: string]: string } = {
        'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e', 'í': 'i',
        'ň': 'n', 'ó': 'o', 'ř': 'r', 'š': 's', 'ť': 't', 'ú': 'u',
        'ů': 'u', 'ý': 'y', 'ž': 'z',
        'Á': 'A', 'Č': 'C', 'Ď': 'D', 'É': 'E', 'Ě': 'E', 'Í': 'I',
        'Ň': 'N', 'Ó': 'O', 'Ř': 'R', 'Š': 'S', 'Ť': 'T', 'Ú': 'U',
        'Ů': 'U', 'Ý': 'Y', 'Ž': 'Z'
      };
      return text.split('').map(char => replacements[char] || char).join('');
    };

    // Helper funkce pro bezpečné vykreslení textu
    const safeDrawText = (page: PDFPage, text: string, options: any) => {
      page.drawText(toWinAnsi(text), options);
    };

    // Wrap všechny stránky, aby drawText automaticky používal toWinAnsi
    const wrapPage = (page: PDFPage) => {
      const originalDrawText = page.drawText.bind(page);
      page.drawText = (text: string, options?: any) => {
        originalDrawText(toWinAnsi(text), options);
      };
      return page;
    };

    // ========== FUNKCE PRO HLAVIČKU ==========
    const addHeader = (page: PDFPage, pageNumber: number) => {
      const { width, height } = page.getSize();

      // Rám hlavičky
      page.drawRectangle({
        x: 40,
        y: height - 80,
        width: width - 80,
        height: 60,
        borderColor: black,
        borderWidth: 1,
      });

      // Text hlavičky
      safeDrawText(page, 'Akusticka laborator', {
        x: 250,
        y: height - 50,
        size: 14,
        font: helveticaBold,
        color: black,
      });

      safeDrawText(page, 'Autorizovana dle zakona c. 258/2000 Sb., ve zneni pozdejsich predpisu', {
        x: 150,
        y: height - 65,
        size: 8,
        font: helveticaItalic,
        color: gray,
      });

      safeDrawText(page, 'Akulab s.r.o., Kavrianon 417/417, 683 52 Saratice', {
        x: 170,
        y: height - 75,
        size: 8,
        font: helvetica,
        color: black,
      });

      safeDrawText(page, 'www.akulab.cz, e-mail: akulab@akulab.cz, tel.: 606 641 521', {
        x: 155,
        y: height - 85,
        size: 8,
        font: helvetica,
        color: black,
      });

      // Zápatí
      safeDrawText(page, `Protokol o mereni hluku c. ${data.protocolNumber}`, {
        x: 40,
        y: 30,
        size: 8,
        font: helvetica,
        color: black,
      });

      safeDrawText(page, `Strana ${pageNumber} z 8`, {
        x: width - 100,
        y: 30,
        size: 8,
        font: helvetica,
        color: black,
      });
    };

    // ========== FUNKCE PRO TABULKU ==========
    const drawTable = (
      page: PDFPage,
      x: number,
      y: number,
      headers: string[],
      rows: string[][],
      columnWidths: number[],
      font: PDFFont,
      fontSize: number = 9
    ) => {
      const rowHeight = 20;
      const cellPadding = 5;
      let currentY = y;

      // Hlavička tabulky
      let currentX = x;
      headers.forEach((header, i) => {
        page.drawRectangle({
          x: currentX,
          y: currentY,
          width: columnWidths[i],
          height: rowHeight,
          borderColor: black,
          borderWidth: 0.5,
          color: lightGray,
        });

        safeDrawText(page, header, {
          x: currentX + cellPadding,
          y: currentY + rowHeight / 2 - 3,
          size: fontSize,
          font: helveticaBold,
          color: black,
        });

        currentX += columnWidths[i];
      });

      currentY -= rowHeight;

      // Řádky
      rows.forEach(row => {
        currentX = x;
        row.forEach((cell, i) => {
          page.drawRectangle({
            x: currentX,
            y: currentY,
            width: columnWidths[i],
            height: rowHeight,
            borderColor: black,
            borderWidth: 0.5,
          });

          const lines = cell.split('\n');
          lines.forEach((line, lineIndex) => {
            safeDrawText(page, line, {
              x: currentX + cellPadding,
              y: currentY + rowHeight / 2 - 3 - (lineIndex * 10),
              size: fontSize - 1,
              font: font,
              color: black,
            });
          });

          currentX += columnWidths[i];
        });
        currentY -= rowHeight;
      });

      return currentY;
    };

    // ========== STRANA 1 ==========
    const page1 = wrapPage(pdfDoc.addPage([595.28, 841.89])); // A4
    addHeader(page1, 1);
    const { height: h1 } = page1.getSize();

    let y = h1 - 110;

    // Objednatel
    page1.drawText('Objednatel:', {
      x: 40,
      y: y,
      size: 10,
      font: helveticaBold,
    });

    page1.drawText(data.clientName, {
      x: 150,
      y: y,
      size: 10,
      font: helvetica,
    });
    y -= 15;

    page1.drawText(data.clientAddress, {
      x: 150,
      y: y,
      size: 10,
      font: helvetica,
    });
    y -= 15;

    page1.drawText(data.clientCity, {
      x: 150,
      y: y,
      size: 10,
      font: helvetica,
    });
    y -= 40;

    // Nadpis protokolu
    page1.drawText(`Protokol o měření hluku č. ${data.protocolNumber}`, {
      x: 110,
      y: y,
      size: 14,
      font: helveticaBold,
    });
    y -= 20;

    page1.drawText('Hluk v mimopracovním prostředí', {
      x: 180,
      y: y,
      size: 11,
      font: helvetica,
    });
    y -= 15;

    page1.drawText('Autorizační set G2', {
      x: 220,
      y: y,
      size: 11,
      font: helvetica,
    });
    y -= 40;

    // Datum a místo měření
    page1.drawText('Datum měření:', {
      x: 40,
      y: y,
      size: 10,
      font: helvetica,
    });

    page1.drawText(formatDate(data.measurementDate), {
      x: 150,
      y: y,
      size: 10,
      font: helvetica,
    });
    y -= 15;

    page1.drawText('Místo měření:', {
      x: 40,
      y: y,
      size: 10,
      font: helvetica,
    });

    page1.drawText(`${data.measurementLocation} - ${data.measurementAddress}`, {
      x: 150,
      y: y,
      size: 10,
      font: helveticaBold,
    });
    y -= 40;

    // Personál
    page1.drawText('Měřil:', {
      x: 40,
      y: y,
      size: 10,
      font: helvetica,
    });

    page1.drawText(data.measuredBy, {
      x: 150,
      y: y,
      size: 10,
      font: helvetica,
    });
    y -= 15;

    page1.drawText('Vyhotovil:', {
      x: 40,
      y: y,
      size: 10,
      font: helvetica,
    });

    page1.drawText(data.preparedBy, {
      x: 150,
      y: y,
      size: 10,
      font: helvetica,
    });
    y -= 15;

    page1.drawText('', {
      x: 40,
      y: y,
      size: 10,
      font: helvetica,
    });

    page1.drawText(data.measuredBy, {
      x: 150,
      y: y,
      size: 10,
      font: helvetica,
    });
    y -= 60;

    // Datum a podpisy
    page1.drawText('V Šaraticích dne:', {
      x: 40,
      y: y,
      size: 10,
      font: helvetica,
    });

    page1.drawText(formatDate(data.issueDate), {
      x: 150,
      y: y,
      size: 10,
      font: helvetica,
    });

    page1.drawText('………………………………...', {
      x: 400,
      y: y,
      size: 10,
      font: helvetica,
    });
    y -= 10;

    page1.drawText(data.preparedBy, {
      x: 400,
      y: y,
      size: 9,
      font: helvetica,
    });
    y -= 8;

    page1.drawText('Vedoucí akustické laboratoře', {
      x: 400,
      y: y,
      size: 8,
      font: helvetica,
    });
    y -= 8;

    page1.drawText('Odborný vedoucí setu', {
      x: 400,
      y: y,
      size: 8,
      font: helvetica,
    });
    y -= 30;

    // Poznámky
    page1.drawText('Všechny výsledky se týkají pouze předmětu měření.', {
      x: 40,
      y: y,
      size: 8,
      font: helvetica,
    });
    y -= 10;

    page1.drawText('Bez písemného souhlasu laboratoře není možno protokol reprodukovat jinak než celý.', {
      x: 40,
      y: y,
      size: 8,
      font: helvetica,
    });
    y -= 15;

    page1.drawText(`Kontakt na zpracovatele: ${data.preparedBy}, e-mail: haluska@akulab.cz, tel.: 732 868 141`, {
      x: 40,
      y: y,
      size: 8,
      font: helvetica,
    });

    // ========== STRANA 2 - Značky, přístroje, normy ==========
    const page2 = wrapPage(pdfDoc.addPage([595.28, 841.89]));
    addHeader(page2, 2);
    const { height: h2 } = page2.getSize();

    y = h2 - 110;

    page2.drawText('1. Použité značky, jednotky a veličiny', {
      x: 40,
      y: y,
      size: 11,
      font: helveticaBold,
    });
    y -= 20;

    // Tabulka značek
    drawTable(
      page2,
      40,
      y,
      ['značka', 'jednotka', 'veličina'],
      [
        ['LAeq,T', 'dB', 'ekvivalentní hladina akustického tlaku'],
        ['LN', 'dB', 'distribuční hladina udávající hladinu akustického tlaku\npřekračovanou v N procentech měřícího intervalu'],
        ['v', 'm/s', 'rychlost proudění vzduchu'],
        ['t', '°C', 'teplota vzduchu'],
        ['Rh', '%', 'relativní vlhkost vzduchu'],
        ['Pn', 'hPa', 'normální atmosférický tlak'],
        ['U', 'dB', 'kombinovaná rozšířená nejistota měření'],
        ['CHVePS', '-', 'chráněný venkovní prostor staveb'],
      ],
      [60, 60, 395],
      helvetica
    );

    y -= 220;

    page2.drawText('2. Použité měřicí přístroje', {
      x: 40,
      y: y,
      size: 11,
      font: helveticaBold,
    });
    y -= 15;

    page2.drawText('Tabulka 1 – Měřicí aparatura', {
      x: 40,
      y: y,
      size: 9,
      font: helvetica,
    });
    y -= 15;

    drawTable(
      page2,
      40,
      y,
      ['měřidlo', 'výrobní číslo', 'ověření / kalibrace do'],
      [
        ['zvukoměr SVAN 971', '107544', '9. 9. 2027'],
        ['mikrofon ACO Pacific 7052E', '80031', '9. 9. 2027'],
        ['akustický kalibrátor LD Cal 200', '16763', '20. 1. 2028'],
        ['meteostanice WH 1080', '-', '19.02.2030'],
        ['měřicí pásmo 10 m Festa', 'K704', '28.01.2030'],
      ],
      [200, 150, 165],
      helvetica
    );

    y -= 130;

    page2.drawText('Měřicí aparatura byla před a po měření kontrolována uvedeným akustickým kalibrátorem.', {
      x: 40,
      y: y,
      size: 9,
      font: helvetica,
    });

    y -= 25;

    page2.drawText('3. Použité normy a legislativa', {
      x: 40,
      y: y,
      size: 11,
      font: helveticaBold,
    });
    y -= 15;

    page2.drawText('Měření a hodnocení hluku bylo provedeno dle:', {
      x: 40,
      y: y,
      size: 9,
      font: helvetica,
    });
    y -= 15;

    const normy = [
      '[1] ČSN ISO 1996-1: Akustika - Popis, měření a hodnocení hluku prostředí - Část 1:\n     Základní veličiny a postupy pro hodnocení',
      '[2] ČSN ISO 1996-2: Akustika - Popis, měření a hodnocení hluku prostředí - Část 2:\n     Určování hladin akustického tlaku',
      '[3] Zákon č. 258/2000 Sb., o ochraně veřejného zdraví a o změně některých\n     souvisejících zákonů; ve znění pozdějších předpisů',
      '[4] Nařízení vlády č. 272/2011 Sb., o ochraně veřejného zdraví před nepříznivými\n     účinky hluku a vibrací; ve znění pozdějších předpisů',
      '[5] Metodický návod pro měření a hodnocení hluku v mimopracovním prostředí.\n     Věstník MZ ČR, částka 14/2023',
    ];

    normy.forEach(norma => {
      const lines = norma.split('\n');
      lines.forEach(line => {
        page2.drawText(line, {
          x: 40,
          y: y,
          size: 8,
          font: helvetica,
        });
        y -= 10;
      });
      y -= 5;
    });

    // ========== STRANA 3 - Měření ==========
    const page3 = wrapPage(pdfDoc.addPage([595.28, 841.89]));
    addHeader(page3, 3);
    const { height: h3 } = page3.getSize();

    y = h3 - 110;

    page3.drawText('4. Měření', {
      x: 40,
      y: y,
      size: 11,
      font: helveticaBold,
    });
    y -= 15;

    const merenText = `Bylo provedeno autorizované měření hluku, které má sloužit jako podklad pro příslušný Orgán ochrany veřejného zdraví k doložení hlukové zátěže v souvislosti s provozem tepelného čerpadla náležícímu k rodinnému domu.

Měření bylo provedeno v době ${formatDate(data.measurementDate)}.

Měření byl přítomen zástupce objednatele. Nejprve byl nastaven chod posuzovaného zdroje hluku na maximální výkon a provedeno měření k posouzení správného nastavení zdroje hluku dle technického listu. Dále bylo provedeno měření v místě M1. Dále byl měřen zbytkový hluk lokality.`;

    const merenLines = merenText.split('\n\n');
    merenLines.forEach(paragraph => {
      const wrapped = wrapText(paragraph, 510, helvetica, 9);
      wrapped.forEach(line => {
        page3.drawText(line, {
          x: 40,
          y: y,
          size: 9,
          font: helvetica,
        });
        y -= 12;
      });
      y -= 5;
    });

    y -= 10;

    page3.drawText('Měřený zdroj hluku', {
      x: 40,
      y: y,
      size: 10,
      font: helveticaBold,
    });
    y -= 15;

    const zdrojText = `Měřeným zdrojem hluku je tepelné čerpadlo umístěné ${data.microphonePosition}. Jedná se o tepelné čerpadlo ${data.heatPumpModel}.

Zdroj hluku se vyznačuje ustáleným charakterem, přičemž v provozu bude nepravidelně v denní i noční době při proměnlivém výkonu.`;

    zdrojText.split('\n\n').forEach(paragraph => {
      const wrapped = wrapText(paragraph, 510, helvetica, 9);
      wrapped.forEach(line => {
        page3.drawText(line, {
          x: 40,
          y: y,
          size: 9,
          font: helvetica,
        });
        y -= 12;
      });
      y -= 5;
    });

    y -= 10;

    page3.drawText('Zbytkový hluk', {
      x: 40,
      y: y,
      size: 10,
      font: helveticaBold,
    });
    y -= 15;

    const zbytkovyText = `Z naměřeného vzorku byly odstraněny jasně identifikovatelné zdroje hluku (hovory lidí, zvuky zvířat, průjezdy automobilů). Měření zbytkového hluku proběhlo v místě M1 po uvedení posuzovaného zdroje hluku mimo provoz. Zbytkový hluk byl tvořen šuměním větru a vzdálenou automobilovou dopravou.`;

    const zbytkovyWrapped = wrapText(zbytkovyText, 510, helvetica, 9);
    zbytkovyWrapped.forEach(line => {
      page3.drawText(line, {
        x: 40,
        y: y,
        size: 9,
        font: helvetica,
      });
      y -= 12;
    });

    y -= 20;

    page3.drawText('Meteorologické podmínky', {
      x: 40,
      y: y,
      size: 10,
      font: helveticaBold,
    });
    y -= 15;

    page3.drawText('Tabulka 2 – Meteorologické podmínky během měření', {
      x: 40,
      y: y,
      size: 9,
      font: helvetica,
    });
    y -= 15;

    drawTable(
      page3,
      40,
      y,
      ['čas', 't\n(°C)', 'Rh\n(%)', 'Pn\n(hPa)', 'v\n(km/h)', 'směr větru\n(-)'],
      [
        ['11:30', data.temperature, data.humidity, data.pressure, data.windSpeed, 'J'],
      ],
      [70, 50, 50, 60, 60, 80],
      helvetica,
      8
    );

    // ========== STRANA 4 - Místo měření (placeholder pro mapu) ==========
    const page4 = wrapPage(pdfDoc.addPage([595.28, 841.89]));
    addHeader(page4, 4);
    const { height: h4 } = page4.getSize();

    y = h4 - 110;

    page4.drawText(`Měřicí místo M1 – ${data.measurementAddress}`, {
      x: 40,
      y: y,
      size: 11,
      font: helveticaBold,
    });
    y -= 15;

    const mistoText = `Měřicí místo bylo zvoleno v místě nejexponovanějšího CHVePS před severovýchodní fasádou rodinného domu na adrese ${data.measurementAddress}. Jedná se o okno v úrovni 1.NP. Měřicí aparatura byla upevněna do stativu ve výšce ${data.measurementHeight} nad úrovní terénu orientována směrem ke zdroji hluku, 2 m od fasády. Vzdálenost mezi zdrojem hluku a měřicím místem je ${data.distanceFromSource}.`;

    const mistoWrapped = wrapText(mistoText, 510, helvetica, 9);
    mistoWrapped.forEach(line => {
      page4.drawText(line, {
        x: 40,
        y: y,
        size: 9,
        font: helvetica,
      });
      y -= 12;
    });

    y -= 30;

    page4.drawText('Mapové podklady a fotodokumentace', {
      x: 40,
      y: y,
      size: 10,
      font: helveticaBold,
    });
    y -= 20;

    // Placeholder pro mapu
    page4.drawRectangle({
      x: 40,
      y: y - 300,
      width: 515,
      height: 300,
      borderColor: black,
      borderWidth: 1,
    });

    page4.drawText('[Mapa lokality - sem lze vložit obrázek]', {
      x: 180,
      y: y - 150,
      size: 10,
      font: helveticaItalic,
      color: gray,
    });

    // ========== STRANA 5 - Fotodokumentace ==========
    const page5 = wrapPage(pdfDoc.addPage([595.28, 841.89]));
    addHeader(page5, 5);
    const { height: h5 } = page5.getSize();

    y = h5 - 110;

    // Placeholder pro fotku
    page5.drawRectangle({
      x: 40,
      y: y - 400,
      width: 515,
      height: 400,
      borderColor: black,
      borderWidth: 1,
    });

    page5.drawText('[Fotodokumentace - sem lze vložit obrázek]', {
      x: 160,
      y: y - 200,
      size: 10,
      font: helveticaItalic,
      color: gray,
    });

    y -= 420;

    page5.drawText('Obrázek 2 – Pohled na místo měření M1 od tepelného čerpadla', {
      x: 40,
      y: y,
      size: 9,
      font: helvetica,
    });

    // ========== STRANA 6 - Výsledky měření ==========
    const page6 = wrapPage(pdfDoc.addPage([595.28, 841.89]));
    addHeader(page6, 6);
    const { height: h6 } = page6.getSize();

    y = h6 - 110;

    page6.drawText('5. Výsledky měření', {
      x: 40,
      y: y,
      size: 11,
      font: helveticaBold,
    });
    y -= 15;

    page6.drawText('Tabulka 3 – Naměřené hodnoty v měřicím místě', {
      x: 40,
      y: y,
      size: 9,
      font: helvetica,
    });
    y -= 15;

    drawTable(
      page6,
      40,
      y,
      ['charakter\nměřeného\nhluku', 'měřicí\nmísto', 'čas\nměření', 'LAeq,T\n(dB)', 'L5\n(dB)', 'L10\n(dB)', 'L90\n(dB)', 'L95\n(dB)'],
      [
        ['ustálený', 'M1', '11:30 – 11:45', data.laeqT, data.l5, data.l10, data.l90, data.l95],
        ['', 'zbytkový\nhluk', '11:45 – 12:00', data.backgroundNoise, '32,2', '32,2', '32,1', '32,1'],
      ],
      [60, 60, 75, 55, 45, 50, 50, 50],
      helvetica,
      8
    );

    y -= 80;

    const rozdilText = `Rozdíl mezi naměřenou hladinou hluku v místě M1 a hladinou zbytkového hluku je méně než 3,0 dB. Měřený zdroj hluku není možno jednoznačně odlišit od zbytkového hluku.`;

    const rozdilWrapped = wrapText(rozdilText, 510, helvetica, 9);
    rozdilWrapped.forEach(line => {
      page6.drawText(line, {
        x: 40,
        y: y,
        size: 9,
        font: helvetica,
      });
      y -= 12;
    });

    y -= 20;

    page6.drawText('Nejistota měření', {
      x: 40,
      y: y,
      size: 10,
      font: helveticaBold,
    });
    y -= 15;

    const nejistotaText = `Měření bylo provedeno zvukoměrem třídy I, který byl zkontrolován kalibrátorem třídy I. Dle Metodického návodu pro měření a hodnocení hluku v mimopracovním prostředí [5] je při použité metodě nejistota měření stanovena následovně:`;

    const nejistotaWrapped = wrapText(nejistotaText, 510, helvetica, 9);
    nejistotaWrapped.forEach(line => {
      page6.drawText(line, {
        x: 40,
        y: y,
        size: 9,
        font: helvetica,
      });
      y -= 12;
    });

    y -= 15;

    page6.drawText('U = 1,7 dB', {
      x: 250,
      y: y,
      size: 12,
      font: helveticaBold,
    });

    y -= 30;

    page6.drawText('Korekce na polohu mikrofonu u odrazivé plochy', {
      x: 40,
      y: y,
      size: 10,
      font: helveticaBold,
    });
    y -= 15;

    const korekceText = `Na základě místního šetření bylo zjištěno, že nebyla splněna kritéria pro přičtení korekce -3 dB na odrazivé plochy dle článku 8.3.1 písm. c normy ČSN ISO 1996-2 [2]. Proto bylo v souladu s Metodickým návodem [5] provedeno přičtení korekce k výsledné celkové hladině v místě měření M1:`;

    const korekceWrapped = wrapText(korekceText, 510, helvetica, 9);
    korekceWrapped.forEach(line => {
      page6.drawText(line, {
        x: 40,
        y: y,
        size: 9,
        font: helvetica,
      });
      y -= 12;
    });

    y -= 15;

    page6.drawText('Vliv odrazivé plochy: -2,0 dB', {
      x: 200,
      y: y,
      size: 12,
      font: helveticaBold,
    });

    // ========== STRANA 7 - Tónová složka a výsledné hodnoty ==========
    const page7 = wrapPage(pdfDoc.addPage([595.28, 841.89]));
    addHeader(page7, 7);
    const { height: h7 } = page7.getSize();

    y = h7 - 110;

    page7.drawText('Tónová složka hluku', {
      x: 40,
      y: y,
      size: 10,
      font: helveticaBold,
    });
    y -= 15;

    page7.drawText('Obrázek 3 - Spektrální analýza v místě M1', {
      x: 40,
      y: y,
      size: 9,
      font: helvetica,
    });
    y -= 20;

    // Placeholder pro graf
    page7.drawRectangle({
      x: 40,
      y: y - 200,
      width: 515,
      height: 200,
      borderColor: black,
      borderWidth: 1,
    });

    page7.drawText('[Graf spektrální analýzy - sem lze vložit obrázek]', {
      x: 140,
      y: y - 100,
      size: 10,
      font: helveticaItalic,
      color: gray,
    });

    y -= 220;

    const tonovaText = `V naměřených hodnotách v místě M1 nebyla dle Nařízení vlády č. 272/2011 Sb. [4] detekována tónová složka hluku, nebude proto přičtena korekce k hygienickému limitu.`;

    const tonovaWrapped = wrapText(tonovaText, 510, helvetica, 9);
    tonovaWrapped.forEach(line => {
      page7.drawText(line, {
        x: 40,
        y: y,
        size: 9,
        font: helvetica,
      });
      y -= 12;
    });

    y -= 20;

    page7.drawText('Výsledné hodnoty', {
      x: 40,
      y: y,
      size: 10,
      font: helveticaBold,
    });
    y -= 15;

    page7.drawText(`Tabulka 4 – Výsledné hodnoty v měřicím místě M1`, {
      x: 40,
      y: y,
      size: 9,
      font: helvetica,
    });
    y -= 15;

    drawTable(
      page7,
      40,
      y,
      [`M1 – ${data.measurementAddress}`, ''],
      [
        ['naměřená hodnota LAeq,T nekorigovaná na zbytkový hluk (dB)', data.laeqT],
        ['korekce na zbytkový hluk (dB)', '0,0'],
        ['korekce na vliv odrazivé plochy (dB)', data.correction],
        ['výsledná dopadající hladina LAeq,T pro dobu provozu zdroje hluku (dB)', data.finalValue],
      ],
      [350, 100],
      helvetica,
      8
    );

    // ========== STRANA 8 - Závěr ==========
    const page8 = wrapPage(pdfDoc.addPage([595.28, 841.89]));
    addHeader(page8, 8);
    const { height: h8 } = page8.getSize();

    y = h8 - 110;

    page8.drawText('6. Závěr', {
      x: 40,
      y: y,
      size: 11,
      font: helveticaBold,
    });
    y -= 15;

    page8.drawText('Tabulka 5 – Porovnání s hygienickým limitem', {
      x: 40,
      y: y,
      size: 9,
      font: helvetica,
    });
    y -= 15;

    // Denní doba
    const zaver1Y = drawTable(
      page8,
      40,
      y,
      [`M1 – ${data.measurementAddress}`, ''],
      [
        ['druh chráněného prostoru', 'CHVePS'],
        ['denní doba', ''],
        ['stanovený hygienický limit (dB)', data.dayLimit],
        ['výsledná dopadající hladina při provozu tepelného čerpadla,\nvčetně zbytkového hluku, stanovena pro referenční časový\ninterval LAeq,8 hod (dB)', data.finalValue],
        ['kombinovaná rozšířená nejistota měření (dB)', '1,7'],
        ['výsledná hodnota hladiny hluku po odečtení nejistoty měření,\nstanovena pro dobu provozu tepelného čerpadla LAeq,8 hod (dB)', '30,7'],
      ],
      [350, 100],
      helvetica,
      7
    );

    y = zaver1Y - 20;

    // Zelený rámeček s výsledkem
    page8.drawRectangle({
      x: 40,
      y: y - 5,
      width: 450,
      height: 15,
      color: rgb(0.8, 1, 0.8),
      borderColor: black,
      borderWidth: 0.5,
    });

    page8.drawText('Hygienický limit není prokazatelně překročen', {
      x: 120,
      y: y,
      size: 9,
      font: helveticaBold,
    });

    y -= 30;

    // Noční doba
    const zaver2Y = drawTable(
      page8,
      40,
      y,
      [`M1 – ${data.measurementAddress}`, ''],
      [
        ['druh chráněného prostoru', 'CHVePS'],
        ['noční doba', ''],
        ['stanovený hygienický limit (dB)', data.nightLimit],
        ['výsledná dopadající hladina při provozu tepelného čerpadla,\nvčetně zbytkového hluku, stanovena pro referenční časový\ninterval LAeq,1 hod (dB)', data.finalValue],
        ['kombinovaná rozšířená nejistota měření (dB)', '1,7'],
        ['výsledná hodnota hladiny hluku po odečtení nejistoty měření,\nstanovena pro dobu provozu tepelného čerpadla LAeq,1 hod (dB)', '30,7'],
      ],
      [350, 100],
      helvetica,
      7
    );

    y = zaver2Y - 20;

    // Zelený rámeček s výsledkem
    page8.drawRectangle({
      x: 40,
      y: y - 5,
      width: 450,
      height: 15,
      color: rgb(0.8, 1, 0.8),
      borderColor: black,
      borderWidth: 0.5,
    });

    page8.drawText('Hygienický limit není prokazatelně překročen', {
      x: 120,
      y: y,
      size: 9,
      font: helveticaBold,
    });

    y -= 20;

    page8.drawText('Výše použitých hygienických limitů byla stanovena dle Nařízení vlády č. 272/2011 Sb. [4].', {
      x: 40,
      y: y,
      size: 9,
      font: helvetica,
    });

    y -= 15;

    page8.drawText('----------------------------------------------------konec protokolu--------------------------------------------------', {
      x: 40,
      y: y,
      size: 9,
      font: helvetica,
    });

    // Uložit PDF
    const pdfBytes = await pdfDoc.save();

    // Vytvořit blob a stáhnout
    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `protokol-mereni-hluku-${data.protocolNumber}.pdf`;
    link.click();
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Chyba při generování PDF:', error);
    alert('Nepodařilo se vygenerovat PDF. Zkontrolujte konzoli pro více informací.');
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '. ');
}

function wrapText(text: string, maxWidth: number, font: PDFFont, fontSize: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}
