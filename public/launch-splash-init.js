(function () {
  try {
    if (sessionStorage.getItem("owemanager-splash-seen")) return;
    var path = location.pathname;
    if (path !== "/home" && path !== "/") return;
    document.documentElement.classList.add("app-launch-splash-active");
  } catch (e) {}
})();
