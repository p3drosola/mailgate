class RoutesController < ApplicationController

  before_filter :authenticated!
  before_filter :find_route, :only => [:view, :update, :destroy]

  def index
    render :json => current_user.routes
  end

  def view
    render :json => @route
  end

  def create
    route = Route.new
    route.generate_forwarder
    route.email = params[:email]
    route.save!

    if route.valid?
      render :json => route
    else
      head :error
    end
  end

  def update
    @route.update_attributes(params)
    @route.save!
    head :ok
  end

  def destroy
    @route.destroy!
    head :ok
  end

  protected
  def find_route
    @route = current_user.routes.find_by_id(params[:id])
  end

end
