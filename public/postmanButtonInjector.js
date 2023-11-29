/* eslint-disable @typescript-eslint/no-unused-vars */
function injectPostmanRunButton(nonce, scriptId, scriptSrc) {
  if (!window[scriptId]) {
    window[scriptId] = function () {
      (window[scriptId].q = window[scriptId].q || []).push(arguments);
    };
  }
  if (!document.getElementById(scriptId)) {
    var script = document.createElement('script');
    script.id = scriptId;
    script.async = 1;
    script.src = scriptSrc;
    script.setAttribute('nonce', nonce);
    document.getElementsByTagName('head')[0].appendChild(script);
  }
}
