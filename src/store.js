// Billenza Store: Dual-mode cloud storage via Supabase with fallback to local Express
// When VITE_SUPABASE_URL is configured, all data persists to PostgreSQL with Row-Level Security.

import { getFinancialYearLabel, parseLocalDate, nextCounterValue, startFor, numberSeriesFor, counterKeyFor, formatDocNumber, INVOICE_TYPES, savedPdfNameFor } from './utils';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';

const API = '/api';

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let body = null;
    try { body = await res.json(); } catch { /* non-JSON body */ }
    const err = new Error(body?.error || `API error: ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.json();
}

// ---- PIN lock (Desktop legacy / Cloud bypass) ----
export const getLockStatus = async () => {
  if (isSupabaseConfigured()) return { locked: false, hasPin: false };
  return apiFetch(`${API}/lock`);
};
export const verifyPin = (pin) => {
  if (isSupabaseConfigured()) return Promise.resolve({ ok: true });
  return apiFetch(`${API}/lock/verify`, { method: 'POST', body: JSON.stringify({ pin }) });
};
export const setLockPin = (pin, currentPin) => {
  if (isSupabaseConfigured()) return Promise.resolve({ ok: true });
  return apiFetch(`${API}/lock/set`, { method: 'POST', body: JSON.stringify({ pin, currentPin }) });
};

// ---- Invoice Number Settings ----
const DEFAULT_INV_SETTINGS = {
  format: 'branded',      // 'branded' | 'sequential' | 'random'
  brandPrefix: '',         // e.g. 'ACME' — empty means use type prefix (INV/EST/CN/BOS)
  separator: '/',          // '/' | '-' | '#'
  showFinYear: true,       // include 2026-27 financial year
  startNumber: 1,          // starting counter value
  padDigits: 4,            // zero-pad to this many digits
};

export const getInvoiceNumberSettings = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase.from('user_preferences').select('invoice_number_settings').maybeSingle();
      return { ...DEFAULT_INV_SETTINGS, ...(data?.invoice_number_settings || {}) };
    } catch {
      return DEFAULT_INV_SETTINGS;
    }
  }
  const { value } = await apiFetch(`${API}/meta/invoiceNumberSettings`);
  return { ...DEFAULT_INV_SETTINGS, ...(value || {}) };
};

export const saveInvoiceNumberSettings = async (settings) => {
  if (isSupabaseConfigured()) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('user_preferences').upsert({
        user_id: user.id,
        invoice_number_settings: settings,
        updated_at: new Date().toISOString(),
      });
    }
    return;
  }
  await apiFetch(`${API}/meta/invoiceNumberSettings`, {
    method: 'POST',
    body: JSON.stringify({ value: settings }),
  });
};

export const getNumberSeriesMap = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase.from('user_preferences').select('invoice_number_series').maybeSingle();
      return data?.invoice_number_series && typeof data.invoice_number_series === 'object' ? data.invoice_number_series : {};
    } catch {
      return {};
    }
  }
  const { value } = await apiFetch(`${API}/meta/invoiceNumberSeries`);
  return value && typeof value === 'object' ? value : {};
};

export const saveNumberSeriesMap = async (map) => {
  if (isSupabaseConfigured()) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('user_preferences').upsert({
        user_id: user.id,
        invoice_number_series: map || {},
        updated_at: new Date().toISOString(),
      });
    }
    return;
  }
  return apiFetch(`${API}/meta/invoiceNumberSeries`, {
    method: 'POST', body: JSON.stringify({ value: map || {} }),
  });
};

export const renameNumberSeries = async (from, to) => {
  if (isSupabaseConfigured()) {
    const map = await getNumberSeriesMap();
    if (map[from]) {
      map[to] = map[from];
      delete map[from];
      await saveNumberSeriesMap(map);
    }
    return { ok: true };
  }
  return apiFetch(`${API}/number-series/rename`, {
    method: 'POST', body: JSON.stringify({ from, to }),
  });
};

export const getNumberSeries = async (businessKey) => {
  const [shared, map] = await Promise.all([getInvoiceNumberSettings(), businessKey ? getNumberSeriesMap() : {}]);
  return numberSeriesFor(shared, map, businessKey);
};

// ---- Stock-alert Settings ----
const DEFAULT_STOCK_ALERT_SETTINGS = {
  enabled: true,
  threshold: 5,
};

export const getStockAlertSettings = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase.from('user_preferences').select('stock_alert_settings').maybeSingle();
      return { ...DEFAULT_STOCK_ALERT_SETTINGS, ...(data?.stock_alert_settings || {}) };
    } catch {
      return DEFAULT_STOCK_ALERT_SETTINGS;
    }
  }
  const { value } = await apiFetch(`${API}/meta/stockAlertSettings`);
  return { ...DEFAULT_STOCK_ALERT_SETTINGS, ...(value || {}) };
};

export const saveStockAlertSettings = async (settings) => {
  if (isSupabaseConfigured()) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('user_preferences').upsert({
        user_id: user.id,
        stock_alert_settings: settings,
        updated_at: new Date().toISOString(),
      });
    }
    return;
  }
  await apiFetch(`${API}/meta/stockAlertSettings`, {
    method: 'POST',
    body: JSON.stringify({ value: settings }),
  });
};

export const applyStockChanges = async (changes) => {
  const ids = Object.keys(changes || {}).filter((id) => changes[id]);
  if (!ids.length) return [];
  const products = await getAllProducts();
  const saved = [];
  for (const id of ids) {
    const p = products.find((x) => x.id === id);
    if (!p) continue;
    const next = { ...p, stock: Math.round(((Number(p.stock) || 0) + changes[id]) * 1000) / 1000 };
    await saveProduct(next);
    saved.push(next);
  }
  return saved;
};

// ---- Invoice Display Options ----
export const getInvoiceDisplayOptions = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase.from('user_preferences').select('data').maybeSingle();
      return data?.invoiceDisplayOptions || null;
    } catch { return null; }
  }
  const { value } = await apiFetch(`${API}/meta/invoiceDisplayOptions`);
  return value || null;
};

export const saveInvoiceDisplayOptions = async (options) => {
  if (isSupabaseConfigured()) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('user_preferences').upsert({
        user_id: user.id,
        data: { invoiceDisplayOptions: options },
      });
    }
    return;
  }
  await apiFetch(`${API}/meta/invoiceDisplayOptions`, {
    method: 'POST',
    body: JSON.stringify({ value: options }),
  });
};

// ---- Region Mode ----
const REGION_KEY = 'gst_regionMode';
export const getRegionMode = () => {
  try { return localStorage.getItem(REGION_KEY) || 'both'; } catch { return 'both'; }
};
export const setRegionMode = (mode) => {
  if (!['india', 'international', 'both'].includes(mode)) return;
  try { localStorage.setItem(REGION_KEY, mode); } catch { /* ignore */ }
  if (isSupabaseConfigured()) {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('user_preferences').upsert({ user_id: user.id, region_mode: mode }).catch(() => {});
      }
    });
  } else {
    apiFetch(`${API}/meta/regionMode`, { method: 'POST', body: JSON.stringify({ value: mode }) }).catch(() => {});
  }
};

// ---- Enabled Feature Modules ----
const MODULES_KEY = 'gst_enabledModules';
export const getEnabledModules = () => {
  try {
    const raw = localStorage.getItem(MODULES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
};
export const setEnabledModules = (map) => {
  try { localStorage.setItem(MODULES_KEY, JSON.stringify(map || {})); } catch { /* ignore */ }
  if (isSupabaseConfigured()) {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('user_preferences').upsert({ user_id: user.id, enabled_modules: map || {} }).catch(() => {});
      }
    });
  } else {
    apiFetch(`${API}/meta/enabledModules`, { method: 'POST', body: JSON.stringify({ value: map || {} }) }).catch(() => {});
  }
};

// ---- Next Invoice Number ----
export const getNextInvoiceNumber = async (prefix = 'INV', { peek = false, explicitPrefix = false, invoiceType = null, businessKey = '', invoiceDate = '' } = {}) => {
  const settings = await getNumberSeries(businessKey);
  const typePrefix = settings.own ? (INVOICE_TYPES[invoiceType]?.prefix || prefix) : prefix;
  const key = counterKeyFor(typePrefix, settings, businessKey);
  const start = invoiceType ? startFor(invoiceType, settings) : 1;
  let next;

  if (isSupabaseConfigured()) {
    try {
      const { data: bills } = await supabase.from('bills').select('invoice_number');
      const count = (bills || []).length;
      next = count + start;
    } catch {
      next = start;
    }
  } else {
    if (peek) {
      const { value: current } = await apiFetch(`${API}/meta/${encodeURIComponent(key)}`);
      next = nextCounterValue(current, start);
    } else {
      const inc = await apiFetch(`${API}/meta/${encodeURIComponent(key)}/increment`, { method: 'POST', body: JSON.stringify({ start }) });
      next = inc.value;
    }
  }

  return formatDocNumber({
    settings, typePrefix, next,
    explicitPrefix: settings.own ? false : explicitPrefix,
    fyLabel: getFinancialYearLabel(invoiceDate ? parseLocalDate(invoiceDate) : new Date()),
  });
};

// ---- Bills ----
export const saveBill = async (bill, { overwrite = false } = {}) => {
  if (isSupabaseConfigured()) {
    const row = {
      id: bill.id,
      invoice_number: bill.invoiceNumber || 'INV-0001',
      invoice_type: bill.invoiceType || 'tax_invoice',
      invoice_date: bill.invoiceDate,
      due_date: bill.details?.dueDate || null,
      client_id: bill.customer?.id || null,
      client_name: bill.customer?.name || null,
      client_gstin: bill.customer?.gstin || null,
      currency: bill.currency || 'INR',
      total_amount: bill.totalAmount || 0,
      paid_amount: bill.paidAmount || 0,
      status: bill.status || 'unpaid',
      is_cancelled: Boolean(bill.isCancelled),
      data: bill,
    };

    const query = overwrite
      ? supabase.from('bills').upsert(row)
      : supabase.from('bills').insert(row);

    const { error } = await query;
    if (error) {
      if (error.code === '23505') {
        const err = new Error('Invoice number already exists');
        err.status = 409;
        throw err;
      }
      throw error;
    }
    return bill;
  }

  const qs = overwrite ? '?overwrite=1' : '';
  return apiFetch(`${API}/bills${qs}`, { method: 'POST', body: JSON.stringify(bill) });
};

export const getAllBills = async () => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('bills').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((row) => ({ ...row.data, id: row.id, status: row.status }));
  }
  return apiFetch(`${API}/bills`);
};

export const deleteBill = async (id) => {
  if (isSupabaseConfigured()) {
    const { error } = await supabase.from('bills').delete().eq('id', id);
    if (error) throw error;
    return { ok: true };
  }
  return apiFetch(`${API}/bills/${encodeURIComponent(id)}`, { method: 'DELETE' });
};

// Backups & Trash
export const getBackupsList = async () => isSupabaseConfigured() ? [] : apiFetch(`${API}/backups`);
export const restoreBackup = async (date) => isSupabaseConfigured() ? { ok: true } : apiFetch(`${API}/backups/${encodeURIComponent(date)}/restore`, { method: 'POST', body: JSON.stringify({}) });
export const triggerBackup = async () => isSupabaseConfigured() ? { ok: true } : apiFetch(`${API}/backups/now`, { method: 'POST', body: JSON.stringify({}) });
export const deleteBackup = async (date) => isSupabaseConfigured() ? { ok: true } : apiFetch(`${API}/backups/${encodeURIComponent(date)}`, { method: 'DELETE' });
export const getBackupFolder = async () => isSupabaseConfigured() ? { path: '' } : apiFetch(`${API}/backup-folder`);
export const setBackupFolder = async (folder) => isSupabaseConfigured() ? { ok: true } : apiFetch(`${API}/backup-folder`, { method: 'POST', body: JSON.stringify({ path: folder }) });
export const getTrashedBills = async () => isSupabaseConfigured() ? [] : apiFetch(`${API}/trash`);
export const restoreTrashedBill = async (id) => isSupabaseConfigured() ? { ok: true } : apiFetch(`${API}/trash/${encodeURIComponent(id)}/restore`, { method: 'POST', body: JSON.stringify({}) });
export const purgeTrashedBill = async (id) => isSupabaseConfigured() ? { ok: true } : apiFetch(`${API}/trash/${encodeURIComponent(id)}`, { method: 'DELETE' });

// ---- Profile (Default business profile) ----
export const DEFAULT_PROFILE = {
  businessName: '',
  address: '',
  city: '',
  state: '',
  stateCode: '',
  pincode: '',
  gstin: '',
  pan: '',
  email: '',
  phone: '',
  bankName: '',
  accountNumber: '',
  ifsc: '',
  swift: '',
  upiId: '',
  logo: '',
  logoHeight: 48,
  signature: '',
  signatureHeight: 60,
  stamp: '',
  stampHeight: 70,
  googleClientId: '',
  googleDriveFolder: 'GST Billing Invoices',
  paymentAccounts: [],
  isDefault: true,
};

export const saveProfile = async (profile) => {
  if (isSupabaseConfigured()) {
    profile.isDefault = true;
    return saveBusinessProfile(profile);
  }
  return apiFetch(`${API}/profile`, { method: 'POST', body: JSON.stringify(profile) });
};

export const getProfile = async () => {
  if (isSupabaseConfigured()) {
    const profiles = await getAllProfiles();
    const found = profiles.find((p) => p.isDefault) || profiles[0];
    return found ? { ...DEFAULT_PROFILE, ...found } : { ...DEFAULT_PROFILE };
  }
  const prof = await apiFetch(`${API}/profile`);
  return prof ? { ...DEFAULT_PROFILE, ...prof } : { ...DEFAULT_PROFILE };
};

// ---- Saved Clients ----
export const saveClient = async (client) => {
  if (isSupabaseConfigured()) {
    const id = client.id || `cli_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    client.id = id;
    const row = {
      id,
      name: client.name || 'Unnamed Client',
      gstin: client.gstin || null,
      pan: client.pan || null,
      phone: client.phone || null,
      email: client.email || null,
      address: client.address || null,
      state: client.state || null,
      state_code: client.stateCode || null,
      data: client,
    };
    const { error } = await supabase.from('clients').upsert(row);
    if (error) throw error;
    return client;
  }
  const res = await apiFetch(`${API}/clients`, { method: 'POST', body: JSON.stringify(client) });
  if (res.id) client.id = res.id;
  return client;
};

