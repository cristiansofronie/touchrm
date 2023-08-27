import { createHints } from './hints';

export const copyCodeBlock = () => {
  createHints('.bp3-button-text', elem => {
    navigator.clipboard.writeText(
      elem
        .closest('.rm-code-block__settings-bar')
        .previousElementSibling.querySelector('.cm-content').textContent,
    );
  });
  return false;
};

export const enterCodeMirror = () => {
  createHints(
    [...document.getElementsByClassName('cm-content')] as HTMLElement[],
    elem => {
      elem.focus();
      elem.dispatchEvent(
        new KeyboardEvent('keydown', {
          keyCode: 17,
          code: 'ControlLeft',
          ctrlKey: true,
          bubbles: true,
        }),
      );
      elem.dispatchEvent(
        new KeyboardEvent('keydown', {
          keyCode: 65,
          code: 'KeyA',
          ctrlKey: true,
          bubbles: true,
        }),
      );
    },
    { autoAction: true },
  );
  return false;
};
