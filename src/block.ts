import { createHints } from './hints';
import { UIGuard } from './utils';

export const addArticleBlock = async () => {
  const pUID = location.hash.split('/').pop();
  let lstBlkStr;
  let lstBlk;

  let blks = [
    ...document.querySelectorAll(`.roam-article :where(
    .roam-article > div:first-child > div:last-child,
    .rm-level-0,
    .rm-reference-item > div
  ) > .roam-block-container > .rm-block-main .rm-block__input`),
  ] as HTMLElement[];

  lstBlk = blks
    .filter(
      e =>
        !e
          .closest('.roam-block-container')
          .querySelector(':scope > .rm-block-children .roam-block-container') &&
        !e.closest('.rm-block-main').querySelector('.rm-bullet--closed'),
    )
    .find(
      e =>
        (e.tagName === 'TEXTAREA' && (e as HTMLTextAreaElement).value === '') ||
        (e.tagName !== 'TEXTAREA' && e.innerText === ''),
    );

  if (!lstBlk) {
    lstBlkStr = '';
  }

  let lstBlkUID;

  if (lstBlk) {
    if (lstBlk.tagName === 'TEXTAREA')
      lstBlkStr = (lstBlk as HTMLTextAreaElement).value;
    else {
      lstBlkStr = lstBlk.innerHTML;
      if (lstBlk.innerHTML === '<span></span>') lstBlkStr = '';
      if (lstBlk.innerText) lstBlkStr = lstBlk.innerText;
    }

    lstBlkUID = lstBlk.id.slice(-9);
    lstBlk.scrollIntoView(true);
  } else {
    // Hack
    lstBlkStr = ' ';
  }

  const blkUID = lstBlkStr ? window.roamAlphaAPI.util.generateUID() : lstBlkUID;

  if (lstBlkStr) {
    await window.roamAlphaAPI.createBlock({
      location: {
        'parent-uid': pUID,
        order: 'last',
      },
      block: {
        string: '',
        uid: blkUID,
      },
    });
  }

  await window.roamAlphaAPI.ui.setBlockFocusAndSelection({
    location: {
      'window-id': 'main-window',
      'block-uid': blkUID,
    },
  });

  document.activeElement.scrollIntoView(true);
};

export const expandBlock = () => {
  createHints(
    () => [...document.querySelectorAll('.rm-block__input')] as HTMLElement[],
    elem => {
      return new Promise<void>(resolve => {
        elem.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

        setTimeout(() => {
          const caret = elem.closest('.rm-block-main');
          caret
            .querySelector('.rm-caret')
            .dispatchEvent(new PointerEvent('click', { bubbles: true }));
          setTimeout(() => {
            resolve();
          }, 200);
        });
      });
    },
  );
};

export const openBlkInSidebarCollapsed = () => {
  createHints(
    () => [...document.querySelectorAll('.rm-block__input')] as HTMLElement[],
    async elem => {
      await window.roamAlphaAPI.ui.rightSidebar.addWindow({
        window: { type: 'block', ['block-uid']: elem.id.slice(-9) },
      });

      setTimeout(() => {
        const blk = document.querySelector('#right-sidebar .rm-block__input');
        blk.dispatchEvent(
          new MouseEvent('mousemove', { cancelable: true, bubbles: true }),
        );
        setTimeout(() => {
          blk
            .closest('.rm-block-main')
            .querySelector('.rm-caret-open')
            .dispatchEvent(
              new PointerEvent('click', { cancelable: true, bubbles: true }),
            );
        });
      });
    },
  );
};

export const newNoteUnderTag = () => {
  createHints(
    ([...document.querySelectorAll('.rm-page-ref')] as HTMLElement[]).reverse(),
    async elem => {
      const parentUid = window.roamAlphaAPI.util.generateUID();
      const childUid = window.roamAlphaAPI.util.generateUID();
      const txt = (elem as HTMLElement).innerText;

      await window.roamAlphaAPI.createBlock({
        location: {
          'parent-uid': location.hash.split('/').at(-1),
          order: 'last',
        },
        block: {
          string: '[[' + txt + ']]',
          uid: parentUid,
        },
      });

      await window.roamAlphaAPI.createBlock({
        location: {
          'parent-uid': parentUid,
          order: 'last',
        },
        block: {
          string: '',
          uid: childUid,
        },
      });

      await window.roamAlphaAPI.ui.setBlockFocusAndSelection({
        location: {
          'window-id': 'main-window',
          'block-uid': childUid,
        },
        selection: { start: 0 },
      });
    },
  );
};

