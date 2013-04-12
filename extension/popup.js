var mailgate = {}, utils = {};

mailgate.domain = '@mailgate.mailgun.org';
mailgate.real_email = 'p3dro.sola@gmail.com';

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
    expression: 'match_recipient("' + mailgate.real_email + '")',
    action: ['forward("' + email + '")', 'stop()'],
    description: host
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

$(function () {

  chrome.tabs.getSelected(null, function (tab) {
    var host = utils.getLocation(tab.url).host,
      email = mailgate.buildEmail();
    mailgate.createRoute(email, host, function () {


      mailgate.show('email');
      $('#email-input').val(email);
      $('#host-name').text(host);

    });
  });
});

