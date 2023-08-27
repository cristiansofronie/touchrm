export const quickSearchWithClip = async () => {
  const input = document.querySelector('#find-or-create-input') as HTMLInputElement;
  const clip = await navigator.clipboard.readText();

  input.focus();
  if (clip) {
    input.value = clip.slice(0, 200) + '\n';
  }

  input.select();

  input.dispatchEvent(new InputEvent('input', { bubbles: true }));
};
