class DocumentNodesController < ApplicationController
  before_action :set_document_node, only: [:show, :update, :destroy]
  before_action :authenticate_user!

  # GET /document_nodes/1.json
  def show
    render json: @document_node.obj.to_json
  end

  # POST /document_nodes.json
  def create
    @document_node = DocumentNode.new(document_node_params)

    if @document_node.save
      render json: @document_node.obj
    else
      render json: @document_node.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /document_nodes/1.json
  def update
    if @document_node.update(document_node_params)
      render json: @document_node.obj
    else
      render json: @document_node.errors, status: :unprocessable_entity
    end
  end

  # DELETE /document_nodes/1.json
  def destroy
    if @document_node.destroy
      head :no_content
    else
      render json: @document_node.errors, status: :not_destroyed
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_document_node
      @document_node = DocumentNode.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def document_node_params
      params.permit( :name, :document_section_id, :leaf_id, :position, :document_node_id, :document_id )
    end
end
