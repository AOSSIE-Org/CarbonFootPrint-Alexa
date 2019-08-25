# Create the .aws and .ask directories
mkdir ~/.aws
mkdir ~/.ask

# Create AWS credentials
echo "[default]" > ~/.aws/credentials
echo "aws_access_key_id=$AWS_ACCESS_KEY_ID" >> ~/.aws/credentials
echo "aws_secret_access_key=$AWS_SECRET_ACCESS_KEY" >> ~/.aws/credentials
echo "region=us-west-2" >> ~/.aws/credentials

# Create ASK config
sed -e s/ASK_ACCESS_TOKEN/${ASK_ACCESS_TOKEN}/g -e \
    s/ASK_REFRESH_TOKEN/${ASK_REFRESH_TOKEN}/g conf/cli_config.json > ~/.ask/cli_config

chmod a+x hooks/pre_deploy_hook.sh

# Create the Lambda upload file and deploy it
ask deploy --force