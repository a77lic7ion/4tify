const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const htmlPath = path.join(__dirname, 'index.html');
const jsPath = path.join(__dirname, 'js/app.js');
const html = fs.readFileSync(htmlPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://4tify.vercel.app/' });
const { window } = dom;
global.window = window; global.document = window.document;

// execute app.js in the window context
const runScript = new Function('window', 'document', js);
runScript(window, window.document);
try { window.document.dispatchEvent(new window.Event('DOMContentLoaded')); } catch(e){}

function snap(){
  const r = {};
  ['original','blackcats','panthar'].forEach(id=>{
    const el = window.document.getElementById('layout-'+id);
    r[id] = { active: el.classList.contains('is-active'), display: el.style.display || 'n/a' };
  });
  r.dataLayout = window.document.documentElement.getAttribute('data-layout');
  r.btnLabel = window.document.getElementById('themeBtnLabel').textContent.trim();
  return r;
}

const results = {};
results.INITIAL = snap();

// click Blackcats option
let bc = [...window.document.querySelectorAll('.theme-opt')].find(o=>o.getAttribute('data-layout')==='blackcats');
bc.click();
results.AFTER_BLACKCATS = snap();

// click Panthar option
let pn = [...window.document.querySelectorAll('.theme-opt')].find(o=>o.getAttribute('data-layout')==='panthar');
pn.click();
results.AFTER_PANTHAR = snap();

// simulate reload: new DOM but reuse localStorage
const stored = window.localStorage.getItem('4tify-layout');
results.PERSISTED_KEY = stored;
const dom2 = new JSDOM(html, { runScripts:'outside-only', pretendToBeVisual:true, url:'https://4tify.vercel.app/' });
dom2.window.localStorage.setItem('4tify-layout', stored);
new Function('window','document', js)(dom2.window, dom2.window.document);
results.AFTER_RELOAD = (function(){
  const r={}; ['original','blackcats','panthar'].forEach(id=>{const e=dom2.window.document.getElementById('layout-'+id); r[id]=e.classList.contains('is-active');});
  r.dataLayout = dom2.window.document.documentElement.getAttribute('data-layout');
  return r;
})();

// verify identical content across layouts: count h1 + a distinctive phrase in each
results.CONTENT = ['original','blackcats','panthar'].map(id=>{
  const el = window.document.getElementById('layout-'+id);
  const txt = el.textContent;
  return { id, hasHero: /Fortifying Their Golden Years/.test(txt), hasPSIRA: /4899123/.test(txt), hasTestimonial: /Facility Manager, Rynfield/.test(txt) };
});

console.log(JSON.stringify(results, null, 2));
