export const setupSession = () => {
  if (!window.sessionTabBC) {
    window.sessionTabBC = new BroadcastChannel('session_tab');
  }
};
