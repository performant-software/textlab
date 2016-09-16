# NOTE: This class is only used for migrating data from the previous version of TextLab

class Folder < ActiveRecord::Base  
  has_many :tl_transcriptions
end