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

  # Override Devise::Controllers::Helpers
  # After user has signed_in, find out if there is an Event that's
  # supposed to be used for sale
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

  # Override Devise::Controllers::Helpers to ignore stored_location_for(scope, resource)
  def redirect_for_sign_in(scope, resource)
    redirect_to after_sign_in_path_for(resource)
  end

  # Override Devise::Controllers:Helpers to make it work
  # FIXME Should not be necessary
  def sign_in_and_redirect(resource_or_scope, *args)
    options  = args.extract_options!
    scope    = Devise::Mapping.find_scope!(resource_or_scope)
    resource = args.last || resource_or_scope
    sign_in(scope, resource, options) unless warden.user(scope) == resource
    redirect_for_sign_in(scope, resource)
  end
end
