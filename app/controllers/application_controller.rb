# -*- encoding : utf-8 -*-
class ApplicationController < ActionController::Base
  protect_from_forgery

  # All pages need login
  before_filter :authenticate_user!

private
  # Check if user is an admin
  # FIXME Should give an error message or 404
  def require_admin
    unless user_signed_in? && current_user.admin?
      redirect_to root_url
    end
  end

  # Override Device::Controller:Helpers#sign_in_and_redirect(resource_or_scope, resource=nil)
  # Don't check stored_location_for(scope)
  def sign_in_and_redirect(resource_or_scope, resource=nil)
    scope      = Devise::Mapping.find_scope!(resource_or_scope)
    resource ||= resource_or_scope
    sign_in(scope, resource) unless warden.user(scope) == resource
    redirect_to after_sign_in_path_for(resource)
  end

  # Override Devise::Controllers::Helpers#after_sign_in_path_for(resource_or_scope)
  # After user has signed_in, find out if there is an Event that's
  # supposed to be used for sale
  #
  # Only takes resource (original takes both resource and scope)
  def after_sign_in_path_for(resource)
    case resource
    when User
      # If there is a default event, go there
      if event = resource.default_event
        sale_event_path(event)
      else
        super
      end
    else
      super
    end
  end
end
