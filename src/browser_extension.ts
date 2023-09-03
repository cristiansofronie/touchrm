import { createHints } from './hints';

// Stuff here only works if there is an external extension that implements
// handlers for these messages

export const browserSearch = () => {
  const sele = document.getSelection().toString();

  window.advSearchBC.postMessage({
    actionType: 'doAdvSearch',
    query: sele,
  });

  try {
    navigator.clipboard.writeText(sele);
  } catch {}

  top.postMessage(
    {
      actionType: 'syncSearch',
      seleTxt: sele,
    },
    '*',
  );
  return false;
};

export const openHrefInTheSearchWin = () => {
  createHints('.rm-block__input a[href]', elem => {
    top.postMessage({ actionType: 'openInSearchWin', URL: (elem as HTMLAnchorElement).href });
  });
};
