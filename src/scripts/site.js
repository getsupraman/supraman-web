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

// Graph / Session swap in the review chapter.
document.querySelectorAll('[data-swap-for]').forEach((group) => {
  const frame = document.getElementById(group.dataset.swapFor);
  const figure = frame?.closest('figure');
  if (!frame || !figure) return;
  const show = (i) => {
    [...frame.children].forEach((img, n) => (img.hidden = n !== i));
    group.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.swap === String(i))));
    figure.querySelectorAll('.pen, .note').forEach((el) => (el.style.visibility = i === 0 ? '' : 'hidden'));
  };
  group.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-swap]');
    if (b) show(Number(b.dataset.swap));
  });
});
