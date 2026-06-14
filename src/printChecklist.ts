import { annualChecklist, siteMeta } from './data';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function openPrintableChecklist(): void {
  const year = new Date().getFullYear();
  const items = annualChecklist
    .map(
      (item, i) => `
      <tr>
        <td class="check">&#9744;</td>
        <td><strong>${i + 1}. ${escapeHtml(item.task)}</strong><br>
        <span class="detail">${escapeHtml(item.detail)}</span><br>
        <span class="owner">Owner: ${escapeHtml(item.owner)}</span></td>
      </tr>`,
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>PCI Annual Checklist ${year} — ${escapeHtml(siteMeta.title)}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: Georgia, "Times New Roman", serif; color: #1e293b; max-width: 720px; margin: 0 auto; padding: 32px 24px; line-height: 1.5; font-size: 11pt; }
    h1 { font-size: 18pt; margin: 0 0 4px; font-family: system-ui, sans-serif; }
    .subtitle { color: #64748b; font-size: 10pt; margin-bottom: 20px; font-family: system-ui, sans-serif; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; margin-bottom: 24px; font-family: system-ui, sans-serif; font-size: 10pt; }
    .meta label { display: block; color: #64748b; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
    .meta .line { border-bottom: 1px solid #cbd5e1; min-height: 22px; }
    .processors { margin-bottom: 24px; font-family: system-ui, sans-serif; font-size: 10pt; }
    .processors span { margin-right: 16px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    td { padding: 10px 0; vertical-align: top; border-bottom: 1px solid #e2e8f0; }
    td.check { width: 28px; font-size: 14pt; color: #0d9488; padding-right: 8px; }
    .detail { color: #475569; font-size: 10pt; }
    .owner { color: #94a3b8; font-size: 9pt; font-style: italic; }
    .notes { margin-bottom: 24px; }
    .notes .box { border: 1px solid #cbd5e1; min-height: 80px; margin-top: 6px; }
    .footer { font-size: 8pt; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; font-family: system-ui, sans-serif; }
    .footer a { color: #0d9488; }
    @media print {
      body { padding: 0; }
      @page { margin: 0.75in; }
    }
  </style>
</head>
<body>
  <h1>PCI Annual Compliance Checklist</h1>
  <p class="subtitle">${escapeHtml(siteMeta.title)} · PCI DSS v4.0.1 · ${year}</p>

  <div class="meta">
    <div><label>Organization</label><div class="line"></div></div>
    <div><label>Renewal due date</label><div class="line"></div></div>
    <div><label>Completed by</label><div class="line"></div></div>
    <div><label>SAQ type (A / A-EP / other)</label><div class="line"></div></div>
  </div>

  <div class="processors">
    <strong>Payment processor:</strong>
    <span>&#9744; Stripe</span>
    <span>&#9744; PayPal</span>
    <span>&#9744; Other: _______________</span>
  </div>

  <table>${items}</table>

  <div class="notes">
    <strong>Notes / action items</strong>
    <div class="box"></div>
  </div>

  <div class="footer">
    Awareness checklist only — not a substitute for a Qualified Security Assessor or your processor's Attestation of Compliance.<br>
    Full guide: <a href="${escapeHtml(siteMeta.url)}">${escapeHtml(siteMeta.url)}</a>
    · ${siteMeta.partners.map((p) => `<a href="${escapeHtml(p.url)}">${escapeHtml(p.name)}</a>`).join(' · ')}
  </div>
</body>
</html>`;

  const win = window.open('', '_blank', 'noopener,noreferrer');
  if (!win) {
    alert('Please allow pop-ups to open the printable checklist.');
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  win.onload = () => win.print();
}
