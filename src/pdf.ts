import { search, titleMatchRegEx, blkStr } from './utils';

export const focusIframe = () => {
  const video = document.getElementsByClassName(
    'rm-video-player',
  )?.[0] as HTMLIFrameElement;
  const PDFActivated = document.getElementsByClassName(
    'pdf-activated',
  )?.[0] as HTMLIFrameElement;
  if (video) {
    video.contentWindow.postMessage({ actionType: 'selectVideo' }, '*');
  } else if (PDFActivated) {
    PDFActivated.scrollIntoView(true);
    (document.getElementsByClassName('roam-article')[0] as HTMLElement).click();
    PDFActivated.focus();
  }
  return false;
};

const focusLastHighGroup = async () => {
  const blk = [
    ...document.querySelectorAll(
      `[data-page-links*="PDF Highlights"] .rm-level-1 > .roam-block-container > .rm-block-main .rm-block__input`,
    ),
  ].at(-1);
  const UID = blk.id.slice(-9);
  const winID = blk.id.slice(12, -10);

  await window.roamAlphaAPI.ui.setBlockFocusAndSelection({
    location: {
      'window-id': winID,
      'block-uid': UID,
    },
  });
};

const focusSecondToLastHighGroup = async () => {
  const pdfHighTag = 'PDF Highlights';

  const tBlk = [
    ...document.querySelectorAll(
      `[data-page-links*="${pdfHighTag}"] .rm-level-1 > .roam-block-container > .rm-block-main .rm-block__input`,
    ),
  ].slice(-2, -1)[0];

  const tBlkUID = tBlk.id.slice(-9);
  const tWinID = tBlk.id.slice(12, -10);

  await window.roamAlphaAPI.ui.setBlockFocusAndSelection({
    location: {
      'window-id': tWinID,
      'block-uid': tBlkUID,
    },
  });
};

const handleSearchInRoamTitles = (event: MessageEvent) => {
  const searchInRoamTitles = (str: string) => {
    return titleMatchRegEx('(?i)' + str.split(' ').join('.*'));
  };

  const results = searchInRoamTitles(event.data.str).map(e => {
    return { str: e[0] as string, UID: e[1] };
  });

  if (results.length) {
    search(results, e => {
      const blk = [
        ...document.querySelectorAll(
          `[data-page-links*="PDF Highlights"] .rm-level-1 > .roam-block-container > .rm-block-main .rm-block__input`,
        ),
      ].at(-1);
      const uid = blk.id.slice(-9);
      const str = blkStr(uid);
      if (!str) return;
      let newStr;
      if (str.trim()) {
        newStr = str + '\n[[' + e.str + ']]';
      } else {
        newStr = `[[${e.str}]]`;
      }
      window.roamAlphaAPI.updateBlock({
        block: {
          uid: uid,
          string: newStr,
        },
      });
      focusIframe();
    });
  }
};

export const addWindowMessageListener = () => {
  window.removeEventListener('message', window.messageListener);
  window.messageListener = (event: MessageEvent) => {
    switch (event.data.actionType) {
      case 'focus':
        focusLastHighGroup();
        break;
      case 'focusSecondToLastHighGroup':
        focusSecondToLastHighGroup();
        break;
      case 'searchInRoamTitles':
        handleSearchInRoamTitles(event);
        break;
    }
  };

  window.addEventListener('message', window.messageListener);
};

