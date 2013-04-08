class UserMailer < ActionMailer::Base
  default from: "Mailgun<postmaster@mailgate.mailgun.org>"

  def activate_token(token)
    @user = token.user
    @activation_url = session_activate_url(token.token)
    mail(to: token.user.email, subject: 'Activate your Mailgate account')
  end

end
