import type Mousetrap from 'mousetrap-ts';
// import webpack from 'webpack';

export type Target = string | HTMLElement[] | (() => HTMLElement[]);

export interface MyMousetrap extends Mousetrap {
  myMousetrap?: boolean;
}

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

declare global {
  interface Window {
    focusIframe(): void;
    Mousetrap: MyMousetrap;
    hintsCount: number;
    ws: WebSocket;
    reloadAdvSearchBC: BroadcastChannel;
    browserSyncBC: BroadcastChannel;
    reloadSrcCacheBC: BroadcastChannel;
    sessionTabBC: BroadcastChannel;
    roamPasteBC: BroadcastChannel;
    syncAdvBrowserSearchBC: BroadcastChannel;
    keepHistory(): void;
    historyList: HistoryEntry[];
    messageListener(event: MessageEvent): void;
  }
}