// export const addWindowMessageListener = () => {
//   window.removeEventListener('message', window.messageListener);
//       case 'scrollToHigh':
//         // top.focus();
//         // touchrm.util.createHints([...document.querySelectorAll('.btn-pdf-activated')].reverse(), async e => {
//         //   e.click();
//         //   focusIframe();
//         //   focusIframe();
//         //   focusIframe();
//         // });
//         break;
//       case 'moveMarkMeta':
//         window.moveMarkMeta();
//         break;
//       case 'focusAndBack':
//         // window.onfocus = () => {
//         //   focusIframe();
//         //   window.onfocus = () => {};
//         // };
//         break;
//       case 'nestPartHigh':
//         nestPartHigh();
//         break;
//       case 'focusSecondToLastHighGroup':
//         focusSecondToLastHighGroup();
//         break;
//       case 'openHlBlock':
//         event.stopImmediatePropagation();
//         event.preventDefault();
//         console.log(event);
//         const bc = new BroadcastChannel('browser_sync');
//         bc.postMessage(event.data.highlight.id);
//         break;
//       case 'addMeta':
//         addMeta(event.data.seleTxt);
//         break;
//       case 'processQueue':
//         roam42.common.createBlock('_X1_7bofN', 'last', event.data.seleTxt);
//         break;
//       case 'added':
//         document.querySelector('.pdf-activated').contentWindow.postMessage(
//           {
//             actionType: 'addedReceived',
//           },
//           '*',
//         );
//         //scrollToTopLastBlk();
//         break;
//       case 'nestHigh':
//         let nestHighTimeout;

//         const observer = new MutationObserver(mList => {
//           clearTimeout(nestHighTimeout);
//           nestHighTimeout = setTimeout(autoNestHigh, 100);
//         });
//         observer.observe(
//           document.querySelector(
//             '[data-page-links*="PDF Highlights"].roam-block-container .rm-block-children',
//           ),
//           {
//             childList: true,
//           },
//         );

//         const autoNestHigh = () => {
//           observer.disconnect();
//           nestPDFHigh();
//           //scrollToTopLastBlk();
//         };
//         break;
//       case 'scrollToTopLastBlk':
//         scrollToTopLastBlk();
//         break;
//       case 'nestHighUnderPrevGroup':
//         let nestUnderPrevTimeout;

//         const observerPrev = new MutationObserver(mList => {
//           clearTimeout(nestUnderPrevTimeout);
//           nestUnderPrevTimeout = setTimeout(autoNestUnderPrev, 100);
//         });
//         observerPrev.observe(
//           document.querySelector(
//             '[data-page-links*="PDF Highlights"].roam-block-container .rm-block-children',
//           ),
//           {
//             childList: true,
//           },
//         );

//         const autoNestUnderPrev = () => {
//           observerPrev.disconnect();
//           nestHighUnderPrevGroup();
//           //scrollToTopLastBlk();
//         };
//         break;
//       case 'focus':
//         focusLastHighGroup();
//         break;
//       case 'moreLeft':
//         addMoreLeftBlk();
//         break;
//       case 'wordUsage':
//         wordUsage(event.data.seleTxt);
//         break;
//       case 'seleHead':
//         nestHighWithHead(event.data.seleTxt);
//         break;
//       case 'popPane':
//         closeFirstPane();
//         break;
//       case 'addNewTag':
//         addNewTag(event.data.seleTxt);
//         break;
//       case 'smartAddNewTag':
//         smartAddNewTag(event.data.seleTxt);
//         break;
//       case 'seleHeadSmart':
//         smartNestHighWithHead(event.data.seleTxt);
//         break;
//       case 'focusFromYoutube':
//         focusFromYoutube();
//         break;
//       case 'escapeLast':
//         escapeLast();
//         break;
//       case 'nestWithTag':
//         nestWithTag();
//         break;
//       case 'highLastHi':
//         highLastHi(event.data.seleTxt);
//         break;
//       case 'goTblCont':
//         goTblCont();
//         break;
//       case 'focusPdfHigh':
//         focusPdfHigh();
//       case 'toggleTimer':
//         toggleTimer();
//         break;
//       case 'quickSearchTxt':
//         quickSearchTxt(event.data.seleTxt);
//       case 'searchInOtherInstance':
//         navigator.clipboard.writeText(event.data.seleTxt);
//         searchInOtherInstance(event.data.seleTxt);
//         break;
//     }
//   };

//   window.addEventListener('message', window.messageListener);
// };
