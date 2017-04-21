class DocumentsController < ApplicationController
  before_action :set_document, only: [:show, :update, :destroy]
  before_action :authenticate_user!, except: :show

  # GET /documents.json
  def index
    @documents = Document.get_all(current_user)
    render json: @documents.to_json
  end

  # GET /documents/1.json
  def show
    respond_to do |format|
      user_id = current_user.nil? ? nil : current_user.id
      format.json { render json: @document.obj(user_id) }
    end
  end

  # POST /documents.json
  def create
    @document = Document.new(document_params)
    @document.user_id = current_user.id

    if @document.save
      render json: @document.obj(current_user.id)
    else
      render json: @document.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /documents/1.json
  def update
    if @document.update(document_params)
      render json: @document.obj(current_user.id)
    else
      render json: @document.errors, status: :unprocessable_entity
    end
  end

  # DELETE /documents/1.json
  def destroy
    if @document.destroy
      head :no_content
    else
      render json: @document.errors, status: :not_destroyed
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_document
    @document = Document.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def document_params
    params.permit( :name, :description, :published, :leaf_manifest, :project_config_id )
  end
end
