import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Clock3, MapPin, Search, Users, ChevronRight, Download, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const STORAGE_KEY = 'matrix-seminar-registrations';
const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxxyIloMkJ78mkr3j9jA8qi2JIo6wep9Exs0Br_7jM0HXo6tUJEB5BUDYJlhM8OU6jO/exec';

type Speaker = {
  name: string;
  role?: string;
  image?: string;
  bio?: string;
};

type Seminar = {
  id: number;
  title: string;
  subtitle?: string;
  date: string;
  time: string;
  area: string;
  category: string;
  speakers: Speaker[];
  abstract: string;
};

type RegistrationRow = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  userCategory: string;
  seminarId: string;
  seminarTitle: string;
  seminarDate: string;
  seminarTime: string;
  createdAt: string;
};

const carmineBio = 'Marketing strategist, consulente e formatore, laureato in Economia e Commercio con Master in Social Media Marketing. Da oltre vent’anni supporta aziende e professionisti nello sviluppo di strategie marketing e commerciali, in particolare nei settori fitness, wellness e medicale. È autore di manuali di marketing, docente e relatore in eventi nazionali e internazionali di settore.';

const seminars: Seminar[] = [
  {
    id: 1,
    title: 'Pagamenti invisibili, impatti concreti: la rivoluzione che il fitness non può ignorare',
    date: '28 maggio 2026',
    time: '10:30 – 11:15',
    area: 'Stand Matrix - Educational Lounge - Pad. B1',
    category: 'Business',
    speakers: [{ name: 'Guzzetti', role: 'Socio fondatore, UP Soluzioni', image: '/GUIZZETTI.jpg' }],
    abstract: 'Dimenticate i contanti: siamo nell’era della rivoluzione cashless, dove lo smartphone è il nuovo portafoglio e la Generazione Z detta le regole del gioco. Il fitness deve evolversi ora, trasformando i pagamenti digitali e ricorrenti in potenti strumenti di fidelizzazione per intercettare i nuovi desideri dei clienti. Non è solo tecnologia, è un cambio di mentalità totale: chi non adegua script di vendita e strategie commerciali a questa velocità rischia di restare invisibile.',
  },
  {
    id: 2,
    title: 'I numeri che contano',
    date: '28 maggio 2026',
    time: '11:30 – 12:15',
    area: 'Stand Matrix - Educational Lounge - Pad. B1',
    category: 'Palestre di Successo',
    speakers: [{ name: 'Claudio De Padua', role: 'Consulente Master, Palestre di Successo' }],
    abstract: 'I parametri fondamentali del controllo di gestione per avere le redini della propria palestra e ottenere, in modo semplice e preciso, la fotografia del club. Un approccio pragmatico per misurare, analizzare e correggere l’andamento della struttura, trasformando i dati in decisioni operative.',
  },
  {
    id: 3,
    title: "Il metodo corretto per implementare l'IA nella gestione del Fitness Club",
    date: '28 maggio 2026',
    time: '12:30 – 14:00',
    area: 'Stand Matrix - Educational Lounge - Pad. B1',
    category: 'AI & Marketing',
    speakers: [
      { name: 'Luca Ercolani' },
      { name: 'Carmine Preziosi', role: 'Marketing Strategist', bio: carmineBio },
      { name: 'Maurizio Taruggi' },
    ],
    abstract: 'Il seminario sarà suddiviso in tre tappe sequenziali per guidare titolari e manager nell’integrazione dell’IA. Tre moduli propedeutici per trasformare l’innovazione tecnologica dell’Intelligenza Artificiale in una concreta leva strategica di profitto e operatività.\n\n1. Il Nuovo Mindset AI (Luca Ercolani) — L’IA non è un semplice software ma un cambio di paradigma culturale.\n\n2. Marketing Strategico e Acquisizione (Carmine Preziosi) — L’IA può potenziare il marketing del club e rendere la lead generation più scalabile e profittevole.\n\n3. Conversione e Vendita Automatizzata (Maurizio Taruggi) — CRM, WhatsApp e automazioni possono essere integrati per gestire volumi elevati di contatti e aumentare le conversioni.',
  },
  {
    id: 4,
    title: 'Il fitness non basta più: entra nell’era della longevità',
    date: '28 maggio 2026',
    time: '14:30 – 15:15',
    area: 'Stand Matrix - Educational Lounge - Pad. B1',
    category: 'Longevity',
    speakers: [
      { name: 'Gianluca Scazzosi' },
      { name: 'Carmine Preziosi', role: 'Marketing Strategist', bio: carmineBio },
    ],
    abstract: 'Il modello tradizionale del fitness mostra oggi limiti evidenti, mentre cresce la domanda di salute attiva e longevità. In questo seminario viene presentato un cambio di paradigma: trasformare la palestra in un centro di longevità, capace di attrarre il target over 50 e generare maggiore valore.\n\nGianluca Scazzosi e Carmine Preziosi illustreranno le leve strategiche per acquisire nuovi clienti, aumentare la retention e creare sostenibilità del business nel nuovo scenario del fitness.',
  },
  {
    id: 5,
    title: 'Dal CRM all’iscrizione: come un agente AI gestisce i contatti al posto tuo',
    date: '28 maggio 2026',
    time: '15:30 – 16:15',
    area: 'Stand Matrix - Educational Lounge - Pad. B1',
    category: 'AI & Sales',
    speakers: [{ name: 'Maurizio Taruggi' }],
    abstract: 'Da titolare di un fitness center e fondatore di una società di consulenza digitale, Maurizio Taruggi racconta il problema reale che lo ha spinto a creare SuperAgent.fit: troppi lead, troppo poco tempo, troppe opportunità perse.\n\nIn questo intervento mostrerà come un agente AI verticale per il fitness possa gestire simultaneamente comunicazioni in entrata e in uscita, inviare messaggi massivi su WhatsApp, qualificare i contatti e alimentare un CRM, il tutto senza aumentare i costi del personale.\n\nNon teoria: dati, flussi e demo dal vivo.',
  },
  {
    id: 6,
    title: 'Dalla prima iscrizione all’allenamento: come creare un’esperienza fluida e memorabile per l’utente del fitness',
    date: '28 maggio 2026',
    time: '16:30 – 17:15',
    area: 'Stand Matrix - Educational Lounge - Pad. B1',
    category: 'Team System',
    speakers: [{ name: 'Roberto Di Giacomo', role: 'Business Developer TeamSystem' }],
    abstract: 'Quando allenarsi è semplice, l’esperienza cresce e il business segue.\n\nOggi l’esperienza dell’utente in un centro fitness non si gioca solo sulla qualità delle attrezzature o dei trainer, ma sulla semplicità e continuità del percorso che vive, dal primo contatto fino all’allenamento in sala.\n\nIl digitale, se incontra processi ben progettati e persone preparate, può trasformare l’esperienza del cliente e diventare una leva concreta di crescita sostenibile per il business del fitness.',
  },
  {
    id: 7,
    title: 'Lavoro di produzione: la differenza tra segreteria e consulenza',
    date: '29 maggio 2026',
    time: '10:30 – 11:15',
    area: 'Stand Matrix - Educational Lounge - Pad. B1',
    category: 'Palestre di Successo',
    speakers: [{ name: 'Gianna Di Pietro', role: 'Consulente Master, Palestre di Successo', bio: 'Gianna Di Pietro lavora da 15 anni nel settore fitness. Per dieci anni è stata consulente fitness in diverse catene sul territorio napoletano. Ha lavorato per oltre 6 anni con il metodo Palestre di Successo, riscontrando nella pratica benefici concreti.\n\nNel 2020 entra in Palestre di Successo come prima dipendente; due mesi dopo scoppia il Covid. Insieme al team decide di supportare attivamente i club, aiutandoli a superare la fase critica.\n\nOggi è consulente master per oltre 100 club in tutta Italia, coordina i consulenti PDS e segue direttamente i centri nell’implementazione del metodo.' }],
    abstract: 'L’intervento ha come obiettivo comprendere la differenza tra la classica segreteria in palestra e la figura del consulente fitness in un centro fitness nel 2026.\n\nQuali sono i benefici per un titolare che inserisce un consulente e come, attraverso il lavoro di produzione illustrato nel dettaglio, è possibile trasformare fino all’80% degli appuntamenti in fatturato aziendale, lasciando solo al 10% la casualità dei tour spontanei.',
  },
  {
    id: 8,
    title: 'Power Penia e Longevity: il ruolo della forza muscolare nei modelli di prevenzione e nelle palestre della salute',
    date: '29 maggio 2026',
    time: '14:30 – 15:15',
    area: 'Stand Matrix - Educational Lounge - Pad. B1',
    category: 'Longevity & Medical Fitness',
    speakers: [
      { name: 'Luca Marin, Ft, PhD', role: 'Università di Pavia', bio: 'Responsabile scientifico del Laboratorio per la Riabilitazione e la Chirurgia Ortopedica (LAROS) e membro del Laboratorio di Attività Motoria Adattata (LAMA), Università di Pavia. Professore a contratto presso i Corsi di Laurea di Scienze Motorie e docente del Master EAP. Autore ed editor di 6 libri sul fitness e sull’attività motoria adattata.' },
      { name: 'Dott. Michele Felisatti, MSc, PhD', role: 'Esercizio Vita Medical Fitness', bio: 'CEO e Co-Founder di Esercizio Vita Medical Fitness. Professore nei corsi di Laurea in Medicina e Chirurgia e Scienze Motorie dell’Università di Ferrara e docente Master EAP Università di Pavia. Vicepresidente A.I.S.E. e membro S.I.S.M.E.S. Autore ed editor di 3 libri e oltre 20 articoli scientifici sull’attività motoria adattata.' },
    ],
    abstract: 'La fisiologica perdita di potenza muscolare correlata all’avanzare degli anni rappresenta un biomarcatore critico della longevità. Questo declino, più rapido e precoce rispetto alla perdita di massa muscolare, costituisce un importante predittore di cadute, disabilità e mortalità prematura.\n\nLe evidenze scientifiche e le linee guida internazionali riconoscono l’esercizio fisico, e in particolare l’allenamento della forza, come intervento efficace nella prevenzione primaria e secondaria delle malattie croniche, oltre che nel mantenimento della capacità funzionale lungo tutto l’arco della vita.\n\nIl workshop fornirà strumenti operativi e una dimostrazione pratica di protocolli ed esercizi specifici per il potenziamento funzionale della persona anziana.',
  },
  {
    id: 9,
    title: 'Personalizzazione dell’allenamento e Longevity Economy: progettare centri fitness più profittevoli nell’era dei dati',
    date: '29 maggio 2026',
    time: '15:30 – 16:15',
    area: 'Stand Matrix - Educational Lounge - Pad. B1',
    category: 'Longevity & Business',
    speakers: [{ name: 'Salvatore Picucci', role: 'Founder WTM – Wellness Management', bio: 'Salvatore Picucci è fondatore del metodo WTM – Ingegneria Strategica del Wellness Management. Da oltre 30 anni progetta strategie di sviluppo e modelli di business per centri fitness, wellness, longevity, beauty e hotel spa, supportando imprenditori e investitori nella creazione di sistemi profittevoli e scalabili.' }],
    abstract: 'Il settore fitness e wellness sta entrando in una nuova fase evolutiva: la personalizzazione basata sui dati, l’integrazione tra fitness, salute e longevità e l’utilizzo di tecnologie intelligenti stanno trasformando profondamente il modello di business dei club.\n\nDurante l’intervento verrà analizzato come i sistemi di allenamento personalizzato e automatizzato possano migliorare retention, valore del cliente e redditività dei centri fitness.\n\nVerranno presentati nuovi modelli di sviluppo per fitness club, spa e wellness destination orientati alla longevity economy.',
  },
  {
    id: 10,
    title: 'Dai clienti agli MVP: come progettare crescita, retention e scalabilità nel fitness 2026',
    date: '29 maggio 2026',
    time: '16:30 – 17:15',
    area: 'Stand Matrix - Educational Lounge - Pad. B1',
    category: 'Les Mills',
    speakers: [{ name: 'Marco Meli', role: 'National Business Development Manager, Les Mills Italia', bio: 'National Business Development Manager per Les Mills Italia, collabora con i club italiani per ottimizzare le operazioni, esplorare nuove opportunità e rimanere all’avanguardia del mercato.' }],
    abstract: `Il fitness cresce, ma i margini no. Perché?

Oggi il vero problema non è portare più clienti, ma creare quelli giusti: gli MVP (Most Valuable Participants), i membri che frequentano di più, restano più a lungo e fanno crescere davvero il business.

Partendo dalle ricerche Les Mills su milioni di percorsi reali, vedremo cosa funziona oggi nei club e perché molti modelli non reggono più. Dalle mode alla costruzione di abitudini, fino a come rendere tutto replicabile e controllabile: dalla sala corsi alla sala pesi, dai sistemi come EGYM al pilotaggio manageriale con Heitz.

Perché oggi non vince chi aggiunge servizi.
Vince chi costruisce un sistema che funziona davvero.`,
  },
  {
    id: 11,
    title: 'Cross Cardio Experience',
    subtitle: 'Il metodo che rivoluziona l’allenamento in sala fitness',
    date: '30 maggio 2026',
    time: '15:30 – 16:15',
    area: 'Stand Matrix - Educational Lounge - Pad. B1',
    category: 'Training & Performance',
    speakers: [
      { name: 'Jairo Junior', role: 'Founder Cross Cardio' },
      { name: 'Daniele Magliola', role: 'Master Trainer' },
      { name: 'Simone Magliola', role: 'Presenter & Trainer' },
      { name: 'Enzo Ferrari', role: 'Maestro di Cultura Fisica' },
    ],
    abstract: 'Un’esperienza formativa e pratica che porta sul palco il metodo Cross Cardio: un approccio rivoluzionario all’allenamento che integra mobilità, intensità e funzionalità per risultati concreti. (Titolo e contenuti in aggiornamento)',
  },
  {
    id: 12,
    title: 'FunXtional Body Building: trasforma la tua sala pesi in un sistema che produce risultati e valore',
    date: '31 maggio 2026',
    time: '11:30 – 12:15',
    area: 'Stand Matrix - Educational Lounge - Pad. B1',
    category: 'Training & Performance',
    speakers: [
      { name: 'Jairo Junior', role: 'Founder Cross Cardio', bio: 'Fitness Legend e laureato in Fisioterapia, è un’icona internazionale del fitness e presenter a Rimini Wellness dal 1999. Fondatore di Cross Cardio e Mobility, ha rivoluzionato l’allenamento in sala fitness con risultati concreti. Formatore di migliaia di trainer, collabora con brand globali ed è trainer Virgin Active.' },
      { name: 'Daniele Magliola', role: 'Master Trainer', bio: 'Master Trainer laureato in Scienze Motorie e manager fitness, scopre Cross Cardio nel 2015 a Rimini Wellness. Da subito coinvolto nel progetto, diventa uno dei massimi esperti del metodo. Oggi forma trainer e diffonde il Cross Cardio in Italia e nel mondo.' },
      { name: 'Simone Magliola', role: 'Presenter & Trainer', bio: 'Laureato in Scienze Motorie e imprenditore fitness, incontra Cross Cardio nel 2015 durante il lancio ufficiale. Dal 2016 è Presenter e Formatore, contribuendo alla crescita del metodo a livello internazionale.' },
      { name: 'Enzo Ferrari', role: 'Maestro di Cultura Fisica', bio: 'Figura storica del bodybuilding italiano con oltre 40 anni di esperienza, è pluricampione IFBB e Maestro di Cultura Fisica. Formatore e mentore, ha dedicato la sua carriera allo sviluppo di forza e ipertrofia.' },
    ],
    abstract: `Oggi la sala pesi tradizionale fatica a coinvolgere, fidelizzare e generare reale valore per il cliente. Allenamenti ripetitivi, scarsa guida e poca struttura portano a risultati limitati e abbandono.

Il FunXtional Body Building nasce per risolvere questo problema: un metodo evoluto che integra i principi del bodybuilding con la logica funzionale, creando sessioni strutturate, coinvolgenti e altamente efficaci.

Attraverso una programmazione basata su stimoli neurali, meccanici e metabolici, il metodo permette di sviluppare forza, ipertrofia e controllo motorio utilizzando in modo strategico le macchine e gli attrezzi della sala pesi Matrix.

Il risultato è un’esperienza di allenamento guidata, progressiva e replicabile, che aumenta la qualità del servizio, migliora la percezione del trainer e trasforma la sala pesi in un vero centro di performance.

Durante il seminario verrà presentata l’applicazione concreta del metodo, seguita da una sessione pratica in sala in cui i partecipanti potranno testare direttamente l’efficacia del sistema utilizzando le attrezzature Matrix.

Più risultati per i clienti. Più valore per il tuo club.
Strength is the new fit.`,
  },
  {
    id: 13,
    title: 'La riumanizzazione del fitness: camminata, corsa e ritorno alla natura umana',
    date: '30 maggio 2026',
    time: '14:30 – 15:15',
    area: 'Stand Matrix - Educational Lounge - Pad. B1',
    category: 'Correre Naturale',
    speakers: [{ name: 'Daniele Vecchioni', role: 'Founder Correre Naturale' }],
    abstract: `Un talk che cambierà il modo in cui guardi il movimento umano.

Viviamo in un'epoca in cui le persone cercano salute, performance e benessere, ma con un corpo che non è più pronto a muoversi secondo natura.

Nel mondo delle palestre, la vera sfida non è far allenare le persone, ma aiutarle a diventare esseri umani che possono allenarsi.

Scoprirai:
- Perché camminare e correre nel modo corretto sono strumenti potenti di acquisizione clienti
- Come creare percorsi di trasformazione reali che aumentano la retention
- I 3 pilastri del benessere: Software, Hardware e Training
- Il concetto di fitness umano e perché sta cambiando il settore

In un mercato saturo, vince chi si distingue con valore, autenticità ed esperienza.`,
  },
  {
    id: 14,
    title: 'Quadrante Inferiore: Anatomia descrittiva e funzionale – Squat e Leg Extension',
    date: '30 maggio 2026',
    time: '10:30 – 12:00',
    area: 'Stand Matrix - Educational Lounge - Pad. B1',
    category: 'Training & Biomeccanica',
    speakers: [
      { name: 'Giuseppe Zinno', role: 'Master Trainer' },
      { name: 'Marco Montanino', role: 'Fisioterapista e Osteopata' },
      { name: 'Generoso Cristantelli', role: 'Preparatore Fisico' },
    ],
    abstract: 'Seminario pratico dedicato all’analisi biomeccanica e funzionale del quadrante inferiore. Focus su squat e leg extension con approfondimenti su tecnica, attivazione muscolare e prevenzione degli infortuni. (Abstract in aggiornamento)',
  },
  {
    id: 15,
    title: 'Quadrante Superiore: Anatomia descrittiva e funzionale – Allenare Petto e Dorso',
    date: '30 maggio 2026',
    time: '12:00 – 13:30',
    area: 'Stand Matrix - Educational Lounge - Pad. B1',
    category: 'Training & Biomeccanica',
    speakers: [
      { name: 'Giuseppe Zinno' },
      { name: 'Marco Montanino' },
      { name: 'Generoso Cristantelli' },
    ],
    abstract: 'Approfondimento tecnico sull’allenamento del quadrante superiore con focus su petto e dorso. Analisi funzionale, biomeccanica e applicazioni pratiche per migliorare performance ed efficacia dell’allenamento. (Abstract in aggiornamento)',
  },
  {
    id: 16,
    title: 'Valorizza il tuo Cardio con Sprint 8GX',
    date: '30 maggio 2026',
    time: '16:30 – 17:15',
    area: 'Stand Matrix - Educational Lounge - Pad. B1',
    category: 'Cardio & Performance',
    speakers: [{ name: 'Marchesan', role: 'Relatore', bio: 'Informazioni in aggiornamento.' }],
    abstract: 'Seminario dedicato alle strategie per valorizzare l’area cardio e aumentare il coinvolgimento degli utenti attraverso protocolli ad alta intensità e soluzioni innovative come Sprint 8GX. (Abstract in aggiornamento)',
  },
];

