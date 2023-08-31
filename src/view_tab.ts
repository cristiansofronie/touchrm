import { createHints } from './hints';

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
