# -*- encoding : utf-8 -*-
class UsersController < ApplicationController
  before_filter :require_admin
  def index
    @users = User.all
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])

    respond_to do |format|
      if @user.save_and_send_password_instructions
        format.html { redirect_to(users_path, :notice => 'Användare skapad.') }
      else
        render :action => "new"
      end
    end
  end

  def update
    respond_to do |format|
      if @user.update_attributes(params[:user])
        redirect_to(users_path, :notice => 'Användare uppdaterad.')
      else
        render :action => "edit"
      end
    end
  end

end