require 'ostruct'
require "#{Rails.root}/lib/service/client"

module Service
  class ServiceCategory
    def self.service_categories
      client = Service.get_client
      url = "/#{client.base_path}/service_categories"
      resp = client.get(url)
      JSON.parse resp.body
    end
  end
end
