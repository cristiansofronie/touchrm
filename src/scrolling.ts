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
  document.querySelector('#roam-right-sidebar-content').scrollTop = 0;
};
