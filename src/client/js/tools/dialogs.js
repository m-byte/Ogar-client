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
}(tools.dialogs));
