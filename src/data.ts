import {
  Network, Database, Lock, Server, Shield, FileWarning, Bell,
  CreditCard, KeyRound, ScrollText, RefreshCw, Bug, HardDrive,
  ClipboardCheck, Calendar, type LucideIcon,
} from 'lucide-react';

export type Owner = 'you' | 'processor' | 'shared';

export interface MatrixItem {
  name: string;
  owner: Owner;
  ref: string; // PCI DSS v4.0.1 requirement reference
  description: string;
}

export interface MatrixSection {
  category: string;
  icon: LucideIcon;
  summary: string;
  items: MatrixItem[];
}

// ── Responsibility matrix ────────────────────────────────────────────────
// Framed for a small org (e.g. PDL) using a hosted processor (Stripe/PayPal/
// Donorbox). "you" = the business/merchant, "processor" = the payment provider,
// "shared" = both parties carry duties. References point to PCI DSS v4.0.1.
export const matrix: MatrixSection[] = [
  {
    category: 'Network Security',
    icon: Network,
    summary: 'Firewalls, segmentation, and keeping your site off the attack surface.',
    items: [
      { name: 'Cardholder data environment (CDE) firewalls', owner: 'processor', ref: 'Req 1',
        description: 'The processor runs the firewalled environment that actually touches card numbers.' },
      { name: 'Your own server / site hardening', owner: 'you', ref: 'Req 1, 2',
        description: 'Your web server, CMS, and admin panels still need secure configs even if cards never land there.' },
      { name: 'TLS on every page that collects or redirects payment', owner: 'shared', ref: 'Req 4.2',
        description: 'The processor secures its iframe/redirect; you must serve your whole site over HTTPS so the handoff is trusted.' },
    ],
  },
  {
    category: 'Cardholder Data',
    icon: Database,
    summary: 'Where card numbers live — and the goal of making sure that is "not on your systems."',
    items: [
      { name: 'Storage of full card numbers (PAN)', owner: 'processor', ref: 'Req 3',
        description: 'Use hosted fields, redirects, or tokenization so the PAN never touches your servers.' },
      { name: 'Never storing sensitive authentication data (CVV)', owner: 'shared', ref: 'Req 3.3',
        description: 'The processor must not store CVV after authorization; you must never log or capture it in forms.' },
      { name: 'Tokenization for repeat / recurring donations', owner: 'processor', ref: 'Req 3.4',
        description: 'Saved-card and recurring billing run on processor tokens, not stored card data on your side.' },
    ],
  },
  {
    category: 'Access Control',
    icon: Lock,
    summary: 'Who can log in, how strong their credentials are, and least privilege.',
    items: [
      { name: 'Strong account passwords (12-char minimum)', owner: 'you', ref: 'Req 8.3.6',
        description: 'User passwords must be at least 12 characters (8 only if a system truly cannot support 12), mixing letters and numbers.' },
      { name: 'Admin / privileged account protection', owner: 'you', ref: 'Req 8.3, 8.4',
        description: 'Administrative access needs strong unique credentials plus multi-factor authentication.' },
      { name: 'MFA into the payment provider dashboard', owner: 'shared', ref: 'Req 8.4, 8.5',
        description: 'The processor offers MFA; you must turn it on for every admin who logs into the dashboard.' },
      { name: 'Least-privilege roles for staff', owner: 'you', ref: 'Req 7',
        description: 'Give each person only the access their job needs — no shared logins.' },
    ],
  },
  {
    category: 'Payment Infrastructure',
    icon: Server,
    summary: 'The gateway, tokens, and encryption the processor operates for you.',
    items: [
      { name: 'Payment gateway uptime & security', owner: 'processor', ref: 'Req 1–6',
        description: 'The processor builds, patches, and monitors the gateway handling live transactions.' },
      { name: 'Encryption key management', owner: 'processor', ref: 'Req 3.5–3.7',
        description: 'Keys protecting card data are generated, rotated, and stored by the processor.' },
      { name: 'Correct embed / integration on your site', owner: 'you', ref: 'Req 6.4.3',
        description: 'Use the provider’s official embed code; do not modify it to route card data through your own forms.' },
      { name: 'Payment page script integrity', owner: 'shared', ref: 'Req 6.4.3, 11.6.1',
        description: 'Monitor scripts on payment pages for tampering — a shared duty under v4.0.1’s new e-commerce rules.' },
    ],
  },
  {
    category: 'Monitoring & Logging',
    icon: Shield,
    summary: 'Detecting fraud and intrusions, and keeping the audit trail.',
    items: [
      { name: 'Fraud detection on transactions', owner: 'processor', ref: 'Req 10, 11',
        description: 'The processor scores transactions and flags fraud at the network level.' },
      { name: 'Logging admin access to your site', owner: 'you', ref: 'Req 10.2',
        description: 'Keep logs of who logged into your CMS / hosting and when.' },
      { name: 'Reviewing alerts you receive', owner: 'shared', ref: 'Req 10.4',
        description: 'The processor sends alerts; someone on your side has to actually read and act on them.' },
      { name: 'Patching your CMS, plugins, and dependencies', owner: 'you', ref: 'Req 6.3',
        description: 'Outdated WordPress plugins, npm packages, or server software are a common breach path — even when cards never touch your server.' },
    ],
  },
  {
    category: 'Systems & Malware',
    icon: Bug,
    summary: 'Keeping workstations and servers clean — often overlooked when payments are outsourced.',
    items: [
      { name: 'Anti-malware on systems that touch card data', owner: 'you', ref: 'Req 5',
        description: 'If staff enter card numbers over the phone or in a portal, those workstations need current anti-malware protection.' },
      { name: 'Secure development & dependency hygiene', owner: 'you', ref: 'Req 6.2, 6.3',
        description: 'Developers must not log card data, must use official SDKs, and must keep libraries patched — especially on checkout pages.' },
    ],
  },
  {
    category: 'Policy & Governance',
    icon: FileWarning,
    summary: 'The paperwork PCI requires — easy to forget when you outsource.',
    items: [
      { name: 'Annual SAQ (Self-Assessment Questionnaire)', owner: 'you', ref: 'SAQ A / A-EP',
        description: 'Even with a hosted processor you must complete the right SAQ each year. Outsourcing does not remove this.' },
      { name: 'Requesting processor’s proof of compliance (AOC)', owner: 'you', ref: 'Req 12.8',
        description: 'Collect each provider’s Attestation of Compliance annually and keep it on file.' },
      { name: 'Cardholder-data handling policy', owner: 'you', ref: 'Req 12.1',
        description: 'Document how staff handle card data during refunds, chargebacks, and phone orders.' },
      { name: 'Incident response plan', owner: 'shared', ref: 'Req 12.10',
        description: 'The processor handles breaches in its environment; you need your own plan for your systems and customers.' },
    ],
  },
  {
    category: 'Incident Response',
    icon: Bell,
    summary: 'What happens when something goes wrong, and who tells the customer.',
    items: [
      { name: 'Breach handling inside the payment system', owner: 'processor', ref: 'Req 12.10',
        description: 'The processor detects and contains incidents within the card environment it runs.' },
      { name: 'Notifying your customers / donors', owner: 'you', ref: 'Req 12.10.1',
        description: 'If your site is compromised, the obligation to notify the people affected is yours.' },
      { name: 'Coordinated recovery', owner: 'shared', ref: 'Req 12.10',
        description: 'Recovery after a real incident needs both parties working the same timeline.' },
    ],
  },
];

