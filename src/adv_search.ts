export const setupAdvSearch = () => {
  if (!window.advSearchBC) {
    window.advSearchBC = new BroadcastChannel('reload_adv_search');
  }

  if (!window.advSearchBC) {
    window.advSearchBC = new BroadcastChannel('adv_search');
  }
};
