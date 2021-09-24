
resource "aws_lambda_function" "main_traced" {
  count            = var.disable ? 0 : 1
  function_name    = var.function_name
  handler          = local.epsagon_handler
  role             = var.role
  runtime          = var.runtime
  timeout          = var.timeout
  environment      = var.environment
  layers           = concat(var.layers, [local.epsagon_layer_arn])
  filename         = data.archive_file.source.output_path
  source_code_hash = data.archive_file.source.output_base64sha256

}

resource "aws_lambda_function" "main_untraced" {
  count            = var.disable ? 1 : 0
  function_name    = var.function_name
  handler          = var.handler
  role             = var.role
  runtime          = var.runtime
  timeout          = var.timeout
  environment      = var.environment
  layers           = var.layers
  filename         = var.filename
  source_code_hash = data.archive_file.source.output_base64sha256

}

data "aws_region" "current" { }

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
