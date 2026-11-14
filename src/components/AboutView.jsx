import {
  Building2,
  CheckCircle2,
  Code2,
  Github,
  ExternalLink,
  FileText,
  BarChart3,
  QrCode,
  Package,
  Users,
  Receipt,
  Layers,
  Database,
  Lock,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';

export default function AboutView() {
  return (
    <div className="dashboard-container" style={{ maxWidth: 860, margin: '0 auto', padding: '1.5rem 1rem' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Building2 size={26} color="var(--primary)" /> About Billenza
          </h1>
          <p className="page-subtitle">Precision GST Invoicing &amp; Compliance SaaS Engine</p>
        </div>
      </div>

      {/* Billenza SaaS Overview Card */}
      <div className="glass-panel p-6 mb-6" style={{ borderRadius: 12, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Billenza Cloud</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Edition 2.0 (SaaS)</span>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.35rem 0.85rem', borderRadius: 999,
            background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a',
            fontSize: '0.82rem', fontWeight: 600, border: '1px solid rgba(34, 197, 94, 0.25)'
          }}>
            <CheckCircle2 size={15} /> Active Cloud Workspace
          </span>
        </div>

        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
          Billenza is a full-featured GST billing, invoicing, and tax compliance platform designed for Indian businesses,
          freelancers, and enterprises. Equipped with automated CGST/SGST/IGST calculation, GSTR-1, GSTR-3B, and GSTR-2B
          reconciliation, e-Way bill exports, multi-currency invoicing, and real-time cloud data synchronisation.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '1.25rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Workspace Sync</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>Real-Time Cloud Sync</div>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Data Security</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>Cloud Encrypted</div>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Compliance Engine</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>India GST &amp; Multi-Currency</div>
          </div>
        </div>
      </div>

      {/* Core Platform Capabilities */}
      <div className="glass-panel p-6 mb-6" style={{ borderRadius: 12, border: '1px solid var(--border)' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.35rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
            <Sparkles size={18} color="var(--primary)" /> Core Platform Capabilities
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Engineered specifically for Indian SMBs, accountants, freelancers, and growing enterprises.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.9rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={17} />
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Smart GST Invoicing</div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Create Tax Invoices, Bills of Supply, Proformas, Quotations, and Credit/Debit Notes. Automatic CGST/SGST/IGST tax splits based on Place of Supply (POS) and Reverse Charge (RCM).
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={17} />
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>GST Filing (GSTR-1, 3B, 2B)</div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              One-click GSTR-1 JSON export ready for the official GST Portal (B2B, B2CL, B2CS, CDNR, EXP, HSN). Instant GSTR-3B tax summaries and GSTR-2B purchase reconciliation.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QrCode size={17} />
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Dynamic UPI QR Payments</div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Embeds automated BharatQR / UPI dynamic payment codes on bills with exact invoice amounts. Customers scan to pay directly into your bank account with zero payment gateway fees.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={17} />
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Inventory &amp; Barcode Suite</div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Track real-time stock levels, low-quantity alerts, batch numbers, and purchase vs. selling margins. Search across 50,000+ HSN/SAC codes with automated tax rate mapping.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={17} />
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Client &amp; Vendor Ledger</div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Unified debtor and creditor records, auto-validation of 15-digit GSTINs, payment terms, outstanding balances, and direct 1-click invoice sharing via WhatsApp and email.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Receipt size={17} />
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Purchase Bills &amp; Smart OCR</div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Capture vendor invoices with intelligent OCR document scanning. Reconcile Input Tax Credit (ITC) eligibility, log expenses by category, and track company outflows effortlessly.
            </p>
          </div>
        </div>
      </div>

      {/* End-to-End Business Lifecycle */}
      <div className="glass-panel p-6 mb-6" style={{ borderRadius: 12, border: '1px solid var(--border)' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.35rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
            <Layers size={18} color="var(--primary)" /> End-to-End Business Lifecycle
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            From initial business configuration to GST portal tax return filing in four streamlined steps.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 01</span>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', margin: '0.35rem 0 0.35rem 0' }}>Profile Setup</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
              Configure business legal name, GSTIN, PAN, bank details, brand logo, and digital signature once.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 02</span>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', margin: '0.35rem 0 0.35rem 0' }}>Generate Invoices</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
              Add items with instant HSN lookup, auto-calculate CGST/SGST/IGST, and apply custom discounts.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 03</span>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', margin: '0.35rem 0 0.35rem 0' }}>Share &amp; Collect</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
              Deliver PDF bills directly via WhatsApp or email with dynamic UPI QR codes for zero-fee payment settlements.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 04</span>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', margin: '0.35rem 0 0.35rem 0' }}>Reconcile &amp; File</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
              Export GSTN-ready GSTR-1 JSON files, verify ITC in GSTR-2B, and review live P&amp;L reports.
            </p>
          </div>
        </div>
      </div>

      {/* Security, Privacy & Data Sovereignty */}
      <div className="glass-panel p-6 mb-6" style={{ borderRadius: 12, border: '1px solid var(--border)' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.35rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
            <ShieldCheck size={18} color="var(--primary)" /> Security, Privacy &amp; Data Sovereignty
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Your financial records are sensitive business assets. Billenza is built on strict data autonomy principles.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.9rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: 'var(--primary)' }}>
              <Database size={16} />
              <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>Zero Vendor Lock-In</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              You own 100% of your business data. Perform complete JSON or Excel backups anytime with full schema transparency and restore anytime.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: 'var(--primary)' }}>
              <Zap size={16} />
              <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>Offline-First Continuity</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Network drops never interrupt bill generation. Billenza operates seamlessly offline and syncs transactions safely once connection returns.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: 'var(--primary)' }}>
              <Lock size={16} />
              <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>Multi-Entity Isolation</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Distinct business profiles maintain strict multi-tenant data separation for multiple GSTINs, bank accounts, and independent bookkeeping.
            </p>
          </div>
        </div>
      </div>

      {/* Open Source Acknowledgments & MIT License Credits */}
      <div className="glass-panel p-6 mb-6" style={{ borderRadius: 12, border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
          <Code2 size={18} color="var(--primary)" /> Open Source Acknowledgments &amp; Credits
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Billenza is powered by and incorporates code from <strong>Free GST Billing Software</strong>, an open-source project
          authored and maintained by <strong>IamRamgarhia</strong> along with <strong>DiceCodes</strong> and community contributors.
          We gratefully acknowledge and give full credit to the repository authors for their foundational work.
        </p>

        {/* GitHub Repository Credit Card */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 10,
          border: '1px solid var(--border)',
          padding: '1.1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: 'rgba(var(--primary-rgb), 0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <Github size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                Free GST Billing Software
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Original Repository by <a href="https://github.com/IamRamgarhia" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>IamRamgarhia</a> &bull; Created by DiceCodes
              </div>
            </div>
          </div>

          <a
            href="https://github.com/IamRamgarhia/Free-GST-Billing-Software"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.82rem',
              padding: '0.45rem 0.85rem',
              textDecoration: 'none'
            }}
          >
            <Github size={15} /> View on GitHub <ExternalLink size={13} style={{ opacity: 0.7 }} />
          </a>
        </div>

        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 8,
          border: '1px solid var(--border)',
          padding: '1rem 1.25rem',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
          color: 'var(--text-muted)',
          lineHeight: 1.55,
          maxHeight: 240,
          overflowY: 'auto',
          whiteSpace: 'pre-wrap'
        }}>
{`MIT License

Copyright (c) 2026 DiceCodes (Contact@dicecodes.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
        </div>
      </div>
    </div>
  );
}
