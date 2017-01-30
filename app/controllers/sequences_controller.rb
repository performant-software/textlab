class SequencesController < ApplicationController
  before_action :set_sequence, only: [:show, :update, :destroy]
  before_action :authenticate_user!, except: :show

  def index
    # get the sequences for a given leaf for current user
    leaf_id = sequence_params[:leaf_id]
    leaf = Leaf.find(leaf_id)
    render json: leaf.get_sequence_objs( current_user.id )
  end

  # GET /sequences/1.json
  def show
    unless @sequence.document.can_view?( current_user )
      redirect_to root_url 
      return
    end
    
    respond_to do |format|
      # format.html {
      #   @transcription.diplo.destroy if !@transcription.diplo.nil?
      #   @transcription.diplo = Diplo.create_diplo!( @transcription )
        
      #   if @transcription.diplo.nil?
      #     render 'no_leaf'
      #     return
      #   end 
        
      #   if @transcription.diplo.error
      #     @error_message = @transcription.diplo.html_content   
      #     @name = @transcription.name  
      #     render 'error', layout: 'tl_viewer'
      #     return
      #   end
        
      #   @transcription.save!
      #   @diplo_html = @transcription.diplo.html_content     
      #   @title = @transcription.document.name
      #   @document_node = @transcription.leaf.document_node
      #   @prev_leaf = @document_node.prev_leaf
      #   @next_leaf =  @document_node.next_leaf
      #   @ancestor_nodes = @document_node.ancestor_nodes
      #   @node_title = @transcription.leaf.name
        
      #   unless @transcription.leaf.nil?
      #     @leaf = { 
      #       zones: @transcription.leaf.zones.map { |zone| zone.obj },
      #       tile_source: @transcription.leaf.tile_source          
      #     }
      #   else
      #     @leaf = { 
      #       zones: [],
      #       tile_source: nil
      #     }
      #   end
        
      #   render layout: 'tl_viewer'
      # }
      format.json { render json: @sequence.obj(current_user.id) }
    end
  end

  # POST /sequences.json
  def create
    @sequence = Sequence.new(sequence_params)
    @sequence.user = current_user

    if @sequence.save
      render json: @sequence.obj(current_user.id) 
    else
      render json: @sequence.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /sequences/1.json
  def update    
    if @sequence.update(sequence_params)
      render json: @sequence.obj(current_user.id) 
    else
      render json: @sequence.errors, status: :unprocessable_entity
    end
  end

  # DELETE /sequences/1.json
  def destroy
    if @sequence.destroy
      head :no_content
    else
      render json: @sequence.errors, status: :not_destroyed
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sequence
      @sequence = Sequence.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def sequence_params
      params.permit(  :name, :shared, :submitted, :published, :leaf_id, :document_id )
    end
end
