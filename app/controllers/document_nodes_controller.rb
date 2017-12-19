class DocumentNodesController < ApplicationController
  before_action :set_document_node, only: [:show, :update, :destroy]
  before_action :authenticate_user!

  # GET /document_nodes/1.json
  def show
    render json: @document_node.obj
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

  # PATCH/PUT /document_nodes/update_set
  def update_set
    # update a collection of nodes
    error = false
    nodes = JSON.parse( params['nodes'] )
    @document_nodes = nodes.map { |node|
      document_node = DocumentNode.find(node['id'])
      # validates params from json obj before update
      node_params = ActionController::Parameters.new(node)
      if document_node.update(document_node_params(node_params))
        document_node.obj
      else
        error = true
        document_node.errors
      end
    }
    if error
      render json: @document_nodes, status: :unprocessable_entity
    else
      render json: @document_nodes
    end
  end

  # PATCH/PUT /document_nodes/1.json
  def update
    # single node update
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
    def document_node_params( param_obj=nil )
      param_obj = param_obj.nil? ? params : param_obj
      param_obj.permit( :name, :document_section_id, :leaf_id, :position, :document_node_id, :document_id, :leaf_manifest )
    end
end
