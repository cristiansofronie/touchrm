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
    const str = window.roamAlphaAPI.q(
      `[
      :find ?str .
      :in $ ?uid
      :where
        [?blk :block/uid ?uid]
        (or
          [?blk :node/title ?str]
          [?blk :block/string ?str]
        )
    ]`,
      location.hash.split('/').at(-1),
    ) as unknown as string | null;

    if (str)
      window.historyList.push({
        hash: location.hash,
        str: str.slice(0, 100),
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
