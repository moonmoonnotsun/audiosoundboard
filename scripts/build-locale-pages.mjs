#!/usr/bin/env node
/**
 * Generate localized landing pages for audiosoundboard.app
 * Usage: node scripts/build-locale-pages.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const METADATA_PATH = path.join(ROOT, '../clarify/locales/appStoreMetadata-soundboard.json');
const OVERLAY_PATH = path.join(ROOT, 'locales/landing-overlay.json');
const TEMPLATE_PATH = path.join(ROOT, 'index.html');
const APP_ID = '6755937474';
const APP_SLUG = 'sound-board-audio-buttons';
const BASE_URL = 'https://audiosoundboard.app';
const LOCALES = ['de', 'fr', 'es', 'ru', 'pl'];
const ALL_LOCALES = [{ code: 'en', path: '/' }, ...LOCALES.map((code) => ({ code, path: `/${code}/` }))];

const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf8'));
const overlay = JSON.parse(fs.readFileSync(OVERLAY_PATH, 'utf8'));
let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

function parseFeatureBullets(description) {
  return description
    .split('• ')
    .slice(1, 6)
    .map((part) => {
      const [title, ...rest] = part.trim().split('\n\n');
      return { title: title.trim(), desc: rest.join('\n\n').trim() };
    });
}

function appStoreUrl(country) {
  return `https://apps.apple.com/${country}/app/${APP_SLUG}/id${APP_ID}`;
}

function escapeJson(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
}

function hreflangBlock() {
  const lines = ALL_LOCALES.map(
    ({ code, path: p }) =>
      `    <link rel="alternate" hreflang="${code}" href="${BASE_URL}${p === '/' ? '/' : p}">`,
  );
  lines.push(`    <link rel="alternate" hreflang="x-default" href="${BASE_URL}/">`);
  return lines.join('\n');
}

function localeRedirectScript() {
  return `    <script>
        (function () {
            var supported = { en: '/', de: '/de/', fr: '/fr/', es: '/es/', ru: '/ru/', pl: '/pl/' };
            var path = window.location.pathname;
            if (path !== '/' && path !== '/index.html') return;
            var langs = navigator.languages || [navigator.language || 'en'];
            for (var i = 0; i < langs.length; i++) {
                var code = (langs[i] || 'en').toLowerCase().split('-')[0];
                if (code !== 'en' && supported[code]) {
                    window.location.replace(supported[code]);
                    return;
                }
            }
        })();
    </script>`;
}

function langSwitcher(currentCode) {
  const labels = { en: 'EN', de: 'DE', fr: 'FR', es: 'ES', ru: 'RU', pl: 'PL' };
  const links = ALL_LOCALES.map(({ code, path: p }) => {
    const href = p;
    const cls = code === currentCode ? 'lang-link is-active' : 'lang-link';
    return `<a href="${code === 'en' ? '/' : `/${code}/`}" hreflang="${code}" class="${cls}">${labels[code]}</a>`;
  }).join('\n                    ');
  return `            <div class="footer-lang" aria-label="Language">
                ${links}
            </div>`;
}

function buildLocalePage(code) {
  const o = overlay[code];
  const m = metadata[code];
  const features = parseFeatureBullets(m.description);
  features.push({ title: o.feature6Title, desc: o.feature6Desc });
  const appName = m.name;
  const storeUrl = appStoreUrl(o.appStoreCountry);
  const pageUrl = `${BASE_URL}/${code}/`;
  const keywords = m.keywords.replace(/,/g, ', ');

  let html = template;

  // Asset paths for subfolders
  html = html.replace(/href="assets\//g, 'href="../assets/');
  html = html.replace(/src="assets\//g, 'src="../assets/');

  html = html.replace(/<html lang="en">/, `<html lang="${o.htmlLang}">`);
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${o.metaTitle}</title>`,
  );
  html = html.replace(
    /<meta name="title" content="[^"]*">/,
    `<meta name="title" content="${o.metaTitle}">`,
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${o.metaDescription}">`,
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*">/,
    `<meta name="twitter:description" content="${o.metaDescription}">`,
  );
  html = html.replace(
    /<meta name="twitter:url" content="[^"]*">/,
    `<meta name="twitter:url" content="${pageUrl}">`,
  );
  html = html.replace(
    /<meta name="keywords" content="[^"]*">/,
    `<meta name="keywords" content="${keywords}">`,
  );
  html = html.replace(
    /<meta name="language" content="[^"]*">/,
    `<meta name="language" content="${m.localeName}">`,
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${pageUrl}">`,
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*">/,
    `<meta property="og:url" content="${pageUrl}">`,
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${o.metaTitle}">`,
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*">/,
    `<meta name="twitter:title" content="${o.metaTitle}">`,
  );
  html = html.replace(
    /<meta property="og:locale" content="[^"]*">/,
    `<meta property="og:locale" content="${o.ogLocale}">`,
  );
  html = html.replace(
    /https:\/\/audiosoundboard\.app\/assets\//g,
    `${BASE_URL}/assets/`,
  );
  html = html.replace(
    /https:\/\/apps\.apple\.com\/us\/app\/sound-board-audio-buttons\/id6755937474/g,
    storeUrl,
  );

  // hreflang + remove locale redirect on localized pages
  if (!html.includes('hreflang="de"')) {
    html = html.replace('</head>', `${hreflangBlock()}\n</head>`);
  } else {
    html = html.replace(
      /<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n?/g,
      '',
    );
    html = html.replace('</head>', `${hreflangBlock()}\n</head>`);
  }
  html = html.replace(/\s*<script>\s*\(function \(\) \{\s*var supported[\s\S]*?<\/script>\s*/g, '\n');

  // JSON-LD
  html = html.replace(/"inLanguage": "en-US"/, `"inLanguage": "${code}"`);
  html = html.replace(/"url": "https:\/\/audiosoundboard\.app\/"/g, `"url": "${pageUrl}"`);
  html = html.replace(
    /"name": "Sound Board - Audio Buttons"/,
    `"name": "${escapeJson(appName)}"`,
  );

  const featureListJson = features.map((f) => `"${escapeJson(f.title)}"`).join(',\n            ');
  html = html.replace(
    /"featureList": \[[\s\S]*?\]/,
    `"featureList": [\n            ${featureListJson}\n        ]`,
  );

  // Hero
  html = html.replace(
    /<p class="app-slogan">[^<]*<\/p>/,
    `<p class="app-slogan">${o.heroSlogan}</p>`,
  );
  html = html.replace(
    /<h1 class="app-title">[\s\S]*?<\/h1>/,
    `<h1 class="app-title">${o.heroH1Before}<span class="highlight-sound">${o.heroH1Highlight}</span>${o.heroH1After}</h1>`,
  );
  const taglineWithLink = `<a href="${storeUrl}" class="app-store-link" target="_blank" rel="noopener noreferrer">${appName}</a> - ${o.heroTagline}`;
  html = html.replace(/<p class="app-tagline">[\s\S]*?<\/p>/, `<p class="app-tagline">${taglineWithLink}</p>`);

  // Features section
  html = html.replace(
    /<span class="title-line">Lightning-fast setup,<\/span>\s*<span class="title-line title-accent">powerful control<\/span>/,
    `<span class="title-line">${o.sectionFeaturesLine1}</span>\n                    <span class="title-line title-accent">${o.sectionFeaturesLine2}</span>`,
  );
  html = html.replace(
    /<p class="section-subtitle">Everything you need in a soundboard app[\s\S]*?<\/p>/,
    `<p class="section-subtitle">${o.sectionFeaturesSubtitle}</p>`,
  );

  const featureCards = [...html.matchAll(/<h3 class="feature-title">[^<]*<\/h3>\s*<p class="feature-description">[^<]*<\/p>/g)];
  featureCards.forEach((match, i) => {
    if (!features[i]) return;
    const replacement = `<h3 class="feature-title">${features[i].title}</h3>\n                    <p class="feature-description">${features[i].desc}</p>`;
    html = html.replace(match[0], replacement);
  });

  // Screenshots
  html = html.replace(/<h2 class="section-title">See It In Action<\/h2>/, `<h2 class="section-title">${o.sectionScreenshotsTitle}</h2>`);
  html = html.replace(
    /<p class="section-subtitle">Experience the fast, intuitive interface designed for creators<\/p>/,
    `<p class="section-subtitle">${o.sectionScreenshotsSubtitle}</p>`,
  );

  // About
  html = html.replace(
    /<h2 class="section-title">What Is a <span class="title-accent">Soundboard App<\/span>\?<\/h2>/,
    `<h2 class="section-title">${o.sectionAboutTitle}<span class="title-accent">${o.sectionAboutTitleAccent}</span>${o.sectionAboutTitleEnd}</h2>`,
  );
  html = html.replace(
    /<p class="section-subtitle about-copy">[\s\S]*?<\/p>/,
    `<p class="section-subtitle about-copy">${o.sectionAboutCopy}<a href="${storeUrl}" class="app-store-link" target="_blank" rel="noopener noreferrer">${appName}</a>${o.sectionAboutCopyAfter}</p>`,
  );

  // FAQ header
  html = html.replace(
    /<h2 class="section-title">Soundboard App <span class="title-accent">FAQ<\/span><\/h2>/,
    `<h2 class="section-title">${o.faqTitle}<span class="title-accent">${o.faqTitleAccent}</span></h2>`,
  );
  html = html.replace(
    /<p class="section-subtitle">Common questions about our free sound board app for iPhone<\/p>/,
    `<p class="section-subtitle">${o.faqSubtitle}</p>`,
  );

  const faqPairs = [
    [o.faq1Q, `${o.faq1A}<a href="${storeUrl}" class="app-store-link" target="_blank" rel="noopener noreferrer">${appName}</a>${o.faq1AAfter}`],
    [o.faq2Q, o.faq2A],
    [o.faq3Q, o.faq3A],
    [o.faq4Q, o.faq4A],
    [o.faq5Q, o.faq5A],
    [o.faq6Q, o.faq6A],
  ];
  const faqBlocks = [...html.matchAll(/<span class="faq-question-text">[^<]*<\/span>[\s\S]*?<p class="faq-answer">[\s\S]*?<\/p>/g)];
  faqBlocks.forEach((match, i) => {
    if (!faqPairs[i]) return;
    const [q, a] = faqPairs[i];
    html = html.replace(
      match[0],
      `<span class="faq-question-text">${q}</span>\n                        <svg class="faq-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>\n                    </summary>\n                    <div class="faq-answer-wrap">\n                        <p class="faq-answer">${a}</p>`,
    );
  });

  // CTA
  html = html.replace(/<h2 class="cta-title">[^<]*<\/h2>/, `<h2 class="cta-title">${o.ctaTitle}</h2>`);
  html = html.replace(
    /<p class="cta-description">[\s\S]*?<\/p>/,
    `<p class="cta-description">${o.ctaDescription}<a href="${storeUrl}" class="app-store-link" target="_blank" rel="noopener noreferrer">${appName}</a>${o.ctaDescriptionAfter}</p>`,
  );

  // Buttons
  html = html.replace(/<span>Download on the App Store<\/span>/g, `<span>${o.downloadAppStore}</span>`);
  html = html.replace(/<span class="btn-free">Free<\/span>/g, `<span class="btn-free">${o.free}</span>`);
  html = html.replace(/aria-label="Download on the App Store"/g, `aria-label="${o.downloadAppStore}"`);

  // Footer
  html = html.replace(/<span class="logo-text">Sound Board - Audio Buttons<\/span>/, `<span class="logo-text">${appName}</span>`);
  html = html.replace(/>Privacy<\/a>/, `>${o.privacy}</a>`);
  html = html.replace(/>Terms<\/a>/, `>${o.terms}</a>`);
  html = html.replace(/>Support<\/a>/, `>${o.support}</a>`);
  html = html.replace(/>Contact<\/a>/, `>${o.contact}</a>`);

  html = html.replace(/<div class="footer-lang"[^>]*>[\s\S]*?<\/div>\s*/g, '');
  html = html.replace(
    /<div class="footer-links">/,
    `${langSwitcher(code)}\n                <div class="footer-links">`,
  );

  return html;
}

