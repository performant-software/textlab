class LeafsController < ApplicationController
  before_action :set_leaf, only: [:show, :update, :destroy]
  before_action :authenticate_user!

  # GET /leafs.json
  def index
    @leafs = Leaf.get_all
    render json: @leafs.to_json
  end

  # GET /leafs/1.json
  def show
    render json: @leaf.obj.to_json
  end

  # POST /leafs.json
  def create
    @leaf = Leaf.new(leaf_params)

    if @leaf.save
      render json: @leaf.obj
    else
      render json: @leaf.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /leafs/1.json
  def update
    
    # rails deep munge substitutes [] with nil, but we always want 
    # to keep this list in sync with editor
    if leaf_params[:zone_links_json].nil?
      @leaf.zone_links.clear
    end
    
    if @leaf.update(leaf_params)
      render json: @leaf.obj
    else
      render json: @leaf.errors, status: :unprocessable_entity
    end
  end

  # DELETE /leafs/1.json
  def destroy
    if @leaf.destroy
      head :no_content
    else
      render json: @leaf.errors, status: :not_destroyed
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_leaf
      @leaf = Leaf.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def leaf_params
      params.permit( :name, :document_id, :content, :next_zone_label, zone_links_json: [ :offset, :zone_label, :leaf_id ] )
    end
end
