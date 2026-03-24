import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  Users, 
  FileText, 
  Clock, 
  Hand,
  Handshake,
  CheckCircle, 
  TrendingUp, 
  AlertCircle, 
  BarChart3, 
  TrendingDown, 
  Wallet, 
  UserPlus, 
  Zap, 
  Settings,
  Timer, 
  Mail, 
  Phone, 
  ExternalLink, 
  Info, 
  ShieldCheck, 
  Youtube, 
  PlusCircle, 
  MinusCircle, 
  HelpCircle,
  ChevronDown
} from 'lucide-react';

import robotFavicon from '../Robot.png';

const App = () => {
  // Ustawienie tytułu dokumentu dla przeglądarki
  useEffect(() => {
    document.title = "Kalkulator rentowności wdrożenia flowMEE";

    // Dynamiczna zmiana favicon
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = robotFavicon;
  }, []);

  // --- Stan zarządzający podstronami ---
  const [activePage, setActivePage] = useState('kalkulator'); // 'kalkulator' | 'info'

    // --- Stan zarządzający listami rozwijanymi ---
  const [showAutoTasks, setShowAutoTasks] = useState(false);
  const [showManualTasks, setShowManualTasks] = useState(false);

  // --- Parametry wejściowe (Suwaki) ---
  const [numAccountants, setNumAccountants] = useState(3);
  const [avgSalaryBrutto, setAvgSalaryBrutto] = useState(9050);
  const [docVolume, setDocVolume] = useState(1000);
  const [manualTimePerDoc, setManualTimePerDoc] = useState(4); 

  // --- Stałe finansowe i Cennik flowMEE dla Firm ---
  const EMPLOYER_COST_FACTOR = 1.2048; // ZUS, FP, FGŚP
  const OVERAGE_PRICE = 0.79; // Za stronę powyżej pakietu ultraMEE

  // Dane kontaktowe
  const CONTACT_EMAIL = "wojciech.piorkowski@automee.pl";
  const CONTACT_PHONE = "+48 732 126 661";
  const PRICING_URL = "https://automee.pl/cennik-firmy/";

  // --- Logika obliczeniowa ---
  const results = useMemo(() => {
    // 1. Koszt aktualnego zespołu
    const employerCostPerEmployee = avgSalaryBrutto * EMPLOYER_COST_FACTOR;
    const actualTotalPayroll = numAccountants * employerCostPerEmployee;
    const hourlyRate = employerCostPerEmployee / 168;

    // 2. Koszt czasu pracy manualnej
    const totalHoursNeededManual = (docVolume * manualTimePerDoc) / 60;
    const marketLaborValue = totalHoursNeededManual * hourlyRate;

    // 3. Cennik flowMEE dla Firm (Pakiety) - Wybór najkorzystniejszego wariantu
    const OPTI_BASE = 2485;
    const OPTI_LIMIT = 1500;
    const OPTI_OVERAGE_PRICE = 0.99;

    const ULTRA_BASE = 4985;
    const ULTRA_LIMIT = 3000;
    const ULTRA_OVERAGE_PRICE = OVERAGE_PRICE; // 0.79

    // Obliczanie całkowitego kosztu dla pakietu optiMEE
    let costOpti = OPTI_BASE;
    if (docVolume > OPTI_LIMIT) {
      costOpti += (docVolume - OPTI_LIMIT) * OPTI_OVERAGE_PRICE;
    }

    // Obliczanie całkowitego kosztu dla pakietu ultraMEE
    let costUltra = ULTRA_BASE;
    if (docVolume > ULTRA_LIMIT) {
      costUltra += (docVolume - ULTRA_LIMIT) * ULTRA_OVERAGE_PRICE;
    }

    let monthlyFlowMeeSub = 0;
    let includedUsers = 0;
    let isIndividual = false;
    let planName = '';

    // Dynamiczny wybór tańszego rozwiązania
    if (costOpti <= costUltra) {
      monthlyFlowMeeSub = costOpti;
      planName = docVolume > OPTI_LIMIT ? 'optiMEE + nadwyżka stron' : 'optiMEE';
      includedUsers = 10;
    } else {
      monthlyFlowMeeSub = costUltra;
      planName = docVolume > ULTRA_LIMIT ? 'ultraMEE + nadwyżka stron' : 'ultraMEE';
      includedUsers = 20;
    }

    if (docVolume > 3000) {
      isIndividual = true;
    }

    // 4. Optymalizacja AI (85% czasu oszczędzone)
    const hoursSaved = totalHoursNeededManual * 0.85;
    const hoursNeededWithAI = totalHoursNeededManual * 0.15;
    const aiWorkLaborCost = hoursNeededWithAI * hourlyRate;
    
    // 5. Wyniki finansowe
    const netMonthlyBenefit = marketLaborValue - (monthlyFlowMeeSub + aiWorkLaborCost);
    const yearlySavings = netMonthlyBenefit * 12;
    
    const fteRequiredManual = totalHoursNeededManual / 168;
    const fteGap = fteRequiredManual - numAccountants;
    const manualShareInPayroll = ((marketLaborValue / actualTotalPayroll) * 100).toFixed(0);

    return {
      employerCostPerEmployee,
      actualTotalPayroll,
      marketLaborValue,
      monthlyFlowMeeSub,
      netMonthlyBenefit,
      yearlySavings,
      fteRequiredManual,
      fteGap,
      hoursSaved,
      isIndividual,
      planName,
      includedUsers,
      manualShareInPayroll
    };
  }, [numAccountants, avgSalaryBrutto, docVolume, manualTimePerDoc]);

  // --- Dynamiczny link Mailto z wynikami ---
  const emailSubject = encodeURIComponent("Prośba o konsultację wdrożenia flowMEE - wyniki analizy");
  const emailBody = encodeURIComponent(`Cześć Wojciech,

Proszę o kontakt w sprawie omówienia wyników mojego działu księgowości z kalkulatora flowMEE i możliwości wdrożenia systemu.

Oto parametry mojej firmy 🏢:
Liczba księgowych: ${numAccountants}
Średnie wynagrodzenie (brutto): ${avgSalaryBrutto.toLocaleString()} zł
Ilość faktur miesięcznie: ${docVolume.toLocaleString()}
Średni czas księgowania 1 faktury: ${manualTimePerDoc} min

Wyniki analizy rentowności flowMEE 📊:
Aktualny budżet płacowy: ${results.actualTotalPayroll.toLocaleString(undefined, {maximumFractionDigits: 0})} zł
Koszt manualnego księgowania: ${results.marketLaborValue.toLocaleString(undefined, {maximumFractionDigits: 0})} zł (${results.manualShareInPayroll}% budżetu)
Miesięczny koszt subskrypcji flowMEE (${results.planName}): ${results.monthlyFlowMeeSub.toLocaleString(undefined, {maximumFractionDigits: 0})} zł
Stopień automatyzacji procesu: 85%
Potencjalnie uwolnione godziny: ${results.hoursSaved.toFixed(0)} h / mies.
Zysk netto miesięcznie: +${results.netMonthlyBenefit.toLocaleString(undefined, {maximumFractionDigits: 0})} zł
Roczne zwiększenie rentowności: +${results.yearlySavings.toLocaleString(undefined, {maximumFractionDigits: 0})} zł

Proszę o informację o dostępnych terminach na krótką rozmowę.

Pozdrawiam,
`);

  const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-slate-900 selection:bg-blue-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActivePage('kalkulator')}>
            <img src="https://automee.pl/wp-content/uploads/2025/01/Logo.png" alt="Automee Logo" className="h-8" />
          </div>
          <div className="hidden md:flex items-center gap-4">
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-100 px-3 py-1 rounded-full">Kalkulator rentowności wdrożenia flowMEE</span>
          </div>
        </div>
      </nav>

      {/* WIDOK 1: GŁÓWNY KALKULATOR */}
      {activePage === 'kalkulator' && (
        <main className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
          {/* NAGŁÓWEK WYCENTROWANY */}
          <div className="mb-16 max-w-5xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] md:whitespace-nowrap">
              Ile Twoja firma zaoszczędzi dzięki <span className="text-blue-600">AI?</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
              Wprowadź dane swojego działu księgowości, aby zobaczyć realny wpływ automatyzacji flowMEE na wydajność zespołu.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* KONFIGURATOR */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                  <Calculator size={14} className="text-blue-600" /> Dane Twojej Firmy
                </h2>
                
                <div className="space-y-10">
                  <div className="group">
                    <div className="flex justify-between mb-4">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-tight">Liczba księgowych</label>
                      <span className="text-blue-600 font-black text-lg">{numAccountants}</span>
                    </div>
                    <input type="range" min="1" max="50" step="1" value={numAccountants} onChange={e => setNumAccountants(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>

                  <div className="group">
                    <div className="flex justify-between mb-4">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-tight">Średnie wynagrodzenie (Brutto)</label>
                      <span className="text-blue-600 font-black text-lg">{avgSalaryBrutto.toLocaleString()} zł</span>
                    </div>
                    <input type="range" min="4800" max="25000" step="100" value={avgSalaryBrutto} onChange={e => setAvgSalaryBrutto(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    <p className="text-[10px] text-slate-400 mt-3 font-medium italic">Koszt pracodawcy: {results.employerCostPerEmployee.toFixed(0)} zł (ZUS, FP, FGŚP)</p>
                  </div>

                  <div className="pt-6 border-t border-slate-50">
                    <div className="flex justify-between mb-4">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-tight">Ilość faktur / mies.</label>
                      <span className="text-blue-600 font-black text-lg">{docVolume.toLocaleString()}</span>
                    </div>
                    <input type="range" min="100" max="20000" step="10" value={docVolume} onChange={e => setDocVolume(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>

                  <div className="group">
                    <div className="flex justify-between mb-4">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-tight">Średni czas księgowania 1 faktury (min)</label>
                      <span className="text-blue-600 font-black text-lg">{manualTimePerDoc} min</span>
                    </div>
                    <input type="range" min="1" max="15" step="1" value={manualTimePerDoc} onChange={e => setManualTimePerDoc(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                </div>
              </div>

              {/* Sekcja informacyjna z pełnym cennikiem */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
                 <div className="flex items-center gap-2 mb-4">
                    <Zap size={16} className="text-amber-500" />
                    <p className="font-bold uppercase text-[10px] text-slate-500 tracking-wider m-0">Modele Cenowe (Wersja dla Firm)</p>
                 </div>
                 
                 <div className="space-y-3 mb-5">
                    {/* Pakiet optiMEE */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
                        <span className="font-black text-xs text-slate-800 uppercase tracking-tight">Pakiet optiMEE</span>
                        <span className="text-blue-600 font-black text-sm">2485 PLN <span className="text-[10px] text-slate-400 font-normal lowercase">netto / mies.</span></span>
                      </div>
                      <ul className="text-[11px] text-slate-500 space-y-1">
                        <li>• <strong className="text-slate-700">W pakiecie:</strong> 1500 stron, 10 użytkowników</li>
                        <li>• <strong className="text-slate-700">Nadwyżka stron:</strong> 0,99 PLN / stronę</li>
                      </ul>
                    </div>

                    {/* Pakiet ultraMEE */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
                        <span className="font-black text-xs text-slate-800 uppercase tracking-tight">Pakiet ultraMEE</span>
                        <span className="text-blue-600 font-black text-sm">4985 PLN <span className="text-[10px] text-slate-400 font-normal lowercase">netto / mies.</span></span>
                      </div>
                      <ul className="text-[11px] text-slate-500 space-y-1">
                        <li>• <strong className="text-slate-700">W pakiecie:</strong> 3000 stron, 20 użytkowników</li>
                        <li>• <strong className="text-slate-700">Nadwyżka stron:</strong> 0,79 PLN / stronę</li>
                        <li>• <strong className="text-slate-700">Głosowa windykacja AI:</strong> 0,50 PLN / min</li>
                        <li className="text-left">• <strong className="text-slate-700">Indywidualne (niestandardowe) funkcjonalności</strong></li>
                      </ul>
                    </div>
                 </div>

                 <p className="text-[11px] text-slate-600 pt-4 border-t border-slate-200/60">
                    Pełny cennik: <br />
                    <a href={PRICING_URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1 mt-1">
                      automee.pl/cennik-firmy <ExternalLink size={10} />
                    </a>
                 </p>
              </div>

               {/* SEKCJA TRANSPARENTNOŚCI (ZAŁOŻENIA) */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-5">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" /> Założenia Kalkulacji
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="text-[10px] font-bold text-slate-400 min-w-[20px]">01</div>
                    <p className="text-[11px] text-slate-600 leading-normal">
                      <strong>Koszt płacowy:</strong> Uwzględniono narzut pracodawcy <strong>20,48%</strong> (ZUS, FP, FGŚP) oraz 168h roboczych miesięcznie.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-[10px] font-bold text-slate-400 min-w-[20px]">02</div>
                    <p className="text-[11px] text-slate-600 leading-normal">
                      <strong>Efektywność:</strong> flowMEE automatyzuje <strong>85%</strong> czasu pracy manualnej. Pozostałe <strong>15%</strong> zarezerwowano na weryfikację i wyjątki.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-[10px] font-bold text-slate-400 min-w-[20px]">03</div>
                    <p className="text-[11px] text-slate-600 leading-normal">
                      <strong>Rentowność netto:</strong> Zysk to różnica między kosztem manualnym a sumą subskrypcji i kosztu 15% nadzoru ludzkiego.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ANALIZA WYNIKÓW */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 text-slate-500">
                    <Wallet size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Budżet płacowy</p>
                    <p className="text-xl font-black text-slate-900">{results.actualTotalPayroll.toLocaleString(undefined, {maximumFractionDigits: 0})} zł</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 text-blue-600">
                    <Timer size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Oszczędzony czas</p>
                    <p className="text-xl font-black text-blue-600">{results.hoursSaved.toFixed(0)} h <span className="text-xs font-normal text-slate-400">/ mies.</span></p>
                  </div>
                </div>
                <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-0.5">Zysk netto mies.</p>
                    <p className="text-xl font-black">+{results.netMonthlyBenefit.toLocaleString(undefined, {maximumFractionDigits: 0})} zł</p>
                  </div>
                </div>
              </div>

              {/* ANALIZA PORÓWNAWCZA */}
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold mb-10 flex items-center gap-3">
                  <BarChart3 className="text-blue-600" /> Analiza struktury kosztów
                </h3>

                <div className="space-y-12">
                  <div className="space-y-4">
                    <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-tight">
                      <span>Pełny budżet płacowy zespołu ({numAccountants} os.)</span>
                      <span>{results.actualTotalPayroll.toLocaleString(undefined, {maximumFractionDigits: 0})} zł</span>
                    </div>
                    <div className="w-full bg-slate-100 h-10 rounded-2xl overflow-hidden flex shadow-inner border border-slate-200">
                      <div className="bg-slate-800 h-full w-full"></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-[11px] font-black text-red-500 uppercase tracking-tight">
                      <span>Koszt manualnego księgowania</span>
                      <span>{results.marketLaborValue.toLocaleString(undefined, {maximumFractionDigits: 0})} zł</span>
                    </div>
                    <div className="w-full bg-slate-100 h-10 rounded-2xl overflow-hidden flex shadow-inner border border-slate-200">
                      <div 
                        className="bg-red-500 h-full transition-all duration-700" 
                        style={{ width: `${Math.min(100, (results.marketLaborValue / results.actualTotalPayroll) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Manualne księgowanie "pożera" <strong>{results.manualShareInPayroll}%</strong> całkowitego budżetu na wynagrodzenia Twojego działu.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-[11px] font-black text-blue-600 uppercase tracking-tight">
                      <span>System flowMEE (Pakiet: {results.planName})</span>
                      <span>{results.monthlyFlowMeeSub.toLocaleString(undefined, {maximumFractionDigits: 0})} zł</span>
                    </div>
                    <div className="w-full bg-slate-100 h-10 rounded-2xl overflow-hidden flex shadow-inner border border-slate-200">
                      <div 
                        className="bg-blue-600 h-full transition-all duration-1000" 
                        style={{ width: `${(results.monthlyFlowMeeSub / results.actualTotalPayroll) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Sekcja Oszczędności Rocznej */}
                <div className="mt-16 bg-blue-50 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between border border-blue-100 gap-8 text-center md:text-left">
                  <div>
                    <p className="text-xs font-black text-blue-800 uppercase tracking-widest mb-2">Roczne zwiększenie rentowności</p>
                    <p className="text-5xl font-black text-blue-600 tracking-tighter">{results.yearlySavings.toLocaleString(undefined, {maximumFractionDigits: 0})} zł</p>
                  </div>
                  <div className="md:border-l border-blue-200 md:pl-10">
                    <p className="text-xs font-black text-blue-800 uppercase tracking-widest mb-2">Uwolnione godziny</p>
                    <p className="text-5xl font-black text-slate-900">{results.hoursSaved.toFixed(0)} h <span className="text-sm font-normal opacity-200">/ mies.</span></p>
                  </div>
                </div>
              </div>

              {/* Status Capacity */}
              <div className={`p-8 rounded-[2rem] flex items-start gap-6 border ${results.fteGap > 0 ? 'bg-amber-50 border-amber-200 shadow-sm' : 'bg-green-50 border-green-200'}`}>
                {results.fteGap > 0 ? (
                  <>
                    <UserPlus className="text-amber-600 shrink-0" size={32} />
                    <div>
                      <h4 className="font-black text-amber-900 uppercase text-xs tracking-widest mb-2">Przeciążenie zespołu</h4>
                      <p className="text-sm text-amber-800 leading-relaxed font-medium">
                        Obecny wolumen wymaga pracy <strong>{results.fteRequiredManual.toFixed(1)} etatów</strong>. Przy {numAccountants} księgowych generujesz wąskie gardło. flowMEE pozwoli Ci obsłużyć ten ruch bez nowych rekrutacji.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle className="text-green-600 shrink-0" size={32} />
                    <div>
                      <h4 className="font-black text-green-900 uppercase text-xs tracking-widest mb-2">Potencjał operacyjny</h4>
                      <p className="text-sm text-green-800 leading-relaxed font-medium">
                        Automatyzacja uwolni <strong>{results.hoursSaved.toFixed(0)} godzin</strong> miesięcznie, co pozwala na ewolucję działu księgowości: od żmudnego procesowania dokumentów po rolę centrum kompetencji analitycznych.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Sekcja Kontaktowa */}
              <div className="bg-white rounded-[2rem] px-8 py-[1.8rem] border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Zapytaj o wdrożenie</h4>
                    <p className="text-sm text-slate-500 font-medium tracking-tight">Masz pytania do analizy? Porozmawiajmy o tym, jak zoptymalizować księgowość w Twojej firmie.</p>
                  </div>
                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    <a 
                      href={mailtoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap"
                    >
                      <Mail size={18} /> Eksportuj wyniki analizy
                    </a>
                    <a 
                      href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-100 whitespace-nowrap"
                    >
                      <Phone size={18} /> {CONTACT_PHONE}
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* POLECANE MATERIAŁY WIDEO */}
          <div className="mt-10">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-10 tracking-tight flex items-center gap-3 text-left">
              <Youtube className="text-red-600" size={32} />
              Polecane materiały wideo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                "https://www.youtube.com/embed/wx2-qQUBX6o",
                "https://www.youtube.com/embed/-NoZBitsZVw",
                "https://www.youtube.com/embed/52E53QpSXYw"
              ].map((url, index) => (
                <div key={index} className="bg-white rounded-[2rem] p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100">
                    <iframe 
                      className="w-full h-full border-0"
                      src={url}
                      title={`Polecane wideo ${index + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* WIDOK 2: PODSTRONA INFORMACYJNA */}
      {activePage === 'info' && (
        <main className="max-w-7xl mx-auto px-6 py-10 lg:py-16 min-h-[60vh]">
          <button 
            onClick={() => setActivePage('kalkulator')} 
            className="mb-8 text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center gap-2 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Wróć do kalkulatora
          </button>
          
          {/* NAGŁÓWEK WYŚRODKOWANY - ZMIENIONY KOLOR flowMEE */}
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 tracking-tight text-center">Co jeszcze wpływa na rentowność <span className="text-blue-600">flowMEE</span>?</h1>
          
          {/* JEDEN MODUŁ POZYTYWNYCH CZYNNIKÓW - ZAJMUJE PEŁNĄ SZEROKOŚĆ (MAX-W-4XL) */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-[2.5rem] py-8 px-10 space-y-4 shadow-sm">
              <h4 className="font-black text-green-900 uppercase text-sm tracking-widest flex items-center gap-2 mb-4">
                <PlusCircle size={20} className="text-green-600" /> Dodatkowe korzyści
              </h4>
              <ul className="flex flex-col gap-y-4">
                {[
                  "Praca 24/7/365 – brak przerw nocnych, weekendowych, świątecznych i chorobowych.",
                  "Brak rotacji wiedzy – procesy zostają w systemie, nawet gdy odchodzi pracownik.",
                  "Skalowalność natychmiastowa – obsługa spiętrzeń (sezon PIT/CIT) bez nadgodzin.",
                  "Automatyzacja detekcji duplikatów – eliminacja błędów przed księgowaniem.",
                  "Brak ukrytych kosztów - bezpłatne pobieranie dokumentów z KSeF.",
                  "Technologia Vision AI - obsługa faktur w dowolnym języku, w tym słabej jakości skanów i pisma odręcznego.",
                  "Bezpieczeństwo Zero Data Retention – dokumenty są kasowane natychmiast po obróbce i nie trenują zewnętrznych modeli AI.",
                  "Odporność na rutynę – AI przejmuje żmudną pracą odtwórczą bez ryzyka wypalenia, uwalniając czas zespołu na wysokopłatne doradztwo i budowanie relacji z klientem.",
                  "Pomoc ekspertów – techniczne i księgowe wsparcie podczas korzystania z systemu."
                ].map((text, idx) => {
                  const separator = text.includes(" – ") ? " – " : text.includes(" - ") ? " - " : null;
                  if (separator) {
                    const [label, ...rest] = text.split(separator);
                    return (
                      <li key={idx} className="flex gap-3 items-start text-sm text-green-800 font-medium">
                        <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-green-600"></div>
                        <span className="leading-tight text-green-700">
                          <strong className="font-bold text-green-900">{label}</strong>{separator}{rest.join(separator)}
                        </span>
                      </li>
                    );
                  }
                  return (
                    <li key={idx} className="flex gap-3 items-start text-sm text-green-800 font-medium">
                      <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-green-600"></div>
                      <span className="leading-tight text-green-700">{text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="mt-10 max-w-5xl mx-auto space-y-4">
            {/* MODUŁ: CZYNNOŚCI AUTOMATYCZNE */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <button 
                onClick={() => setShowAutoTasks(!showAutoTasks)}
                className="w-full p-7 flex items-center justify-between hover:bg-slate-50 transition-colors group"
              >
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 text-left">
                  <Settings size={18} className="text-blue-500" /> Czynności które wykonują się automatycznie z flowMEE
                </h3>
                <ChevronDown 
                  size={20} 
                  className={`text-slate-400 transition-transform duration-300 ${showAutoTasks ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${showAutoTasks ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-7 pb-10 border-t border-slate-50 pt-8">
                  <ul className="space-y-4">
                    <li className="flex gap-4 items-start">
                      <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">Pobieranie dokumentów:</strong> flowMEE samodzielnie i na bieżąco gromadzi faktury prosto z platformy KSeF, dedykowanych skrzynek e-mail, folderów oraz ręcznie wgranych plików.
                      </p>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">Odczyt danych z faktur:</strong> Technologia Vision AI „czyta” dane ze zdjęć, skanów, PDF-ów oraz KSeF, radząc sobie ze zmianami układu dokumentu bez wymogu tworzenia sztywnych szablonów.
                      </p>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">Weryfikacja poprawności i audyt:</strong> Wbudowany e-Audytor automatycznie wyłapuje duplikaty, sprawdza poprawność NIP-ów, chroni przed oszustwami i weryfikuje kontrahentów m.in. na Białej Liście.
                      </p>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">Kierowanie dokumentów do odpowiednich osób:</strong> Faktury na podstawie swojej treści (np. za paliwo lub sprzęt) są kierowane do odpowiednich osób w firmie, wymuszając na nich merytoryczną akceptację.
                      </p>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">Kategoryzacja kosztów i dekretacja:</strong> System na podstawie zasad polityki rachunkowości firmy samodzielnie rozpisuje dokumenty na odpowiednie konta syntetyczne i analityczne (zapisy Wn/Ma).
                      </p>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">Rozbicie i przypisanie stawek VAT:</strong> flowMEE precyzyjnie dzieli kwoty, klasyfikuje wydatki jako KUP/NKUP i dopasowuje stawki, przygotowując dane pod deklaracje JPK.
                      </p>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">Alokacja MPK:</strong> Na podstawie opisów na fakturze system automatycznie przypisuje koszty do właściwych działów, osób lub projektów (np. usługa serwerowa trafia na dział IT).
                      </p>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">Eksport do ERP:</strong> Gotowe, w 100% zadekretowane i sprawdzone dokumenty are przesyłane (przez API) bezpośrednio do systemu ERP.
                      </p>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">Rozliczanie wyciągów bankowych:</strong> System wczytuje historie operacji bankowych i automatycznie znajduje powiązania z fakturami.
                      </p>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">Obsługa przelewów:</strong> Korzystając z repozytorium można zweryfikować status płatności faktur oraz wygenerować paczkę przelewów (Multicash), która po zaimportowaniu do banku skraca czas obsługi płatności.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* MODUŁ: CZYNNOŚCI MANUALNE */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <button 
                onClick={() => setShowManualTasks(!showManualTasks)}
                className="w-full p-7 flex items-center justify-between hover:bg-slate-50 transition-colors group"
              >
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 text-left">
                  <Hand size={18} className="text-amber-500" /> Czynności, które nadal wykonywać należy manualnie
                </h3>
                <ChevronDown 
                  size={20} 
                  className={`text-slate-400 transition-transform duration-300 ${showManualTasks ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${showManualTasks ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-7 pb-10 border-t border-slate-50 pt-8">
                  <ul className="space-y-4">
                    <li className="flex gap-4 items-start">
                      <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">Obsługa wyjątków i błędów:</strong> ręczna weryfikacja dokumentów oflagowanych ostrzeżeniami (np. brak kontrahenta w bazie) oraz odrzucanie fałszywych faktur "scamów" z KSeF.
                      </p>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">Uczenie sztucznej inteligencji:</strong> wprowadzanie jednorazowych korekt i poleceń w języku naturalnym do polityki rachunkowości firmy, gdy system nie rozpozna nowego zdarzenia.
                      </p>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">Akceptacja w systemie ERP:</strong> ostateczne zatwierdzanie i przenoszenie zadekretowanych dokumentów do pełnych ksiąg w ERP.
                      </p>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">Sprawozdawczość i zamknięcia:</strong> generowanie i wysyłka deklaracji (m.in. JPK, VAT, CIT), sprawozdań finansowych oraz zamykanie/otwieranie okresów księgowych.
                      </p>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">Specyficzne procesy księgowe:</strong> ewidencja i amortyzacja środków trwałych, księgowanie kadr i płac oraz Rozliczenia Międzyokresowe Kosztów (RMK).
                      </p>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">Gospodarka magazynowa:</strong> obsługa obrotu towarami, dokumentująca przychody, rozchody i przesunięcia w magazynie: PZ (przyjęcie z zewnątrz), WZ (wydanie na zewnątrz), RW (rozchód wewnętrzny), PW (przyjęcie wewnętrzne), a MM (przesunięcie międzymagazynowe).
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* WIDOK 3: PODSTRONA MODEL WSPÓŁPRACY */}
      {activePage === 'model' && (
        <main className="max-w-7xl mx-auto px-6 py-10 lg:py-16 min-h-[60vh]">
          <button 
            onClick={() => setActivePage('kalkulator')} 
            className="mb-8 text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center gap-2 transition-colors group no-print"
          >
            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Wróć do kalkulatora
          </button>
          
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-12 tracking-tight text-center">Model <span className="text-blue-600">współpracy</span></h1>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* 1. START */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">1</div>
                  START (Onboarding)
                </h3>
                <div className="text-sm text-slate-600 space-y-4 flex-1">
                  <p>Współpraca rozpoczyna się od onboardingu i konfiguracji platformy flowMEE. Na tym etapie:</p>
                  <ul className="space-y-2">
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div><span>nasi eksperci z obszaru księgowość konfigurują platformę oraz modele AI w odniesieniu do potrzeb i zasad obowiązujących u klienta,</span></li>
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div><span>realizujemy integrację flowMEE z systemem ERP klienta (po stronie autoMEE, bez zaangażowania zespołu klienta),</span></li>
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div><span>przygotowujemy platformę do pracy na danych operacyjnych.</span></li>
                  </ul>
                </div>
                <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-[11px] font-bold text-slate-700 leading-relaxed">
                  Zakończenie tego etapu oznacza pełną gotowość produkcyjną systemu.
                </div>
              </div>

              {/* 2. OPERATE */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">2</div>
                  OPERATE (Produkcja)
                </h3>
                <div className="text-sm text-slate-600 space-y-4 flex-1">
                  <p>Po uruchomieniu produkcyjnym:</p>
                  <ul className="space-y-2">
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500"></div><span>flowMEE automatyzuje bieżące procesy księgowe,</span></li>
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500"></div><span>obsługuje standardowe przypadki oraz identyfikuje wyjątki,</span></li>
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500"></div><span>użytkownicy zachowują pełną kontrolę i możliwość weryfikacji decyzji systemu.</span></li>
                  </ul>
                  <p className="font-bold text-slate-800 pt-2">autoMEE zapewnia:</p>
                  <ul className="space-y-2">
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400"></div><span>wsparcie techniczne i produktowe,</span></li>
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400"></div><span>monitoring jakości działania platformy,</span></li>
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400"></div><span>stabilne i nieprzerwane działanie usługi.</span></li>
                  </ul>
                </div>
              </div>

              {/* 3. OPTIMIZE */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">3</div>
                  OPTIMIZE (Doskonalenie)
                </h3>
                <div className="text-sm text-slate-600 space-y-4 flex-1">
                  <p>W trakcie korzystania z flowMEE:</p>
                  <ul className="space-y-2">
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500"></div><span>system jest dalej dostrajany na podstawie rzeczywistych danych operacyjnych za pomocą języka naturalnego,</span></li>
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500"></div><span>optymalizowane są reguły i obsługa wyjątków,</span></li>
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500"></div><span>poprawiana jest skuteczność i jakość automatyzacji w ramach istniejących procesów.</span></li>
                  </ul>
                </div>
                <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 italic text-[11px] font-bold text-emerald-800 leading-relaxed">
                  Celem tego etapu jest zwiększanie efektywności pracy zespołu finansowego bez zmiany zakresu procesowego.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* 4. Rozwój platformy */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 mb-6">
                  <Zap className="text-amber-500" size={20} /> 4. Rozwój platformy
                </h3>
                <div className="text-sm text-slate-600 space-y-4">
                  <p>Rozwój flowMEE oznacza:</p>
                  <ul className="space-y-2">
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500"></div><span>ciągłość świadczenia usługi,</span></li>
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500"></div><span>dostosowanie platformy do zmian legislacyjnych i regulacyjnych,</span></li>
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500"></div><span>regularne aktualizacje funkcjonalne w ramach standardowego produktu.</span></li>
                  </ul>
                  <p className="font-bold text-slate-800 pt-2">
                    Aktualizacje platformy są realizowane automatycznie i nie wymagają dodatkowych działań po stronie klienta.
                  </p>
                </div>
              </div>

              {/* 5. Role i odpowiedzialności */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 mb-6">
                  <Users className="text-blue-500" size={20} /> 5. Role i odpowiedzialności
                </h3>
                <div className="text-sm text-slate-600 space-y-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="font-bold text-slate-800 mb-2">autoMEE odpowiada za:</p>
                      <ul className="space-y-2">
                        <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div><span>dostarczenie, utrzymanie i rozwój platformy flowMEE,</span></li>
                        <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div><span>konfigurację systemu i integrację z ERP,</span></li>
                        <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div><span>wsparcie techniczne i produktowe.</span></li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 mb-2">Klient odpowiada za:</p>
                      <ul className="space-y-2">
                        <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400"></div><span>określenie zasad księgowych i procesowych,</span></li>
                        <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400"></div><span>weryfikację wyjątków i decyzji wymagających osądu biznesowego,</span></li>
                        <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400"></div><span>bieżące korzystanie z platformy.</span></li>
                      </ul>
                    </div>
                  </div>
                  <p className="font-bold text-slate-800 pt-2 text-[13px] border-t border-slate-100 mt-2 pb-2">
                    Odpowiedzialność biznesowa pozostaje po stronie klienta. flowMEE pełni rolę narzędzia wspierającego pracę zespołu finansowego.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 6. Model rozliczenia */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 mb-6">
                  <Wallet className="text-green-500" size={20} /> 6. Model rozliczenia
                </h3>
                <div className="text-sm text-slate-600 space-y-4">
                  <p>Współpraca obejmuje:</p>
                  <ul className="space-y-3">
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-green-500"></div><span><strong className="text-slate-900">jednorazową opłatę startową</strong> (startup fee) - onboarding, konfiguracja i integracja,</span></li>
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-green-500"></div><span><strong className="text-slate-900">miesięczny abonament</strong> za korzystanie z platformy,</span></li>
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-green-500"></div><span><strong className="text-slate-900">dodatkowe opłaty</strong> za usługi dodatkowe (np. niestandardowe prace lub rozszerzony support).</span></li>
                  </ul>
                  <p className="font-bold text-slate-800 pt-2 mt-4 border-t border-slate-100 pb-1">
                    Aktualizacje platformy i dostosowania legislacyjne są zawarte w abonamencie.
                  </p>
                </div>
              </div>

              {/* Zakres poza współpracą */}
              <div className="bg-red-50 rounded-3xl border border-red-100 shadow-sm p-8">
                <h3 className="text-sm font-black text-red-900 uppercase tracking-widest flex items-center gap-3 mb-6">
                  <MinusCircle className="text-red-500" size={20} /> Zakres poza współpracą
                </h3>
                <div className="text-sm text-red-800 space-y-4">
                  <p className="font-medium">Model współpracy nie obejmuje:</p>
                  <ul className="space-y-2 font-medium">
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-red-400"></div><span>zmiany lub zastępowania systemów ERP klienta,</span></li>
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-red-400"></div><span>migracji historycznych danych,</span></li>
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-red-400"></div><span>redefinicji polityki rachunkowości,</span></li>
                    <li className="flex gap-3"><div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-red-400"></div><span>doradztwa podatkowego lub księgowego.</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

       {/* FOOTER WSPÓLNY DLA OBU WIDOKÓW */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center grayscale opacity-40">
            <img src="https://automee.pl/wp-content/uploads/2025/01/Logo.png" alt="Automee Logo" className="h-6" />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* PRZENIESIONY MODUŁ INFORMACYJNY W FORMIE LINKU ORAZ MODEL WSPÓŁPRACY */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setActivePage('info')}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors normal-case tracking-normal font-bold"
              >
                <Info size={14} /> Co jeszcze wpływa na rentowność?
              </button>
              <button 
                onClick={() => setActivePage('model')}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors normal-case tracking-normal font-bold"
              >
                <Handshake size={14} /> Model współpracy
              </button>
            </div>

            <a 
              href={`mailto:${CONTACT_EMAIL}`} 
              className="hover:text-blue-600 transition-colors flex items-center gap-2 normal-case tracking-normal"
            >
              <Mail size={14} /> {CONTACT_EMAIL}
            </a>
            <a 
              href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} 
              className="hover:text-blue-600 transition-colors flex items-center gap-2 normal-case tracking-normal"
            >
              <Phone size={14} /> {CONTACT_PHONE}
            </a>
            <a 
              href="https://www.automee.pl" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-600 transition-colors flex items-center gap-2 normal-case tracking-normal"
            >
              <ExternalLink size={14} /> www.automee.pl
            </a>
            <a 
              href="https://www.youtube.com/@domi_from_automee" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-red-600 transition-colors flex items-center gap-2 normal-case tracking-normal"
            >
              <Youtube size={14} /> YouTube
            </a>
          </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 24px; height: 24px;
          background: #2563eb; cursor: pointer;
          border-radius: 50%; border: 4px solid white;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px; height: 24px;
          background: #2563eb; cursor: pointer;
          border-radius: 50%; border: 4px solid white;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
        }
      `}} />
    </div>
  );
};

export default App;

import ReactDOM from 'react-dom/client'

// Renderowanie aplikacji do elementu o id "root" z pliku index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