const categories = ['Tutti', ...Array.from(new Set(seminars.map((seminar) => seminar.category)))];

const initialForm = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  city: '',
  userCategory: '',
  seminarIds: [] as string[],
};

function safeReadRegistrations(): RegistrationRow[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWriteRegistrations(registrations: RegistrationRow[]) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
  } catch {
    // ignore storage write failures
  }
}

function buildCsvContent(registrations: RegistrationRow[]) {
  const headers = ['Nome', 'Cognome', 'Telefono', 'Email', 'Città', 'Categoria', 'Seminario', 'Data', 'Orario', 'Registrazione'];
  const rows = registrations.map((item) => [
    item.firstName,
    item.lastName,
    item.phone,
    item.email,
    item.city,
    item.userCategory,
    item.seminarTitle,
    item.seminarDate,
    item.seminarTime,
    item.createdAt,
  ]);

  return [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

async function sendRowsToGoogleSheets(rows: RegistrationRow[]) {
  if (!GOOGLE_SHEETS_WEBHOOK_URL || GOOGLE_SHEETS_WEBHOOK_URL === 'INCOLLA_QUI_URL_GOOGLE_APPS_SCRIPT') {
    return;
  }

  // Google Apps Script spesso blocca le richieste con preflight CORS.
  // Usiamo text/plain + no-cors per evitare il blocco lato browser.
  await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ rows }),
  });
}

