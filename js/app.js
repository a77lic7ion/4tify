// 4tify — instant TEMPLATE/layout switcher + shared interactions
(function(){
  var LAYOUTS = [
    { id:'original',   label:'4tify Original' },
    { id:'blackhawk',  label:'Blackhawak Tactical' },
    { id:'blackcats',  label:'Blackcats Console' },
    { id:'panthar',    label:'Panthar Field-Ops' }
  ];
  var KEY = '4tify-layout';
  var html = document.documentElement;

  function applyLayout(id, persist){
    if (!LAYOUTS.some(function(l){return l.id===id;})) id = 'original';
    LAYOUTS.forEach(function(l){
      var blk = document.getElementById('layout-' + l.id);
      if (blk) blk.classList.toggle('is-active', l.id === id);
    });
    html.setAttribute('data-layout', id);
    var t = LAYOUTS.filter(function(l){return l.id===id;})[0];
    var lbl = document.getElementById('themeBtnLabel');
    if (lbl) lbl.textContent = t.label;
    document.querySelectorAll('.theme-opt').forEach(function(o){
      o.classList.toggle('active', o.getAttribute('data-layout') === id);
    });
    if (persist) { try { window.localStorage.setItem(KEY, id); } catch(e){} }
  }

  function buildMenu(){
    var menu = document.getElementById('themeMenu');
    if (!menu) return;
    menu.innerHTML = '';
    LAYOUTS.forEach(function(l){
      var b = document.createElement('button');
      b.className = 'theme-opt';
      b.setAttribute('data-layout', l.id);
      b.textContent = l.label;
      b.addEventListener('click', function(){
        applyLayout(l.id, true);
        menu.classList.add('hidden');
      });
      menu.appendChild(b);
    });
  }

  function init(){
    buildMenu();
    var saved = null;
    try { saved = window.localStorage.getItem(KEY); } catch(e){}
    applyLayout(saved || 'original', false);

    // dropdown open/close
    var btn = document.getElementById('themeBtn');
    var menu = document.getElementById('themeMenu');
    var wrap = document.getElementById('themeSwitcher');
    if (btn && menu){
      btn.addEventListener('click', function(e){ e.stopPropagation(); menu.classList.toggle('hidden'); });
      document.addEventListener('click', function(e){ if (wrap && !wrap.contains(e.target)) menu.classList.add('hidden'); });
    }

    // in-page scroll for nav + footer + CTA links
    document.querySelectorAll('[data-scroll]').forEach(function(a){
      a.addEventListener('click', function(e){
        e.preventDefault();
        var active = document.querySelector('.layout-block.is-active');
        var target = active ? active.querySelector('#' + a.getAttribute('data-scroll')) : document.querySelector('#' + a.getAttribute('data-scroll'));
        if (target) target.scrollIntoView({ behavior:'smooth', block:'start' });
        var mm = document.getElementById('mobile-menu'); if (mm) mm.classList.add('hidden');
      });
    });

    // FAQ accordion (works in whichever layout is active)
    document.querySelectorAll('.faq-item').forEach(function(item){
      var q = item.querySelector('.faq-q');
      if (q) q.addEventListener('click', function(){ item.classList.toggle('open'); });
    });

    // mobile menu
    var mbtn = document.getElementById('mobile-menu-button');
    var mm = document.getElementById('mobile-menu');
    if (mbtn && mm) mbtn.addEventListener('click', function(){ mm.classList.toggle('hidden'); });

    // year
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
