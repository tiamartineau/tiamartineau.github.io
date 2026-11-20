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
function openCover(toPosition) {
  const moveFocus = document.activeElement === cover || document.activeElement === next;
  if (reducedMotion.matches) {
    finishTurn('artwork', toPosition);
    if (moveFocus) next.focus({ preventScroll: true });
    return;
  }

  const book = $('book');
  const bookRect = book.getBoundingClientRect();
  const coverRect = cover.getBoundingClientRect();
  const flap = document.createElement('div');
  flap.className = 'cover-flap';
  flap.setAttribute('aria-hidden', 'true');
  flap.inert = true;
  const face = cover.cloneNode(true);
  face.removeAttribute('id');
  flap.append(face);
  Object.assign(flap.style, {
    left: `${coverRect.left - bookRect.left}px`,
    top: `${coverRect.top - bookRect.top}px`,
    width: `${coverRect.width}px`,
    height: `${coverRect.height}px`
  });
  book.append(flap);

  turning = true;
  view = 'artwork';
  position = toPosition;
  openBook.inert = true;
  renderBook();

  const firstPage = right.getBoundingClientRect();
  const hingeShift = firstPage.left - coverRect.left;
  const duration = 560;
  const coverTurn = flap.animate([
    { transform: 'perspective(1500px) translateX(0) rotateY(0)', opacity: 1 },
    { transform: `perspective(1500px) translateX(${hingeShift}px) rotateY(-110deg)`, opacity: 1, offset: .72 },
    { transform: `perspective(1500px) translateX(${hingeShift}px) rotateY(-165deg)`, opacity: 0 }
  ], { duration, easing: 'cubic-bezier(.35, .05, .22, 1)' });

  openBook.animate([{ opacity: 0 }, { opacity: 1, offset: .52 }, { opacity: 1 }], duration);
  book.animate([
    { height: `${bookRect.height}px` },
    { height: `${book.getBoundingClientRect().height}px` }
  ], { duration, easing: 'ease' });

  function finishOpening() {
    flap.remove();
    openBook.inert = false;
    turning = false;
    updateControls();
    if (moveFocus && document.activeElement === document.body) next.focus({ preventScroll: true });
  }
  coverTurn.finished.then(finishOpening, finishOpening);
}

function changeView(toView, toPosition, direction) {
  if (turning) return;
  if (view === 'cover' && toView === 'artwork') { openCover(toPosition); return; }
  if (reducedMotion.matches || toView === 'cover') { finishTurn(toView,toPosition); return; }
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
cover.addEventListener('click', () => { if (Date.now() >= suppressCoverClickUntil) forward(); });
cover.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (Date.now() >= suppressCoverClickUntil) forward(); }
});
window.addEventListener('keydown', event => {
  if (lightbox.open || event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) return;
  if (event.key === 'ArrowRight') { event.preventDefault(); forward(); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); backward(); }
});
/* Touch navigation, version 7.
   Attach to the WHOLE notebook, including the cover and margins, rather than
   just the page stack. A user should be able to swipe anywhere on the book.
   Horizontal gestures are handled by the notebook. Vertical gestures continue
   to scroll the page normally. This also supports touch-enabled tablets. */
const swipeSurface = $('book');
let gesture = null;
let suppressArtworkClickUntil = 0;
let suppressCoverClickUntil = 0;

function beginGesture(x, y, id) {
  if (lightbox.open || turning) return;
  gesture = { x, y, id, lock: null };
}
function moveGesture(x, y, event) {
  if (!gesture) return;
  const dx = x - gesture.x, dy = y - gesture.y;
  if (!gesture.lock && Math.hypot(dx, dy) > 12) {
    gesture.lock = Math.abs(dx) > Math.abs(dy) * 1.15 ? 'horizontal' : 'vertical';
  }
  if (gesture.lock === 'horizontal' && event?.cancelable) event.preventDefault();
}
function finishGesture(x, y, event) {
  if (!gesture) return;
  const dx = x - gesture.x, dy = y - gesture.y;
  const locked = gesture.lock;
  gesture = null;
  if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy) * 1.15 || locked === 'vertical') return;
  // Prevent the synthetic click emitted after touchend from opening a painting
  // or re-opening a cover that has just been swiped away.
  suppressArtworkClickUntil = Date.now() + 800;
  suppressCoverClickUntil = Date.now() + 800;
  if (event?.cancelable) event.preventDefault();
  if (dx < 0) forward(); else backward();
}

swipeSurface.addEventListener('touchstart', event => {
  if (event.touches.length !== 1) { gesture = null; return; }
  const t = event.touches[0];
  beginGesture(t.clientX, t.clientY, t.identifier);
}, {passive: true});

swipeSurface.addEventListener('touchmove', event => {
  if (!gesture || event.touches.length !== 1) return;
  const t = event.touches[0];
  if (t.identifier !== gesture.id) return;
  moveGesture(t.clientX, t.clientY, event);
}, {passive: false});

swipeSurface.addEventListener('touchend', event => {
  if (!gesture) return;
  for (let i = 0; i < event.changedTouches.length; i++) {
    const t = event.changedTouches[i];
    if (t.identifier === gesture.id) {
      finishGesture(t.clientX, t.clientY, event);
      break;
    }
  }
}, {passive: false});

swipeSurface.addEventListener('touchcancel', () => { gesture = null; }, {passive: true});

/* Fallback for mouse/trackpad dragging and touch devices that primarily send
   pointer events. Touch pointers are excluded here to avoid double turns. */
let drag = null;
swipeSurface.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse' || event.button !== 0 || lightbox.open || turning) return;
  drag = {x: event.clientX, y: event.clientY, moved: false};
});
swipeSurface.addEventListener('pointermove', event => {
  if (!drag) return;
  if (Math.abs(event.clientX - drag.x) > 10) drag.moved = true;
});
swipeSurface.addEventListener('pointerup', event => {
  if (!drag) return;
  const {x,y,moved} = drag;
  drag = null;
  if (moved) {
    // Reuse the same distance and direction checks as touch navigation.
    beginGesture(x, y, 'mouse');
    finishGesture(event.clientX, event.clientY, event);
  }
});
swipeSurface.addEventListener('pointercancel', () => { drag = null; });
swipeSurface.addEventListener('dragstart', event => { if (event.target.closest('img')) event.preventDefault(); });

$('book').addEventListener('click', event => {
  const target = event.target.closest('.artwork-open');
  if (!target || turning || Date.now() < suppressArtworkClickUntil) return;
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