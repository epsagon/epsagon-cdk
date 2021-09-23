

data "http" "layer_arn" {
  url = "https://layers.epsagon.com/production?region=${
    data.aws_region.current.name
    }&name=epsagon-${
    local.runtime_to_language[var.runtime]
  }-layer&max_items=1"
}