export const getAllClients = async () => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('clients').select('*').order('name');
    if (error) throw error;
    return (data || []).map((r) => ({ ...r.data, id: r.id, name: r.name, gstin: r.gstin }));
  }
  return apiFetch(`${API}/clients`);
};

export const deleteClient = async (id) => {
  if (isSupabaseConfigured()) {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
    return { ok: true };
  }
  return apiFetch(`${API}/clients/${encodeURIComponent(id)}`, { method: 'DELETE' });
};

// ---- Terms Templates ----
export const getTermsTemplates = async () => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('terms_templates').select('*');
    if (error) throw error;
    return (data || []).map((r) => ({ ...r.data, id: r.id, title: r.title, content: r.content }));
  }
  return apiFetch(`${API}/templates`);
};

export const saveTermsTemplate = async (template) => {
  if (isSupabaseConfigured()) {
    const id = template.id || `tmpl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    template.id = id;
    const row = {
      id,
      title: template.title || 'Terms',
      content: template.content || '',
      data: template,
    };
    const { error } = await supabase.from('terms_templates').upsert(row);
    if (error) throw error;
    return template;
  }
  const res = await apiFetch(`${API}/templates`, { method: 'POST', body: JSON.stringify(template) });
  if (res.id) template.id = res.id;
  return template;
};

export const deleteTermsTemplate = async (id) => {
  if (isSupabaseConfigured()) {
    const { error } = await supabase.from('terms_templates').delete().eq('id', id);
    if (error) throw error;
    return { ok: true };
  }
  return apiFetch(`${API}/templates/${encodeURIComponent(id)}`, { method: 'DELETE' });
};

// ---- Products / Inventory ----
export const getAllProducts = async () => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('products').select('*').order('name');
    if (error) throw error;
    return (data || []).map((r) => ({ ...r.data, id: r.id, name: r.name, stock: r.stock, price: r.price }));
  }
  return apiFetch(`${API}/products`);
};

export const saveProduct = async (product) => {
  if (isSupabaseConfigured()) {
    const id = product.id || `prod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    product.id = id;
    const row = {
      id,
      name: product.name || 'Unnamed Product',
      hsn: product.hsn || null,
      unit: product.unit || 'PCS',
      price: Number(product.price) || 0,
      tax_rate: Number(product.taxRate) || 18,
      stock: Number(product.stock) || 0,
      low_stock_threshold: Number(product.lowStockThreshold) || 5,
      data: product,
    };
    const { error } = await supabase.from('products').upsert(row);
    if (error) throw error;
    return product;
  }
  const res = await apiFetch(`${API}/products`, { method: 'POST', body: JSON.stringify(product) });
  if (res.id) product.id = res.id;
  return product;
};

