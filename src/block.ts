import { createHints } from './hints';
import { UIGuard } from './utils';

export const addArticleBlock = async () => {
  const blkUid = window.roamAlphaAPI.util.generateUID();

  await window.roamAlphaAPI.createBlock({
    location: {
      'parent-uid': location.hash.split('/').at(-1),
      order: 'last',
    },
    block: {
      string: '',
      uid: blkUid,
    },
  });

  window.roamAlphaAPI.ui.setBlockFocusAndSelection({
    location: {
      'window-id': 'main-window',
      'block-uid': blkUid,
    },
  });
};

export const expandBlock = () => {
  createHints(
    () => [...document.querySelectorAll('.rm-bullet')] as HTMLElement[],
    elem => {
      return new Promise<void>(resolve => {
        const style = document.createElement('style');
        style.textContent = `
.bp3-context-menu + .bp3-portal {
  visibility: hidden;
}
`;
        document.head.append(style);

        setTimeout(() => {
          const coords = elem.getBoundingClientRect();
          elem.dispatchEvent(
            new MouseEvent('contextmenu', {
              cancelable: true,
              bubbles: true,
              clientX: coords.x,
              clientY: coords.y,
            }),
          );

          setTimeout(() => {
            const expandAllElem = ([
              ...document.querySelectorAll(
                '.bp3-context-menu + .bp3-portal li a',
              ),
            ] as HTMLElement[]).find(e => e.textContent == 'Expand all');
            console.log(expandAllElem);
            expandAllElem.click();

            setTimeout(() => {
              style.remove();
            });
          });
        }, 10);
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
            ?.dispatchEvent(
              new PointerEvent('click', { cancelable: true, bubbles: true }),
            );
          window.roamAlphaAPI.ui.setBlockFocusAndSelection({
            location: {
              'window-id': blk.id.slice(12, -10),
              'block-uid': blk.id.slice(-9),
            },
          });
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
  createHints(
    () => [...document.querySelectorAll('.rm-block__input')] as HTMLElement[],
    elem => {
      window.roamAlphaAPI.deleteBlock({ block: { uid: elem.id.slice(-9) } });
    },
  );
};

export const expandEmbeds = async () => {
  const blks = document.querySelectorAll(
    '.rm-embed-container .rm-block__input',
  );

  for (let blk of blks) {
    const blkUid = blk.id.slice(-9);
    window.roamAlphaAPI.updateBlock({
      block: {
        uid: blkUid,
        open: true,
      },
    });
  }
};

export const newBlockUnder = async () => {
  const uid = window.roamAlphaAPI.ui.getFocusedBlock()['block-uid'];
  const newUid = window.roamAlphaAPI.util.generateUID();
  await window.roamAlphaAPI.createBlock({
    location: {
      'parent-uid': uid,
      order: 0,
    },
    block: {
      string: '',
      uid: newUid,
    },
  });
  await window.roamAlphaAPI.ui.setBlockFocusAndSelection({
    location: {
      'window-id': 'main-window',
      'block-uid': newUid,
    },
    selection: { start: 0 },
  });
};

export const quickMakeRefAndNewBlockUnder = async () => {
  const txtArea = document.activeElement as HTMLTextAreaElement;
  if (txtArea.tagName !== 'TEXTAREA') return;
  const line = txtArea.value.slice(0, txtArea.selectionEnd).split('\n').at(-1);

  txtArea.setRangeText('[[' + line + ']]', txtArea.selectionEnd - line.length, txtArea.selectionEnd, 'end');
  txtArea.dispatchEvent(new InputEvent('change', { bubbles: true }));

  const uid = window.roamAlphaAPI.ui.getFocusedBlock()['block-uid'];
  const newUid = window.roamAlphaAPI.util.generateUID();
  await window.roamAlphaAPI.createBlock({
    location: {
      'parent-uid': uid,
      order: 0,
    },
    block: {
      string: '',
      uid: newUid,
    },
  });
  await window.roamAlphaAPI.ui.setBlockFocusAndSelection({
    location: {
      'window-id': 'main-window',
      'block-uid': newUid,
    },
    selection: { start: 0 },
  });
};

export const copyBlock = () => {
  createHints('.rm-block__input', elem => {
    const str = window.roamAlphaAPI.q(
      `[
        :find ?str .
        :in $ ?uid
        :where
          [?blk :block/uid ?uid]
          [?blk :block/string ?str]
      ]`,
      elem.id.slice(-9),
    ) as unknown as string;

    navigator.clipboard.writeText(str);
  });
};

export const newBlockAfter = async () => {
  const uid = window.roamAlphaAPI.ui.getFocusedBlock()['block-uid'];
  const newUid = window.roamAlphaAPI.util.generateUID();
  const [pUid, order] = window.roamAlphaAPI.data.q(
    `[
    :find ?parentUid ?order
    :in $ ?uid
    :where
      [?blk :block/uid ?uid]
      [?parent :block/children ?blk]
      [?parent :block/uid ?parentUid]
      [?blk :block/order ?order]
  ]`,
    uid,
  )[0] as unknown as [string, number];

  await window.roamAlphaAPI.createBlock({
    location: {
      'parent-uid': pUid,
      order: order + 1,
    },
    block: {
      string: '',
      uid: newUid,
    },
  });

  window.roamAlphaAPI.ui.setBlockFocusAndSelection({
    location: {
      'window-id': 'main-window',
      'block-uid': newUid,
    },
  });
};
