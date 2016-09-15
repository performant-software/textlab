Rails.application.routes.draw do
  devise_for :users
  
  root 'home#index'
  
  resources :documents, only: [ :index, :show, :update, :create, :destroy ]
  resources :leafs, only: [ :show, :update, :create, :destroy ]
  resources :memberships, only: [ :show, :update, :create, :destroy ]
  resources :document_sections, only: [ :show, :update, :create, :destroy ]
  resources :document_nodes, only: [ :show, :update, :create, :destroy ]
  resources :zones, only: [ :show, :update, :create, :destroy ]
  resources :zone_links, only: [ :show, :update, :create, :destroy ]
   
end