export const deleteProduct = async (id) => {
  if (isSupabaseConfigured()) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return { ok: true };
  }
  return apiFetch(`${API}/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
};

// ---- Expenses ----
export const getAllExpenses = async () => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('expenses').select('*').order('expense_date', { ascending: false });
    if (error) throw error;
    return (data || []).map((r) => ({ ...r.data, id: r.id }));
  }
  return apiFetch(`${API}/expenses`);
};

export const saveExpense = async (expense) => {
  if (isSupabaseConfigured()) {
    const id = expense.id || `exp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    expense.id = id;
    const row = {
      id,
      category: expense.category || 'General',
      amount: Number(expense.amount) || 0,
      expense_date: expense.date || new Date().toISOString().split('T')[0],
      data: expense,
    };
    const { error } = await supabase.from('expenses').upsert(row);
    if (error) throw error;
    return expense;
  }
  const res = await apiFetch(`${API}/expenses`, { method: 'POST', body: JSON.stringify(expense) });
  if (res.id) expense.id = res.id;
  return expense;
};

export const deleteExpense = async (id) => {
  if (isSupabaseConfigured()) {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
    return { ok: true };
  }
  return apiFetch(`${API}/expenses/${encodeURIComponent(id)}`, { method: 'DELETE' });
};

// ---- Purchases ----
export const getAllPurchases = async () => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('purchases').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((r) => ({ ...r.data, id: r.id }));
  }
  return apiFetch(`${API}/purchases`);
};

