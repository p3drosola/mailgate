class ApplicationController < ActionController::Base
  protect_from_forgery

  helper_method :current_user, :not_found



  private

  def current_user
    @current_user ||= User.find_by_id(session[:user_id]) if session[:user_id]
  end

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  def authenticated!
    render :json => {:message => 'not authorized'}, :status => 401 unless current_user
  end
end
