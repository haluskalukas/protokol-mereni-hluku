'use client';

import { useState } from 'react';
import { generateProtocolPDF } from '@/lib/pdf-generator';

interface ProtocolData {
  // Hlavička
  protocolNumber: string;
  issueDate: string;

  // Objednatel
  clientName: string;
  clientAddress: string;
  clientCity: string;

  // Místo měření
  measurementLocation: string;
  measurementAddress: string;
  measurementCity: string;
  measurementDate: string;

  // Personál
  measuredBy: string;
  preparedBy: string;

  // Tepelné čerpadlo
  heatPumpModel: string;
  heatPumpManufacturer: string;
  heatPumpPower: string;

  // Umístění mikrofonu
  microphonePosition: string;
  distanceFromSource: string;
  measurementHeight: string;

  // Meteorologické podmínky
  temperature: string;
  humidity: string;
  pressure: string;
  windSpeed: string;
  cloudiness: string;

  // Naměřené hodnoty
  laeqT: string;
  l5: string;
  l10: string;
  l90: string;
  l95: string;

  // Zbytkový hluk
  backgroundNoise: string;

  // Korekce
  correction: string;

  // Hygieniské limity
  dayLimit: string;
  nightLimit: string;

  // Výsledek
  finalValue: string;

  // Závěr
  conclusion: string;
}

