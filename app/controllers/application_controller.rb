# -*- encoding : utf-8 -*-
class ApplicationController < ActionController::Base
  protect_from_forgery

  # All pages need login
  before_filter :authenticate_user!
end
