import { handleSendBlockToRoam } from './handlers';

const PORT = 8181;
window.ws;

export const handleMessage = async (e: MessageEvent) => {
  window.webSockActive = true;
  const res = JSON.parse(e.data);

  if (res.actionType === 'sendBlockToRoam') {
    handleSendBlockToRoam({ page: res.page, blocks: res.blocks });
  } else if (res.actionType === 'reloadSrcCache') {
    window.reloadSrcCacheBC.postMessage('reload');
  } else if (res.actionType === 'reloadAdvSearch') {
    window.advSearchBC.postMessage('reload');
  } else if (res.actionType === 'pasteDailyNotes') {
    window.roamPasteBC.postMessage(res.data);
  } else if (res.actionType === 'roamAdvancedSearch') {
    window.advSearchBC.postMessage(res.query);
  } else if (res.actionType === 'queryRoam') {
    const result = window.roamAlphaAPI.q(res.query);
    window.ws.send(
      JSON.stringify({
        actionType: 'queryResult',
        result,
      }),
    );
  } else if (res.actionType === 'openWebsite') {
    const queryResults = (
      window.roamAlphaAPI.q(
        `[
          :find ?t ?str ?time
          :in $ ?regex
          :where
            [?page :node/title ?t]
            [(re-pattern ?regex) ?re]
            [(re-find ?re ?t)]
            [?refs :block/refs ?page]
            [?refs :block/children ?c]
            [?c :block/string ?str]
            [(re-pattern "^http.*") ?linkPat]
            [(re-find ?linkPat ?str)]
            [?c :edit/time ?time]
        ]`,
        res.pattern + '.*Website$',
      ) as unknown as [string, string, string][]
    )?.sort((a, b) => a[0].length - b[0].length);

    if (!queryResults.length) return;

    const bestMatches = queryResults
      .filter(e => e[0] === queryResults[0][0])
      .sort((a, b) => parseInt(b[2]) - parseInt(a[2]));
    const bestMatch = bestMatches[0];
    const href = bestMatch[1];
    top.postMessage({ actionType: 'openInSearchWin', URL: href });
  } else if (res.actionType === 'tmuxOpenFile') {
    const queryResults = (
      window.roamAlphaAPI.q(
        `[
          :find ?t ?str ?u ?time
          :in $ ?regex
          :where
            [?b :node/title ?t]
            [(re-pattern ?regex) ?re]
            [(re-find ?re ?t)]
            [?b :block/uid ?u]
            [?r :block/refs ?b]
            [?r :block/children ?c]
            [?c :block/refs ?cf]
            [?cf :node/title "roam_file_link"]
            [?c :block/string ?str]
            [?c :edit/time ?time]
        ]`,
        res.pattern,
      ) as unknown as [string, string, string, string][]
    )?.sort((a, b) => a[0].length - b[0].length);

    if (!queryResults.length) return;

    const bestMatches = queryResults
      .filter(e => e[0] === queryResults[0][0])
      .sort((a, b) => parseInt(b[3]) - parseInt(a[3]));
    const bestMatch = bestMatches[0];
    const txt = bestMatch[1];

    if (!txt) return;

    window.browserSyncBC.postMessage({
      loc: 'main',
      UID: bestMatch[2],
    });

    const parsed = txt.split("'");
    window.ws.send(
      JSON.stringify({
        actionType: 'openSingleFileInTmux',
        data: {
          file: parsed[1],
          lineNo: parsed[3],
          target: parsed[5],
        },
      }),
    );
  } else if (res.actionType === 'roamOpenInViewTab') {
    window.browserSyncBC.postMessage({
      loc: res.loc,
      UID: res.UID,
      justHistory: res.justHistory,
    });
  } else if (res.actionType === 'openSearchRoam') {
    let justHistory = false;

    const cmdArray = res.pattern.split(' ');
    const flags = cmdArray.filter((e: string) => e[0] === ';');
    const patternArray = cmdArray.filter((e: string) => e[0] !== ';');

    if (flags.some((e: string) => e === ';s')) {
      patternArray.splice(1, 0, '(snippet|script)');
      justHistory = true;
    }
    const pattern = patternArray.join('.*');

    const openSearchRoamOpen = () => {
      if (flags.some((e: string) => e === ';s')) {
        let codeBlks = (
          window.roamAlphaAPI.q(
            `[
            :find ?str
            :in $ ?uid
            :where
              [?node :block/uid ?uid]
              [?blk_with_ref :block/refs ?node]
              [?blk_with_ref :block/children ?child]
              [?child :block/string ?str]
          ]`,
            pages[0][1],
          ) as unknown as [string][]
        ).map(blk => {
          return blk[0]
            .replace(new RegExp('^' + '`'.repeat(3) + 'javascript\n'), '')
            .replace(new RegExp('`'.repeat(3) + '$'), '')
            .trim();
        });

        window.ws.send(
          JSON.stringify({
            actionType: 'copy',
            data: {
              text: codeBlks[0],
            },
          }),
        );
      }

      if (pages[0][0].startsWith('roam/session/')) {
        window.sessionTabBC.postMessage({ UID: pages[0][1] });
      } else {
        window.browserSyncBC.postMessage({
          loc: 'main',
          UID: pages[0][1],
          justHistory,
        });
      }
    };

    let pages = window.allPages
      .filter(e => new RegExp(pattern, 'i').test(e[0]))
      .sort((a, b) => a[0].length - b[0].length);

    if (pages.length) {
      openSearchRoamOpen();
    } else {
      window.allPages = window.roamAlphaAPI.q(
        '[:find ?t ?uid :where [?n :node/title ?t][?n :block/uid ?uid]]',
      ) as unknown as [string, string][];
    }

    pages = window.allPages
      .filter(e => new RegExp(res.pattern, 'i').test(e[0]))
      .sort((a, b) => a[0].length - b[0].length);

    if (pages.length) {
      openSearchRoamOpen();
    }
  }
};

export const connectSock = () => {
  window.ws = new WebSocket(`ws://localhost:${PORT}`);
  window.ws.onopen = () => {
    window.ws.send(
      JSON.stringify({
        actionType: 'setRoamWs',
      }),
    );
  };
  window.ws.onmessage = handleMessage;
  window.ws.onclose = () => {
    window.webSockActive = false;
    setTimeout(connectSock, 1000);
  };
};
