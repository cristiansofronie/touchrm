import { createHints } from './hints';

export const openRef = () => {
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
