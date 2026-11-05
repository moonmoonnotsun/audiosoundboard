#!/usr/bin/env node
/**
 * Build the homepage and localized pages from scripts/home.template.html.
 * Usage: node scripts/build-locale-pages.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const METADATA_PATH = path.join(ROOT, '../clarify/locales/appStoreMetadata-soundboard.json');
const OVERLAY_PATHS = [
  'landing-overlay.json',
  'landing-overlay-extra.json',
  'landing-overlay-batch3.json',
  'landing-overlay-batch4.json',
].map((name) => path.join(ROOT, 'locales', name));
const COPY_PATH = path.join(ROOT, 'locales/home-copy.json');
const SEO_PATH = path.join(ROOT, 'locales/home-seo.json');
const TEMPLATE_PATH = path.join(ROOT, 'scripts/home.template.html');
const APP_ID = '6755937474';
const APP_SLUG = 'sound-board-audio-buttons';
const BASE_URL = 'https://audiosoundboard.app';

const LOCALE_CONFIG = {
  de: { dir: 'de', hreflang: 'de', label: 'DE' },
  fr: { dir: 'fr', hreflang: 'fr', label: 'FR' },
  es: { dir: 'es', hreflang: 'es', label: 'ES' },
  ru: { dir: 'ru', hreflang: 'ru', label: 'RU' },
  pl: { dir: 'pl', hreflang: 'pl', label: 'PL' },
  ja: { dir: 'ja', hreflang: 'ja', label: 'JA' },
  'pt-BR': { dir: 'pt', hreflang: 'pt-BR', label: 'PT' },
  'zh-Hans': { dir: 'zh', hreflang: 'zh-Hans', label: 'ZH' },
  ko: { dir: 'ko', hreflang: 'ko', label: 'KO' },
  it: { dir: 'it', hreflang: 'it', label: 'IT' },
  nl: { dir: 'nl', hreflang: 'nl', label: 'NL' },
  tr: { dir: 'tr', hreflang: 'tr', label: 'TR' },
  uk: { dir: 'uk', hreflang: 'uk', label: 'UK' },
  ar: { dir: 'ar', hreflang: 'ar', label: 'AR' },
  sv: { dir: 'sv', hreflang: 'sv', label: 'SV' },
  'zh-Hant': { dir: 'zh-tw', hreflang: 'zh-Hant', label: 'TW' },
  'pt-PT': { dir: 'pt-pt', hreflang: 'pt-PT', label: 'PT-PT' },
  vi: { dir: 'vi', hreflang: 'vi', label: 'VI' },
  id: { dir: 'id', hreflang: 'id', label: 'ID' },
  th: { dir: 'th', hreflang: 'th', label: 'TH' },
  cs: { dir: 'cs', hreflang: 'cs', label: 'CS' },
  da: { dir: 'da', hreflang: 'da', label: 'DA' },
  nb: { dir: 'nb', hreflang: 'nb', label: 'NB' },
  fi: { dir: 'fi', hreflang: 'fi', label: 'FI' },
  he: { dir: 'he', hreflang: 'he', label: 'HE' },
  ca: { dir: 'ca', hreflang: 'ca', label: 'CA' },
  hr: { dir: 'hr', hreflang: 'hr', label: 'HR' },
  el: { dir: 'el', hreflang: 'el', label: 'EL' },
  hi: { dir: 'hi', hreflang: 'hi', label: 'HI' },
  hu: { dir: 'hu', hreflang: 'hu', label: 'HU' },
  ms: { dir: 'ms', hreflang: 'ms', label: 'MS' },
  'es-MX': { dir: 'es-mx', hreflang: 'es-MX', label: 'ES-MX' },
  ro: { dir: 'ro', hreflang: 'ro', label: 'RO' },
  sk: { dir: 'sk', hreflang: 'sk', label: 'SK' },
  'fr-CA': { dir: 'fr-ca', hreflang: 'fr-CA', label: 'FR-CA' },
};

const LOCALES = Object.keys(LOCALE_CONFIG);
const ALL_LOCALES = [
  { code: 'en', hreflang: 'en', path: '/', label: 'EN' },
  ...LOCALES.map((code) => ({
    code,
    hreflang: LOCALE_CONFIG[code].hreflang,
    path: `/${LOCALE_CONFIG[code].dir}/`,
    label: LOCALE_CONFIG[code].label,
  })),
];

const RAW_KEYS = new Set([
  'heroHtml',
  'boardsHtml',
  'featuresHtml',
  'themesHtml',
  'schemaName',
  'schemaTitle',
  'schemaDescription',
  'featureList',
  'hreflang',
  'ogLocaleAlternates',
  'localeRedirect',
  'langSwitcher',
  'langScript',
  'htmlDirAttr',
]);

const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf8'));
const overlay = Object.assign({}, ...OVERLAY_PATHS.map((file) => JSON.parse(fs.readFileSync(file, 'utf8'))));
const copy = JSON.parse(fs.readFileSync(COPY_PATH, 'utf8'));
const seo = JSON.parse(fs.readFileSync(SEO_PATH, 'utf8'));
const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
const englishKeys = Object.keys(copy.en);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function appStoreUrl(country) {
  return `https://apps.apple.com/${country}/app/${APP_SLUG}/id${APP_ID}`;
}

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.ohmyapp.soundboard';

function hreflangBlock() {
  const lines = ALL_LOCALES.map(
    ({ hreflang, path: p }) =>
      `    <link rel="alternate" hreflang="${hreflang}" href="${BASE_URL}${p === '/' ? '/' : p}">`,
  );
  lines.push(`    <link rel="alternate" hreflang="x-default" href="${BASE_URL}/">`);
  return lines.join('\n');
}

function localeRedirectScript() {
  const routeEntries = ALL_LOCALES.filter(({ path: p }) => p !== '/').flatMap(({ path: p }) => {
    const dir = p.replace(/\//g, '');
    const entries = [[dir, p]];
    if (dir === 'pt') entries.push(['pt-br', p]);
    if (dir === 'zh') entries.push(['zh-cn', p], ['zh-hans', p]);
    if (dir === 'zh-tw') entries.push(['zh-hant', p], ['zh-hk', p], ['zh-tw', p]);
    if (dir === 'pt-pt') entries.push(['pt-pt', p]);
    if (dir === 'uk') entries.push(['ua', p]);
    if (dir === 'nb') entries.push(['no', p], ['nn', p]);
    if (dir === 'es-mx') entries.push(['es-mx', p]);
    if (dir === 'fr-ca') entries.push(['fr-ca', p]);
    return entries;
  });
  const routesJson = JSON.stringify(Object.fromEntries(routeEntries));
  return `    <script>
        (function () {
            var routes = ${routesJson};
            var path = window.location.pathname;
            if (path !== '/' && path !== '/index.html') return;
            var langs = navigator.languages || [navigator.language || 'en'];
            var primary = (langs[0] || 'en').toLowerCase();
            if (primary === 'en' || primary.indexOf('en-') === 0) return;
            var tag = primary;
            var base = primary.split('-')[0];
            if (routes[tag]) { window.location.replace(routes[tag]); return; }
            if (routes[base]) { window.location.replace(routes[base]); return; }
        })();
    </script>`;
}

function langSwitcherScript() {
  return `    <script>
        (function () {
            var select = document.getElementById('lang-select');
            if (!select) return;
            select.addEventListener('change', function () {
                if (!this.value) return;
                window.location.href = this.value;
            });
        })();
    </script>`;
}

function langSwitcher(currentCode, label) {
  const options = ALL_LOCALES.map(({ code, path: p, label: localeLabel }) => {
    const selected = code === currentCode ? ' selected' : '';
    return `<option value="${p}"${selected}>${localeLabel}</option>`;
  }).join('\n                        ');
  return `<label class="lang">${escapeHtml(label)}
                    <select id="lang-select" aria-label="${escapeHtml(label)}">
                        ${options}
                    </select>
                </label>`;
}

function ogLocaleAlternates(current) {
  return ALL_LOCALES
    .filter(({ code }) => code !== current)
    .map(({ code }) => `    <meta property="og:locale:alternate" content="${seo[code].ogLocale}">`)
    .join('\n');
}

function fill(html, values) {
  let out = html;
  for (const [key, value] of Object.entries(values)) {
    const safe = RAW_KEYS.has(key) ? String(value) : escapeHtml(value);
    out = out.split(`{{${key}}}`).join(safe);
  }
  const leftover = out.match(/\{\{[a-zA-Z0-9]+\}\}/);
  if (leftover) throw new Error(`Unfilled placeholder ${leftover[0]}`);
  return out;
}

function buildPage(code) {
  const strings = copy[code];
  if (!strings) throw new Error(`Missing copy for ${code}`);
  for (const key of englishKeys) {
    if (typeof strings[key] !== 'string' || !strings[key]) {
      throw new Error(`Missing ${code}.${key}`);
    }
  }
  const isEnglish = code === 'en';
  const o = isEnglish ? null : overlay[code];
  const m = isEnglish ? metadata['en-US'] : metadata[code];
  if (!m || (!isEnglish && !o)) throw new Error(`Missing metadata or overlay for ${code}`);

  const pagePath = isEnglish ? '/' : `/${LOCALE_CONFIG[code].dir}/`;
  const pageUrl = `${BASE_URL}${pagePath === '/' ? '/' : pagePath}`;
  const country = isEnglish ? 'us' : o.appStoreCountry;
  const storeUrl = appStoreUrl(country);
  const appName = 'Sound Board Pro - Audio Pads';
  const featureList = [1, 2, 3, 4, 5, 6].map((n) => strings[`f${n}Title`]);
  const pageSeo = seo[code];
  if (!pageSeo?.metaTitle || !pageSeo?.metaDescription || !pageSeo?.keywords || !pageSeo?.ogLocale) {
    throw new Error(`Missing SEO for ${code}`);
  }
  const metaTitle = pageSeo.metaTitle;
  const metaDescription = pageSeo.metaDescription;

  const values = {
    ...strings,
    htmlLang: isEnglish ? 'en' : o.htmlLang,
    htmlDirAttr: !isEnglish && o.htmlDir ? ` dir="${o.htmlDir}"` : '',
    metaTitle,
    metaDescription,
    keywords: pageSeo.keywords,
    languageName: isEnglish ? 'English' : m.localeName,
    pageUrl,
    ogLocale: pageSeo.ogLocale,
    ogLocaleAlternates: ogLocaleAlternates(code),
    appName: appName,
    storeUrl,
    playUrl: PLAY_URL,
    schemaName: JSON.stringify(appName),
    schemaTitle: JSON.stringify(metaTitle),
    schemaDescription: JSON.stringify(metaDescription),
    featureList: JSON.stringify(featureList),
    hreflang: hreflangBlock(),
    localeRedirect: isEnglish ? localeRedirectScript() : '',
    langSwitcher: langSwitcher(code, strings.langLabel),
    langScript: langSwitcherScript(),
  };

  let html = fill(template, values);
  if (!isEnglish) {
    html = html.replace(/href="assets\//g, 'href="../assets/');
    html = html.replace(/src="assets\//g, 'src="../assets/');
  }
  return html;
}

for (const code of ['en', ...LOCALES]) {
  const html = buildPage(code);
  const outPath = code === 'en'
    ? path.join(ROOT, 'index.html')
    : path.join(ROOT, LOCALE_CONFIG[code].dir, 'index.html');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
  console.log(`Built ${code === 'en' ? 'index.html' : `${LOCALE_CONFIG[code].dir}/index.html`}`);
}

const today = new Date().toISOString().slice(0, 10);
const alternates = (selfPath) => ALL_LOCALES.map(({ hreflang, path: p }) => {
  const href = `${BASE_URL}${p === '/' ? '/' : p}`;
  return `        <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`;
}).concat(`        <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/"/>`).join('\n');
const urls = ALL_LOCALES.map(({ path: p }) => `    <url>
        <loc>${BASE_URL}${p === '/' ? '/' : p}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>${p === '/' ? '1.0' : '0.9'}</priority>
${alternates(p)}
    </url>`);
fs.writeFileSync(
  path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`,
);
console.log('Updated sitemap.xml');
