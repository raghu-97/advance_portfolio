/* ---------- Particle background ---------- */
(() => {
    const canvas = document.getElementById('particles');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = innerWidth;
    let h = canvas.height = innerHeight;
    window.addEventListener('resize', () => { w = canvas.width = innerWidth; h = canvas.height = innerHeight; });
  
    const particles = [];
    const count = Math.max(20, Math.round((w*h)/110000)); // scale by screen
  
    function rand(a,b){ return Math.random()*(b-a)+a; }
  
    class P {
      constructor(){
        this.x = Math.random()*w;
        this.y = Math.random()*h;
        this.r = rand(0.6,2.2);
        this.vx = rand(-0.2,0.2);
        this.vy = rand(-0.15,0.15);
        this.alpha = rand(0.06,0.28);
      }
      step(){
        this.x += this.vx;
        this.y += this.vy;
        if(this.x < -50) this.x = w + 50;
        if(this.x > w + 50) this.x = -50;
        if(this.y < -50) this.y = h + 50;
        if(this.y > h + 50) this.y = -50;
      }
      draw(){
        ctx.beginPath();
        ctx.fillStyle = `rgba(124,92,255,${this.alpha})`;
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fill();
      }
    }
  
    for(let i=0;i<count;i++) particles.push(new P());
  
    function frame(){
      ctx.clearRect(0,0,w,h);
      // subtle gradient
      const g = ctx.createLinearGradient(0,0,w,h);
      g.addColorStop(0, 'rgba(2,6,12,0.12)');
      g.addColorStop(1, 'rgba(2,6,12,0.22)');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,w,h);
  
      particles.forEach(p => { p.step(); p.draw(); });
      // optional connecting lines
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx*dx + dy*dy;
          if(d2 < 12000){
            ctx.beginPath();
            ctx.strokeStyle = `rgba(124,92,255,${0.008 * (12000 - d2)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
  
      requestAnimationFrame(frame);
    }
    frame();
  })();
  
  /* ---------- Typewriter effect ---------- */
  (() => {
    const el = document.getElementById('typewriter');
    if(!el) return;
    const phrases = [
      'I build production data pipelines.',
      'I craft ETL/ELT solutions on Azure & Databricks.',
      'I optimize data flows with PySpark.'
    ];
    let i = 0, j = 0, forward = true;
    function tick(){
      const p = phrases[i];
      if(forward){
        j++;
        el.textContent = p.slice(0,j);
        if(j === p.length){ forward = false; setTimeout(tick, 900); return; }
      } else {
        j--;
        el.textContent = p.slice(0,j);
        if(j === 0){ forward = true; i = (i+1)%phrases.length; }
      }
      setTimeout(tick, forward ? 36 : 20);
    }
    tick();
  })();
  
  /* ---------- Intersection Observer: reveal + animate skill bars ---------- */
  (() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('show');
          // animate skill bars inside
          const bars = entry.target.querySelectorAll('.bar > i');
          bars.forEach(b => {
            const target = b.getAttribute('data-width') || '70%';
            setTimeout(()=> b.style.width = target, 120);
          });
        }
      });
    }, { threshold: 0.12 });
  
    document.querySelectorAll('.reveal, .card, .section, .cert-card').forEach(node => observer.observe(node));
  })();
  
  /* ---------- Experience counter (dynamic) ---------- */
  (() => {
    const base = new Date('2023-06-15T00:00:00+05:30'); // change if you like
    const yEl = document.getElementById('years');
    const mEl = document.getElementById('months');
    const dEl = document.getElementById('days');
    if(!yEl) return;
    function refresh(){
      const now = new Date();
      let y = now.getFullYear() - base.getFullYear();
      let m = now.getMonth() - base.getMonth();
      let d = now.getDate() - base.getDate();
      if(d < 0){ m -= 1; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
      if(m < 0){ y -= 1; m += 12; }
      yEl.textContent = `${y}y`; mEl.textContent = `${m}m`; dEl.textContent = `${d}d`;
    }
    refresh();
    setInterval(refresh, 60*1000);
  })();
  
  /* ---------- Footer year ---------- */
  (() => { const el = document.getElementById('year'); if(el) el.textContent = new Date().getFullYear(); })();
  
  /* ---------- Certification modal (click to view) ---------- */
  (() => {
    const modal = document.getElementById('cert-modal');
    const img = document.getElementById('cert-img');
    const title = document.getElementById('cert-title');
    const desc = document.getElementById('cert-desc');
    const link = document.getElementById('cert-link');
    const close = document.getElementById('cert-close');
  
    function openCert(data){
      img.src = data.img;
      img.alt = data.title;
      title.textContent = data.title;
      desc.textContent = data.desc || '';
      link.href = data.link || '#';
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
    }
    function closeCert(){
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
    }
  
    document.querySelectorAll('.cert-card').forEach(card => {
      card.addEventListener('click', () => {
        openCert({
          img: card.getAttribute('data-img'),
          title: card.getAttribute('data-title'),
          desc: card.getAttribute('data-desc'),
          link: card.getAttribute('data-link') || '#'
        });
      });
      // keyboard accessibility
      card.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); } });
    });
  
    close.addEventListener('click', closeCert);
    modal.addEventListener('click', e => { if(e.target === modal) closeCert(); });
    window.addEventListener('keydown', e => { if(e.key === 'Escape') closeCert(); });
  })();
  