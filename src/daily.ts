export const setupDaily = () => {
  window.roamAlphaAPI.ui.commandPalette.addCommand({
    label: 'Toggle daily notes tab',
    callback: () => {
      window.isDailyNotesTab = !window.isDailyNotesTab;
    },
  });
};

export const nestBlocksUnderPreviousTime = async () => {
  const containers = [
    ...document.querySelectorAll(
      '.roam-article > div > div:nth-child(2) > .roam-block-container',
    ),
  ];
  const i = containers.findLastIndex(e =>
    e.querySelector('.rm-block__input').textContent.match(/^\d\d:\d\d$/),
  );
  const pBlk = containers[i].querySelector('.rm-block__input');
  const pUID = pBlk.id.slice(-9);
  const toMoveBlks = containers
    .slice(i + 1)
    .map(e => e.querySelector('.rm-block__input').id.slice(-9));
  pBlk.scrollIntoView(true);

  let blkOrder =
    parseInt(
      window.roamAlphaAPI.q(
        `[
    :find (count ?c) .
    :in $ ?UID
    :where [?b :block/uid ?UID]
           [?b :block/order ?o]
           [?b :block/children ?c]
  ]`,
        pUID,
      ) as unknown as string | null,
    ) || 0;

  for (const uid of toMoveBlks) {
    await window.roamAlphaAPI.updateBlock({
      block: {
        uid: uid,
        open: false,
      },
    });
    await window.roamAlphaAPI.moveBlock({
      location: {
        'parent-uid': pUID,
        order: blkOrder++,
      },
      block: {
        uid: uid,
      },
    });
  }
};

export const newTimeBlock = async () => {
  const containers = [
    ...document.querySelectorAll(
      '.roam-article > div > div:nth-child(2) > .roam-block-container',
    ),
  ];
  const i = containers.findLastIndex(e =>
    e.querySelector('.rm-block__input').textContent.match(/^\d\d:\d\d$/),
  );
  if (i === -1) {
    const date = new Date();
    await window.roamAlphaAPI.createBlock({
      location: {
        'parent-uid': window.roamAlphaAPI.util.dateToPageUid(date),
        order: 'last',
      },
      block: {
        string: `${date.getHours().toString().padStart(2, '0')}:${date
          .getMinutes()
          .toString()
          .padStart(2, '0')}`,
      },
    });
  } else {
    const pUID = containers[i].querySelector('.rm-block__input').id.slice(-9);
    const toMoveBlks = containers
      .slice(i + 1)
      .map(e => e.querySelector('.rm-block__input').id.slice(-9));

    if (!toMoveBlks.length) return;

    const height = containers
      .slice(i + 1)
      .reduce((prev, curr) => prev + curr.getBoundingClientRect().height, 0);

    console.log('Height', height);
    if (height < window.innerHeight) return;

    await nestBlocksUnderPreviousTime();

    await window.roamAlphaAPI.updateBlock({
      block: {
        uid: pUID,
        open: false,
      },
    });

    setTimeout(async () => {
      const date = new Date();
      await window.roamAlphaAPI.createBlock({
        location: {
          'parent-uid': window.roamAlphaAPI.util.dateToPageUid(date),
          order: 'last',
        },
        block: {
          string: `${date.getHours().toString().padStart(2, '0')}:${date
            .getMinutes()
            .toString()
            .padStart(2, '0')}`,
        },
      });

      [
        ...document.querySelectorAll(
          '.roam-article > div > div:nth-child(2) > .roam-block-container',
        ),
      ]
        .at(-1)
        .querySelector('.rm-block__input')
        .scrollIntoView(true);
    }, 100);
  }
};

export const callNewTimeBlock = () => {
  window.isDailyBusy = true;
  window.setTimeout(newTimeBlock);
  window.isDailyBusy = false;
};

const manageDailyPage = async () => {
  if (!window.isDailyNotesTab) return;

  if (!document.hasFocus() && !window.isDailyBusy) {
    const dayUID = window.roamAlphaAPI.util.dateToPageUid(new Date());
    if (dayUID !== location.hash.split('/').pop()) {
      await window.roamAlphaAPI.ui.mainWindow.openPage({
        page: { uid: dayUID },
      });
      window.setTimeout(callNewTimeBlock, 100);
      return;
    }
    callNewTimeBlock();
  }
};

export const startManageDailyPage = () => {
  clearInterval(window.dailyPageManagementInterval);
  window.dailyPageManagementInterval = window.setInterval(
    manageDailyPage,
    1000 * 60 * 5,
  );
};
