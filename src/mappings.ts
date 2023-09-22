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
  scrollSideToBottom,
  sidePageDown,
  sidePageUp,
  blockDown,
  mentionsDayUp,
  scrollToNextTopBlk,
  scrollToPrevTopBlk,
} from './scrolling';
import { deletePage } from './page';
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
  openBlkInSidebarCollapsed,
  newNoteUnderTag,
  deleteCurrentBlock,
  expandAll,
  newNoteUnderTagFromTextarea,
  deleteBlk,
  expandEmbeds,
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
import { toggleLinkedRefs } from './references';

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
        window.Mousetrap._resetSequences();
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
  normalBind('shift+r', deletePage);
  globalBind('alt+4', toggleLinkedRefs);

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
  normalBind('shift+f4', mentionsDayUp);
  normalBind('f4', blockDown);
  normalBind('t', scrollToNextTopBlk);
  normalBind('shift+t', scrollToPrevTopBlk);

  globalBind('alt+j', scrollDown);
  globalBind('alt+k', scrollUp);

  normalBind('shift+[', scrollSideToTop);
  normalBind('shift+]', scrollSideToBottom);
  normalBind('shift+n', sidePageDown);
  normalBind('shift+p', sidePageUp);

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
  globalBind('alt+[', expandEmbeds);

  normalBind('z o', expandBlock);
  normalBind('o b', openBlkInSidebarCollapsed);

  normalBind('.', callPrevHints);
  globalBind('alt+s shift+u', newNoteUnderTag);
  globalBind('alt+shift+d', deleteCurrentBlock);

  normalBind('/', quickSearchWithClip);

  normalBind('alt+s shift+r', reloadExtension);

  normalBind('f', openRefInViewTab);
  normalBind('s', focusBlockWithHints);
  normalBind('shift+d', deleteBlk);
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
