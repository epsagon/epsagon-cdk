

/*
 * vars.tf
 * all variables accepted by the module in alphabetical order.
 * All Rights Reserved.
 */

variable "app_name" {
  description = "Epsagon Application Name. Unique per application and/or stage."
  type        = string
  default     = "Epsagon Application"
}

variable "code_signing_config_arn" {
  description = "To enable code signing for this function, specify the ARN of a code-signing configuration. A code-signing configuration includes a set of signing profiles, which define the trusted publishers for this function."
  type        = string
  default     = ""
}

variable "collector_url" {
  description = "You should know what you are doing. Trace Collector Url. Use the no-region full-path."
  type        = string
  default     = "https://tc.epsagon.com"
}

variable "dead_letter_config" {
  description = "Specifies the queue or topic where Lambda sends asynchronous events when they fail processing."
  type = object({
    target_arn = string
  })
  default = null
}

variable "debug" {
  description = "Whether to enable Epsagon's debug logs. If true -> will output."
  type        = bool
  default     = false
}

variable "description" {
  description = "Description of what your Lambda Function does."
  type        = string
  default     = ""
}

variable "disable" {
  description = "Whether to disable Epsagon tracing. If true -> will not be traced."
  type        = bool
  default     = false
}

variable "environment" {
  description = "The Lambda environment's configuration settings."
  type = object({
    variables = map(string)
  })
  default = null
}

variable "file_system_config" {
  description = "Connection settings for an EFS file system."
  type = object({
    arn              = string
    local_mount_path = string
  })
  default = null
}

variable "filename" {
  description = "Path to the function's deployment package within the local filesystem. Conflicts with image_uri, s3_bucket, s3_key, and s3_object_version."
  type        = string
  default     = null
}

variable "function_name" {
  description = "Unique name for your Lambda Function."
  type        = string
}

variable "handler" {
  description = "Function entrypoint in your code."
  type        = string
  default     = ""
}

variable "image_config" {
  description = "Container image configuration values that override the values in the container image Dockerfile."
  type = object({
    command           = string
    entry_point       = string
    working_directory = string
  })
  default = null
}

variable "image_uri" {
  description = "ECR image URI containing the function's deployment package. Conflicts with filename, s3_bucket, s3_key, and s3_object_version."
  type        = string
  default     = null
}

variable "kms_key_arn" {
  description = "Amazon Resource Name (ARN) of the AWS Key Management Service (KMS) key that is used to encrypt environment variables. If this configuration is not provided when environment variables are in use, AWS Lambda uses a default service key."
  type        = string
  default     = null
}

variable "layers" {
  description = "List of Lambda Layer Version ARNs to attach to your Lambda Function."
  type        = list(string)
  default     = []
}

variable "memory_size" {
  description = "mount of memory in MB your Lambda Function can use at runtime. Defaults to 128."
  type        = number
  default     = 128
}

variable "metadata_only" {
  description = "Whether to collect only metadata in the Trace. If true -> Will ONLY collect metadata."
  type        = bool
  default     = false
}

variable "package_type" {
  description = "Lambda deployment package type. Valid values are Zip and Image. Defaults to Zip."
  type        = string
  default     = "Zip"
}

variable "publish" {
  description = "Whether to publish creation/change as new Lambda Function Version. Defaults to false."
  type        = bool
  default     = false
}

variable "reserved_concurrent_executions" {
  description = "Amount of reserved concurrent executions for this lambda function. A value of 0 disables lambda from being triggered and -1 removes any concurrency limitations. Defaults to Unreserved Concurrency Limits -1."
  type        = number
  default     = -1
}

variable "role" {
  description = "Amazon Resource Name (ARN) of the function's execution role."
  type        = string
}

variable "runtime" {
  description = "Identifier of the function's runtime."
  type        = string
}

variable "s3_bucket" {
  description = "S3 bucket location containing the function's deployment package. Conflicts with filename and image_uri. This bucket must reside in the same AWS region where you are creating the Lambda function."
  type        = string
  default     = null
}

variable "s3_key" {
  description = "S3 key of an object containing the function's deployment package. Conflicts with filename and image_uri."
  type        = string
  default     = null
}

variable "s3_object_version" {
  description = "Object version containing the function's deployment package. Conflicts with filename and image_uri."
  type        = string
  default     = null
}

variable "source_code_hash" {
  description = "Used to trigger updates. Must be set to a base64-encoded SHA256 hash of the package file specified with either filename or s3_key."
  type        = string
  default     = null
}

variable "source_dir" {
  description = "Path to the function's deployment source directory within the local filesystem. Conflicts with image_uri, s3_bucket, s3_key, and s3_object_version."
  type        = string
  default     = null
}

variable "tags" {
  description = ""
  type        = map(string)
  default     = null
}

variable "timeout" {
  description = "Amount of time your Lambda Function has to run in seconds. Defaults to 3."
  type        = number
  default     = 3
}

variable "token" {
  description = "Epsagon Token. Unique per Organization Account."
  type        = string
  default     = ""
}

variable "tracing_config" {
  description = "Whether to to sample and trace a subset of incoming requests with AWS X-Ray. Valid values are PassThrough and Active."
  type = object({
    mode = string
  })
  default = null
}

variable "vpc_config" {
  description = "For network connectivity to AWS resources in a VPC, specify a list of security groups and subnets in the VPC. When you connect a function to a VPC, it can only access resources and the internet through that VPC."
  type = object({
    security_group_ids = list(string)
    subnet_ids         = list(string)
  })
  default = null
}
