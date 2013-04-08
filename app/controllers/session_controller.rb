class SessionController < ApplicationController
  def create

    if params[:email].nil? then not_found end

    @user = User.find_by_email(params[:email])

    if @user.nil?
      # creates a new user account
      @user = User.create(:email => params[:email], :name => params[:name])
    end

    @token = @user.auth_tokens.active.find_by_token(params[:token])
    if @token.nil?
      # creates a new auth token
      @token = AuthToken.create(:user_id => @user.id)
      UserMailer.activate_token(@token).deliver
      head :json => {:message => 'email sent'}
    else
      # authenticated
      login(@user)
      render :json => {:message => 'authenticated'}
    end
  end

  def activate
    token = AuthToken.find_by_token(params[:token])
    if token.nil?
      render "activate_error"
    else
      token.activated = true
      if token.save
        login(token.user)
        @token = token.token
        render "activate"
      else
        render "activate_error"
      end
    end
  end

  def user
    user = User.find_by_id(session[:user_id])
    if user.nil?
      head 404
    else
      render :json => user
    end
  end

  protected
  def login(user)
    session[:user_id] = user.id
  end
end
