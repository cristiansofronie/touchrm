const scrollElem = document.getElementsByClassName(
  'rm-article-wrapper',
)[0] as HTMLElement;

removeEventListener('popstate', window.restoreScroll);

const restoreScrollCallback = () => {
  // Special case that should not be here
  // if (window?.roamsr?.state?.status !== 'standby') return;

  // const storedScrollback = parseInt(localStorage.getItem('roam-scroll-' + location.hash)) || 0;
  scrollElem.scrollTop = 0;
  // scrollElem.scrollTop = storedScrollback;
  // console.log('Restoring scroll to', storedScrollback, 'for', location.href);
};

window.restoreScroll = (event: PopStateEvent) => {
  restoreScrollCallback();
};

addEventListener('popstate', window.restoreScroll);

scrollElem.removeEventListener('scroll', window.storeScroll);
window.storeScroll = () => {
  localStorage.setItem(
    'roam-scroll-' + location.hash,
    String(scrollElem.scrollTop),
  );
};
scrollElem.addEventListener('scroll', window.storeScroll);

export const pageDown = () => {
  const scrollElem = document.querySelector(
    '.rm-article-wrapper',
  ) as HTMLElement;
  scrollElem.scrollTop =
    scrollElem.scrollTop + Math.floor(window.innerHeight * 0.9);
};

export const pageUp = () => {
  const scrollElem = document.querySelector(
    '.rm-article-wrapper',
  ) as HTMLElement;
  scrollElem.scrollTop =
    scrollElem.scrollTop - Math.floor(window.innerHeight * 0.9);
};

export const scrollDown = () => {
  const scrollElem = document.querySelector(
    '.rm-article-wrapper',
  ) as HTMLElement;
  scrollElem.scrollTop =
    scrollElem.scrollTop + Math.floor(window.innerHeight * 0.2);
};

export const scrollUp = () => {
  const scrollElem = document.querySelector(
    '.rm-article-wrapper',
  ) as HTMLElement;
  scrollElem.scrollTop =
    scrollElem.scrollTop - Math.floor(window.innerHeight * 0.2);
};

export const scrollTop = () => {
  (document.querySelector('.rm-article-wrapper') as HTMLElement).scrollTop = 0;
};

export const scrollBottom = () => {
  const elem = [
    ...document.querySelectorAll('.rm-article-wrapper .rm-block__input'),
  ].at(-1);
  if (elem) {
    elem.scrollIntoView(true);
  }
};

export const sidePageDown = () => {
  const scrollElem = document.querySelector('#roam-right-sidebar-content');
  scrollElem.scrollTop =
    scrollElem.scrollTop + Math.floor(window.innerHeight * 0.9);
};

export const sidePageUp = () => {
  const scrollElem = document.querySelector('#roam-right-sidebar-content');
  scrollElem.scrollTop =
    scrollElem.scrollTop - Math.floor(window.innerHeight * 0.9);
};

export const scrollSideToTop = () => {
  document.getElementById('roam-right-sidebar-content').scrollTop = 0;
};

export const scrollSideToBottom = () => {
  const elem = document.getElementById('roam-right-sidebar-content');
  elem.scrollTop = elem.scrollHeight;
};

const TOP_MARGIN: number = Math.round(
  document.getElementsByClassName('rm-topbar')[0].getBoundingClientRect()
    .height,
);

const getBlks = (query: string) => {
  return ([...document.querySelectorAll(query)] as HTMLElement[]).sort(
    (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
  );
};

const elemUp = (elems: HTMLElement[], margin: number) => {
  const i =
    elems.findLastIndex(
      e => Math.round(e.getBoundingClientRect().top) < margin,
    ) + 1;
  elems[i - 1 > 0 ? i - 1 : 0].scrollIntoView(true);
};

const elemDown = (elems: HTMLElement[], margin: number) => {
  const i =
    elems.findIndex(e => Math.round(e.getBoundingClientRect().top) > margin) -
    1;
  elems[i + 1 < elems.length ? i + 1 : elems.length - 1]?.scrollIntoView(true);
};

export const mentionsDayUp = () => {
  elemUp(getBlks('.rm-page__title'), TOP_MARGIN);
};

export const blockDown = () => {
  elemDown(getBlks('.rm-page__title'), TOP_MARGIN);
};

export const scrollToPrevTopBlk = () => {
  elemUp(
    getBlks(
      '.rm-reference-main > div > .rm-reference-container > .rm-mentions > .rm-ref-page-view > div > div > .rm-reference-item, .roam-article > div > div:nth-child(2) > .roam-block-container:not(.rm-block--ghost)',
    ),
    TOP_MARGIN,
  );
};

export const scrollToNextTopBlk = () => {
  elemDown(
    getBlks(
      '.rm-reference-main > div > .rm-reference-container > .rm-mentions > .rm-ref-page-view > div > div > .rm-reference-item, .roam-article > div > div:nth-child(2) > .roam-block-container:not(.rm-block--ghost)',
    ),
    TOP_MARGIN,
  );
};
