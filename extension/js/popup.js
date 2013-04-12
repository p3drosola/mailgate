var mailgate = {}, utils = {};

mailgate.domain = '@mailgate.mailgun.org';

mailgate.alphanumeric = function (length) {
  if (!length) {
    length = 32;
  }
  var i,
    a = '',
    alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';

  for (i = 0; i < length; i++) {
    a += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return a;
};

mailgate.buildEmail = function () {
  var random = mailgate.alphanumeric();
  return random + mailgate.domain;
};

mailgate.createRoute = function (email, host, callback) {

  var data = {
    expression: 'match_recipient("' + email + '")',
    action: ['forward("' + mailgate.getUserEmail() + '")', 'stop()'],
    description: host,
    priority: 1
  };

  $.ajax({
    type: 'POST',
    url: 'https://api.mailgun.net/v2/routes',
    data: data,
    success: function () {
      callback();
    },
    error: function (err) {
      $('body').html('There was a problem with the API :(');
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', utils.makeBaseAuth('api', 'key-8hvv8bnieptegxk9jcib3xo871bo0jv3'));
    }
  });

};

mailgate.show = function (pane) {
  var $pane = $('.pane#' + pane);
  if ($pane.length) {
    $('.pane').removeClass('active');
    $pane.addClass('active');
  }
};

mailgate.saveUserEmail = function () {
  var email = $('#preference-email-input').val();
  localStorage['user-email'] = email;
};

mailgate.showNewEmail = function () {
  chrome.tabs.getSelected(null, function (tab) {
    var host = utils.getLocation(tab.url).host,
      email = mailgate.buildEmail();

    mailgate.createRoute(email, host, function () {
      mailgate.show('email');
      $('#email-input').val(email);
      $('#host-name').text(host);
    });
  });
};

mailgate.getUserEmail = function () {
  return localStorage['user-email'];
};

utils.makeBaseAuth = function (user, password) {
  var tok = user + ':' + password,
    hash = btoa(tok);
  return "Basic " + hash;
};

utils.getLocation = function (href) {
  var l = document.createElement("a");
  l.href = href;
  return l;
};

utils.copyToClipboard = function (text) {
  var copyDiv = document.createElement('div');
  copyDiv.contentEditable = true;
  document.body.appendChild(copyDiv);
  copyDiv.innerHTML = text;
  copyDiv.unselectable = "off";
  copyDiv.focus();
  document.execCommand('SelectAll');
  document.execCommand("Copy", false, null);
  document.body.removeChild(copyDiv);
};

$(function () {

  var email = mailgate.getUserEmail();
  if (!email) {
    mailgate.show('settings');
  } else {
    $('#preference-email-input').val(email);
    mailgate.showNewEmail();
  }

  $('button.copy').click(function () {
    utils.copyToClipboard($('#email-input').val());
    $(this).text('Copied!');
  });

  $('button.save').click(function () {
    mailgate.saveUserEmail();
    mailgate.showNewEmail();
  });

  $('img.settings').click(function () {
    mailgate.show('settings');
  });

});

