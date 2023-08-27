export const openInViewTab = () => {
  const item = document.querySelector('.bp3-active') as HTMLElement ||
    document.querySelector('.bp3-menu-item:not(:has(.rm-new-item))') as HTMLElement;
  let uid = (item.querySelector('[data-uid]') as HTMLElement | null)?.dataset.uid;

  if (!uid) {
    uid = window.roamAlphaAPI.q(`[
      :find ?uid .
      :in $ ?title
      :where
        [?page :node/title ?title]
        [?page :block/uid ?uid]
    ]`, item.textContent) as unknown as string;
  }
  window.browserSyncBC.postMessage({loc: 'main', UID: uid});

  return false;
};
