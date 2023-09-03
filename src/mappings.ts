import Mousetrap from 'mousetrap-ts';

import type { CustomCallbackFunction } from './types';
import { focusIframe } from './pdf';
import {
  scrollTop,
  scrollBottom,
  pageDown,
  pageUp,
  scrollDown,
  scrollUp,
  scrollSideToTop,
  sidePageDown,
  sidePageUp,
} from './scrolling';
import { historyForward, historyBack, searchHistory } from './history';
import {
  closeAllSidePanes,
  closeSidePaneWithHints,
  openWinFromPane,
  closeFirstPane,
  openWinFromFirstPane,
} from './panes';
import { openAdvSearchResultInViewTab } from './view_tab';
import {
  addArticleBlock,
  expandBlock,
  newNoteUnderTag,
  deleteCurrentBlock,
  expandAll,
  newNoteUnderTagFromTextarea,
} from './block';
import {
  focusPrevSiblingBlk,
  focusNextSiblingBlk,
  focusNextBlkStart,
  focusNextBlk,
  focusPrevBlkStart,
  focusPrevBlk,
  focusBlockWithHints,
} from './focus_block';
import { callPrevHints } from './hints';
import { quickSearchWithClip } from './search';
import { reloadExtension, clickExtensionReloadButton } from './extension';
import { openRefInViewTab } from './view_tab';
import { copyTitle, focusTitle } from './title';
import { browserSearch, openHrefInTheSearchWin } from './browser_extension';
import { copyCodeBlock, enterCodeMirror } from './code_block';
import { newTimeBlock, nestBlocksUnderPreviousTime } from './daily';
import { reloadAdvSearch } from './adv_search';

const normalBind = (keys: string, callback: CustomCallbackFunction) => {
  const _bindKey = (keys: string, callback: CustomCallbackFunction) => {
    window.Mousetrap.bind(
      keys,
      (event?: KeyboardEvent, combo?: string) => {
        if (!document.activeElement) return;
        const tagName = document.activeElement.tagName;
        if (
          tagName === 'TEXTAREA' ||
          tagName === 'INPUT' ||
          document.activeElement.matches('[contenteditable]')
        )
          return;

        callback(event, combo);
        return false;
      },
      'keydown',
    );
  };

  _bindKey(keys, callback);
};

const globalBind = (keys: string, callback: CustomCallbackFunction) => {
  window.Mousetrap.bind(
    keys,
    (e?: KeyboardEvent, combo?: string) => {
      callback(e, combo);
      return false;
    },
    'keydown',
  );
};

export const setupMappings = () => {
  if (window.Mousetrap) {
    window.Mousetrap.destroy();
  }
  window.Mousetrap = new Mousetrap(document.documentElement, true);

  window.hintsCount = 1;
};

export const addMappings = () => {
  normalBind('g o', openHrefInTheSearchWin);

  normalBind('g r', clickExtensionReloadButton);

  globalBind('alt+l', reloadAdvSearch);

  globalBind('alt+shift+p', focusPrevBlkStart);
  globalBind('alt+p', focusPrevBlk);

  globalBind('alt+n', focusNextBlk);
  globalBind('alt+shift+n', focusNextBlkStart);

  globalBind('ctrl+shift+n', focusNextSiblingBlk);
  globalBind('ctrl+shift+p', focusPrevSiblingBlk);

  globalBind('alt+q', focusIframe);

  normalBind('g g', scrollTop);
  normalBind('shift+g', scrollBottom);
  normalBind('d', pageDown);
  normalBind('shift+u', pageDown);
  normalBind('u', pageUp);
  normalBind('j', scrollDown);
  normalBind('k', scrollUp);

  globalBind('alt+j', scrollDown);
  globalBind('alt+k', scrollUp);

  normalBind('{', scrollSideToTop);
  normalBind('N', sidePageDown);
  normalBind('P', sidePageUp);

  normalBind('g h', searchHistory);
  normalBind('shift+b', historyBack);
  normalBind('shift+o', historyForward);

  globalBind('alt+s alt+x', closeAllSidePanes);
  normalBind('shift+x', closeSidePaneWithHints);
  normalBind('i', openWinFromFirstPane);
  normalBind('shift+i', openWinFromPane);
  normalBind('x', closeFirstPane);

  globalBind('alt+o', openAdvSearchResultInViewTab);

  globalBind('alt+c', addArticleBlock);

  normalBind('z o', expandBlock);

  normalBind('.', callPrevHints);
  globalBind('alt+s shift+u', newNoteUnderTag);
  globalBind('alt+shift+d', deleteCurrentBlock);

  normalBind('/', quickSearchWithClip);

  normalBind('alt+s shift+r', reloadExtension);

  normalBind('f', openRefInViewTab);
  normalBind('s', focusBlockWithHints);
  normalBind('shift+y i', copyTitle);
  normalBind('g e', expandAll);
  normalBind('e', focusTitle);
  globalBind('alt+v', browserSearch);
  normalBind('y l', copyCodeBlock);
  normalBind('a i', enterCodeMirror);

  normalBind('g alt+n', newTimeBlock);
  normalBind('g shift+n', nestBlocksUnderPreviousTime);

  globalBind('alt+h', newNoteUnderTagFromTextarea);
};