export const savePurchase = async (purchase) => {
  if (isSupabaseConfigured()) {
    const id = purchase.id || `pur_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    purchase.id = id;
    const row = {
      id,
      supplier_name: purchase.supplierName || 'Supplier',
      invoice_number: purchase.invoiceNumber || '',
      total_amount: Number(purchase.totalAmount) || 0,
      data: purchase,
    };
    const { error } = await supabase.from('purchases').upsert(row);
    if (error) throw error;
    return purchase;
  }
  const res = await apiFetch(`${API}/purchases`, { method: 'POST', body: JSON.stringify(purchase) });
  if (res.id) purchase.id = res.id;
  return purchase;
};

export const deletePurchase = async (id) => {
  if (isSupabaseConfigured()) {
    const { error } = await supabase.from('purchases').delete().eq('id', id);
    if (error) throw error;
    return { ok: true };
  }
  return apiFetch(`${API}/purchases/${encodeURIComponent(id)}`, { method: 'DELETE' });
};

// ---- Recurring Invoices ----
export const getAllRecurring = async () => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('recurring_invoices').select('*');
    if (error) throw error;
    return (data || []).map((r) => ({ ...r.data, id: r.id }));
  }
  return apiFetch(`${API}/recurring`);
};

export const saveRecurring = async (item) => {
  if (isSupabaseConfigured()) {
    const id = item.id || `rec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    item.id = id;
    const row = {
      id,
      frequency: item.frequency || 'monthly',
      next_run_date: item.nextRunDate || new Date().toISOString().split('T')[0],
      data: item,
    };
    const { error } = await supabase.from('recurring_invoices').upsert(row);
    if (error) throw error;
    return item;
  }
  const res = await apiFetch(`${API}/recurring`, { method: 'POST', body: JSON.stringify(item) });
  if (res.id) item.id = res.id;
  return item;
};

