require 'ostruct'
require "#{Rails.root}/lib/service_adapter.rb"
require "#{Rails.root}/lib/service/client"
require "#{Rails.root}/app/models/service_category"

module Service
  class ServiceCategory
    extend ServiceAdapter

    CategorySkusList = 'categorySkusList'
    ServiceCategoryKey = 'serviceCategory'
    ErrorKey = 'errorMessages'

    def self.model
      ::ServiceCategory
    end

    def self.model_service_mapping
      {name: "name", channel: "channel", error_messages: "errorMessages", id: "id"}
    end

    def self.service_categories
      service_categories = get_service_categories[CategorySkusList]
      service_categories.map do |srv_cat_resp|
        from_service srv_cat_resp[ServiceCategoryKey]
      end
    end

    def self.get_service_categories
      client = Service.get_client
      url = "/#{client.base_path}/service_categories"
      resp = client.get(url)
      JSON.parse resp.body
    end
  end
end
