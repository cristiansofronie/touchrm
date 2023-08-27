import Mousetrap from 'mousetrap-ts';
import { addMappings } from './mappings';
import { addHistoryWatcher } from './history';
import 'roamjs-components/types';
import { addWindowMessageListener } from './pdf';

if (!window.roamPasteBC) {
  window.roamPasteBC = new BroadcastChannel('roam_paste');
}

if (!window.sessionTabBC) {
  window.sessionTabBC = new BroadcastChannel('session_tab');
}

if (!window.reloadSrcCacheBC) {
  window.reloadSrcCacheBC = new BroadcastChannel('reload_src_cache');
}

if (!window.browserSyncBC) {
  window.browserSyncBC = new BroadcastChannel('browser_sync');
}

if (!window.reloadAdvSearchBC) {
  window.reloadAdvSearchBC = new BroadcastChannel('reload_adv_search');
}

if (!window.syncAdvBrowserSearchBC) {
  window.syncAdvBrowserSearchBC = new BroadcastChannel('sync_adv_search');
}

if (window.Mousetrap) {
  window.Mousetrap.destroy();
}

window.Mousetrap = new Mousetrap(document.documentElement, true);
window.Mousetrap.myMousetrap = true;

addHistoryWatcher();

// For repeating stuff
window.hintsCount = 1;
addMappings();

addWindowMessageListener();
