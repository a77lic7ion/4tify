// 4tify tactical site — interactions
(function(){
  // Mobile menu toggle
  var btn = document.getElementById('mobile-menu-button');
  var menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', function(){ menu.classList.toggle('hidden'); });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ menu.classList.add('hidden'); });
    });
  }

  // Current year in footer
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    if (q) q.addEventListener('click', function(){ item.classList.toggle('open'); });
  });

  // Active nav highlight on scroll
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link[href^="#"]'));
  var sections = links
    .map(function(l){ return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) {
          var id = e.target.id;
          links.forEach(function(l){
            l.classList.toggle('active', l.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function(s){ obs.observe(s); });
  }
})();
