import type { AdvSearchMessageEvent } from './types';

export const setupAdvSearch = () => {
  window.roamAlphaAPI.ui.commandPalette.addCommand({
    label: 'Toggle advanced search tab',
    callback: () => {
      window.isAdvSearchTab = !window.isAdvSearchTab;
    },
  });

  if (!window.advSearchBC) {
    window.advSearchBC = new BroadcastChannel('adv_search');
  }
};

export const reloadAdvSearch = () => {
  reloadAdvSearchHandler();
};

if (!window.advSearchBCReceiver) {
  window.advSearchBCReceiver = new BroadcastChannel('adv_search');
}

window.advSearchBCReceiver.onmessage = (event: AdvSearchMessageEvent) => {
  if (window.isAdvSearchTab) {
    switch (event.actionType) {
      case 'doAdvSearch':
        const input = document.querySelector(
          '#rm-search-path-query-input',
        ) as HTMLInputElement;
        if (input) {
          input.select();
          input.setRangeText(
            event.query,
            input.selectionStart,
            input.selectionEnd,
            'end',
          );
          input.dispatchEvent(new InputEvent('input', { bubbles: true }));
        }
        break;
      case 'reloadAdvSearch':
        reloadAdvSearchHandler();
        break;
    }
  }
};

export const reloadAdvSearchHandler = () => {
  const savedText = (
    document.querySelector('#rm-search-path-query-input') as HTMLInputElement
  ).value;

  document.activeElement.dispatchEvent(
    new KeyboardEvent('keydown', { keyCode: 27, bubbles: true }),
  );

  document.activeElement.dispatchEvent(
    new KeyboardEvent('keydown', { keyCode: 27, bubbles: true }),
  );

  setTimeout(() => {
    document.activeElement.dispatchEvent(
      new KeyboardEvent('keydown', {
        keyCode: 73,
        altKey: true,
        bubbles: true,
      }),
    );
    setTimeout(() => {
      const input = document.querySelector(
        '#rm-search-path-query-input',
      ) as HTMLInputElement;
      input.select();
      input.setRangeText(
        savedText,
        input.selectionStart,
        input.selectionEnd,
        'end',
      );
      input.select();
      input.dispatchEvent(new InputEvent('input', { bubbles: true }));
    }, 50);
  }, 500);
};
