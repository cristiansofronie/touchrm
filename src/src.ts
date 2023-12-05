import type { PullBlock } from 'roamjs-components/types';

export const setupSrc = () => {
  if (!window.reloadSrcCacheBC) {
    window.reloadSrcCacheBC = new BroadcastChannel('reload_src_cache');
  }

  if (!window.reloadSrcCacheBCReceiver) {
    window.reloadSrcCacheBCReceiver = new BroadcastChannel('reload_src_cache');
  }

  window.reloadSrcCacheBCReceiver.onmessage = () => {
    reloadSrcBlkCache();
  };

  window.roamAlphaAPI.ui.commandPalette.addCommand({
    label: 'Reload src cache',
    callback: reloadSrcBlkCache,
  });

  if (!window.srcBlks) {
    window.setTimeout(() => {
      reloadSrcBlkCache();
    }, 1000 * 30);
  }

  startWatchForNewSrcBlks();
};

export const reloadSrcBlkCache = () => {
  console.log('Reloading src blocks');
  const oldStyleSrcBlks = (
    window.roamAlphaAPI.q(
      `[
        :find ?t ?str ?uid ?time ?parent_str ?parent_uid ?blk_uid
        :where
          [?cf :node/title "tmux_view_file"]
          [?c :block/refs ?cf]
          [?r :block/children ?c]
          [?r :block/refs ?b]
          [?r :block/string ?parent_str]
          [?r :block/uid ?parent_uid]
          [?b :node/title ?t]
          [(re-pattern ".*Src$") ?re]
          [(re-find ?re ?t)]
          [?b :block/uid ?uid]
          [?c :block/string ?str]
          [?c :edit/time ?time]
          [?c :block/uid ?blk_uid]
      ]`,
    ) as unknown as [string, string, string, string, string, string, string][]
  )
    ?.sort((a, b) => a[0].length - b[0].length)
    .map(e => {
      const parsed = e[1].split("'");

      return {
        feature: e[0].replace(/ Src$/, ''),
        descr: e[4],
        dir: parsed[3],
        file: parsed[5],
        lineno: parseInt(parsed[7]),
        col: 0,
        page_uid: e[2],
        parent_uid: e[5],
        blk_uid: e[6],
        time: parseInt(e[3]),
      };
    });

  const newStyleSrcBlks = (
    window.roamAlphaAPI.q(
      `[
        :find ?t ?str ?page_uid ?edit_time ?parent_str ?parent_uid ?blk_uid
        :where
          [?cf :node/title "src_entry_1"]
          [?c :block/refs ?cf]
          [?r :block/children ?c]
          [?r :block/refs ?b]
          [?r :block/string ?parent_str]
          [?r :block/uid ?parent_uid]
          [?b :node/title ?t]
          [(re-pattern ".*Src$") ?re]
          [(re-find ?re ?t)]
          [?b :block/uid ?page_uid]
          [?c :block/string ?str]
          [?c :edit/time ?edit_time]
          [?c :block/uid ?blk_uid]
      ]`,
    ) as unknown as [string, string, string, string, string, string, string][]
  )
    ?.sort((a, b) => a[0].length - b[0].length)
    .map(e => {
      let parsed;
      try {
        parsed = JSON.parse(e[1]);
      } catch (error) {
        console.error('Failed to parse:', e);
      }

      parsed.feature = e[0].replace(/ Src$/, '');
      parsed.page_uid = e[2];
      parsed.time = parseInt(e[3]);
      parsed.descr = e[4];
      parsed.parent_uid = e[5];
      parsed.blk_uid = e[6];

      return parsed;
    });

  window.srcBlks = oldStyleSrcBlks.concat(newStyleSrcBlks);

  window.ws.send(
    JSON.stringify({
      actionType: 'reloadSrcCache',
      data: {
        srcBlks: window.srcBlks,
      },
    }),
  );
};

const startWatchForNewSrcBlks = () => {
  if (!window.isDailyNotesTab) return;

  setInterval(
    () => {
      if (window.prevDate !== new Date().getDay()) {
        startWatchForNewSrcBlks();
      }
    },
    5 * 60 * 1000,
  );

  window.prevDate = new Date().getDay();

  window.pullPattern =
    '[:block/refs {:block/refs [:node/title :block/uid]} :block/string :block/uid :edit/time {:block/children ...}]';
  const entity = `[:block/uid "${window.roamAlphaAPI.util.dateToPageUid(
    new Date(),
  )}"]`;

  window.appendSrcCacheWatchFn = (
    before: PullBlock | null,
    after: PullBlock | null,
  ) => {
    const last = after[':block/children'].at(-1);
    if (last[':block/string'].length) {
      if (/src_entry_1/.test(last[':block/children'][0][':block/string'])) {
        const title = (last[':block/refs'] as PullBlock[]).find(
          (e: PullBlock) => e[':node/title'].endsWith(' Src'),
        )[':node/title'];
        const parent_str = last[':block/string'];
        const parent_uid = last[':block/uid'];
        const str = last[':block/children'][0][':block/string'];
        const blk_uid = last[':block/children'][0][':block/uid'];
        const page_uid = (last[':block/refs'][0] as PullBlock)[':block/uid'];
        const time = last[':block/children'][0][':edit/time'];

        const entry = JSON.parse(str);

        entry.feature = title.replace(/ Src$/, '');
        entry.page_uid = page_uid;
        entry.time = parseInt(time as unknown as string);
        entry.descr = parent_str;
        entry.parent_uid = parent_uid;
        entry.blk_uid = blk_uid;

        window.srcBlks.push(entry);

        const msg = JSON.stringify({
          actionType: 'appendToSrcBlks',
          data: {
            srcBlk: entry,
          },
        });

        if (msg !== window.prevMsg) {
          window.ws.send(msg);
          window.prevMsg = msg;
        }

        window.srcBlks.sort((a, b) => a.feature.length - b.feature.length);
      }
    }
  };

  window.roamAlphaAPI.data.removePullWatch(
    window.pullPattern,
    entity,
    window.appendSrcCacheWatchFn,
  );
  console.log('Removed pull watch');

  window.roamAlphaAPI.data.addPullWatch(
    window.pullPattern,
    entity,
    window.appendSrcCacheWatchFn,
  );
  console.log('Added pull watch');
};
