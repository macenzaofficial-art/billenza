import { Building2, CheckCircle2, Code2, Github, ExternalLink } from 'lucide-react';

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
