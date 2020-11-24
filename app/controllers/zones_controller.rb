class ZonesController < ApplicationController
  before_action :set_zone, only: [:show, :update, :destroy]
  before_action :authenticate_user!

  # GET /zones/1.json
  def show
    render json: @zone.obj.to_json
  end

  # POST /zones.json
  def create
    @zone = Zone.new(zone_params)

    if @zone.save
      render json: @zone.obj
    else
      render json: @zone.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /zones/1.json
  def update
    if @zone.update(zone_params)
      render json: @zone.obj
    else
      render json: @zone.errors, status: :unprocessable_entity
    end
  end

  # DELETE /zones/1.json
  def destroy
    if @zone.destroy
      head :no_content
    else
      render json: @zone.errors, status: :not_destroyed
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_zone
      @zone = Zone.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def zone_params
      params.permit( :zone_label, :ulx, :uly, :lrx, :lry, :transcription_id )
    end
end
