class ServiceSku
  attr_accessor :id, :title, :short_title, :type, :channel, :min_price, :max_price,
    :min_duration, :max_duration, :min_reason, :max_reason, :error_messages

  module AdapterServiceSku
    def self.from_service(service_obj)
      sku = ServiceSku.new
      sku.id = service_obj['id']
      sku.title = service_obj['title']
      sku.short_title = service_obj['shortTitle']
      sku.type = service_obj['type']
      sku.channel = service_obj['channel']
      sku.min_price = service_obj['minPrice']
      sku.max_price = service_obj['maxPrice']
      sku.min_duration = service_obj['minDuration']
      sku.max_duration = service_obj['maxDuration']
      sku.min_reason = service_obj['minReason']
      sku.max_reason = service_obj['maxReason']
    end
  end
end