// ── Myths ─────────────────────────────────────────────────────────────────
export type MythAudience = 'business' | 'developer' | 'both';

export interface Myth {
  n: number;
  myth: string;
  truth: string;
  highlight?: boolean;
  audience?: MythAudience;
}

export const myths: Myth[] = [
  { n: 1, audience: 'business', myth: 'One vendor and one product will make us compliant.',
    truth: 'No single product covers PCI DSS. Compliance is a mix of the right technology, processes, and people — and most of the people are yours.' },
  { n: 2, highlight: true, audience: 'both', myth: 'Outsourcing card processing makes us compliant.',
    truth: 'Outsourcing simplifies processing but does not hand you automatic compliance. You still own policies and procedures for transactions, refunds, and chargebacks; you must protect card data whenever you receive it; you must confirm your providers’ apps and terminals meet PCI standards and store no sensitive data; and you should request proof of compliance from providers every year.' },
  { n: 3, audience: 'business', myth: 'PCI compliance is an IT project.',
    truth: 'It touches legal, HR, finance, and frontline staff. Treating it as IT-only leaves the human and policy gaps wide open.' },
  { n: 4, audience: 'both', myth: 'PCI will make us secure.',
    truth: 'PCI is a baseline, not a finish line. It reduces risk but does not guarantee you won’t be breached — security is continuous.' },
  { n: 5, audience: 'business', myth: 'PCI is unreasonable; it requires too much.',
    truth: 'Most requirements are basic security hygiene you should be doing anyway: patching, strong passwords, least privilege, and logging.' },
  { n: 6, audience: 'business', myth: 'We don’t take enough cards to need PCI.',
    truth: 'PCI applies to any business that accepts payment cards — there is no volume floor. Your transaction count only sets which SAQ you use and how you validate it.' },
  { n: 7, audience: 'business', myth: 'Our SSL certificate means we’re PCI compliant.',
    truth: 'HTTPS protects data in transit — one requirement among dozens. A padlock in the browser is not a compliance certificate.' },
  { n: 8, audience: 'developer', myth: 'We don’t store cards, so PCI doesn’t apply to us.',
    truth: 'Not storing PAN shrinks scope but does not eliminate it. Your site, admin accounts, checkout scripts, logs, and policies still fall under PCI when you accept cards.' },
  { n: 9, audience: 'developer', myth: 'Stripe.js / hosted checkout = zero PCI work for developers.',
    truth: 'Hosted fields and redirects move the hardest technical controls to the processor, but developers still must use official integrations, avoid logging card data, monitor script integrity (Req 6.4.3), and the business still completes an SAQ annually.' },
  { n: 10, audience: 'developer', myth: 'It’s fine to log payment API responses for debugging.',
    truth: 'Never log full card numbers, CVV, or magnetic-stripe data — even temporarily. Mask or exclude sensitive fields in dev, staging, and production logs.' },
  { n: 11, audience: 'both', myth: 'PCI is only for big companies (Level 1 merchants).',
    truth: 'Every merchant that accepts cards must comply. Level 1 (6M+ transactions/yr) needs a QSA audit; most small businesses validate with a shorter SAQ self-assessment.' },
  { n: 12, audience: 'developer', myth: 'Our WooCommerce / Shopify plugin handles all of PCI.',
    truth: 'Plugins configure the payment flow — they do not write your policies, rotate your admin passwords, or file your SAQ. Plugin choice affects SAQ type (A vs A-EP), not whether you comply.' },
];