export const deleteCurrentBlock = () => {
  const activeElem = document.activeElement;
  window.roamAlphaAPI.deleteBlock({ block: { uid: activeElem.id.slice(-9) } });
  const blk = activeElem
    .closest('.roam-block-container')
    .previousElementSibling.querySelector('.rm-block__input');

  window.roamAlphaAPI.ui.setBlockFocusAndSelection({
    location: {
      'window-id': blk.id.slice(12, -10),
      'block-uid': blk.id.slice(-9),
    },
  });
};

export const expandElem = (elem: HTMLElement) => {
  return new Promise<void>(resolve => {
    let clicked = false;
    new MutationObserver(async (mutationsList, observer) => {
      observer.disconnect();
      new MutationObserver((mutationsList, observer) => {
        observer.disconnect();
        resolve();
      }).observe(document.body, { childList: true });
      mutationsList.forEach(mutation => {
        const elem = [
          ...(mutation.target as HTMLElement).querySelectorAll('a'),
        ].filter(e => e.textContent.match(/Expand all/))[0];
        if (elem) {
          elem.click();
          clicked = true;
        }
      });
    }).observe(document.body, { childList: true });
    elem.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
  });
};

export const expandArticle = async () => {
  const title = document.querySelector(
    '.roam-article .rm-title-display',
  ) as HTMLElement | null;
  if (
    title &&
    [
      ...document.querySelectorAll(
        '.roam-article > div > div:nth-child(2) .rm-caret-closed',
      ),
    ].filter(
      e =>
        [...e.getElementsByClassName('rm-caret-closed')].filter(
          e => !e.closest('.rm-embed-container, .rm-block-ref'),
        ).length !== 0,
    )
  ) {
    await expandElem(title);
  } else {
    const elems = (
      [...document.querySelectorAll('.rm-level-1')] as HTMLElement[]
    )
      .filter(
        e =>
          [...e.getElementsByClassName('rm-caret-closed')].filter(
            e => !e.closest('.rm-embed-container, .rm-block-ref'),
          ).length !== 0,
      )
      .map(e => e.querySelector('.rm-bullet')) as HTMLElement[];

    for (const e of elems) {
      await expandElem(e);
    }
  }
};

export const expandReferences = async () => {
  const elems = [...document.querySelectorAll('.rm-reference-item')]
    .filter(
      e =>
        [...e.getElementsByClassName('rm-caret-closed')].filter(
          e => !e.closest('.rm-embed-container, .rm-block-ref'),
        ).length !== 0,
    )
    .map(e => e.querySelector('.rm-bullet')) as HTMLElement[];

  for (const e of elems) {
    await expandElem(e);
  }
};

export const expandAll = () => {
  UIGuard(
    async () => {
      await expandArticle();
      await expandReferences();
    },
    `
    .bp3-portal {
      display: none !important;
    }
  `,
  );
};

export const newNoteUnderTagFromTextarea = async () => {
  const textArea = document.activeElement;
  if (textArea.tagName !== 'TEXTAREA') return;

  const txt = (textArea as HTMLTextAreaElement).value
    .match(/\[\[[^\[\]]*\]\]/g)
    .at(-1);
  if (!txt) return;

  const parentUid = window.roamAlphaAPI.util.generateUID();
  const childUid = window.roamAlphaAPI.util.generateUID();

  await window.roamAlphaAPI.data.block.create({
    location: {
      'parent-uid': location.hash.split('/').at(-1),
      order: 'last',
    },
    block: {
      string: txt,
      uid: parentUid,
    },
  });

  await window.roamAlphaAPI.data.block.create({
    location: {
      'parent-uid': parentUid,
      order: 'last',
    },
    block: {
      string: '',
      uid: childUid,
    },
  });

  await window.roamAlphaAPI.ui.setBlockFocusAndSelection({
    location: {
      'window-id': 'main-window',
      'block-uid': childUid,
    },
  });
};

export const deleteBlk = async () => {
  createHints(() => [...document.querySelectorAll('.rm-block__input')] as HTMLElement[], elem => {
    window.roamAlphaAPI.deleteBlock({ block: { uid: elem.id.slice(-9) } });
  });
};

export const expandEmbeds = async () => {
  const blks = document.querySelectorAll('.rm-embed-container .rm-block__input');

  for (let blk of blks) {
    const blkUid = blk.id.slice(-9);
    window.roamAlphaAPI.updateBlock({
      'block': {
        'uid': blkUid,
        'open': true
      }
    });
  }
};
