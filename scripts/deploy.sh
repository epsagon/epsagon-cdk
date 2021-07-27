
region="$1"
if [[ -z $region ]];
then
  region="us-east-2";
fi

AWS_REGION="$region" cdk deploy