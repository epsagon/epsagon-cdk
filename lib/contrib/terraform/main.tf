
locals {
  zip_deployment_used   = alltrue([var.filename])
  s3_deployment_used    = alltrue([var.s3_bucket, var.s3_key])
  image_deployment_used = alltrue([var.image_uri])
  //  deployment_used = coalesce(
  //    local.zip_deployment_used,
  //    local.s3_deployment_used,
  //    local.image_deployment_used,
  //  )

  deployments = {
    archive_zip = {
      type        = local.zip_deployment_used ? "zip" : null
      output_path = local.zip_deployment_used ? var.filename : null
      source_dir  = local.zip_deployment_used ? dirname(var.filename) : null
    }

    archive_s3 = {
      type   = local.s3_deployment_used ? "s3" : null
      bucket = local.s3_deployment_used ? var.s3_bucket : null
      key    = local.s3_deployment_used ? var.s3_key : null
    }
  }

  epsagon_layer_response = jsondecode(data.http.layer_arn.body)
  epsagon_layer_arn      = epsagon_layer_response["ResponseMetadata"]["LayerVersions"][0]["LayerVersionArn"]
  handler_split = split(".", var.handler)
  handler_relative_path = join(".", slice(local.handler_split, 0, -1))
  handler_func_name = element(var.handler, length(var.handler) - 1)
  epsagon_handlers_filename = "epsagon_handlers"

  runtime_to_language = {
    "nodejs10.x" = "node"
    "nodejs12.x" = "node"
    "nodejs14.x" = "node"
    "python2.7"  = "python"
    "python3.6"  = "python"
    "python3.7"  = "python"
    "python3.8"  = "python"
  }

  wrappers = {
    "node" = <<-EOF

      const epsagonHandler = require('${local.handler_relative_path}')
      exports.${local.handler_func_name} = epsagonHandler.${local.handler_func_name}

      try {
          process.env.EPSAGON_DEBUG = '${upper(var.debug)}';

          const epsagon = require('epsagon');
          epsagon.init({
              token: '${var.token}',
              appName: '${var.app_name}',
              traceCollectorURL: '${var.collector_url}',
              metadataOnly: ${var.metadata_only},
          });

          exports.${methodName} = epsagon.lambdaWrapper(exports.${methodName});
      } catch (err) {
          console.log('Warning: Epsagon package not found. The Function will not be monitored.');
      }
      EOF

    "python" = <<-EOF

      import ${local.handler_relative_path}
      ${local.handler_func_name} = ${local.handler_relative_path}.${local.handler_func_name}

      try:
          import os
          import epsagon
          null = undefined = None
          epsagon.init(
              token='${var.token}',
              app_name='${var.app_name}',
              debug=bool('${var.debug}'),
              collector_url='${var.collector_url}',
              metadata_only=bool('${var.metadata_only}'),
              enabled=bool('${var.epsagon_enabled}')
          )
          ${local.handler_func_name} = epsagon.lambda_wrapper(${local.handler_func_name})

          except:
              print('Warning: Epsagon package not found. The Function will not be monitored.')

      EOF
  }
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
  content = local.wrappers[ runtime_to_language[var.runtime] ]
  filename = local.deployments.archive_zip.source_dir + "/" + local.epsagon_handlers_filename
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

resource "aws_lambda_function" "main" {
  count = var.epsagon_enabled ? 1 : 0
  function_name = var.function_name
  handler       = var.handler
  role          = var.role
  runtime       = var.runtime
  layers        = length(var.layers) < 5 ? concat(var.layers, [local.epsagon_layer_arn]) : var.layers


  filename         = data.archive_file.source.output_path
  source_code_hash = data.archive_file.source.output_base64sha256

}