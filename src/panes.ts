import { createHints } from './hints';

export const closeAllSidePanes = () => {
  (
    document.querySelectorAll('.bp3-icon-cross') as NodeListOf<HTMLElement>
  ).forEach(e => e.click());
};

export const closeSidePaneWithHints = () => {
  createHints(
    '.bp3-icon-cross',
    async (elem: HTMLElement) => {
      return new Promise<void>(resolve => {
        elem.click();
        setTimeout(() => {
          resolve();
        }, 100);
      });
    },
    { multiHits: true },
  );
};

export const openWinFromPane = () => {
  createHints('.rm-sidebar-window', elem => {
    const i = [...document.querySelectorAll('.rm-sidebar-window')].findIndex(
      e => e.innerHTML === elem.innerHTML,
    );

    const wins = window.roamAlphaAPI.ui.rightSidebar
      .getWindows()
      .sort((a, b) => a.order - b.order);

    const win = wins[i];
    const uid = win['window-id'].slice(-9);

    window.roamAlphaAPI.ui.mainWindow.openPage({ page: { uid } });
  });
};

export const closeFirstPane = () => {
  (document.querySelector('.bp3-icon-cross') as HTMLElement | null)?.click();
};

export const openWinFromFirstPane = () => {
  const win = window.roamAlphaAPI.ui.rightSidebar
    .getWindows()
    .sort((a, b) => b.order - a.order)
    .pop();

  const uid = win['window-id'].slice(-9);

  window.roamAlphaAPI.ui.mainWindow.openPage({ page: { uid } });
};