export const generateRecurringNow = async (id) => {
  return apiFetch(`${API}/recurring/${encodeURIComponent(id)}/generate`, { method: 'POST', body: JSON.stringify({}) });
};

export const deleteRecurring = async (id) => {
  if (isSupabaseConfigured()) {
    const { error } = await supabase.from('recurring_invoices').delete().eq('id', id);
    if (error) throw error;
    return { ok: true };
  }
  return apiFetch(`${API}/recurring/${encodeURIComponent(id)}`, { method: 'DELETE' });
};

// ---- Receipts ----
export const getAllReceipts = async () => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('receipts').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((r) => ({ ...r.data, id: r.id }));
  }
  return apiFetch(`${API}/receipts`);
};

export const saveReceipt = async (receipt) => {
  if (isSupabaseConfigured()) {
    const id = receipt.id || `rcpt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    receipt.id = id;
    const row = {
      id,
      receipt_number: receipt.receiptNumber || '',
      amount: Number(receipt.amount) || 0,
      data: receipt,
    };
    const { error } = await supabase.from('receipts').upsert(row);
    if (error) throw error;
    return receipt;
  }
  const res = await apiFetch(`${API}/receipts`, { method: 'POST', body: JSON.stringify(receipt) });
  if (res.id) receipt.id = res.id;
  return receipt;
};

export const markSavedPdfCancelled = (bill, cancelled) => isSupabaseConfigured() ? Promise.resolve({ ok: true }) : apiFetch(`${API}/saved-pdf/cancel-mark`, {
  method: 'POST', body: JSON.stringify({ ...savedPdfNameFor(bill), cancelled }),
});

export const trashSavedPdf = (bill) => isSupabaseConfigured() ? Promise.resolve({ ok: true }) : apiFetch(`${API}/trash-pdf`, {
  method: 'POST', body: JSON.stringify(savedPdfNameFor(bill)),
});

export const deleteReceipt = async (id) => {
  if (isSupabaseConfigured()) {
    const { error } = await supabase.from('receipts').delete().eq('id', id);
    if (error) throw error;
    return { ok: true };
  }
  return apiFetch(`${API}/receipts/${encodeURIComponent(id)}`, { method: 'DELETE' });
};

// ---- Business Profiles (Multi-business) ----
export const getAllProfiles = async () => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at');
    if (error) throw error;
    return (data || []).map((r) => ({ ...r.data, id: r.id }));
  }
  return apiFetch(`${API}/profiles`);
};

export const saveBusinessProfile = async (profile) => {
  if (isSupabaseConfigured()) {
    const id = profile.id || `prof_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    profile.id = id;
    const row = {
      id,
      business_name: profile.businessName || 'My Business',
      gstin: profile.gstin || null,
      pan: profile.pan || null,
      phone: profile.phone || null,
      email: profile.email || null,
      address: profile.address || null,
      city: profile.city || null,
      state: profile.state || null,
      state_code: profile.stateCode || null,
      pincode: profile.pincode || null,
      bank_details: profile.bankDetails || {},
      logo_url: profile.logo || null,
      signature_url: profile.signature || null,
      is_default: Boolean(profile.isDefault),
      data: profile,
    };
    const { error } = await supabase.from('profiles').upsert(row);
    if (error) throw error;
    return profile;
  }
  const res = await apiFetch(`${API}/profiles`, { method: 'POST', body: JSON.stringify(profile) });
  if (res.id) profile.id = res.id;
  return profile;
};

