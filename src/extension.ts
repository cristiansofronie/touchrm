import { createHints } from './hints';

export const reloadExtension = () => {
  createHints(
    () =>
      [
        ...document.getElementsByClassName('rm-code-warning'),
        ...document.getElementsByClassName('rm-roam-css'),
      ] as HTMLElement[],
    (elem: HTMLElement) => {
      new MutationObserver((mutationsList, observer) => {
        observer.disconnect();
        (mutationsList[0].target as HTMLElement)
          .getElementsByTagName('button')[0]
          .click();
      }).observe(elem, { attributes: true });
      elem.getElementsByTagName('button')[0].click();
    },
    { autoAction: true },
  );
  return false;
};

export const clickExtensionReloadButton = () => {
  createHints(
    () =>
      [
        ...document.querySelectorAll(
          ':where(.rm-code-warning, .rm-roam-css) button',
        ),
      ] as HTMLElement[],
    element => {
      return new Promise(resolve => {
        element.click();
        resolve();
      });
    },
    { autoAction: true },
  );
};
