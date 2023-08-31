import { createBlocks } from '../utils';
import { SendBlockToRoamData } from '../types';

export const handleSendBlockToRoam = (data: SendBlockToRoamData) => {
  let uid = window.roamAlphaAPI.util.dateToPageUid(new Date());

  if (data.page)
    uid = window.roamAlphaAPI.q(
      `[
          :find ?uid
          :in $ ?page
          :where
            [?node :node/title ?page]
            [?node :block/uid ?uid]
        ]`,
      data.page,
    )[0][0] as string;
  createBlocks(data.blocks, uid);
};
