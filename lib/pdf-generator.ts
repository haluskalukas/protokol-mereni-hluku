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

  let yPos = 20;

  // Hlavička
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PROTOKOL O MĚŘENÍ HLUKU', 105, yPos, { align: 'center' });

  yPos += 10;
  doc.setFontSize(12);
  doc.text(`Číslo protokolu: ${data.protocolNumber}`, 20, yPos);

  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Datum vyhotovení: ${formatDate(data.issueDate)}`, 20, yPos);

  yPos += 15;

  // Objednatel
  doc.setFont('helvetica', 'bold');
  doc.text('OBJEDNATEL:', 20, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(data.clientName, 20, yPos);
  yPos += 5;
  doc.text(data.clientAddress, 20, yPos);
  yPos += 5;
  doc.text(data.clientCity, 20, yPos);

  yPos += 15;

  // Místo měření
  doc.setFont('helvetica', 'bold');
  doc.text('MÍSTO MĚŘENÍ:', 20, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Lokalita: ${data.measurementLocation}`, 20, yPos);
  yPos += 5;
  doc.text(`Adresa: ${data.measurementAddress}`, 20, yPos);
  yPos += 5;
  doc.text(data.measurementCity, 20, yPos);
  yPos += 5;
  doc.text(`Datum měření: ${formatDate(data.measurementDate)}`, 20, yPos);

  yPos += 15;

  // Personál
  doc.setFont('helvetica', 'bold');
  doc.text('PERSONÁL:', 20, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Měření provedl: ${data.measuredBy}`, 20, yPos);
  yPos += 5;
  doc.text(`Protokol vyhotovil: ${data.preparedBy}`, 20, yPos);

  yPos += 15;

  // Tepelné čerpadlo
  doc.setFont('helvetica', 'bold');
  doc.text('MĚŘENÉ ZAŘÍZENÍ - TEPELNÉ ČERPADLO:', 20, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Typ/Model: ${data.heatPumpModel}`, 20, yPos);
  yPos += 5;
  doc.text(`Výrobce: ${data.heatPumpManufacturer}`, 20, yPos);
  yPos += 5;
  doc.text(`Výkon: ${data.heatPumpPower}`, 20, yPos);

  yPos += 15;

  // Umístění mikrofonu
  doc.setFont('helvetica', 'bold');
  doc.text('UMÍSTĚNÍ MIKROFONU:', 20, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Pozice: ${data.microphonePosition}`, 20, yPos);
  yPos += 5;
  doc.text(`Vzdálenost od zdroje: ${data.distanceFromSource}`, 20, yPos);
  yPos += 5;
  doc.text(`Výška měření: ${data.measurementHeight}`, 20, yPos);

  // Přidat novou stránku
  doc.addPage();
  yPos = 20;

  // Meteorologické podmínky - tabulka
  doc.setFont('helvetica', 'bold');
  doc.text('METEOROLOGICKÉ PODMÍNKY:', 20, yPos);
  yPos += 5;

  doc.autoTable({
    startY: yPos,
    head: [['Parametr', 'Hodnota']],
    body: [
      ['Teplota vzduchu', `${data.temperature} °C`],
      ['Relativní vlhkost', `${data.humidity} %`],
      ['Atmosférický tlak', `${data.pressure} hPa`],
      ['Rychlost větru', `${data.windSpeed} m/s`],
      ['Oblačnost', data.cloudiness],
    ],
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202], textColor: 255 },
    margin: { left: 20 },
    tableWidth: 170,
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Naměřené hodnoty - tabulka
  doc.setFont('helvetica', 'bold');
  doc.text('NAMĚŘENÉ AKUSTICKÉ HODNOTY:', 20, yPos);
  yPos += 5;

  doc.autoTable({
    startY: yPos,
    head: [['Parametr', 'Hodnota [dB]']],
    body: [
      ['LAeq,T (ekvivalentní hladina)', data.laeqT],
      ['L5 (překročená 5% času)', data.l5],
      ['L10 (překročená 10% času)', data.l10],
      ['L90 (překročená 90% času)', data.l90],
      ['L95 (překročená 95% času)', data.l95],
      ['Zbytkový hluk', data.backgroundNoise],
    ],
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202], textColor: 255 },
    margin: { left: 20 },
    tableWidth: 170,
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Výpočty
  doc.setFont('helvetica', 'bold');
  doc.text('KOREKCE A VÝSLEDKY:', 20, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Korekce na zbytkový hluk: ${data.correction} dB`, 20, yPos);
  yPos += 10;

  // Výsledná tabulka
  doc.autoTable({
    startY: yPos,
    head: [['Parametr', 'Hodnota [dB]']],
    body: [
      ['Hygienický limit - denní doba', data.dayLimit],
      ['Hygienický limit - noční doba', data.nightLimit],
      ['Výsledná naměřená hodnota', data.finalValue],
    ],
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202], textColor: 255 },
    bodyStyles: (data: any) => {
      if (data.row.index === 2) {
        return { fontStyle: 'bold', fillColor: [255, 255, 200] };
      }
      return {};
    },
    margin: { left: 20 },
    tableWidth: 170,
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // Závěr
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('ZÁVĚR:', 20, yPos);
  yPos += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const conclusionLines = doc.splitTextToSize(data.conclusion, 170);
  doc.text(conclusionLines, 20, yPos);

  yPos += conclusionLines.length * 7 + 20;

  // Kontrola, jestli se vejde podpis na stránku
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  // Podpisy
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Měření provedl:', 20, yPos);
  doc.text('Protokol vyhotovil:', 110, yPos);
  yPos += 15;
  doc.line(20, yPos, 80, yPos);
  doc.line(110, yPos, 170, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(data.measuredBy, 20, yPos);
  doc.text(data.preparedBy, 110, yPos);

  // Poznámka
  yPos += 15;
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text('Protokol byl vytvořen automaticky generátorem protokolů měření hluku.', 20, yPos);
  doc.text(`Datum vyhotovení: ${formatDate(data.issueDate)}`, 20, yPos + 4);

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