function updateEnglishIndex() {
  let html = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  if (!html.includes('hreflang="de"')) {
    html = html.replace('</head>', `${hreflangBlock()}\n${localeRedirectScript()}\n</head>`);
  }
  html = html.replace(/<div class="footer-lang"[^>]*>[\s\S]*?<\/div>\s*/g, '');
  if (!html.includes('footer-lang')) {
    html = html.replace(
      /<div class="footer-links">/,
      `${langSwitcher('en')}\n                <div class="footer-links">`,
    );
  }
  if (!html.includes('.footer-lang')) {
    html = html.replace(
      '</style>',
      `
        .footer-lang {
            display: flex;
            flex-wrap: wrap;
            gap: 8px 12px;
            justify-content: center;
            margin-bottom: 16px;
        }
        .lang-link {
            color: rgba(255, 255, 255, 0.55);
            font-size: 0.8125rem;
            font-weight: 600;
            letter-spacing: 0.04em;
            text-decoration: none;
            transition: color 0.2s ease;
        }
        .lang-link:hover,
        .lang-link.is-active {
            color: #fff;
        }
    </style>`,
    );
  }
  fs.writeFileSync(TEMPLATE_PATH, html);
}

function updateSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = ALL_LOCALES.map(
    ({ code, path: p }) => `    <url>
        <loc>${BASE_URL}${p === '/' ? '/' : p}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>${p === '/' ? '1.0' : '0.9'}</priority>
    </url>`,
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
}

updateEnglishIndex();
template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

for (const code of LOCALES) {
  const outDir = path.join(ROOT, code);
  fs.mkdirSync(outDir, { recursive: true });
  const html = buildLocalePage(code);
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  console.log(`Built ${code}/index.html`);
}

updateSitemap();
console.log('Updated sitemap.xml');
