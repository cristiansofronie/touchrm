import { callNewTimeBlock } from './daily';
import { sleep } from './utils';

export const setupPasting = () => {
  if (!window.roamPasteBC) {
    window.roamPasteBC = new BroadcastChannel('roam_paste');
  }
};

if (!window.roamPasteBCReceiver) {
  window.roamPasteBCReceiver = new BroadcastChannel('roam_paste');
}

window.roamPasteBCReceiver.onmessage = e => {
  if (!window.isDailyNotesTab) return;
  pasteQueue.unshift(e.data);
  processPasteQueue();
};

const pasteQueue: string[] = [];

const processPasteQueueInternal = async () => {
  window.isDailyBusy = true;

  const dayUID = window.roamAlphaAPI.util.dateToPageUid(new Date());
  if (dayUID !== window.location.hash.split('/').pop()) {
    await window.roamAlphaAPI.ui.mainWindow.openPage({ page: { uid: dayUID } });
    sleep(100);
    callNewTimeBlock();
  }

  const blkUID = window.roamAlphaAPI.util.generateUID();
  await window.roamAlphaAPI.createBlock({
    location: {
      'parent-uid': dayUID,
      order: 'last',
    },
    block: {
      string: '',
      uid: blkUID,
    },
  });

  await window.roamAlphaAPI.ui.setBlockFocusAndSelection({
    location: {
      'window-id': 'main-window',
      'block-uid': blkUID,
    },
  });

  window.setTimeout(() => {
    const clipData = new DataTransfer();
    clipData.items.add(pasteQueue.pop(), 'text/html');

    document.activeElement.dispatchEvent(
      new ClipboardEvent('paste', {
        bubbles: true,
        clipboardData: clipData,
      }),
    );
    document.activeElement.scrollIntoView(true);
    window.setTimeout(() => {
      window.isDailyBusy = false;
      if (pasteQueue.length) {
        processPasteQueue();
      }
    });
  });
};

const processPasteQueue = async () => {
  window.clearTimeout(window.processPasteQueueTimeout);
  if (window.isDailyBusy) {
    window.processPasteQueueTimeout = window.setTimeout(
      processPasteQueueInternal,
      100,
    );
  } else {
    window.processPasteQueueTimeout = window.setTimeout(
      processPasteQueueInternal,
    );
  }
};
