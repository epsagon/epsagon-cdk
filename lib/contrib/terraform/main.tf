
resource "aws_lambda_function" "main_traced" {
  count = var.disable ? 0 : 1

  code_signing_config_arn        = var.code_signing_config_arn
  description                    = var.description
  filename                       = data.archive_file.source.output_path
  function_name                  = var.function_name
  handler                        = local.epsagon_handler
  image_uri                      = var.image_uri
  kms_key_arn                    = var.kms_key_arn
  layers                         = concat(var.layers, [local.epsagon_layer_arn])
  memory_size                    = var.memory_size
  package_type                   = var.package_type
  publish                        = var.publish
  reserved_concurrent_executions = var.reserved_concurrent_executions
  role                           = var.role
  runtime                        = var.runtime
  source_code_hash               = data.archive_file.source.output_base64sha256
  tags                           = var.tags
  timeout                        = var.timeout

  dynamic "dead_letter_config" {
    for_each = var.dead_letter_config != null ? [var.dead_letter_config] : []
    content {
      target_arn = dead_letter_config.value.target_arn
    }
  }

  dynamic "environment" {
    for_each = var.environment != null ? [var.environment] : []
    content {
      variables = environment.value.variables
    }
  }

  dynamic "file_system_config" {
    for_each = var.file_system_config != null ? [var.file_system_config] : []
    content {
      arn              = file_system_config.value.arn
      local_mount_path = file_system_config.value.local_mount_path
    }
  }

  dynamic "image_config" {
    for_each = var.image_config != null ? [var.image_config] : []
    content {
      command              = image_config.value.command
      entry_point = file_system_config.value.entry_point
      working_directory = file_system_config.value.working_directory
    }
  }

  dynamic "tracing_config" {
    for_each = var.tracing_config != null ? [var.tracing_config] : []
    content {
      mode = tracing_config.value.mode
    }
  }

  dynamic "vpc_config" {
    for_each = var.vpc_config != null ? [var.vpc_config] : []
    content {
      security_group_ids = vpc_config.value.security_group_ids
      subnet_ids         = vpc_config.value.subnet_ids
    }
  }
}

resource "aws_lambda_function" "main_untraced" {
  count = var.disable ? 1 : 0

  code_signing_config_arn        = var.code_signing_config_arn
  description                    = var.description
  filename                       = var.filename
  function_name                  = var.function_name
  handler                        = var.handler
  image_uri                      = var.image_uri
  kms_key_arn                    = var.kms_key_arn
  layers                         = var.layers
  memory_size                    = var.memory_size
  package_type                   = var.package_type
  publish                        = var.publish
  reserved_concurrent_executions = var.reserved_concurrent_executions
  role                           = var.role
  runtime                        = var.runtime
  source_code_hash               = var.source_code_hash
  tags                           = var.tags
  timeout                        = var.timeout

  dynamic "dead_letter_config" {
    for_each = var.dead_letter_config != null ? [var.dead_letter_config] : []
    content {
      target_arn = dead_letter_config.value.target_arn
    }
  }

  dynamic "environment" {
    for_each = var.environment != null ? [var.environment] : []
    content {
      variables = environment.value.variables
    }
  }

  dynamic "file_system_config" {
    for_each = var.file_system_config != null ? [var.file_system_config] : []
    content {
      arn              = file_system_config.value.arn
      local_mount_path = file_system_config.value.local_mount_path
    }
  }

  dynamic "image_config" {
    for_each = var.image_config != null ? [var.image_config] : []
    content {
      command              = image_config.value.command
      entry_point = file_system_config.value.entry_point
      working_directory = file_system_config.value.working_directory
    }
  }

  dynamic "tracing_config" {
    for_each = var.tracing_config != null ? [var.tracing_config] : []
    content {
      mode = tracing_config.value.mode
    }
  }

  dynamic "vpc_config" {
    for_each = var.vpc_config != null ? [var.vpc_config] : []
    content {
      security_group_ids = vpc_config.value.security_group_ids
      subnet_ids         = vpc_config.value.subnet_ids
    }
  }
}

data "aws_region" "current" { }

resource "local_file" "epsagon_handler" {
  content  = local.wrappers[
    local.runtime_to_language[
      var.runtime
    ]
  ]
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
