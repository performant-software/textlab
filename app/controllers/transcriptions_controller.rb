class TranscriptionsController < ApplicationController
  before_action :set_transcription, only: [:show, :update, :destroy]
  before_action :authenticate_user!, except: :show

  def index
    # get the transcriptions for a given leaf for current user
    leaf_id = transcription_params[:leaf_id]
    render json: Transcription.get_all( leaf_id, current_user.id )
  end

  # GET /transcriptions/1.json
  def show
    unless @transcription.document.can_view?( current_user )
      redirect_to root_url 
      return
    end
    
    respond_to do |format|
      format.html {
        @transcription.diplo.destroy if !@transcription.diplo.nil?
        @transcription.diplo = Diplo.create_diplo!( @transcription )
        
        if @transcription.diplo.nil?
          render 'no_leaf'
          return
        end 
        
        if @transcription.diplo.error
          @error_message = @transcription.diplo.html_content   
          @name = @transcription.name  
          render 'error', layout: 'tl_viewer'
          return
        end
        
        @transcription.save!
        @diplo_html = @transcription.diplo.html_content     
        @title = @transcription.document.name
        
        unless @transcription.leaf.nil?
          @leaf = { 
            zones: @transcription.leaf.zones.map { |zone| zone.obj },
            tile_source: @transcription.leaf.tile_source          
          }
        else
          @leaf = { 
            zones: [],
            tile_source: nil
          }
        end
        
        render layout: 'tl_viewer'
      }
      format.json { render json: @transcription.obj(current_user.id) }
    end
  end

  # POST /transcriptions.json
  def create
    @transcription = Transcription.new(transcription_params)
    @transcription.user = current_user

    if @transcription.save
      render json: @transcription.obj(current_user.id) 
    else
      render json: @transcription.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /transcriptions/1.json
  def update
    
    # rails deep munge substitutes [] with nil, but we always want 
    # to keep this list in sync with editor
    if transcription_params[:zone_links_json].nil?
      @transcription.zone_links.clear
    end
    
    if @transcription.update(transcription_params)
      render json: @transcription.obj(current_user.id) 
    else
      render json: @transcription.errors, status: :unprocessable_entity
    end
  end

  # DELETE /transcriptions/1.json
  def destroy
    if @transcription.destroy
      head :no_content
    else
      render json: @transcription.errors, status: :not_destroyed
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_transcription
      @transcription = Transcription.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def transcription_params
      params.permit( :name, :content, :shared, :submitted, :published, :leaf_id, :document_id, zone_links_json: [ :offset, :zone_label, :leaf_id ] )
    end
end
