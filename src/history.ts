import { search } from './utils';
import type { HistoryEntry } from './types';
import 'roamjs-components/types';

export const addHistoryWatcher = () => {
  if (window.keepHistory) {
    window.removeEventListener('popstate', window.keepHistory);
  }

  if (!window.historyList) {
    window.historyList = [];
  }

  window.keepHistory = () => {
    setTimeout(() => {
      const str = document
        .querySelector('.roam-article .rm-title-display, .rm-block__input')
        .textContent;

      window.historyList = window.historyList.filter(e => e.hash !== location.hash);
      window.historyList.push({
        hash: location.hash,
        str: str.slice(0, 100) + location.hash,
      });
    });
  };

  window.addEventListener('popstate', window.keepHistory);
};

export const searchHistory = () => {
  if (window.historyList.length) {
    search(window.historyList, (e: HistoryEntry) => {
      const UID = e.hash.split('/').at(-1);
      window.roamAlphaAPI.ui.mainWindow.openPage({
        page: {
          uid: UID,
        },
      });
    });
  }
};

export const historyBack = () => {
  history.back();
};

export const historyForward = () => {
  history.forward();
};
