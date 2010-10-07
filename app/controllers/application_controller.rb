# -*- encoding : utf-8 -*-
class ApplicationController < ActionController::Base
  protect_from_forgery

  # All pages need login
  before_filter :authenticate_user!

private
  def require_admin
    unless user_signed_in? && current_user.admin?
      redirect_to root_url
    end
  end
end
