if (typeof(tools) == 'undefined') tools = {};
if (typeof(tools.dialogs) == 'undefined') tools.dialogs = {};
(function (dialogs) {

  var current = 'hello';

  dialogs.switch = function (dialog) {
    if (dialog != current) {
      var dialogs = document.querySelectorAll('#overlays .dialog');
      for (var i = 0; i < dialogs.length; i++) {
        dialogs[i].className = dialogs[i].className.replace('hidden', '').replace('  ', ' ');
        if (dialogs[i].id != dialog + 'Dialog') {
          dialogs[i].className = dialogs[i].className + ' hidden';
        }
      }
      current = dialog;
    }
  };

  dialogs.showDialogs = function (show) {
    var dialogs = document.getElementById('overlays'),
      index = dialogs.className.indexOf('hidden');
    if ((show && index == -1) || (!show && index > -1)) {
      dialogs.className = dialogs.className.replace('hidden', '').replace('  ', ' ');
      if (show) {
        dialogs.className = dialogs.className + ' hidden';
      }
    }
  };

  dialogs.showConnecting = function (show) {
    var connecting = document.getElementById('connecting'),
      index = connecting.className.indexOf('hidden');
    if ((show && index == -1) || (!show && index > -1)) {
      connecting.className = connecting.className.replace('hidden', '').replace('  ', ' ');
      if (show) {
        connecting.className = connecting.className + ' hidden';
      }
    }
  };
}(tools.dialogs));
