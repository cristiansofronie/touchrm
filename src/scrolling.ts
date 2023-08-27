export const pageDown = () => {
  const scrollElem = document.querySelector(
    '.rm-article-wrapper',
  ) as HTMLElement;
  scrollElem.scrollTop =
    scrollElem.scrollTop + Math.floor(window.innerHeight * 0.9);
  return false;
};

export const pageUp = () => {
  const scrollElem = document.querySelector('.rm-article-wrapper') as HTMLElement;
  scrollElem.scrollTop =
    scrollElem.scrollTop - Math.floor(window.innerHeight * 0.9);
  return false;
};

export const scrollDown = () => {
  const scrollElem = document.querySelector('.rm-article-wrapper') as HTMLElement;
  scrollElem.scrollTop =
    scrollElem.scrollTop + Math.floor(window.innerHeight * 0.2);
  return false;
};

export const scrollUp = () => {
  const scrollElem = document.querySelector('.rm-article-wrapper') as HTMLElement;
  scrollElem.scrollTop =
    scrollElem.scrollTop - Math.floor(window.innerHeight * 0.2);
  return false;
};

export const scrollTop = () => {
  (document.querySelector('.rm-article-wrapper') as HTMLElement).scrollTop = 0;
  return false;
};

export const scrollBottom = () => {
  const elem = [
    ...document.querySelectorAll('.rm-article-wrapper .rm-block__input')
  ].at(-1);
  if (elem) {
    elem.scrollIntoView(true);
  }
  return false;
};
