import 'roamjs-components/types';

import { connectSock } from './ws';
import { addHistoryWatcher } from './history';
import { startManageDailyPage } from './daily';
import { addMappings, setupMappings } from './mappings';
import { addWindowMessageListener } from './pdf';
import { setupSrc } from './src';
import { setupAllPages } from './all_pages';
import { setupSession } from './session';
import { setupViewTab } from './view_tab';
import { setupAdvSearch } from './adv_search';
import { setupPasting } from './pasting';

setupPasting();

connectSock();

addHistoryWatcher();
addWindowMessageListener();
startManageDailyPage();

setupAdvSearch();
setupViewTab();
setupSession();
setupAllPages();
setupSrc();

setupMappings();
addMappings();
