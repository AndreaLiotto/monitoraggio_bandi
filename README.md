# 🎯 Monitoraggio Bandi - Sistema Completo

Sistema professionale per la gestione e il monitoraggio di bandi pubblici.

**Stack**: React 18 + JavaScript + Supabase + Tailwind CSS

---

## 🚀 Quick Start

```bash
# 1. Installa dipendenze
npm install

# 2. Configura Supabase
cp .env.local.example .env.local
# Modifica .env.local con le tue credenziali

# 3. Esegui SCHEMA_DATABASE.sql in Supabase SQL Editor

# 4. Avvia l'applicazione
npm start
```

Apri [http://localhost:3000](http://localhost:3000)

---

## ✨ Funzionalità

### Dashboard
- ✅ 4 KPI real-time (Bandi Totali, Attivi, Importo Concesso, Scadenze)
- ✅ Lista scadenze imminenti (30 giorni)
- ✅ Grafico importi per mese (Chart.js)
- ✅ Export Excel multi-sheet

### Gestione Bandi
- ✅ Lista completa con ricerca e filtri
- ✅ Creazione e modifica bandi
- ✅ Dettaglio bando con tabs (Spese, Storico, Note)
- ✅ Stati: bozza, presentato, in_valutazione, approvato, respinto, erogato, chiuso
- ✅ Alert scadenze (rosso < 7 giorni, giallo < 14 giorni)
- ✅ Calcolo automatico importi totali

### Gestione Clienti
- ✅ CRUD completo
- ✅ Validazione P.IVA (11 cifre)
- ✅ Validazione Codice Fiscale (16 caratteri)
- ✅ Gestione referenti

### Gestione Spese
- ✅ Spese per bando
- ✅ Calcolo automatico percentuale agevolazione
- ✅ Stati: presentata, approvata, respinta, in_verifica
- ✅ Collegamento a clienti

### Enti e Tipi Contributo
- ✅ Gestione enti erogatori
- ✅ Gestione tipi di contributo
- ✅ Visualizzazione card con dettagli

### Timeline e Note
- ✅ Storico aggiornamenti per bando
- ✅ Note con tag e filtri
- ✅ Visualizzazione timeline

### Export
- ✅ Export Excel con 5 sheet
- ✅ Formattazione automatica colonne

---

## 🛠️ Tecnologie

- **Frontend**: React 18 + JavaScript (JSX)
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Grafici**: Chart.js + react-chartjs-2
- **Form**: React Hook Form
- **Routing**: React Router v6
- **Date**: date-fns (locale italiano)
- **Export**: SheetJS (xlsx)

---

## 📁 Struttura Progetto

```
monitoraggio-bandi/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Bandi/          # Gestione bandi
│   │   ├── Clienti/        # Gestione clienti
│   │   ├── Dashboard/      # KPI e grafici
│   │   ├── Enti/           # Enti erogatori
│   │   ├── Export/         # Export Excel
│   │   ├── Note/           # Sistema note
│   │   ├── Shared/         # Componenti condivisi
│   │   ├── Spese/          # Gestione spese
│   │   ├── Storico/        # Timeline
│   │   └── TipiContributo/ # Tipi contributo
│   ├── hooks/              # Custom hooks Supabase
│   ├── lib/                # Utilità e Supabase client
│   ├── pages/              # Pagine
│   ├── App.jsx             # Router principale
│   ├── index.js            # Entry point
│   └── index.css           # Stili globali
├── package.json
├── tailwind.config.js
└── SCHEMA_DATABASE.sql
```

---

## 🗄️ Database

### Tabelle:
- **bandi** - Bandi pubblici
- **clienti** - Clienti/Beneficiari
- **enti_erogatori** - Enti che erogano bandi
- **tipi_contributo** - Tipologie di contributo
- **spese** - Spese per bando
- **bandi_clienti** - Relazione N:M bandi-clienti
- **storico** - Timeline aggiornamenti
- **note** - Note per bando

### Features Database:
- ✅ Trigger auto-aggiornamento updated_at
- ✅ Calcolo automatico totali bando
- ✅ Percentuale agevolazione computed
- ✅ Indici per performance
- ✅ Row Level Security (permissiva)

---

## 🔧 Configurazione Supabase

### 1. Crea Progetto
- Vai su [app.supabase.com](https://app.supabase.com)
- New Project → "monitoraggio-bandi"
- **Regione**: Europe (Frankfurt) per GDPR

### 2. Esegui Schema
- SQL Editor → New Query
- Copia tutto da `SCHEMA_DATABASE.sql`
- Run

### 3. Ottieni Credenziali
- Settings → API
- Copia:
  - **Project URL**
  - **anon/public key**

### 4. Configura .env.local
```env
REACT_APP_SUPABASE_URL=https://tuo-progetto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJ...tua-key
```

---

## 📤 Deploy

### Vercel (raccomandato)

```bash
# 1. Push su GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TUO_USERNAME/monitoraggio-bandi.git
git push -u origin main

# 2. Deploy su Vercel
# - Vai su vercel.com
# - Import repository
# - Aggiungi variabili ambiente:
#   REACT_APP_SUPABASE_URL
#   REACT_APP_SUPABASE_ANON_KEY
# - Deploy
```

---

## 📊 Stato Progetto

**Completamento**: 95% ✅

Vedi `STATO_PROGETTO.md` per dettagli completi.

### Completamente Funzionanti:
- Dashboard, KPI, Grafici
- CRUD Bandi
- CRUD Clienti
- Visualizzazione Spese, Enti, Tipi
- Timeline, Note
- Export Excel
- Navigazione completa
- Validazioni

### Opzionali (placeholder):
- 4 form inline secondari

---

## 🎨 Design System

### Colori
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)

### Componenti
- Tailwind utility-first
- Responsive mobile-first
- Loading states
- Confirm dialogs
- Empty states

---

## 🔐 Sicurezza

- ✅ Validazione client-side
- ✅ Validazione P.IVA e CF
- ✅ RLS Supabase abilitato
- ⚠️ Aggiungi autenticazione per produzione

---

## 📝 Note Sviluppo

### Custom Hooks Pattern
Ogni hook espone:
```javascript
const { items, loading, error, fetch*, create*, update*, delete* } = useHook();
```

### Utilità Disponibili
```javascript
formatDate(date)           // dd/MM/yyyy
formatCurrency(amount)     // € x.xxx,xx
formatPercentage(value)    // xx.xx%
validatePartitaIva(piva)   // boolean
validateCodiceFiscale(cf)  // boolean
getScadenzaStatus(data)    // 'urgent'|'warning'|'normal'
```

---

## 🤝 Supporto

Per problemi o domande:
1. Verifica `STATO_PROGETTO.md`
2. Controlla console browser per errori
3. Verifica credenziali Supabase in `.env.local`
4. Controlla che lo schema SQL sia eseguito

---

## 📄 Licenza

Uso interno - Tutti i diritti riservati

---

**Creato con ❤️ usando React + Supabase**
