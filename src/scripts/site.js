const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal: a block gets .in once, the first time it is well inside the viewport; data-reveal="load" at once.
const blocks = document.querySelectorAll('[data-reveal]');
if (reduce || !('IntersectionObserver' in window)) {
  blocks.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -22% 0px', threshold: 0.12 });
  blocks.forEach((el) => (el.dataset.reveal === 'load' ? requestAnimationFrame(() => el.classList.add('in')) : io.observe(el)));
}

// The spine fills as the story scrolls past.
const story = document.querySelector('.story');
const fill = story?.querySelector('.spine');
if (story && fill) {
  let queued = false;
  const update = () => {
    queued = false;
    const r = story.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
    fill.style.setProperty('--p', p.toFixed(4));
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

// Graph / Session / Diff: swap the view, then let its pen notes draw again.
document.querySelectorAll('[data-views]').forEach((group) => {
  const figure = document.getElementById(group.dataset.views);
  if (!figure) return;
  group.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-view]');
    if (!b) return;
    figure.dataset.view = b.dataset.view;
    group.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    if (!reduce) { figure.classList.remove('in'); requestAnimationFrame(() => requestAnimationFrame(() => figure.classList.add('in'))); }
  });
});

// Lightbox: any [data-zoom] figure opens large; on a phone it is wider than the screen and pans.
const zoomLabel = document.body.dataset.zoomLabel || '';
const closeLabel = document.body.dataset.closeLabel || '';
let box;
const closeBox = () => { if (box) { box.hidden = true; box.querySelector('.lb-body').replaceChildren(); document.documentElement.style.overflow = ''; } };
const openBox = (fig) => {
  if (!box) {
    box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML = '<button type="button" class="lb-close"></button><div class="lb-body"></div>';
    box.querySelector('.lb-close').textContent = closeLabel;
    box.addEventListener('click', (e) => { if (e.target === box || e.target.closest('.lb-close')) closeBox(); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape') closeBox(); });
    document.body.append(box);
  }
  const body = box.querySelector('.lb-body');
  const stage = fig.querySelector('.stage');
  if (stage) {
    const clone = fig.cloneNode(true);
    clone.querySelectorAll('.zoom-btn, .how-steps').forEach((x) => x.remove());
    clone.classList.add('in');
    body.style.setProperty('--lb-min', '960px');
    body.style.setProperty('--lb-max', '1500px');
    body.replaceChildren(clone);
  } else {
    const shown = [...fig.querySelectorAll('.frame img')].find((i) => !i.closest('[data-view]') || i.dataset.v === fig.dataset.view) || fig.querySelector('.frame img');
    const img = new Image();
    const src = shown.getAttribute('src');
    img.src = src;
    img.alt = shown.alt;
    const w = Number(shown.getAttribute('width')) || 1600;
    body.style.setProperty('--lb-min', innerWidth < 760 ? `${Math.min(w, 1400) * 0.75}px` : '0px');
    body.style.setProperty('--lb-max', `${w}px`);
    body.replaceChildren(img);
  }
  box.hidden = false;
  document.documentElement.style.overflow = 'hidden';
  box.querySelector('.lb-close').focus();
};
document.querySelectorAll('[data-zoom]').forEach((fig) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'zoom-btn';
  b.textContent = zoomLabel;
  fig.append(b);
  b.addEventListener('click', () => openBox(fig));
  fig.querySelector('.frame, .stage')?.addEventListener('click', () => openBox(fig));
});
