

resource "aws_lambda_function" "main" {
  function_name = var.function_name
  handler = var.handler
  role = var.role
  runtime = var.runtime
  filename = var.filename
  source_code_hash = var.source_code_hash
}