export const setupAllPages = () => {
  if (!window.allPages) {
    window.allPages = [];
    window.setTimeout(() => {
      reloadAllPages();
    }, 1000 * 30);
  }
};

export const reloadAllPages = () => {
  window.allPages = window.roamAlphaAPI.q(
    '[:find ?t ?uid :where [?n :node/title ?t][?n :block/uid ?uid]]',
  ) as unknown as [string, string][];
};
