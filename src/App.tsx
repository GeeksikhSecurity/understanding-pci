import { useState } from 'react';
import {
  ShieldCheck, X, ChevronRight, ArrowRight, ExternalLink,
  CheckCircle2, CircleDot, Info, XCircle, Code2, Briefcase, Printer,
  type LucideIcon,
} from 'lucide-react';
import {
  matrix, myths, passwordRules, saqGuide, annualChecklist, developerTips,
  processorGuides, whatIsPci, siteMeta,
  OWNER_LABELS, type Owner, type MatrixItem, type MatrixSection, type MythAudience,
} from './data';
import { openPrintableChecklist } from './printChecklist';

type Tab = 'start' | 'matrix' | 'shared' | 'rules';
type OwnerFilter = Owner | 'all';

const ownerStyle: Record<Owner, { dot: string; chip: string; bar: string }> = {
  you:       { dot: 'bg-amber-500',  chip: 'bg-amber-50 text-amber-800 ring-amber-200',   bar: 'bg-amber-500' },
  processor: { dot: 'bg-teal-600',   chip: 'bg-teal-50 text-teal-800 ring-teal-200',       bar: 'bg-teal-600' },
  shared:    { dot: 'bg-violet-500', chip: 'bg-violet-50 text-violet-800 ring-violet-200', bar: 'bg-violet-500' },
};

function OwnerChip({ owner }: { owner: Owner }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${ownerStyle[owner].chip}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${ownerStyle[owner].dot}`} />
      {OWNER_LABELS[owner]}
    </span>
  );
}

function ItemDetail({ item, onClose }: { item: MatrixItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-t-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-5 text-sm leading-relaxed text-slate-600">{item.description}</p>
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <OwnerChip owner={item.owner} />
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {item.ref}
          </span>
        </div>
      </div>
    </div>
  );
}

function MatrixCard({ section, filter, onPick }: {
  section: MatrixSection; filter: OwnerFilter; onPick: (i: MatrixItem) => void;
}) {
  const Icon = section.icon as LucideIcon;
  const items = section.items.filter((i) => filter === 'all' || i.owner === filter);
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 transition hover:shadow-md">
      <div className="mb-1 flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-50 text-teal-700">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-base font-semibold text-slate-900">{section.category}</h3>
      </div>
      <p className="mb-4 text-sm text-slate-500">{section.summary}</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.name}>
            <button
              onClick={() => onPick(item)}
              className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition hover:bg-slate-50"
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${ownerStyle[item.owner].dot}`} />
              <span className="flex-1 text-sm text-slate-700">{item.name}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-400" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>('matrix');
  const [filter, setFilter] = useState<OwnerFilter>('all');
  const [picked, setPicked] = useState<MatrixItem | null>(null);

  const all = matrix.flatMap((s) => s.items);
  const counts = {
    you: all.filter((i) => i.owner === 'you').length,
    processor: all.filter((i) => i.owner === 'processor').length,
    shared: all.filter((i) => i.owner === 'shared').length,
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'start', label: 'Quick Start' },
    { id: 'matrix', label: 'Responsibility Matrix' },
    { id: 'shared', label: 'Shared Responsibility' },
    { id: 'rules', label: 'Myths & Rules' },
  ];

  const filters: { id: OwnerFilter; label: string }[] = [
    { id: 'all', label: 'Everyone' },
    { id: 'you', label: 'You' },
    { id: 'processor', label: 'Processor' },
    { id: 'shared', label: 'Shared' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {picked && <ItemDetail item={picked} onClose={() => setPicked(null)} />}

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-600 text-white">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                {siteMeta.title}
              </h1>
              <p className="text-sm text-slate-500">
                {siteMeta.tagline} · {siteMeta.version}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero thesis */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-700">
            What is PCI?
          </p>
          <h2 className="max-w-3xl text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            Accepting credit cards means shared responsibility.
            <span className="text-slate-400"> Stripe and PayPal help — they don&apos;t hand you compliance.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            PCI DSS is the security standard for any business that takes payment cards. Your processor
            secures the part that touches card numbers. You still own your site, staff, passwords,
            and the yearly paperwork. Here is exactly where the line sits.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => setTab('start')}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700"
            >
              Quick start checklist <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTab('shared')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50"
            >
              See the split
            </button>
            <button
              onClick={() => setTab('rules')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50"
            >
              Common myths
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Sections">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap border-b-2 px-3 py-3.5 text-sm font-medium transition ${
                  tab === t.id
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {tab === 'start' && <QuickStartView onGoRules={() => setTab('rules')} />}

        {tab === 'matrix' && (
          <>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm font-medium text-slate-500">Show duties for:</span>
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    filter === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {matrix.map((s) => (
                <MatrixCard key={s.category} section={s} filter={filter} onPick={setPicked} />
              ))}
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-slate-400">
              <Info className="h-3.5 w-3.5" /> Tap any item for the plain-language explanation and PCI DSS reference.
            </p>
          </>
        )}

        {tab === 'shared' && <SharedView counts={counts} total={all.length} />}
        {tab === 'rules' && <RulesView />}
      </main>

      <footer className="border-t border-slate-200 bg-white no-print">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="mb-4 text-sm text-slate-600">
            A free resource from{' '}
            {siteMeta.partners.map((p, i) => (
              <span key={p.url}>
                {i > 0 && ' · '}
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="font-medium text-teal-700 hover:text-teal-800">
                  {p.name}
                </a>
              </span>
            ))}
          </p>
          <p className="text-xs leading-relaxed text-slate-400">
            Awareness resource only — not a substitute for a Qualified Security Assessor or your
            processor&apos;s Attestation of Compliance. References point to {siteMeta.version}.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Non-compliance can lead to fines from card brands, increased processing fees, or loss of
            the ability to accept cards — even for small merchants. Your acquirer or processor sets
            the exact validation deadline.
          </p>
        </div>
      </footer>
    </div>
  );
}

