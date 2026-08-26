// 4tify — instant theme switcher (no reload)
(function(){
  var THEMES = [
    { id:'original',   label:'4tify Original' },
    { id:'blackcats',  label:'Blackcats Command' },
    { id:'panthar',    label:'Panthar Field-Ops' }
  ];
  var link   = document.getElementById('themeStylesheet');
  var btnLbl = document.getElementById('themeBtnLabel');
  var menu   = document.getElementById('themeMenu');
  var wrap   = document.getElementById('themeSwitcher');
  var KEY = '4tify-theme';

  function apply(id, persist){
    if (!THEMES.some(function(t){return t.id===id;})) id = 'original';
    if (link) link.href = 'css/theme-' + id + '.css';
    var t = THEMES.filter(function(x){return x.id===id;})[0];
    if (btnLbl) btnLbl.textContent = t.label;
    document.querySelectorAll('.theme-opt').forEach(function(o){
      o.classList.toggle('active', o.getAttribute('data-theme') === id);
    });
    if (persist) { try { localStorage.setItem(KEY, id); } catch(e){} }
  }

  function buildMenu(){
    if (!menu) return;
    menu.innerHTML = '';
    THEMES.forEach(function(t){
      var b = document.createElement('button');
      b.className = 'theme-opt';
      b.setAttribute('data-theme', t.id);
      b.textContent = t.label;
      b.addEventListener('click', function(){
        apply(t.id, true);
        menu.classList.add('hidden');
      });
      menu.appendChild(b);
    });
  }

  function init(){
    buildMenu();
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch(e){}
    apply(saved || 'original', false);

    var btn = document.getElementById('themeBtn');
    if (btn && menu){
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        menu.classList.toggle('hidden');
      });
      document.addEventListener('click', function(e){
        if (wrap && !wrap.contains(e.target)) menu.classList.add('hidden');
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
