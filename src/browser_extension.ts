export const browserSearch = () => {
  const sele = document.getSelection().toString();

  window.advSearchBC.postMessage(sele);

  try {
    navigator.clipboard.writeText(sele);
  } catch {}

  top.postMessage(
    {
      actionType: 'syncSearch',
      seleTxt: sele,
    },
    '*',
  );
  return false;
};