// ── SAQ quick guide ───────────────────────────────────────────────────────
export interface SaqOption {
  id: string;
  name: string;
  when: string;
  examples: string;
}

export const saqGuide: SaqOption[] = [
  { id: 'A', name: 'SAQ A',
    when: 'Card data never touches your website or systems — fully hosted redirect or iframe with no e-commerce scripts on your pages.',
    examples: 'PayPal redirect checkout, Donorbox embed where all card entry is on their domain.' },
  { id: 'A-EP', name: 'SAQ A-EP',
    when: 'Your site loads payment JavaScript or embeds checkout on your domain, but card data still goes directly to the processor.',
    examples: 'Stripe.js / Elements, PayPal JS SDK, Square Web Payments on your checkout page.' },
  { id: 'other', name: 'Other SAQs (B, C, D)',
    when: 'You store, process, or transmit card data on your own systems — rare for small businesses using modern hosted processors.',
    examples: 'Custom payment vault, MOTO-only call center with local storage, on-premise POS without P2PE.' },
];

// ── Annual checklist ──────────────────────────────────────────────────────
export interface ChecklistItem {
  icon: LucideIcon;
  task: string;
  detail: string;
  owner: string;
}

export const annualChecklist: ChecklistItem[] = [
  { icon: ClipboardCheck, task: 'Complete the right SAQ',
    detail: 'Pick SAQ A or A-EP based on how checkout is integrated — not on which processor you use.',
    owner: 'Business owner / compliance lead' },
  { icon: FileWarning, task: 'File or retain your Attestation of Compliance (AOC)',
    detail: 'Your bank or processor may require a signed AOC each year. Keep a dated copy even if nobody asks.',
    owner: 'Business owner' },
  { icon: HardDrive, task: 'Collect processor AOCs',
    detail: 'Request current Attestations of Compliance from Stripe, PayPal, Donorbox, or any provider in scope.',
    owner: 'Business owner / finance' },
  { icon: Shield, task: 'Review access & MFA',
    detail: 'Confirm every admin on your site, hosting, and payment dashboard has unique credentials and MFA enabled.',
    owner: 'IT / developer' },
  { icon: Bug, task: 'Patch CMS, plugins, and dependencies',
    detail: 'Update WordPress, Shopify apps, npm packages, and server OS before your SAQ — unpatched software is a common finding.',
    owner: 'Developer / IT' },
  { icon: ScrollText, task: 'Update policies & train staff',
    detail: 'Refresh the cardholder-data handling policy; remind staff how to handle phone orders, refunds, and chargebacks.',
    owner: 'Business owner / HR' },
  { icon: Calendar, task: 'Set a recurring calendar reminder',
    detail: 'PCI validation is annual. Mark the month your processor or acquirer expects renewal so it does not slip.',
    owner: 'Business owner' },
];

