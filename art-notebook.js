/* =================================================================
   YOUR PAINTINGS, IN DISPLAY ORDER
   Rearrange entries here when you are ready to curate the sequence.
   The first painting gets its OWN opening spread on desktop.
   Titles are INTERNAL for accessible image labels, NEVER printed.
   Exact filename capitalization matters on GitHub Pages.
   ================================================================= */
const artworks = [
  { file: 'self.JPG', title: 'Self', alt: 'Self-portrait with colorful glitch-like overlays.' },
  { file: 'rue.JPG', title: 'Zendaya / Rue', alt: 'Blue-toned portrait painting of Zendaya as Rue.' },
  { file: 'billie.JPG', title: 'Billie', alt: 'Blue and orange portrait painting.' },
  { file: 'catskull.JPG', title: 'Cat Skull', alt: 'Monochrome painting of a skull against black.' },
  { file: 'silenthillf.JPG', title: 'Silent Hill F', alt: 'Silent Hill-inspired painting.' },
  { file: 'inside.JPG', title: 'Inside', alt: 'Pale sculptural figure.' },
  { file: 'paleman.JPG', title: 'Pale Man', alt: 'Painting of the Pale Man.' },
  { file: 'borrowedlight.JPG', title: 'Borrowed Light', alt: 'Figurative painting.' },
  { file: 'slasher.JPG', title: 'Slasher', alt: 'Screaming portrait with strong blue and orange lighting.' },
  { file: 'sheets.JPG', title: 'Sheets', alt: 'Pale intertwined figures painted among folds of fabric.' },
  { file: 'othermother.JPG', title: 'Other Mother', alt: 'Green-lit horror painting.' },
  { file: 'whitney.JPG', title: 'Whitney', alt: 'Portrait painting.' },
  { file: 'sevastopol.JPG', title: 'Sevastopol', alt: 'Painting titled Sevastopol.' },
  { file: 'torso.JPG', title: 'Torso', alt: 'Figurative torso study.' },
  { file: 'joker.JPG', title: 'Joker', alt: 'Colorful Joker portrait.' },
  { file: 'firehand.JPG', title: 'Fire Hand', alt: 'Painted hand with orange and blue lighting against black.' },
  { file: 'untildawn.JPG', title: 'Until Dawn', alt: 'Blue-toned horror portrait.' },
  { file: 'solitude.JPG', title: 'Solitude', alt: 'Figurative painting.' },
  { file: 'icecube.JPG', title: 'Ice Cube', alt: 'Close study of a mouth with ice.' },
  { file: 'Love.JPG', title: 'Love', alt: 'Pale figurative work.' },
  { file: 'sakuko.JPG', title: 'Sakuko', alt: 'Portrait painting titled Sakuko.' },
  { file: 'tear.JPG', title: 'Tear', alt: 'Portrait detail of a closed eye.' },
  { file: 'tigermouth.JPG', title: 'Mouth', alt: 'Close-cropped study of an open mouth in red and pink.' },
  { file: 'dandelion.JPG', title: 'Dandelion', alt: 'Dark painting of a dandelion with orange movement.' },
  { file: 'frankenfurter.JPG', title: 'Frank-N-Furter', alt: 'Portrait of Frank-N-Furter in pink.' },
  { file: 'neck.JPG', title: 'Neck Study', alt: 'Close-cropped neck study painted against black.' },
  { file: 'neckcollar.JPG', title: 'Neck & Collar', alt: 'Portrait detail of a neck and collar.' },
  { file: 'twisty.JPG', title: 'Twisty', alt: 'Horror clown painting.' },
  { file: 'marie.JPG', title: 'Marie', alt: 'Dark horror portrait painting.' },
  { file: 'rose.JPG', title: 'Rose', alt: 'Painted pink rose.' },
  { file: 'balloons.JPG', title: 'Balloons', alt: 'Colorful collection of balloons.' }
];

