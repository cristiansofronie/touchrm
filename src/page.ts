export const deletePage = () => {
  const uid = location.hash.slice(-9);

  window.roamAlphaAPI.deletePage({
    page: {
      uid,
    },
  });
};