// ── Developer do / don’t ──────────────────────────────────────────────────
export interface DevTip {
  do: boolean;
  text: string;
  ref?: string;
}

export const developerTips: DevTip[] = [
  { do: true, text: 'Use the processor’s official SDK, iframe, or redirect — never build your own card form that posts to your server.', ref: 'Req 3, 6.4.3' },
  { do: true, text: 'Serve every page over HTTPS, including staging environments that mimic checkout.', ref: 'Req 4.2' },
  { do: true, text: 'Enable MFA on payment-dashboard and hosting admin accounts.', ref: 'Req 8.4' },
  { do: true, text: 'Monitor payment-page scripts for unauthorized changes (v4.0.1 e-commerce requirements).', ref: 'Req 6.4.3, 11.6.1' },
  { do: true, text: 'Document which SAQ applies based on your integration pattern and share it with the business owner.', ref: 'SAQ A / A-EP' },
  { do: false, text: 'Log, cache, or email full card numbers, CVV, or track data — not even in error handlers.', ref: 'Req 3.3' },
  { do: false, text: 'Copy payment API responses into Slack, Sentry, or analytics without scrubbing sensitive fields.', ref: 'Req 3' },
  { do: false, text: 'Assume “we use Stripe” ends the conversation — schedule the SAQ with whoever owns compliance.', ref: 'Req 12' },
  { do: false, text: 'Modify third-party checkout scripts or load payment JS from unofficial CDNs.', ref: 'Req 6.4.3' },
];

// ── Password requirements (v4.0.1) ──────────────────────────────────────
export interface PwRule {
  icon: LucideIcon;
  label: string;
  detail: string;
  ref: string;
}

export const passwordRules: PwRule[] = [
  { icon: KeyRound, label: '12-character minimum', ref: 'Req 8.3.6',
    detail: 'User passwords must be at least 12 characters. If a system genuinely cannot support 12, the floor is 8 — but 12 is the target.' },
  { icon: ScrollText, label: 'Letters and numbers', ref: 'Req 8.3.6',
    detail: 'Passwords must contain both numeric and alphabetic characters. Longer passphrases beat short complex strings users can’t remember.' },
  { icon: Shield, label: 'MFA for all admin access', ref: 'Req 8.4, 8.5',
    detail: 'Multi-factor authentication is required for administrative and remote access — not optional under v4.0.1.' },
  { icon: RefreshCw, label: 'Change on suspicion, not on a clock', ref: 'Req 8.3.9',
    detail: 'Forced periodic rotation is no longer required if you monitor accounts and use MFA. Change credentials when there’s evidence of compromise.' },
  { icon: CreditCard, label: 'No shared or default credentials', ref: 'Req 8.2, 2.2',
    detail: 'Every user gets a unique ID. Vendor-default passwords must be changed before a system goes live.' },
];

export const OWNER_LABELS: Record<Owner, string> = {
  you: 'You (the business)',
  processor: 'Payment processor',
  shared: 'Shared',
};

