import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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
    // Načíst šablonu PDF
    const templateUrl = '/template.pdf';
    const existingPdfBytes = await fetch(templateUrl).then(res => res.arrayBuffer());

    // Načíst PDF dokument
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pages = pdfDoc.getPages();

    // ========== STRANA 1 ==========
    const page1 = pages[0];
    const { height } = page1.getSize();

    // Objednatel
    page1.drawText(data.clientName, {
      x: 100,
      y: height - 150,
      size: 10,
      font: helveticaFont,
    });

    page1.drawText(data.clientAddress, {
      x: 100,
      y: height - 165,
      size: 10,
      font: helveticaFont,
    });

    page1.drawText(data.clientCity, {
      x: 100,
      y: height - 180,
      size: 10,
      font: helveticaFont,
    });

    // Číslo protokolu
    page1.drawText(data.protocolNumber, {
      x: 300,
      y: height - 250,
      size: 12,
      font: helveticaBold,
    });

    // Datum měření
    page1.drawText(formatDate(data.measurementDate), {
      x: 150,
      y: height - 310,
      size: 10,
      font: helveticaFont,
    });

    // Místo měření
    page1.drawText(`${data.measurementLocation} - ${data.measurementAddress}`, {
      x: 150,
      y: height - 325,
      size: 10,
      font: helveticaBold,
    });

    // Personál
    page1.drawText(data.measuredBy, {
      x: 150,
      y: height - 365,
      size: 10,
      font: helveticaFont,
    });

    page1.drawText(data.preparedBy, {
      x: 150,
      y: height - 380,
      size: 10,
      font: helveticaFont,
    });

    page1.drawText(data.measuredBy, {
      x: 150,
      y: height - 395,
      size: 10,
      font: helveticaFont,
    });

    // Datum vyhotovení
    page1.drawText(formatDate(data.issueDate), {
      x: 150,
      y: height - 455,
      size: 10,
      font: helveticaFont,
    });

    page1.drawText(data.preparedBy, {
      x: 400,
      y: height - 455,
      size: 9,
      font: helveticaFont,
    });

    // ========== STRANA 3 - Meteorologické podmínky ==========
    const page3 = pages[2];
    const { height: height3 } = page3.getSize();

    // Tepelné čerpadlo v textu
    page3.drawText(data.heatPumpModel, {
      x: 200,
      y: height3 - 400,
      size: 9,
      font: helveticaFont,
    });

    // Tabulka meteorologických podmínek - musíme najít přesné pozice
    page3.drawText(data.temperature, {
      x: 150,
      y: height3 - 680,
      size: 9,
      font: helveticaFont,
    });

    page3.drawText(data.humidity, {
      x: 200,
      y: height3 - 680,
      size: 9,
      font: helveticaFont,
    });

    page3.drawText(data.pressure, {
      x: 250,
      y: height3 - 680,
      size: 9,
      font: helveticaFont,
    });

    page3.drawText(data.windSpeed, {
      x: 310,
      y: height3 - 680,
      size: 9,
      font: helveticaFont,
    });

    // ========== STRANA 6 - Naměřené hodnoty ==========
    const page6 = pages[5];
    const { height: height6 } = page6.getSize();

    // Tabulka naměřených hodnot
    page6.drawText(data.laeqT, {
      x: 230,
      y: height6 - 195,
      size: 9,
      font: helveticaFont,
    });

    page6.drawText(data.l5, {
      x: 280,
      y: height6 - 195,
      size: 9,
      font: helveticaFont,
    });

    page6.drawText(data.l10, {
      x: 330,
      y: height6 - 195,
      size: 9,
      font: helveticaFont,
    });

    page6.drawText(data.l90, {
      x: 380,
      y: height6 - 195,
      size: 9,
      font: helveticaFont,
    });

    page6.drawText(data.l95, {
      x: 430,
      y: height6 - 195,
      size: 9,
      font: helveticaFont,
    });

    // Zbytkový hluk
    page6.drawText(data.backgroundNoise, {
      x: 230,
      y: height6 - 215,
      size: 9,
      font: helveticaFont,
    });

    // ========== STRANA 7 - Výsledné hodnoty ==========
    const page7 = pages[6];
    const { height: height7 } = page7.getSize();

    // Tabulka výsledných hodnot
    page7.drawText(data.laeqT, {
      x: 450,
      y: height7 - 380,
      size: 9,
      font: helveticaFont,
    });

    page7.drawText(data.correction, {
      x: 450,
      y: height7 - 430,
      size: 9,
      font: helveticaFont,
    });

    page7.drawText(data.finalValue, {
      x: 450,
      y: height7 - 455,
      size: 9,
      font: helveticaBold,
    });

    // ========== STRANA 8 - Závěr ==========
    const page8 = pages[7];
    const { height: height8 } = page8.getSize();

    // Hygienické limity - denní doba
    page8.drawText(data.dayLimit, {
      x: 450,
      y: height8 - 180,
      size: 9,
      font: helveticaFont,
    });

    page8.drawText(data.finalValue, {
      x: 450,
      y: height8 - 210,
      size: 9,
      font: helveticaFont,
    });

    // Hygienické limity - noční doba
    page8.drawText(data.nightLimit, {
      x: 450,
      y: height8 - 370,
      size: 9,
      font: helveticaFont,
    });

    page8.drawText(data.finalValue, {
      x: 450,
      y: height8 - 400,
      size: 9,
      font: helveticaFont,
    });

    // Uložit PDF
    const pdfBytes = await pdfDoc.save();

    // Vytvořit blob a stáhnout
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
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
  });
}
