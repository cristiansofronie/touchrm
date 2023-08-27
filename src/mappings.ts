import { globalBind, normalBind } from './utils';
import { focusIframe } from './pdf';
import {
  scrollTop,
  scrollBottom,
  pageDown,
  pageUp,
  scrollDown,
  scrollUp,
} from './scrolling';
import { historyForward, historyBack, searchHistory } from './history';
import {
  closeAllSidePanes,
  closeSidePaneWithHints,
  openWinFromPane,
  closeFirstPane,
  openWinFromFirstPane,
} from './panes';
import { openInViewTab } from './adv_search';
import {
  addArticleBlock,
  expandBlock,
  newNoteUnderTag,
  deleteCurrentBlock,
  expandAll,
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
import { reloadExtension } from './extension';
import { openRef } from './view_tab';
import { copyTitle, focusTitle } from './title';
import { search } from './misc';
import { copyCodeBlock, enterCodeMirror } from './code_block';

export const addMappings = () => {
  globalBind('alt+shift+p', focusPrevBlkStart);
  globalBind('alt+p', focusPrevBlk);

  globalBind('alt+n', focusNextBlk);
  globalBind('alt+shift+n', focusNextBlkStart);

  globalBind('ctrl+shift+n', event => {
    event.stopImmediatePropagation();
    event.preventDefault();
    return focusNextSiblingBlk();
  });
  globalBind('ctrl+shift+p', event => {
    event.stopImmediatePropagation();
    event.preventDefault();
    return focusPrevSiblingBlk();
  });

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

  normalBind('g h', searchHistory);
  normalBind('shift+b', historyBack);
  normalBind('shift+o', historyForward);

  globalBind('alt+s alt+x', closeAllSidePanes);
  normalBind('shift+x', closeSidePaneWithHints);
  normalBind('i', openWinFromFirstPane);
  normalBind('shift+i', openWinFromPane);
  normalBind('x', closeFirstPane);

  globalBind('alt+o', openInViewTab);

  globalBind('alt+c', () => {
    addArticleBlock();
    return false;
  });

  normalBind('z o', expandBlock);

  normalBind('.', callPrevHints);
  globalBind('alt+s shift+u', newNoteUnderTag);
  globalBind('alt+shift+d', deleteCurrentBlock);

  normalBind('/', () => {
    quickSearchWithClip();
    return false;
  });

  normalBind('alt+s shift+r', reloadExtension);

  normalBind('f', openRef);
  normalBind('s', focusBlockWithHints);
  normalBind('shift+y i', copyTitle);
  normalBind('g e', expandAll);
  normalBind('e', focusTitle);
  globalBind('alt+v', search);
  normalBind('y l', copyCodeBlock);
  normalBind('a i', enterCodeMirror);
};
