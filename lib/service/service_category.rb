require "#{Rails.root}/lib/service_adapter.rb"
require "#{Rails.root}/lib/service/client"
require "#{Rails.root}/app/models/service_category"
require "#{Rails.root}/app/models/service_sku"

module Service
  class ServiceCategory
    extend ServiceAdapter

    CategorySkusList = 'categorySkusList'
    ServiceCategoryKey = 'serviceCategory'
    ServiceSkuKey = 'serviceSkus'
    ErrorKey = 'errorMessages'

    def self.model
      ::ServiceCategory
    end

    def self.model_service_mapping
      {name: "name", channel: "channel", error_messages: "errorMessages", id: "id"}
    end

    def self.make_service_categories(service_categories, &block)
      service_categories.map do |srv_cat_resp|
        category = from_service srv_cat_resp[ServiceCategoryKey]
        service_skus = srv_cat_resp[ServiceSkuKey]
        category.service_skus = Service::ServiceSku.make_service_skus(service_skus) do |sku|
          sku.service_category = category
        end
        yield category if block_given?
        category
      end
    end

    def self.fetch_service_categories
      client = Service.get_client
      url = "/#{client.base_path}/service_categories"
      resp = client.get(url)
      body = JSON.parse resp.body
      service_categories = make_service_categories body[CategorySkusList]
      errors = body[ErrorKey]
      [service_categories, errors]
    end
  end
end
