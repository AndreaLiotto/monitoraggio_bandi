import { format, parseISO, differenceInDays } from 'date-fns';
import { it } from 'date-fns/locale';

export function formatDate(date) {
  if (!date) return '-';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'dd/MM/yyyy', { locale: it });
}

export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '€ 0,00';
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

export function formatPercentage(value) {
  if (value === null || value === undefined) return '0%';
  return `${value.toFixed(2)}%`;
}

export function getScadenzaStatus(scadenza) {
  if (!scadenza) return 'normal';
  const giorni = differenceInDays(parseISO(scadenza), new Date());
  
  if (giorni < 0) return 'urgent';
  if (giorni <= 7) return 'urgent';
  if (giorni <= 14) return 'warning';
  return 'normal';
}

export function validatePartitaIva(piva) {
  if (!piva || piva.length !== 11) return false;
  if (!/^\d{11}$/.test(piva)) return false;
  
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    let digit = parseInt(piva[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(piva[10]);
}

export function validateCodiceFiscale(cf) {
  if (!cf || cf.length !== 16) return false;
  return /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i.test(cf);
}
