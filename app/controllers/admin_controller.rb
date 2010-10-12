# -*- encoding : utf-8 -*-
class AdminController < ApplicationController
  before_filter :require_admin

  # Sign as different user, and redirect as a normal login
  def become
    sign_in_and_redirect(:user, User.find(params[:user][:id]))
  end
end