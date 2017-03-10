class SequencesController < ApplicationController
  before_action :set_sequence, except: [ :index, :create ]
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
      format.json { 
        if sequence_params[:p]
          render json: @sequence.published_obj() 
        else          
          render json: @sequence.obj(current_user.id) 
        end
      }
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

    # excludes fields the user isn't authorized to edit
    filtered_params = @sequence.filter_by_permissions(sequence_params, current_user.id)

    if @sequence.update(filtered_params)
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

    def sequence_params
      params.permit( :p, :leaf_id, :name, :shared, :submitted, :published, :document_id )
    end

end
