# -*- encoding : utf-8 -*-
class AdminController < ApplicationController
  before_filter :require_admin

  def become
    sign_in(:user, user = User.find(params[:user][:id]))
    redirect_for_sign_in(:user, user)
  end
end