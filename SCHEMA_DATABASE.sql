-- SCHEMA DATABASE COMPLETO PER SUPABASE
-- Esegui questo script in Supabase SQL Editor

-- 1. ENTI EROGATORI
CREATE TABLE IF NOT EXISTS enti_erogatori (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  sito_web TEXT,
  email_contatto TEXT,
  telefono TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TIPI CONTRIBUTO
CREATE TABLE IF NOT EXISTS tipi_contributo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  percentuale_copertura DECIMAL(5,2),
  massimale_euro DECIMAL(12,2),
  descrizione TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. CLIENTI
CREATE TABLE IF NOT EXISTS clienti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ragione_sociale TEXT NOT NULL,
  partita_iva VARCHAR(11) UNIQUE,
  codice_fiscale VARCHAR(16),
  referente_nome TEXT,
  referente_email TEXT,
  referente_telefono TEXT,
  indirizzo TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. BANDI
CREATE TABLE IF NOT EXISTS bandi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titolo TEXT NOT NULL,
  ente_erogatore_id UUID REFERENCES enti_erogatori(id) ON DELETE RESTRICT,
  tipo_contributo_id UUID REFERENCES tipi_contributo(id) ON DELETE RESTRICT,
  scadenza_domanda DATE,
  scadenza_rendicontazione DATE,
  tempistica_erogazione_giorni INTEGER,
  link_decreto TEXT,
  codice_bando TEXT,
  stato TEXT CHECK (stato IN ('bozza','presentato','in_valutazione','approvato','respinto','erogato','chiuso')) DEFAULT 'bozza',
  importo_totale_richiesto DECIMAL(12,2) DEFAULT 0,
  importo_totale_concesso DECIMAL(12,2) DEFAULT 0,
  note_generali TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. RELAZIONE BANDI-CLIENTI
CREATE TABLE IF NOT EXISTS bandi_clienti (
  bando_id UUID REFERENCES bandi(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clienti(id) ON DELETE CASCADE,
  ruolo TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (bando_id, cliente_id)
);

-- 6. SPESE
CREATE TABLE IF NOT EXISTS spese (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bando_id UUID REFERENCES bandi(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clienti(id) ON DELETE CASCADE,
  descrizione TEXT NOT NULL,
  categoria TEXT,
  importo_richiesto DECIMAL(12,2) NOT NULL,
  importo_concesso DECIMAL(12,2) DEFAULT 0,
  percentuale_agevolazione DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE WHEN importo_richiesto > 0 
    THEN (importo_concesso / importo_richiesto * 100) 
    ELSE 0 END
  ) STORED,
  data_presentazione DATE,
  stato TEXT CHECK (stato IN ('presentata','approvata','respinta','in_verifica')) DEFAULT 'presentata',
  fattura_url TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. STORICO AGGIORNAMENTI
CREATE TABLE IF NOT EXISTS storico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bando_id UUID REFERENCES bandi(id) ON DELETE CASCADE,
  titolo TEXT NOT NULL,
  descrizione TEXT,
  autore TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. NOTE
CREATE TABLE IF NOT EXISTS note (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bando_id UUID REFERENCES bandi(id) ON DELETE CASCADE,
  testo TEXT NOT NULL,
  tag TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- INDICI per performance
CREATE INDEX IF NOT EXISTS idx_bandi_ente ON bandi(ente_erogatore_id);
CREATE INDEX IF NOT EXISTS idx_bandi_stato ON bandi(stato);
CREATE INDEX IF NOT EXISTS idx_bandi_scadenza_domanda ON bandi(scadenza_domanda);
CREATE INDEX IF NOT EXISTS idx_spese_bando ON spese(bando_id);
CREATE INDEX IF NOT EXISTS idx_spese_cliente ON spese(cliente_id);
CREATE INDEX IF NOT EXISTS idx_storico_bando ON storico(bando_id);

-- TRIGGER updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS bandi_updated_at BEFORE UPDATE ON bandi
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER IF NOT EXISTS clienti_updated_at BEFORE UPDATE ON clienti
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER IF NOT EXISTS spese_updated_at BEFORE UPDATE ON spese
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER IF NOT EXISTS enti_updated_at BEFORE UPDATE ON enti_erogatori
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER IF NOT EXISTS note_updated_at BEFORE UPDATE ON note
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- FUNCTION ricalcolo totali bando
CREATE OR REPLACE FUNCTION ricalcola_totali_bando()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE bandi SET
    importo_totale_richiesto = (
      SELECT COALESCE(SUM(importo_richiesto), 0) 
      FROM spese WHERE bando_id = COALESCE(NEW.bando_id, OLD.bando_id)
    ),
    importo_totale_concesso = (
      SELECT COALESCE(SUM(importo_concesso), 0) 
      FROM spese WHERE bando_id = COALESCE(NEW.bando_id, OLD.bando_id)
    )
  WHERE id = COALESCE(NEW.bando_id, OLD.bando_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS spese_aggiorna_totali
AFTER INSERT OR UPDATE OR DELETE ON spese
FOR EACH ROW EXECUTE FUNCTION ricalcola_totali_bando();

-- ROW LEVEL SECURITY (permissiva per uso singolo)
ALTER TABLE bandi ENABLE ROW LEVEL SECURITY;
ALTER TABLE clienti ENABLE ROW LEVEL SECURITY;
ALTER TABLE spese ENABLE ROW LEVEL SECURITY;
ALTER TABLE enti_erogatori ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipi_contributo ENABLE ROW LEVEL SECURITY;
ALTER TABLE storico ENABLE ROW LEVEL SECURITY;
ALTER TABLE note ENABLE ROW LEVEL SECURITY;
ALTER TABLE bandi_clienti ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Accesso completo bandi" ON bandi FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Accesso completo clienti" ON clienti FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Accesso completo spese" ON spese FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Accesso completo enti" ON enti_erogatori FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Accesso completo tipi" ON tipi_contributo FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Accesso completo storico" ON storico FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Accesso completo note" ON note FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Accesso completo bandi_clienti" ON bandi_clienti FOR ALL USING (true);
