export const search = () => {
  const sele = document.getSelection().toString();

  window.syncAdvBrowserSearchBC.postMessage(sele);

  try {
    navigator.clipboard.writeText(sele);
  } catch {}

  top.postMessage({
        actionType: 'syncSearch',
        seleTxt: sele
  }, '*');
  return false;
};
