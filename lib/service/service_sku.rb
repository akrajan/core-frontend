require "#{Rails.root}/lib/service_adapter.rb"
require "#{Rails.root}/lib/service/client"
require "#{Rails.root}/app/models/service_sku"

module Service
  class ServiceSku
    extend ServiceAdapter
    ServiceSkuKey = 'serviceSkus'
    ErrorKey = 'errorMessages'

    def self.model
      ::ServiceSku
    end

    def self.model_service_mapping
      {id: 'id', title: 'title', short_title: 'shortTitle', type: 'type', channel: 'channel',
       min_price: 'minPrice', max_price: 'maxPrice', min_duration: 'minDuration', max_duration: 'maxDuration',
      min_reason: 'minReason', max_reason: 'maxReason'}
    end

    def self.make_service_skus(service_skus, &block)
      service_skus.map do |srv_sku|
        obj = from_service srv_sku
        yield obj if block_given?
        obj
      end
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
