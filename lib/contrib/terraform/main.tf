
resource "aws_lambda_function" "main_traced" {
  count            = var.epsagon_enabled ? 1 : 0
  function_name    = var.function_name
  handler          = local.epsagon_handler
  role             = var.role
  runtime          = var.runtime
  layers           = concat(var.layers, [local.epsagon_layer_arn])
  filename         = data.archive_file.source.output_path
  source_code_hash = data.archive_file.source.output_base64sha256

}

resource "aws_lambda_function" "main_untraced" {
  count            = var.epsagon_enabled ? 0 : 1
  function_name    = var.function_name
  handler          = var.handler
  role             = var.role
  runtime          = var.runtime
  layers           = var.layers
  filename         = var.filename
  source_code_hash = data.archive_file.source.output_base64sha256

}



data "aws_region" "current" {

}

data "http" "layer_arn" {
  url = "https://layers.epsagon.com/production?region=${
    data.aws_region.current.name
    }&name=epsagon-${
    local.runtime_to_language[var.runtime]
  }-layer&max_items=1"
}


resource "local_file" "epsagon_handler" {
  content  = local.wrappers[local.runtime_to_language[var.runtime]]
  filename = local.epsagon_handlers_filename
}

data "archive_file" "source" {
  type        = local.deployments.archive_zip.type
  output_path = local.deployments.archive_zip.output_path
  source_dir  = local.deployments.archive_zip.source_dir

  depends_on = [
    local_file.epsagon_handler
  ]
}

resource "aws_s3_bucket_object" "source" {
  count  = local.s3_deployment_used ? 1 : 0
  bucket = local.deployments.archive_s3.bucket
  key    = local.deployments.archive_s3.key
}

