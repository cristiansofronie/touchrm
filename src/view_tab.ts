import { createHints } from './hints';

window.roamAlphaAPI.ui.commandPalette.addCommand({
  label: 'Toggle commander view tab',
  callback: () => {
    window.commanderViewPage = !window.commanderViewPage;
  },
});

if (!window.browserSyncBCReceiver) {
  window.browserSyncBCReceiver = new BroadcastChannel('browser_sync');
}

window.browserSyncBCReceiver.onmessage = async e => {
  if (!window.commanderViewPage) return;

  const uid = e.data.UID;
  const loc = e.data.loc;

  if (e.data.justHistory) {
    const title = window.roamAlphaAPI.q(`[
      :find ?title .
      :in $ ?uid
      :where
      [?node :block/uid ?uid]
      [?node :node/title ?title]
    ]`, uid) as unknown as string | undefined;

    if (title) {
      const histEntry = {
        hash: `#/app/StudyDatabase/page/${uid}`,
        str: title,
      };

      window.historyList = window.historyList.filter(e => e.hash !== location.hash);
      window.historyList.push(histEntry);
    }

    return;
  }

  if (loc === 'main') {
    window.roamAlphaAPI.ui.mainWindow.openPage({ page: { uid } });
  } else if (loc === 'sidebar') {
    window.roamAlphaAPI.ui.rightSidebar.addWindow({
      window: {
        type: 'block',
        'block-uid': uid,
      },
    });
  }
};

export const setupViewTab = () => {
  if (!window.browserSyncBC) {
    window.browserSyncBC = new BroadcastChannel('browser_sync');
  }
};

export const openRefInViewTab = () => {
  createHints(
    [
      ...document.querySelectorAll(
        '.rm-block__input .rm-page-ref, .rm-title-display .rm-page-ref',
      ),
    ] as HTMLElement[],
    elem => {
      const UID = window.roamAlphaAPI.q(
        `[:find ?u . :in $ ?t :where [?b :node/title ?t][?b :block/uid ?u]]`,
        elem.innerText,
      );
      window.browserSyncBC.postMessage({ loc: 'main', UID });
    },
  );
  return false;
};

export const openAdvSearchResultInViewTab = () => {
  const item =
    (document.querySelector('.bp3-active') as HTMLElement) ||
    (document.querySelector(
      '.bp3-menu-item:not(:has(.rm-new-item))',
    ) as HTMLElement);
  let uid = (item.querySelector('[data-uid]') as HTMLElement | null)?.dataset
    .uid;

  if (!uid) {
    uid = window.roamAlphaAPI.q(
      `[
      :find ?uid .
      :in $ ?title
      :where
        [?page :node/title ?title]
        [?page :block/uid ?uid]
    ]`,
      item.textContent,
    ) as unknown as string;
  }
  window.browserSyncBC.postMessage({ loc: 'main', UID: uid });

  return false;
};
