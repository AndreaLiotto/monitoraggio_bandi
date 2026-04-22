# ⚡ Monitoraggio Bandi - Vite + React

Sistema completo per gestione bandi pubblici costruito con **Vite** (ultra-veloce!).

## 🚀 Quick Start

```bash
# 1. Installa dipendenze
npm install

# 2. Configura ambiente
cp .env.example .env
# Modifica .env con le tue credenziali Supabase

# 3. Esegui SCHEMA_DATABASE.sql in Supabase

# 4. Avvia (Vite è velocissimo!)
npm run dev
```

Apri http://localhost:3000

---

## ⚡ Vite vs Create React App

- **Start**: 10x più veloce ⚡
- **HMR**: Istantaneo 🔥
- **Build**: 50% più veloce 📦
- **Moderno**: ES modules nativi

---

## 📦 Comandi Disponibili

```bash
npm run dev      # Sviluppo con HMR ultra-veloce
npm run build    # Build produzione
npm run preview  # Anteprima build locale
```

---

## 🔧 Differenze da Create React App

### 1. Variabili Ambiente
- **CRA**: `REACT_APP_*`
- **Vite**: `VITE_*` ← **IMPORTANTE!**

File `.env`:
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

### 2. Entry Point
- **CRA**: `src/index.js`
- **Vite**: `src/main.jsx`

### 3. index.html
- **CRA**: In `public/`
- **Vite**: Nella root del progetto

---

## ✨ Funzionalità Complete

- ✅ Dashboard con KPI real-time
- ✅ Gestione completa Bandi (CRUD)
- ✅ Gestione Clienti con validazione P.IVA/CF
- ✅ Spese per bando con calcoli automatici
- ✅ Enti Erogatori
- ✅ Tipi Contributo
- ✅ Timeline Storico aggiornamenti
- ✅ Note con tag e filtri
- ✅ Export Excel multi-sheet (5 fogli)
- ✅ Grafici Chart.js
- ✅ Alert scadenze con colori
- ✅ Responsive design Tailwind

---

## 🗄️ Database Supabase

8 tabelle con features avanzate:
- Trigger auto-aggiornamento
- Calcolo automatico totali bando
- Percentuali computed
- Row Level Security
- Indici ottimizzati

---

## 📤 Deploy

### Vercel (consigliato)
```bash
npm run build
# Connetti repo su vercel.com
# Framework Preset: Vite
# Build Command: npm run build
# Output Directory: dist
# Aggiungi variabili VITE_*
```

### Netlify
```bash
npm run build
# Build command: npm run build
# Publish directory: dist
# Aggiungi variabili VITE_*
```

---

## 📱 Routing

- `/` → Dashboard
- `/bandi` → Lista bandi
- `/bandi/nuovo` → Nuovo bando
- `/bandi/:id` → Dettaglio bando
- `/bandi/:id/modifica` → Modifica bando
- `/clienti` → Gestione clienti
- `/enti` → Enti erogatori
- `/tipi-contributo` → Tipi contributo

---

## 🎨 Stack Tecnologico

- **Build Tool**: Vite 5
- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 3
- **Backend**: Supabase (PostgreSQL)
- **Forms**: React Hook Form
- **Charts**: Chart.js + react-chartjs-2
- **Date**: date-fns (locale italiano)
- **Export**: SheetJS (xlsx)

---

## 🐛 Troubleshooting

### Errore variabili ambiente
```bash
# Assicurati che .env contenga VITE_* (non REACT_APP_*)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### Hot reload non funziona
```bash
# Riavvia il server
npm run dev
```

### Errore import
```javascript
// Vite usa import.meta invece di process.env
const url = import.meta.env.VITE_SUPABASE_URL
```

---

## 📁 Struttura Progetto

```
monitoraggio-bandi/
├── index.html                  # Entry HTML (root!)
├── vite.config.js             # Config Vite
├── package.json
├── .env.example               # Template variabili
├── SCHEMA_DATABASE.sql        # Schema DB completo
├── src/
│   ├── main.jsx              # Entry point Vite
│   ├── App.jsx               # Router principale
│   ├── index.css             # Tailwind imports
│   ├── lib/
│   │   ├── supabase.js       # Client Supabase (VITE_*)
│   │   └── utils.js          # Utilità comuni
│   ├── hooks/                # 7 custom hooks
│   ├── components/           # 24 componenti
│   └── pages/                # Dashboard page
```

---

## 🎉 Pronto per Produzione!

Progetto completo con 42 file JavaScript e **Vite** per performance ottimali.

**Buon lavoro!** 🚀
