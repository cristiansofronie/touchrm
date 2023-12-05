import { mouseClick } from './utils';

export const copyTitle = () => {
  navigator.clipboard.writeText(
    document.getElementsByClassName('rm-title-display')[0].textContent,
  );
  return false;
};

export const copyTitleLink = () => {
  navigator.clipboard.writeText(
    '[[' + document.getElementsByClassName('rm-title-display')[0].textContent + ']]',
  );
  return false;
};

export const focusTitle = () => {
  const tick = document.querySelector('.bp3-button-group [icon="tick"]');
  if (tick) {
    tick.dispatchEvent(new Event('click', { bubbles: true }));
  } else {
    const title = (
      document.getElementsByClassName(
        'rm-title-display',
      ) as HTMLCollectionOf<HTMLElement>
    )[0];
    if (title) {
      mouseClick(title);
    }
    setTimeout(() => {
      const txtArea = document.querySelector(
        '.rm-title-editing-display textarea',
      ) as HTMLTextAreaElement;
      console.log(txtArea);
      txtArea.selectionStart = txtArea.selectionEnd = txtArea.value.length;
    });
  }
  return false;
};