export const deleteBusinessProfile = async (id) => {
  if (isSupabaseConfigured()) {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) throw error;
    return { ok: true };
  }
  return apiFetch(`${API}/profiles/${encodeURIComponent(id)}`, { method: 'DELETE' });
};

// ---- Export / Import ----
const EXPORTABLE_LOCALSTORAGE_KEYS = [
  'gst_customUnits',
  'gst_regionMode',
  'gst_enabledModules',
  'gst_filing_status',
  'gst_printSettings',
  'gst_itrCalcInputs',
  'gst_itrPresumptive',
  'gst_itrAdvanceTax',
  'gst_stockAlertSettings',
  'billenza_invoiceOptions',
  'billenza_theme',
  'billenza_onboarded',
];

const EXPORTABLE_LOCALSTORAGE_PREFIXES = [
  'gst_lastUsedAccountId_',
];

const collectLocalStorage = () => {
  const out = {};
  EXPORTABLE_LOCALSTORAGE_KEYS.forEach(k => {
    try { const v = localStorage.getItem(k); if (v !== null) out[k] = v; } catch { /* sandboxed */ }
  });
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (EXPORTABLE_LOCALSTORAGE_PREFIXES.some(p => k.startsWith(p))) {
        out[k] = localStorage.getItem(k);
      }
    }
  } catch { /* sandboxed */ }
  return out;
};

