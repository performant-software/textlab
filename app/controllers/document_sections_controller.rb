class DocumentSectionsController < ApplicationController
  before_action :set_document_section, only: [:show, :update, :destroy]
  before_action :authenticate_user!

  # GET /document_sections/1.json
  def show
    respond_to do |format|
      format.html {
        if @document_section.document.published 
          @subsections = @document_section.subsections
          render layout: 'tl_viewer'
        else
          render 'not_published', layout: 'tl_viewer'
        end
      }
      format.json { render json: @document_section.obj }
    end
  end

  # POST /document_sections.json
  def create
    @document_section = DocumentSection.new(document_section_params)

    if @document_section.save
      render json: @document_section.obj
    else
      render json: @document_section.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /document_sections/1.json
  def update
    if @document_section.update(document_section_params)
      render json: @document_section.obj
    else
      render json: @document_section.errors, status: :unprocessable_entity
    end
  end

  # DELETE /document_sections/1.json
  def destroy
    if @document_section.destroy
      head :no_content
    else
      render json: @document_section.errors, status: :not_destroyed
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_document_section
      @document_section = DocumentSection.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def document_section_params
      params.permit( :name, :document_id )
    end
end
