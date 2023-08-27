import { createHints } from './hints';

const topMargin = 50;
const bottomMargin = 10;

export const focusNextSiblingBlk = () => {
  const query = `:where(
      .roam-article > div:first-child > div:last-child,
      .rm-level-0,
      .rm-reference-item > div
    ) > .roam-block-container > .rm-block-main  .rm-block__input`;

  const queryClose = `:where(
      .roam-article > div:first-child > div:last-child,
      .rm-level-0,
      .rm-reference-item > div
    ) > .roam-block-container`;

  let blks = [...document.querySelectorAll(query)]
    .filter(e => !e.matches('.rm-link .rm-block__input'))
    .sort(
      (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
    );

  let i = blks.findIndex(e => e.id == document.activeElement.id);
  if (i == -1)
    i = blks.findIndex(
      e =>
        e.id ==
        document.activeElement
          .closest(queryClose)
          ?.querySelector('.rm-block-main  .rm-block__input').id,
    );
  if (i == blks.length - 1) i = -1;

  if (document.activeElement.tagName !== 'TEXTAREA') {
    i = -1;
    const fBlks = blks.filter(e => {
      const box = e.getBoundingClientRect();
      return (
        box.top < window.innerHeight - topMargin && box.bottom >= topMargin
      );
    });
    if (fBlks.length) blks = fBlks;
  }
  const blk = blks[i + 1];

  window.roamAlphaAPI.ui.setBlockFocusAndSelection({
    location: {
      'window-id': blk.id.slice(12, -10),
      'block-uid': blk.id.slice(-9),
    },
  });

  return false;
};

export const focusPrevSiblingBlk = () => {
  const query = `:where(
      .roam-article > div:first-child > div:last-child,
      .rm-level-0,
      .rm-reference-item > div
    ) > .roam-block-container > .rm-block-main  .rm-block__input`;

  const queryClose = `:where(
      .roam-article > div:first-child > div:last-child,
      .rm-level-0,
      .rm-reference-item > div
    ) > .roam-block-container`;

  let blks = [...document.querySelectorAll(query)]
    .filter(e => !e.matches('.rm-link .rm-block__input'))
    .sort(
      (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
    );

  let i = blks.findIndex(e => e.id == document.activeElement.id);
  if (i == -1) {
    i = blks.findIndex(
      e =>
        e.id ==
        document.activeElement
          .closest(queryClose)
          ?.querySelector('.rm-block-main  .rm-block__input').id,
    );
    if (i != -1) i += 1;
  }
  if (i == -1) i = blks.length;
  if (i == 0) i = blks.length;

  if (document.activeElement.tagName !== 'TEXTAREA') {
    const fBlks = blks.filter(e => {
      const box = e.getBoundingClientRect();
      return (
        box.top < window.innerHeight - bottomMargin &&
        box.bottom >= bottomMargin
      );
    });
    if (fBlks.length) blks = fBlks;
    i = blks.length;
  }

  const blk = blks[i - 1];

  window.roamAlphaAPI.ui.setBlockFocusAndSelection({
    location: {
      'window-id': blk.id.slice(12, -10),
      'block-uid': blk.id.slice(-9),
    },
  });

  return false;
};

export const focusNextBlk = () => {
  const blks = [
    ...document.querySelectorAll('.roam-article .rm-block__input'),
  ].concat([...document.querySelectorAll('#right-sidebar .rm-block__input')]);
  let i = blks.findIndex(e => e.id == document.activeElement.id);

  if (document.activeElement.tagName !== 'TEXTAREA') {
    i = -1;
  } else {
    if (i == blks.length - 1) i = -1;
  }

  const blk = blks[i + 1];

  window.roamAlphaAPI.ui.setBlockFocusAndSelection({
    location: {
      'window-id': blk.id.slice(12, -10),
      'block-uid': blk.id.slice(-9),
    },
  });

  return false;
};

export const focusNextBlkStart = () => {
  const blks = [
    ...document.querySelectorAll('.roam-article .rm-block__input'),
  ].concat([...document.querySelectorAll('#right-sidebar .rm-block__input')]);
  let i = blks.findIndex(e => e.id == document.activeElement.id);

  if (document.activeElement.tagName !== 'TEXTAREA') {
    i = -1;
  } else {
    if (i == blks.length - 1) i = -1;
  }

  const blk = blks[i + 1];

  window.roamAlphaAPI.ui.setBlockFocusAndSelection({
    location: {
      'window-id': blk.id.slice(12, -10),
      'block-uid': blk.id.slice(-9),
    },
  });

  return false;
};

export const focusPrevBlk = () => {
  const blks = [...document.querySelectorAll('.rm-block__input')]
    .sort(
      (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
    )
    .concat(
      Array.from(document.querySelectorAll('#right-sidebar .rm-block__input')),
    );
  let i = blks.findIndex(e => e.id == document.activeElement.id);

  if (document.activeElement.tagName !== 'TEXTAREA') {
    i = blks.length;
  } else {
    if (i == 0) i = blks.length;
  }

  const blk = blks[i - 1];

  window.roamAlphaAPI.ui.setBlockFocusAndSelection({
    location: {
      'window-id': blk.id.slice(12, -10),
      'block-uid': blk.id.slice(-9),
    },
  });

  return false;
};

export const focusPrevBlkStart = () => {
  const blks = [...document.querySelectorAll('.rm-block__input')]
    .sort(
      (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
    )
    .concat(
      Array.from(document.querySelectorAll('#right-sidebar .rm-block__input')),
    );
  let i = blks.findIndex(e => e.id == document.activeElement.id);

  if (document.activeElement.tagName !== 'TEXTAREA') {
    i = blks.length;
  } else {
    if (i == 0) i = blks.length;
  }

  const blk = blks[i - 1];

  window.roamAlphaAPI.ui.setBlockFocusAndSelection({
    location: {
      'window-id': blk.id.slice(12, -10),
      'block-uid': blk.id.slice(-9),
    },
  });

  return false;
};

export const focusBlockWithHints = () => {
  createHints(
    [...document.querySelectorAll('.rm-block__input')] as HTMLElement[],
    elem => {
      const uid = elem.id.slice(-9);
      const winId = elem.id.slice(12, -10);
      window.roamAlphaAPI.ui.setBlockFocusAndSelection({
        location: {
          'window-id': winId,
          'block-uid': uid,
        },
      });
    }
  );
  return false;
};
