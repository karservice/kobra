# -*- encoding : utf-8 -*-
class UsersController < ApplicationController
  before_filter :require_admin, :except => :show
  def index
    @users = User.all
  end

  # Show myself, admin can look at everyone
  def show
    if current_user.admin? && params[:id]
      @user = User.find(params[:id])
    else
      @user = current_user
    end
  end

  def edit
    @user = User.find(params[:id])
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])

    @user.admin = params[:user][:admin]

    if @user.save_and_send_password_instructions
      redirect_to(users_path, :notice => 'Användare skapad.')
    else
      render :action => "new"
    end
  end

  def update
    @user = User.find(params[:id])

    @user.admin = params[:user][:admin]

    if @user.update_attributes(params[:user])
      redirect_to(user_path(@user), :notice => 'Användare uppdaterad.')
    else
      render :action => "edit"
    end
  end

end