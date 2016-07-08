class ZonesLinksController < ApplicationController
  before_action :set_zone_link, only: [:show, :update, :destroy]
  before_action :authenticate_user!

  # GET /zone_links.json
  def index
    @zone_links = ZoneLink.get_all
    render json: @zone_links.to_json
  end

  # GET /zone_links/1.json
  def show
    render json: @zone_link.obj.to_json
  end

  # POST /zone_links.json
  def create
    @zone_link = ZoneLink.new(zone_link_params)

    if @zone_link.save
      render json: @zone_link.obj
    else
      render json: @zone_link.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /zone_links/1.json
  def update
    if @zone_link.update(zone_link_params)
      render json: @zone_link.obj
    else
      render json: @zone_link.errors, status: :unprocessable_entity
    end
  end

  # DELETE /zone_links/1.json
  def destroy
    if @zone_link.destroy
      head :no_content
    else
      render json: @zone_link.errors, status: :not_destroyed
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def :set_zone_link
      @zone_link = ZoneLink.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def zone_link_params
      params.permit( :zone_label, :offset, :leaf_id )
    end
end
