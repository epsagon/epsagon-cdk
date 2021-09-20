
variable "function_name" {
  description = ""
  type        = string
}

variable "handler" {
  description = ""
  type        = string

}

variable "role" {
  description = ""
  type        = string
  default     = ""
}

variable "runtime" {
  description = ""
  type        = string
}

variable "filename" {
  description = ""
  type        = string
  default     = null
}

variable "source_dir" {
  description = ""
  type        = string
  default     = null
}

variable "image_uri" {
  description = ""
  type        = string
  default     = null
}

variable "s3_bucket" {
  description = ""
  type        = string
  default     = null
}

variable "s3_key" {
  description = ""
  type        = string
  default     = null
}

variable "s3_object_version" {
  description = ""
  type        = string
  default     = null
}

variable "layers" {
  description = ""
  type        = list(string)
  default     = []
}

variable "memory_size" {
  description = ""
  type        = string
  default     = ""
}

variable "package_type" {
  description = ""
  type        = string
  default     = ""
}

variable "source_code_hash" {
  description = ""
  type        = string
  default     = ""
}

variable "tags" {
  description = ""
  type        = map(string)
  default = {

  }
}


variable "archive" {
  description = ""
  type        = string
  default     = ""
}

variable "token" {
  description = ""
  type        = string
  default     = ""
}

variable "app_name" {
  description = ""
  type        = string
  default     = ""
}

variable "debug" {
  description = ""
  type        = bool
  default     = false
}

variable "metadata_only" {
  description = ""
  type        = bool
  default     = false
}

variable "collector_url" {
  description = ""
  type        = string
  default     = "https://tc.epsagon.com"
}

variable "epsagon_enabled" {
  description = ""
  type        = bool
  default     = true
}