export default function HomePage() {
  const [formData, setFormData] = useState<ProtocolData>({
    protocolNumber: 'PM-2026-053',
    issueDate: new Date().toISOString().split('T')[0],

    clientName: 'Conmach s.r.o.',
    clientAddress: 'Svatopluka Čecha 343/5',
    clientCity: '678 01 Blansko',

    measurementLocation: 'Rekreační objekt',
    measurementAddress: 'Horní Heřmanice',
    measurementCity: 'Horní Heřmanice 87, Blansko 67801',
    measurementDate: new Date().toISOString().split('T')[0],

    measuredBy: 'Ing. Jan Novák',
    preparedBy: 'Ing. Jan Novák',

    heatPumpModel: 'Sinclair MSH-100EB',
    heatPumpManufacturer: 'Sinclair',
    heatPumpPower: '10 kW',

    microphonePosition: 'Volný prostor před objektem',
    distanceFromSource: '3,5 m',
    measurementHeight: '1,5 m',

    temperature: '19,2',
    humidity: '61',
    pressure: '1014',
    windSpeed: '< 1',
    cloudiness: 'oblačno',

    laeqT: '34,4',
    l5: '35,5',
    l10: '34,9',
    l90: '33,5',
    l95: '33,2',

    backgroundNoise: '32,1',

    correction: '0,3',

    dayLimit: '50,0',
    nightLimit: '40,0',

    finalValue: '32,4',

    conclusion: 'Naměřená hodnota hluku z tepelného čerpadla nepřekračuje hygienické limity stanovené pro denní ani noční dobu.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGeneratePDF = () => {
    generateProtocolPDF(formData);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold">Generátor protokolů měření hluku</h1>
            <p className="mt-2 text-blue-100">Vyplňte údaje a vygenerujte PDF protokol</p>
          </div>

          <form className="px-6 py-8 space-y-8">
            {/* Základní údaje */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
                Základní údaje
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Číslo protokolu *
                  </label>
                  <input
                    type="text"
                    name="protocolNumber"
                    value={formData.protocolNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Datum vyhotovení *
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Objednatel */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
                Objednatel
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Název firmy *
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ulice a číslo popisné *
                    </label>
                    <input
                      type="text"
                      name="clientAddress"
                      value={formData.clientAddress}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PSČ a Město *
                    </label>
                    <input
                      type="text"
                      name="clientCity"
                      value={formData.clientCity}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Místo měření */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
                Místo měření
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Popis lokality *
                    </label>
                    <input
                      type="text"
                      name="measurementLocation"
                      value={formData.measurementLocation}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Datum měření *
                    </label>
                    <input
                      type="date"
                      name="measurementDate"
                      value={formData.measurementDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ulice a číslo popisné *
                  </label>
                  <input
                    type="text"
                    name="measurementAddress"
                    value={formData.measurementAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Celá adresa *
                  </label>
                  <input
                    type="text"
                    name="measurementCity"
                    value={formData.measurementCity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Personál */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
                Personál
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Měření provedl *
                  </label>
                  <input
                    type="text"
                    name="measuredBy"
                    value={formData.measuredBy}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Protokol vyhotovil *
                  </label>
                  <input
                    type="text"
                    name="preparedBy"
                    value={formData.preparedBy}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Tepelné čerpadlo */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
                Tepelné čerpadlo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Typ/Model *
                  </label>
                  <input
                    type="text"
                    name="heatPumpModel"
                    value={formData.heatPumpModel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Výrobce *
                  </label>
                  <input
                    type="text"
                    name="heatPumpManufacturer"
                    value={formData.heatPumpManufacturer}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Výkon *
                  </label>
                  <input
                    type="text"
                    name="heatPumpPower"
                    value={formData.heatPumpPower}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Umístění mikrofonu */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
                Umístění mikrofonu
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Popis umístění *
                  </label>
                  <input
                    type="text"
                    name="microphonePosition"
                    value={formData.microphonePosition}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vzdálenost od zdroje *
                    </label>
                    <input
                      type="text"
                      name="distanceFromSource"
                      value={formData.distanceFromSource}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="např. 3,5 m"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Výška měření *
                    </label>
                    <input
                      type="text"
                      name="measurementHeight"
                      value={formData.measurementHeight}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="např. 1,5 m"
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Meteorologické podmínky */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
                Meteorologické podmínky
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teplota (°C) *
                  </label>
                  <input
                    type="text"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="19,2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vlhkost (%) *
                  </label>
                  <input
                    type="text"
                    name="humidity"
                    value={formData.humidity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="61"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tlak (hPa) *
                  </label>
                  <input
                    type="text"
                    name="pressure"
                    value={formData.pressure}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1014"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vítr (m/s) *
                  </label>
                  <input
                    type="text"
                    name="windSpeed"
                    value={formData.windSpeed}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="< 1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Oblačnost *
                  </label>
                  <input
                    type="text"
                    name="cloudiness"
                    value={formData.cloudiness}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="oblačno"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Naměřené hodnoty */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
                Naměřené akustické hodnoty (dB)
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LAeq,T *
                  </label>
                  <input
                    type="text"
                    name="laeqT"
                    value={formData.laeqT}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="34,4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    L5 *
                  </label>
                  <input
                    type="text"
                    name="l5"
                    value={formData.l5}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="35,5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    L10 *
                  </label>
                  <input
                    type="text"
                    name="l10"
                    value={formData.l10}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="34,9"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    L90 *
                  </label>
                  <input
                    type="text"
                    name="l90"
                    value={formData.l90}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="33,5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    L95 *
                  </label>
                  <input
                    type="text"
                    name="l95"
                    value={formData.l95}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="33,2"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Výpočty a výsledky */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
                Výpočty a výsledky
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zbytkový hluk (dB) *
                  </label>
                  <input
                    type="text"
                    name="backgroundNoise"
                    value={formData.backgroundNoise}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="32,1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Korekce (dB) *
                  </label>
                  <input
                    type="text"
                    name="correction"
                    value={formData.correction}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0,3"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hygienický limit - den (dB) *
                  </label>
                  <input
                    type="text"
                    name="dayLimit"
                    value={formData.dayLimit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="50,0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hygienický limit - noc (dB) *
                  </label>
                  <input
                    type="text"
                    name="nightLimit"
                    value={formData.nightLimit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="40,0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Výsledná hodnota (dB) *
                  </label>
                  <input
                    type="text"
                    name="finalValue"
                    value={formData.finalValue}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-bold"
                    placeholder="32,4"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Závěr */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
                Závěr
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text závěru *
                </label>
                <textarea
                  name="conclusion"
                  value={formData.conclusion}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </section>

            {/* Tlačítko pro generování */}
            <div className="flex justify-center pt-6">
              <button
                type="button"
                onClick={handleGeneratePDF}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                📄 Vygenerovat PDF protokol
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