// ── Site metadata (standalone deployment) ─────────────────────────────────
export interface PartnerLink {
  name: string;
  url: string;
}

export const siteMeta = {
  title: 'Understanding PCI for Small Business',
  tagline: 'What is PCI? Who owns what when you accept credit cards through a processor.',
  description: 'A plain-language PCI DSS v4.0.1 guide for small businesses and developers using Stripe, PayPal, or similar hosted processors.',
  /** Production URL — update when custom domain is assigned */
  url: 'https://understanding-pci.vercel.app',
  version: 'PCI DSS v4.0.1',
  partners: [
    { name: 'SecurityLeader.ai', url: 'https://securityleader.ai' },
    { name: 'Sayva Inc.', url: 'https://sayvainc.com' },
  ] satisfies PartnerLink[],
};

// ── What is PCI? (intro copy) ─────────────────────────────────────────────
export const whatIsPci = {
  heading: 'What is PCI?',
  body: 'PCI DSS (Payment Card Industry Data Security Standard) is the set of security rules every business must follow when it accepts credit or debit cards — regardless of size, volume, or whether you use Stripe, PayPal, or a bank terminal. It exists to protect cardholder data from theft and fraud.',
  bullets: [
    'Applies to any merchant that accepts payment cards — no volume minimum.',
    'Validation is annual: most small businesses complete a Self-Assessment Questionnaire (SAQ).',
    'Using a hosted processor reduces technical scope but does not remove your responsibility.',
    'Non-compliance can mean fines, higher processing fees, or losing the ability to accept cards.',
  ],
};

// ── Processor-specific PCI guides ─────────────────────────────────────────
export interface ProcessorLink {
  label: string;
  url: string;
}

export interface ProcessorGuide {
  id: string;
  name: string;
  typicalSaq: string;
  summary: string;
  links: ProcessorLink[];
  integrations: { pattern: string; saq: string }[];
}

export const processorGuides: ProcessorGuide[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    typicalSaq: 'SAQ A or SAQ A-EP',
    summary: 'Stripe is PCI Level 1 certified as a service provider. You still validate annually — Stripe\'s Dashboard includes a PCI wizard that picks the right SAQ based on your integration.',
    links: [
      { label: 'PCI compliance guide', url: 'https://stripe.com/guides/pci-compliance' },
      { label: 'Integration security guide', url: 'https://docs.stripe.com/security/guide' },
      { label: 'PCI wizard (Dashboard)', url: 'https://dashboard.stripe.com/settings/compliance' },
      { label: 'PCI SSC SAQ library', url: 'https://www.pcisecuritystandards.org/document_library?category=saqs' },
    ],
    integrations: [
      { pattern: 'Stripe Checkout (hosted page)', saq: 'Usually SAQ A' },
      { pattern: 'Stripe.js / Elements (embed on your site)', saq: 'Usually SAQ A-EP' },
      { pattern: 'Direct API with raw card data on your server', saq: 'SAQ D — avoid this pattern' },
    ],
  },
  {
    id: 'paypal',
    name: 'PayPal',
    typicalSaq: 'SAQ A or SAQ A-EP',
    summary: 'PayPal handles card processing in its PCI-compliant environment. You must still complete an annual SAQ based on how checkout is integrated — hosted redirect vs embedded buttons or JS SDK on your domain.',
    links: [
      { label: 'Business PCI compliance', url: 'https://www.paypal.com/us/business/pci-compliance' },
      { label: 'Checkout security (developers)', url: 'https://developer.paypal.com/docs/checkout/security/pci-compliance/' },
      { label: 'Payflow PCI guide', url: 'https://developer.paypal.com/api/nvp-soap/payflow/integration-guide/security-pci-compliance/' },
      { label: 'PCI SSC SAQ library', url: 'https://www.pcisecuritystandards.org/document_library?category=saqs' },
    ],
    integrations: [
      { pattern: 'PayPal redirect / hosted checkout', saq: 'Usually SAQ A' },
      { pattern: 'PayPal JS SDK / Smart Buttons on your site', saq: 'Usually SAQ A-EP' },
      { pattern: 'Payflow Transparent Redirect', saq: 'Often SAQ A-EP — confirm with acquirer' },
    ],
  },
];
