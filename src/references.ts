export const toggleLinkedRefs = () => {
  (
    document.querySelector('.rm-reference-container .rm-caret') as HTMLElement
  ).click();
};

export const quickMakeRef = () => {
  const txtArea = document.activeElement as HTMLTextAreaElement;
  if (txtArea.tagName !== 'TEXTAREA') return;
  const line = txtArea.value.slice(0, txtArea.selectionEnd).split('\n').at(-1);

  txtArea.setRangeText('[[' + line + ']]', txtArea.selectionEnd - line.length, txtArea.selectionEnd, 'end');
  txtArea.dispatchEvent(new InputEvent('change', { bubbles: true }));
};