const isRestorable = (k) => EXPORTABLE_LOCALSTORAGE_KEYS.includes(k)
  || EXPORTABLE_LOCALSTORAGE_PREFIXES.some(p => k.startsWith(p));

const restoreLocalStorage = (map) => {
  if (!map || typeof map !== 'object') return;
  Object.entries(map).forEach(([k, v]) => {
    if (!isRestorable(k)) return;
    try { localStorage.setItem(k, v); } catch { /* ignore */ }
  });
};

export const runUpdateNow = async () => {
  if (isSupabaseConfigured()) return { ok: true, message: 'Cloud version is always up to date.' };
  try {
    const res = await fetch('/api/control-panel/launch-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update' }),
    });
    const data = await res.json();
    if (!data.ok) return { ok: false, error: data.error || data.stderr || 'The update script did not finish.' };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
};

export const exportAllData = async (selection) => {
  if (isSupabaseConfigured()) {
    const [bills, clients, products, expenses, purchases, receipts, profiles] = await Promise.all([
      getAllBills().catch(() => []),
      getAllClients().catch(() => []),
      getAllProducts().catch(() => []),
      getAllExpenses().catch(() => []),
      getAllPurchases().catch(() => []),
      getAllReceipts().catch(() => []),
      getAllProfiles().catch(() => []),
    ]);

    const data = {
      exportedAt: new Date().toISOString(),
      version: '2.0.0-cloud',
      __billenza_backup: true,
      bills, clients, products, expenses, purchases, receipts, profiles,
      localStorage: collectLocalStorage(),
    };
    return JSON.stringify(data, null, 2);
  }

  const [all, version] = await Promise.all([apiFetch(`${API}/export`), Promise.resolve('1.10.80')]);
  const sel = selection || { profile: true, profiles: true, bills: true, clients: true, products: true, expenses: true, purchases: true, recurring: true, receipts: true, termsTemplates: true, meta: true, localStorage: true };

  const data = { exportedAt: new Date().toISOString(), version, __billenza_backup: true };
  if (sel.profile)        data.profile = all.profile;
  if (sel.profiles)       data.profiles = all.profiles;
  if (sel.bills)          data.bills = all.bills;
  if (sel.clients)        data.clients = all.clients;
  if (sel.termsTemplates) data.termsTemplates = all.termsTemplates;
  if (sel.products)       data.products = all.products;
  if (sel.expenses)       data.expenses = all.expenses;
  if (sel.recurring)      data.recurring = all.recurring;
  if (sel.receipts)       data.receipts = all.receipts;
  if (sel.purchases)      data.purchases = all.purchases;
  if (sel.meta)           data.meta = all.meta;
  if (sel.localStorage)   data.localStorage = collectLocalStorage();

  return JSON.stringify(data, null, 2);
};

