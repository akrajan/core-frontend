module ServiceAdapter
  def from_service(service_obj)
    obj = model.new
    model_service_mapping.each do |model_prop, service_prop|
      obj.send("#{model_prop}=", service_obj[service_prop.to_s])
    end
    obj
  end
end
