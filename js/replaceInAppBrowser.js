function goToExternalBrowser() {
  const userAgt = navigator.userAgent.toLowerCase();
  const target_url = "https://nudake-canvas.vercel.app/";

  if (userAgt.match(/kakaotalk/i)) {
    location.href =
      "kakaotalk://web/openExternal?url=" + encodeURIComponent(target_url);
  }
}

export { goToExternalBrowser };