export const inspectBackup = (jsonString) => {
  let data;
  try { data = JSON.parse(jsonString); }
  catch { throw new Error('Not a valid JSON file'); }
  return {
    valid: !!data && (data.__billenza_backup || data.__freegstbill_backup || data.bills || data.profile),
    exportedAt: data.exportedAt || null,
    version: data.version || null,
    counts: {
      profile: data.profile && Object.keys(data.profile).length > 0 ? 1 : 0,
      profiles: Array.isArray(data.profiles) ? data.profiles.length : 0,
      bills: Array.isArray(data.bills) ? data.bills.length : 0,
      clients: Array.isArray(data.clients) ? data.clients.length : 0,
      termsTemplates: Array.isArray(data.termsTemplates) ? data.termsTemplates.length : 0,
      products: Array.isArray(data.products) ? data.products.length : 0,
      expenses: Array.isArray(data.expenses) ? data.expenses.length : 0,
      purchases: Array.isArray(data.purchases) ? data.purchases.length : 0,
      recurring: Array.isArray(data.recurring) ? data.recurring.length : 0,
      receipts: Array.isArray(data.receipts) ? data.receipts.length : 0,
      meta: data.meta ? Object.keys(data.meta).length : 0,
      localStorage: data.localStorage ? Object.keys(data.localStorage).length : 0,
    },
    raw: data,
  };
};

export const importData = async (jsonString, selection) => {
  const inspected = typeof jsonString === 'string' ? inspectBackup(jsonString) : { raw: jsonString };
  const data = inspected.raw;

  if (isSupabaseConfigured()) {
    if (Array.isArray(data.bills)) {
      for (const bill of data.bills) { await saveBill(bill, { overwrite: true }); }
    }
    if (Array.isArray(data.clients)) {
      for (const c of data.clients) { await saveClient(c); }
    }
    if (Array.isArray(data.products)) {
      for (const p of data.products) { await saveProduct(p); }
    }
    if (data.localStorage) restoreLocalStorage(data.localStorage);
    return { ok: true, imported: true };
  }

  const sel = selection || { profile: true, profiles: true, bills: true, clients: true, products: true, expenses: true, purchases: true, recurring: true, receipts: true, termsTemplates: true, meta: true, localStorage: true };
  const payload = {};
  if (sel.profile && data.profile)               payload.profile = data.profile;
  if (sel.profiles && data.profiles)             payload.profiles = data.profiles;
  if (sel.bills && data.bills)                   payload.bills = data.bills;
  if (sel.clients && data.clients)               payload.clients = data.clients;
  if (sel.termsTemplates && data.termsTemplates) payload.termsTemplates = data.termsTemplates;
  if (sel.products && data.products)             payload.products = data.products;
  if (sel.expenses && data.expenses)             payload.expenses = data.expenses;
  if (sel.recurring && data.recurring)           payload.recurring = data.recurring;
  if (sel.receipts && data.receipts)             payload.receipts = data.receipts;
  if (sel.purchases && data.purchases)           payload.purchases = data.purchases;
  if (sel.meta && data.meta)                     payload.meta = data.meta;

  const result = await apiFetch(`${API}/import`, { method: 'POST', body: JSON.stringify(payload) });
  if (sel.localStorage && data.localStorage) restoreLocalStorage(data.localStorage);
  return result;
};
