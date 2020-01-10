function notification(messageDiv='response', formId, message='null') {
    document.getElementById(messageDiv).classList.remove('hidden')
    document.getElementById(messageDiv).innerHTML = message;
    document.getElementById(formId).className = '';
    setTimeout(() => {
        document.getElementById(formId).className = 'animated bounce';
    }, 100)
}

function escapeHTML(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function getValue(element) {
    return document.getElementById(element).value;
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}