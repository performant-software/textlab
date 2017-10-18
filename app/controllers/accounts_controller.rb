class AccountsController < ApplicationController
  before_action :set_user, only: [:show, :update]
  before_action :check_privs, only: [:show, :update]
  before_action :authenticate_user!

  # GET /accounts.json
  def index
    # normal users can't access other folks account 
    redirect_to root_path if current_user.user_type == 'user'

    @users = User.get_all(current_user)
    render json: @users.to_json
  end

  # GET /accounts/1.json
  def show
    respond_to do |format|
      format.json { render json: @user.obj }
    end
  end

  # PATCH/PUT /accounts/1.json
  def update
    if @user.update(user_params)
      render json: @user.obj
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private

  def check_privs
    # normal users can only edit their own accounts
    redirect_to root_path if current_user.user_type == 'user' && @user.id != current_user.id
    # site admins can edit site member's accounts
    redirect_to root_path if current_user.user_type == 'site_admin' && @user.site_id != @user.site_id
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def user_params
    # only admins can change user_type and site_id
    if current_user.admin?
      params.permit( :username, :first_name, :last_name, :email, :user_type, :site_id )
    else
      params.permit( :username, :first_name, :last_name, :email )
    end
  end
end
