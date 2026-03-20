# 📄 Generátor protokolů měření hluku

Webová aplikace pro vytváření protokolů o měření hluku z tepelných čerpadel.

## ✨ Funkce

- ✅ **58 editovatelných polí** organizovaných do přehledných sekcí
- ✅ **Editace typu čerpadla** (model, výrobce, výkon)
- ✅ **Editace umístění mikrofonu** (popis, vzdálenost, výška)
- ✅ **Generování PDF protokolů** s profesionálním vzhledem
- ✅ **Responzivní design** (funguje na PC i mobilu)
- ✅ **Předvyplněné ukázkové hodnoty** podle standardního protokolu

## 🚀 Spuštění

### Lokálně

```bash
npm install
npm run dev
```

Aplikace běží na `http://localhost:3000`

### Produkce

```bash
npm run build
npm start
```

## 📋 Editovatelná pole

### Základní údaje
- Číslo protokolu
- Datum vyhotovení

### Objednatel
- Název firmy, adresa, město

### Místo měření
- Lokalita, datum, adresa

### Personál
- Měření provedl, Protokol vyhotovil

### Tepelné čerpadlo
- Typ/Model (např. Sinclair MSH-100EB)
- Výrobce
- Výkon

### Umístění mikrofonu
- Popis umístění
- Vzdálenost od zdroje
- Výška měření

### Meteorologické podmínky
- Teplota, vlhkost, tlak, vítr, oblačnost

### Naměřené akustické hodnoty
- LAeq,T, L5, L10, L90, L95

### Výpočty a výsledky
- Zbytkový hluk, korekce
- Hygienické limity (den/noc)
- Výsledná hodnota

### Závěr
- Text závěru

## 🛠️ Technologie

- **Next.js 16.2** - React framework
- **TypeScript** - Typová bezpečnost
- **Tailwind CSS v4** - Styling
- **jsPDF** - Generování PDF
- **jspdf-autotable** - Tabulky v PDF

## 📄 Jak používat

1. Vyplňte formulář (všechna pole jsou předvyplněná)
2. Upravte hodnoty podle potřeby
3. Klikněte "Vygenerovat PDF protokol"
4. PDF se automaticky stáhne

## 🌐 Deployment

Aplikace je připravená pro nasazení na:
- Vercel
- Railway
- Netlify

## 📝 Licence

MIT
