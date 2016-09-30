class DiplosController < ApplicationController
  before_action :set_diplo, only: [:show, :update, :destroy]
  before_action :authenticate_user!

  # GET /diplos/1.json
  def show
    render json: @diplo.obj
  end

  # POST /diplos.json
  def create
    @diplo = Diplo.new(diplo_params)

    if @diplo.save
      render json: @diplo.obj
    else
      render json: @diplo.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /diplos/1.json
  def update
    if @diplo.update(diplo_params)
      render json: @diplo.obj
    else
      render json: @diplo.errors, status: :unprocessable_entity
    end
  end

  # DELETE /diplos/1.json
  def destroy
    if @diplo.destroy
      head :no_content
    else
      render json: @diplo.errors, status: :not_destroyed
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_diplo
      @diplo = Diplo.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def diplo_params
      params.permit( :transcription_id )
    end
end