const $ = id => document.getElementById(id);
const cover = $('bookCover'), openBook = $('bookOpen');
const left = $('leftPage'), right = $('rightPage');
const prev = $('prevPage'), next = $('nextPage');
const nextLabel = $('nextLabel'), progress = $('bookProgress'), fill = $('bookProgressFill');
const turnLayer = $('turnLayer');
const lightbox = $('paintingLightbox'), lightboxImage = $('lightboxImage');
const mobile = window.matchMedia('(max-width: 700px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const imagePath = file => `assets/img/art/${encodeURIComponent(file)}`;
const escapeHTML = string => String(string).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

let view = 'cover';
let position = 0;
let turning = false;

function spreadIndices(index = position) {
  if (mobile.matches) return [null, index];
  if (index === 0) return [null, 0];
  return [index, index + 1 < artworks.length ? index + 1 : null];
}
function nextPosition(index = position) {
  return mobile.matches ? index + 1 : index === 0 ? 1 : index + 2;
}
function previousPosition(index = position) {
  return mobile.matches ? Math.max(0, index - 1) : index <= 1 ? 0 : index - 2;
}
function emptyOpeningHTML() {
  return '<div class="page-number" aria-hidden="true">&nbsp;</div>';
}
function paperHTML(index) {
  if (index === null || !artworks[index]) return emptyOpeningHTML();
  const item = artworks[index];
  return `<div class="page-art-region">
    <button class="artwork-open" type="button" data-art-index="${index}" aria-label="View ${escapeHTML(item.title)} enlarged">
      <img src="${imagePath(item.file)}" alt="${escapeHTML(item.alt)}" draggable="false" loading="eager">
    </button>
  </div><div class="page-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</div>`;
}
function endHTML() {
  return '<div class="end-mark"></div><h2 class="end-head">Fin.</h2><p class="end-copy">thanks for looking ♡</p><div class="end-mark"></div>';
}
function setPaper(el, index, ending = false) {
  el.classList.toggle('end-page', ending);
  el.classList.toggle('opening-page', index === null && !ending);
  el.classList.remove('page-variation-0','page-variation-1','page-variation-2','page-variation-3');
  if (index !== null && !ending) el.classList.add(`page-variation-${index % 4}`);
  el.innerHTML = ending ? endHTML() : paperHTML(index);
}
function updateControls() {
  prev.disabled = view === 'cover' || turning;
  next.disabled = turning;
  if (view === 'cover') {
    progress.textContent = 'Cover'; fill.style.width = '0%';
    nextLabel.textContent = 'Open book'; next.setAttribute('aria-label','Open sketchbook');
  } else if (view === 'end') {
    progress.textContent = 'The end'; fill.style.width = '100%';
    nextLabel.textContent = 'Start over'; next.setAttribute('aria-label','Return to cover');
  } else {
    const indices = spreadIndices();
    const last = indices[1] === null ? indices[0] : indices[1];
    const label = indices[0] === null || mobile.matches ? `${last + 1} / ${artworks.length}` : `${indices[0] + 1}–${last + 1} / ${artworks.length}`;
    progress.textContent = label;
    fill.style.width = `${((last + 1) / artworks.length) * 100}%`;
    nextLabel.textContent = 'Next'; next.setAttribute('aria-label','Next page');
  }
}
function renderBook() {
  cover.hidden = view !== 'cover';
  openBook.hidden = view === 'cover';
  if (view === 'artwork') {
    const [li, ri] = spreadIndices();
    setPaper(left, li);
    setPaper(right, ri);
  } else if (view === 'end') {
    setPaper(left, null);
    setPaper(right, null, true);
  }
  updateControls();
}
function finishTurn(toView, toPosition) {
  view = toView; position = toPosition; turning = false;
  turnLayer.className = 'page-turn-layer';
  $('turnFront').innerHTML = '';
  $('turnBack').innerHTML = '';
  $('turnBack').classList.remove('end-page');
  renderBook();
}
function changeView(toView, toPosition, direction) {
  if (turning) return;
  if (reducedMotion.matches || view === 'cover' || toView === 'cover') { finishTurn(toView,toPosition); return; }
  turning = true; updateControls();
  const oldLeft = left.innerHTML, oldRight = right.innerHTML;
  const newIndices = toView === 'end' ? [null,null] : (mobile.matches ? [null,toPosition] : toPosition === 0 ? [null,0] : [toPosition,toPosition+1 < artworks.length ? toPosition+1 : null]);
  const newLeft = paperHTML(newIndices[0]);
  const newRight = toView === 'end' ? endHTML() : paperHTML(newIndices[1]);
  // Preserve the final page's centering throughout the page-turn animation.
  // Without this, 'Fin.' appears at the top until renderBook() runs.
  right.classList.toggle('end-page', toView === 'end' || view === 'end');
  $('turnBack').classList.toggle('end-page', (mobile.matches && toView === 'end') || (direction < 0 && view === 'end'));
  $('turnFront').innerHTML = direction > 0 ? oldRight : (mobile.matches ? oldRight : oldLeft);
  $('turnBack').innerHTML = direction > 0 ? (mobile.matches ? newRight : newLeft) : (mobile.matches ? newRight : oldRight);
  turnLayer.querySelectorAll('button').forEach(button => { button.tabIndex = -1; });
  right.innerHTML = direction > 0 ? newRight : oldRight;
  left.innerHTML = direction > 0 ? oldLeft : newLeft;
  turnLayer.className = 'page-turn-layer';
  let finished = false;
  function done() {
    if (finished) return;
    finished = true;
    turnLayer.removeEventListener('animationend', done);
    finishTurn(toView,toPosition);
  }
  turnLayer.addEventListener('animationend', done);
  requestAnimationFrame(() => turnLayer.classList.add(direction > 0 ? 'is-forward' : 'is-backward'));
  window.setTimeout(done, 850);
}
function forward() {
  if (turning) return;
  if (view === 'cover') { changeView('artwork',0,1); return; }
  if (view === 'end') { changeView('cover',0,1); return; }
  const following = nextPosition();
  changeView(following >= artworks.length ? 'end' : 'artwork', following >= artworks.length ? position : following, 1);
}
function backward() {
  if (turning || view === 'cover') return;
  if (view === 'end') {
    const finalIndex = mobile.matches ? artworks.length-1 : artworks.length % 2 === 1 ? artworks.length-2 : artworks.length-1;
    changeView('artwork', Math.max(0,finalIndex),-1);
  } else if (position === 0) {
    changeView('cover',0,-1);
  } else {
    changeView('artwork', previousPosition(), -1);
  }
}

prev.addEventListener('click',backward);
next.addEventListener('click',forward);
cover.addEventListener('click',forward);
cover.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); forward(); }
});
window.addEventListener('keydown', event => {
  if (lightbox.open || event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) return;
  if (event.key === 'ArrowRight') { event.preventDefault(); forward(); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); backward(); }
});
let touchStart = null;
$('bookPages').addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse') touchStart = {x:event.clientX,y:event.clientY};
});
$('bookPages').addEventListener('pointerup', event => {
  if (!touchStart) return;
  const dx = event.clientX-touchStart.x, dy = event.clientY-touchStart.y;
  touchStart = null;
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)*1.3) dx < 0 ? forward() : backward();
});
$('book').addEventListener('click', event => {
  const target = event.target.closest('.artwork-open');
  if (!target || turning) return;
  const item = artworks[Number(target.dataset.artIndex)];
  lightboxImage.src = imagePath(item.file);
  lightboxImage.alt = item.alt;
  lightbox.showModal();
});
$('lightboxClose').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click',event => { if (event.target === lightbox) lightbox.close(); });
mobile.addEventListener('change', () => {
  if (turning) return;
  if (view === 'artwork' && !mobile.matches && position > 0 && position % 2 === 0) position--;
  renderBook();
});
renderBook();
