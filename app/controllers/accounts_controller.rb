class AccountsController < ApplicationController
  before_action :set_user, only: [:show, :update]
  before_action :authenticate_user!

  # GET /accounts.json
  def index
    @users = User.get_all
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

  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def user_params
    params.permit( :username, :email, :user_type )
  end
end
