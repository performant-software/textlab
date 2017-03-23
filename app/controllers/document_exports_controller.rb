class DocumentExportsController < ApplicationController

  # TODO restrict access to authorized users/hosts

  # GET /document_exports.json
  def index
    render json: Document.export_list_obj
  end

  # GET /document_exports/1.json
  def show
    @document = Document.find(params[:id])

    respond_to do |format|
      format.json { render json: @document.export_obj }
    end
  end

end
