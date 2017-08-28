class MembershipsController < ApplicationController
  before_action :set_membership, only: [:show, :update, :destroy]
  before_action :authenticate_user!

  # GET /memberships/1.json
  def show
    render json: @membership.obj
  end

  # POST /memberships.json
  def create
    @membership = Membership.new(membership_params)

    if @membership.user.nil?
      validation_message = "Unable to find #{membership_params[:username]}."
    elsif @membership.user.id == current_user.id
      @membership.user = nil 
      validation_message = "Can't add project owner to team."
    end
    
    unless validation_message
      if @membership.save
        render json: @membership.obj
      else
        render json: @membership.errors, status: :unprocessable_entity
      end
    else
      render json: { validation_message: validation_message }
    end    
  end

  # PATCH/PUT /memberships/1.json
  def update
        
    if @membership.update(membership_params)
      render json: @membership.obj
    else
      render json: @membership.errors, status: :unprocessable_entity
    end
  end

  # DELETE /memberships/1.json
  def destroy
    if @membership.destroy
      head :no_content
    else
      render json: @membership.errors, status: :not_destroyed
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_membership
      @membership = Membership.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def membership_params
      params.permit( :username, :primary_editor, :secondary_editor, :document_id, :accepted )
    end
end