function AudienceBadge({ audience }: { audience?: MythAudience }) {
  if (!audience || audience === 'both') return null;
  const isDev = audience === 'developer';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
      isDev ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'
    }`}>
      {isDev ? <Code2 className="h-3 w-3" /> : <Briefcase className="h-3 w-3" />}
      {isDev ? 'Developers' : 'Business owners'}
    </span>
  );
}

function QuickStartView({ onGoRules }: { onGoRules: () => void }) {
  return (
    <div className="space-y-10">
      {/* What is PCI */}
      <section className="rounded-2xl border border-teal-200 bg-teal-50/50 p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">{whatIsPci.heading}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">{whatIsPci.body}</p>
        <ul className="mt-4 space-y-2">
          {whatIsPci.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
              {b}
            </li>
          ))}
        </ul>
      </section>

      {/* Who this is for */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">Who needs to read this?</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 font-medium text-slate-900">
              <Briefcase className="h-4 w-4 text-amber-600" /> Business owners &amp; ops
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              You sign the SAQ, collect processor proof, train staff, and own the relationship with
              your bank — even if a developer built the checkout.
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 font-medium text-slate-900">
              <Code2 className="h-4 w-4 text-sky-600" /> Developers &amp; IT
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              You choose the integration pattern (redirect vs embed), which determines SAQ type,
              and you must not log card data or weaken checkout security.
            </p>
          </div>
        </div>
      </section>

      {/* SAQ guide */}
      <section>
        <h3 className="mb-1 text-lg font-semibold text-slate-900">Which SAQ applies?</h3>
        <p className="mb-5 text-sm text-slate-500">
          Most small businesses using Stripe, PayPal, or Donorbox fall into SAQ A or SAQ A-EP — not
          because of the processor name, but because of how checkout is integrated.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {saqGuide.map((s) => (
            <div key={s.id} className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <span className="inline-flex w-fit rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
                {s.name}
              </span>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{s.when}</p>
              <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-400">
                <span className="font-medium text-slate-500">Examples: </span>{s.examples}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          When in doubt, confirm with your processor or acquirer. Using JavaScript checkout on your
          domain almost always means SAQ A-EP, not SAQ A.
        </p>
      </section>

      {/* Processor-specific guides */}
      <section>
        <h3 className="mb-1 text-lg font-semibold text-slate-900">Processor PCI guides</h3>
        <p className="mb-5 text-sm text-slate-500">
          Official documentation for validating compliance with Stripe and PayPal — including which SAQ
          typically applies to each integration pattern.
        </p>
        <div className="grid gap-5 lg:grid-cols-2">
          {processorGuides.map((pg) => (
            <div key={pg.id} className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h4 className="text-base font-semibold text-slate-900">{pg.name}</h4>
                <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
                  {pg.typicalSaq}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{pg.summary}</p>
              <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4">
                {pg.integrations.map((int) => (
                  <li key={int.pattern} className="flex flex-wrap gap-x-2 text-xs text-slate-600">
                    <span className="font-medium text-slate-700">{int.pattern}</span>
                    <span className="text-slate-400">→</span>
                    <span>{int.saq}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-4 flex flex-col gap-2">
                {pg.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800"
                    >
                      {link.label} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Annual checklist */}
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Annual compliance checklist</h3>
            <p className="mt-1 text-sm text-slate-500">
              PCI validation is yearly. Work through this list before your renewal date.
            </p>
          </div>
          <button
            onClick={openPrintableChecklist}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            <Printer className="h-4 w-4" /> Print / save as PDF
          </button>
        </div>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
          <ul className="divide-y divide-slate-100">
            {annualChecklist.map((item) => {
              const Icon = item.icon as LucideIcon;
              return (
                <li key={item.task} className="flex items-start gap-4 p-4 sm:p-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-900">{item.task}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                        {item.owner}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.detail}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Use the print button for a pen-and-paper checklist with organization fields and checkboxes.
        </p>
      </section>

      {/* Merchant levels callout */}
      <div className="rounded-2xl border border-slate-200 bg-slate-100/60 p-5 sm:p-6">
        <h4 className="font-semibold text-slate-900">Merchant levels — why “small” still counts</h4>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Card brands classify merchants by annual transaction volume. Levels 2–4 (under 6 million
          transactions) typically self-validate with an SAQ. Level 1 requires a Report on Compliance
          from a QSA. There is no exemption for nonprofits, startups, or low volume — only the
          validation method changes.
        </p>
        <button
          onClick={onGoRules}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          See common myths that trip up small merchants <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function SharedView({ counts, total }: { counts: Record<Owner, number>; total: number }) {
  const rows: { owner: Owner; blurb: string }[] = [
    { owner: 'you', blurb: 'Your site, staff, passwords, policies, and the annual self-assessment.' },
    { owner: 'processor', blurb: 'The card environment: gateway, storage, encryption keys, fraud detection.' },
    { owner: 'shared', blurb: 'Handoffs where both sides must act — TLS, MFA, alerts, incident recovery.' },
  ];
  return (
    <div className="space-y-8">
      {/* Split bar */}
      <div>
        <h3 className="mb-1 text-lg font-semibold text-slate-900">How the duties divide</h3>
        <p className="mb-5 text-sm text-slate-500">{total} core duties across the relationship.</p>
        <div className="flex h-3 w-full overflow-hidden rounded-full ring-1 ring-inset ring-slate-200">
          <div className={ownerStyle.you.bar} style={{ width: `${(counts.you / total) * 100}%` }} />
          <div className={ownerStyle.processor.bar} style={{ width: `${(counts.processor / total) * 100}%` }} />
          <div className={ownerStyle.shared.bar} style={{ width: `${(counts.shared / total) * 100}%` }} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {rows.map((r) => (
          <div key={r.owner} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
            <div className="flex items-baseline justify-between">
              <OwnerChip owner={r.owner} />
              <span className="text-2xl font-semibold text-slate-900">{counts[r.owner]}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{r.blurb}</p>
          </div>
        ))}
      </div>
      {/* The trap */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <CircleDot className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <h4 className="font-semibold text-amber-900">The outsourcing trap</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-amber-800">
              The amber slice never goes away. Even with a fully hosted processor, you still
              complete a Self-Assessment Questionnaire each year, collect your providers’
              proof of compliance, protect card data during refunds and chargebacks, and
              keep your own systems patched. Outsourcing shrinks the work — it does not
              erase your name from it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RulesView() {
  const businessMyths = myths.filter((m) => m.audience !== 'developer');
  const developerMyths = myths.filter((m) => m.audience === 'developer');

  return (
    <div className="space-y-12">
      {/* Myths — business */}
      <section>
        <h3 className="mb-1 text-lg font-semibold text-slate-900">PCI myths for business owners</h3>
        <p className="mb-5 text-sm text-slate-500">The misunderstandings that get small businesses fined.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {businessMyths.map((m) => (
            <MythCard key={m.n} myth={m} />
          ))}
        </div>
      </section>

      {/* Myths — developers */}
      <section>
        <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Code2 className="h-5 w-5 text-sky-600" /> PCI myths for developers
        </h3>
        <p className="mb-5 text-sm text-slate-500">
          Common assumptions in code reviews and sprint planning — corrected.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {developerMyths.map((m) => (
            <MythCard key={`dev-${m.n}`} myth={m} />
          ))}
        </div>
      </section>

      {/* Developer do / don't */}
      <section>
        <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Code2 className="h-5 w-5 text-sky-600" /> Developer do&apos;s &amp; don&apos;ts
        </h3>
        <p className="mb-5 text-sm text-slate-500">
          Practical integration rules when you accept cards through a hosted processor.
        </p>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
          <ul className="divide-y divide-slate-100">
            {developerTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 p-4 sm:p-5">
                {tip.do ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-relaxed text-slate-700">{tip.text}</p>
                  {tip.ref && (
                    <span className="mt-1.5 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                      {tip.ref}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Password rules */}
      <section>
        <h3 className="mb-1 text-lg font-semibold text-slate-900">Password &amp; access rules</h3>
        <p className="mb-5 text-sm text-slate-500">
          What v4.0.1 actually requires for the accounts you control.
        </p>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
          <ul className="divide-y divide-slate-100">
            {passwordRules.map((r) => {
              const Icon = r.icon as LucideIcon;
              return (
                <li key={r.label} className="flex items-start gap-4 p-4 sm:p-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-900">{r.label}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                        {r.ref}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{r.detail}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <a
          href="https://www.pcisecuritystandards.org/merchants/process/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          Official PCI SSC merchant requirements <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </section>
    </div>
  );
}

function MythCard({ myth: m }: { myth: typeof myths[number] }) {
  return (
    <div
      className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ${
        m.highlight ? 'ring-2 ring-amber-300' : 'ring-slate-200/70'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
          {m.n}
        </span>
        {m.highlight && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
            Most common
          </span>
        )}
        <AudienceBadge audience={m.audience} />
      </div>
      <p className="mt-3 text-sm font-medium text-slate-400 line-through decoration-slate-300">
        &ldquo;{m.myth}&rdquo;
      </p>
      <div className="mt-2 flex items-start gap-2">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
        <p className="text-sm leading-relaxed text-slate-700">{m.truth}</p>
      </div>
    </div>
  );
}