console.assert(Array.isArray(seminars), 'seminars should be an array');
console.assert(seminars.length === 16, 'there should be 16 seminars');
console.assert(seminars.every((seminar) => typeof seminar.abstract === 'string'), 'each seminar should have a string abstract');
console.assert(seminars.every((seminar) => seminar.speakers.length > 0), 'each seminar should have at least one speaker');
console.assert(buildCsvContent([]).includes('Nome'), 'CSV should include header row');

export default function LandingPageSeminari() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);
  const [formData, setFormData] = useState(initialForm);
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setRegistrations(safeReadRegistrations());
  }, []);

  useEffect(() => {
    safeWriteRegistrations(registrations);
  }, [registrations]);

  const filteredSeminars = useMemo(() => {
    const filtered = seminars.filter((seminar) => {
      const q = search.trim().toLowerCase();
      const subtitle = seminar.subtitle ? seminar.subtitle.toLowerCase() : '';

      const matchesSearch =
        q === '' ||
        seminar.title.toLowerCase().includes(q) ||
        subtitle.includes(q) ||
        seminar.category.toLowerCase().includes(q) ||
        seminar.speakers.some((speaker) => speaker.name.toLowerCase().includes(q));

      const matchesCategory = selectedCategory === 'Tutti' || seminar.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const parseDay = (dateStr: string) => Number.parseInt(dateStr.split(' ')[0], 10);
    const parseTimeValue = (timeStr: string) => timeStr.split('–')[0].trim();

    return filtered.sort((a, b) => {
      const dateDiff = parseDay(a.date) - parseDay(b.date);
      if (dateDiff !== 0) return dateDiff;
      return parseTimeValue(a.time).localeCompare(parseTimeValue(b.time));
    });
  }, [search, selectedCategory]);

  const selectedSeminarObjects = useMemo(
    () => seminars.filter((seminar) => formData.seminarIds.includes(String(seminar.id))),
    [formData.seminarIds],
  );

  const toggleSeminarSelection = (seminarId: string) => {
    setFormData((prev) => ({
      ...prev,
      seminarIds: prev.seminarIds.includes(seminarId)
        ? prev.seminarIds.filter((id) => id !== seminarId)
        : [...prev.seminarIds, seminarId],
    }));
  };

  const handleOpenRegistration = (seminar: Seminar) => {
    setFormData((prev) => ({
      ...prev,
      seminarIds: prev.seminarIds.includes(String(seminar.id)) ? prev.seminarIds : [...prev.seminarIds, String(seminar.id)],
    }));
    const element = document.getElementById('registration-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.seminarIds.length) return;

    const selectedRows: RegistrationRow[] = seminars
      .filter((seminar) => formData.seminarIds.includes(String(seminar.id)))
      .map((seminar) => ({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        userCategory: formData.userCategory,
        seminarId: String(seminar.id),
        seminarTitle: seminar.title,
        seminarDate: seminar.date,
        seminarTime: seminar.time,
        createdAt: new Date().toLocaleString('it-IT'),
      }));

    try {
      setIsSubmitting(true);
      await sendRowsToGoogleSheets(selectedRows);
      setRegistrations((prev) => [...selectedRows, ...prev]);
      setFormData(initialForm);
      setSubmitted(true);
      window.setTimeout(() => setSubmitted(false), 2500);
    } catch (error) {
      console.error('Errore invio Google Sheets:', error);
      window.alert('Invio non riuscito. Verifica che lo script Google sia pubblicato come Web App con accesso “Chiunque” e riprova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadCSV = () => {
    if (!registrations.length || typeof window === 'undefined') return;

    const csvContent = buildCsvContent(registrations);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'iscrizioni-seminari-matrix.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.18),transparent_28%),radial-gradient(circle_at_left,rgba(255,255,255,0.08),transparent_22%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl">
            <Badge className="mb-4 rounded-full bg-red-600 px-4 py-1 text-sm font-medium text-white hover:bg-red-600">
              Iscrizione Seminari Stand Matrix
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">Scopri il programma e registrati ai seminari</h1>
            <p className="mt-6 text-lg leading-8 text-neutral-300">
              Consulta tutti gli appuntamenti in programma, approfondisci abstract e relatori, quindi completa la registrazione inserendo nome, cognome, telefono, email, città e categoria professionale.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-neutral-300">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <CalendarDays className="h-4 w-4" /> Programma completo
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <Users className="h-4 w-4" /> {seminars.length} seminari
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <MapPin className="h-4 w-4" /> Stand Matrix - Educational Lounge - Pad. B1
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cerca per titolo, tema o relatore" className="h-11 rounded-2xl border-white/10 bg-neutral-900 pl-10 text-white placeholder:text-neutral-500" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'rounded-full bg-red-600 text-white hover:bg-red-500' : 'rounded-full border-white/15 bg-transparent text-white hover:bg-white/10'}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredSeminars.map((seminar, index) => (
            <motion.div key={seminar.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: index * 0.02 }}>
              <Card className="h-full rounded-[24px] border-white/10 bg-neutral-900 text-white shadow-xl shadow-black/20">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">{seminar.category}</Badge>
                    <span className="text-sm text-neutral-400">#{seminar.id}</span>
                  </div>
                  <CardTitle className="text-xl leading-tight">{seminar.title}</CardTitle>
                  {seminar.subtitle ? <p className="text-sm leading-6 text-neutral-400">{seminar.subtitle}</p> : null}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-neutral-300">
                    <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {seminar.date}</div>
                    <div className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> {seminar.time}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {seminar.area}</div>
                    <div className="flex items-start gap-2"><Users className="mt-0.5 h-4 w-4" /><span>{seminar.speakers.map((speaker) => speaker.name).join(', ')}</span></div>
                  </div>
                  <p className="line-clamp-3 whitespace-pre-line text-sm leading-6 text-neutral-400">{seminar.abstract}</p>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={() => setSelectedSeminar(seminar)} className="flex-1 rounded-2xl bg-red-600 text-white hover:bg-red-500">
                      Scopri di più <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => handleOpenRegistration(seminar)} className="rounded-2xl border-white/15 bg-transparent text-white hover:bg-white/10">
                      Aggiungi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="registration-section" className="mx-auto max-w-7xl px-6 pb-20 pt-6 lg:px-8">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-red-600 to-red-500 p-[1px]">
          <div className="rounded-[31px] bg-neutral-950 px-8 py-10 lg:px-12 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
              <div>
                <Badge className="mb-4 rounded-full bg-white/10 text-white hover:bg-white/10">Registrazione</Badge>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Registrati a uno o più seminari</h2>
                <p className="mt-4 max-w-2xl text-neutral-300">
                  Compila il modulo con i tuoi dati e seleziona tutti i seminari di interesse. Quando collegherai Google Sheets, ogni seminario selezionato verrà salvato come riga separata.
                </p>
                <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-neutral-400">Iscrizioni raccolte</p>
                      <p className="mt-1 text-3xl font-semibold text-white">{registrations.length}</p>
                    </div>
                    <Button onClick={downloadCSV} disabled={!registrations.length} className="rounded-2xl bg-red-600 text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50">
                      <Download className="mr-2 h-4 w-4" /> Scarica iscrizioni CSV
                    </Button>
                  </div>
                </div>
              </div>

              <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nome</Label>
                        <Input id="firstName" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="rounded-2xl border-white/10 bg-neutral-900 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Cognome</Label>
                        <Input id="lastName" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="rounded-2xl border-white/10 bg-neutral-900 text-white" />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefono</Label>
                        <Input id="phone" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="rounded-2xl border-white/10 bg-neutral-900 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="rounded-2xl border-white/10 bg-neutral-900 text-white" />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="city">Città</Label>
                        <Input id="city" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="rounded-2xl border-white/10 bg-neutral-900 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label>Categoria</Label>
                        <Select value={formData.userCategory} onValueChange={(value) => setFormData({ ...formData, userCategory: value })}>
                          <SelectTrigger className="rounded-2xl border-white/10 bg-neutral-900 text-white"><SelectValue placeholder="Seleziona categoria" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Titolare / Owner">Titolare / Owner</SelectItem>
                            <SelectItem value="Club Manager">Club Manager</SelectItem>
                            <SelectItem value="Trainer / PT">Trainer / PT</SelectItem>
                            <SelectItem value="Consulente">Consulente</SelectItem>
                            <SelectItem value="Studente">Studente</SelectItem>
                            <SelectItem value="Altro">Altro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Seminari di interesse</Label>
                      <div className="max-h-72 space-y-2 overflow-auto rounded-2xl border border-white/10 bg-neutral-900 p-4">
                        {seminars
                          .slice()
                          .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
                          .map((seminar) => {
                            const checked = formData.seminarIds.includes(String(seminar.id));
                            return (
                              <label key={seminar.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/5 p-3 transition hover:bg-white/5">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleSeminarSelection(String(seminar.id))}
                                  className="mt-1 h-4 w-4 accent-red-600"
                                />
                                <div className="text-sm">
                                  <p className="font-medium text-white">{seminar.title}</p>
                                  <p className="mt-1 text-neutral-400">{seminar.date} · {seminar.time}</p>
                                </div>
                              </label>
                            );
                          })}
                      </div>
                      {selectedSeminarObjects.length ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-neutral-300">
                          <p className="mb-2 font-medium text-white">Selezionati ({selectedSeminarObjects.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedSeminarObjects.map((seminar) => (
                              <Badge key={seminar.id} className="rounded-full bg-red-600 text-white hover:bg-red-600">
                                {seminar.time} · {seminar.title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <Button type="submit" disabled={isSubmitting || !formData.seminarIds.length} className="w-full rounded-2xl bg-red-600 text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50">
                      {isSubmitting ? 'Invio in corso...' : 'Conferma iscrizione'}
                    </Button>

                    {submitted ? (
                      <div className="flex items-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                        <CheckCircle2 className="h-4 w-4" /> Iscrizione registrata correttamente.
                      </div>
                    ) : null}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={!!selectedSeminar} onOpenChange={() => setSelectedSeminar(null)}>
        <DialogContent className="max-w-2xl rounded-[28px] border-white/10 bg-neutral-950 text-white">
          {selectedSeminar && (
            <>
              <DialogHeader>
                <div className="mb-3 flex items-center gap-2">
                  <Badge className="rounded-full bg-red-600 text-white hover:bg-red-600">{selectedSeminar.category}</Badge>
                  <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">{selectedSeminar.date}</Badge>
                </div>
                <DialogTitle className="text-2xl leading-tight">{selectedSeminar.title}</DialogTitle>
                <DialogDescription className="pt-2 text-neutral-400">{selectedSeminar.time} · {selectedSeminar.area}</DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-6">
                {selectedSeminar.subtitle ? (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Focus</h3>
                    <p className="text-base leading-7 text-neutral-200">{selectedSeminar.subtitle}</p>
                  </div>
                ) : null}

                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Abstract</h3>
                  <p className="whitespace-pre-line text-base leading-7 text-neutral-200">{selectedSeminar.abstract}</p>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Relatori</h3>
                  <div className="space-y-3">
                    {selectedSeminar.speakers.map((speaker, idx) => (
                      <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                        {speaker.image ? (
                          <img src={speaker.image} alt={speaker.name} className="h-48 w-full rounded-xl object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        ) : null}
                        <div>
                          <p className="font-medium text-white">{speaker.name}</p>
                          {speaker.role ? <p className="mt-1 text-sm text-neutral-400">{speaker.role}</p> : null}
                        </div>
                        {speaker.bio ? <p className="whitespace-pre-line text-sm leading-6 text-neutral-300">{speaker.bio}</p> : null}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Button onClick={() => { setSelectedSeminar(null); handleOpenRegistration(selectedSeminar); }} className="w-full rounded-2xl bg-red-600 text-white hover:bg-red-500">
                    Aggiungi alla registrazione
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
