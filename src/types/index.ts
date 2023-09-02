import type Mousetrap from 'mousetrap-ts';
import type { PullBlock } from 'roamjs-components/types';

export type Target = string | HTMLElement[] | (() => HTMLElement[]);

export interface HintsTargetElem extends HTMLElement {
  data?: string;
}

export type HintsCallback = (elem: HintsTargetElem) => void | Promise<void>;

export type HintsOpts = {
  multiHits?: boolean;
  autoAction?: boolean;
  alsoVisible?: boolean;
};

export type HistoryEntry = {
  hash: string;
  str: string;
};

export type Block = {
  string: string;
  blocks: Block[];
};

export type SendBlockToRoamData = { page: string; blocks: Block[] };

export type AllPagesEntry = [string, string];

export type CustomCallbackFunction = (
  e?: KeyboardEvent,
  combo?: string,
) => void | boolean | Promise<void> | Promise<boolean>;

export type SrcBlk = {
  feature: string;
  descr: string;
  dir: string;
  file: string;
  lineno: number;
  col?: number;
  page_uid: string;
  parent_uid: string;
  blk_uid: string;
  time: number;
};

export interface AdvSearchMessageEvent extends MessageEvent {
  actionType: string;
  query: string;
};

// Many things are added to the window so that on reload they would be replaced
declare global {
  interface Window {
    srcBlks: SrcBlk[];
    allPages: AllPagesEntry[];
    webSockActive: boolean;
    pullPattern: string;
    prevDate: number;
    reloadSrcCacheBCReceiver: BroadcastChannel;
    roamPasteBCReceiver: BroadcastChannel;
    processPasteQueueTimeout: number;
    dailyPageManagementInterval: number;
    isDailyBusy: boolean;
    isAdvSearchTab: boolean;
    isDailyNotesTab: boolean;
    focusIframe(): void;
    Mousetrap: Mousetrap;
    hintsCount: number;
    ws: WebSocket;
    browserSyncBC: BroadcastChannel;
    reloadSrcCacheBC: BroadcastChannel;
    sessionTabBC: BroadcastChannel;
    roamPasteBC: BroadcastChannel;
    advSearchBC: BroadcastChannel;
    advSearchBCReceiver: BroadcastChannel;
    keepHistory(): void;
    historyList: HistoryEntry[];
    messageListener(event: MessageEvent): void;
    appendSrcCacheWatchFn: (before: PullBlock | null, after: PullBlock | null) => void;
    prevMsg: string;
  }
}
