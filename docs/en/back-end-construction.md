# Steps to build the backend

## Deploy peripheral resources

These peripheral resources need to be deployed for this app:

1. Common processing layer (Layer)
1. Periodic execution batch (batch)

### 1. Common processing layer (Layer)

In AWS Lambda, you can describe the process you want to use in common with multiple Lambda functions as a layer.
Since this app uses layers, first deploy the layers by following these steps:

- Change template.yaml
  Open template.yaml in the backend > Layer folder and change this parameter item in the EnvironmentMap dev:

  - `LayerName` any layer name

- Run this command:

```
cd [backend > Layer folder]
sam build --use-container
sam deploy --guided
*Must be specified when using profile information that's not the default (`sam deploy --guided --profile xxx`)
    Stack Name: any stack name
    AWS Region: ap-northeast-1
    Parameter Environment: dev
    #Shows you resources changes to be deployed and require a 'Y' to initiate deploy Confirm changes before deploy [Y/n]: Y
    #SAM needs permission to be able to create roles to connect to the resources in your template Allow SAM CLI IAM role creation[Y/n]: Y
    Save arguments to samconfig.toml [Y/n]: Y

    SAM configuration file [samconfig.toml]: Press Enter only
    SAM configuration environment [default]: Press Enter only

    Deploy this changeset? [y/N]: y
```

- Note the layer version
  After deployment, the layer ARN and layer version will be displayed in the Outputs section of the terminal, so note the layer version.
  The layer version is the number at the end.
  *The version is updated every time you deploy, so the correct version for your first deployment is version 1.
  ![Output section of the command prompt](../images/en/out-put-description-en.png)

- [Confirmation] Open the Lambda console in the AWS Management Console, select "Layers" from the left tab, and confirm that the layer you deployed this time exists.

### 2. Periodic execution batch (batch)

Deploy the short-term channel access token update batch required by this app.
Since the short-term channel access tokens expire 30 days after they are obtained, we run a batch every day at regular intervals to reacquire the short-term channel access tokens and update the tables before they expire.
We use the Amazon Event Bridge [official documentation](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html) to get the batch working on time.
Follow these steps to deploy the batch:

- Change template.yaml
  Open template.yaml in the backend > batch folder and change this parameter item in the EnvironmentMap dev:

  - `LINEChannelAccessTokenDBName` Any table name (the table that manages short-term channel access tokens)
  - `EventBridgeName` Any event bridge name
    Example: AccessTokenUpdateEvent
  - `LayerVersion` The version number of the layer deployed in the [1. Common processing layer] procedure
    Example: LayerVersion: 1
  - `LoggerLevel` INFO or Debug
    Example: INFO

- Run this command:

```
cd [folder where template.yaml is located in [backend > batch]]
sam build --use-container
sam deploy --guided
*Must be specified when using profile information that's not the default (`sam deploy --guided --profile xxx`)
    Stack Name: any stack name
    AWS Region: ap-northeast-1
    Parameter Environment: dev
    #Shows you resources changes to be deployed and require a 'Y' to initiate deploy Confirm changes before deploy [Y/n]: Y
    #SAM needs permission to be able to create roles to connect to the resources in your template Allow SAM CLI IAM role creation[Y/n]: Y
    Save arguments to samconfig.toml [Y/n]: Y

    SAM configuration file [samconfig.toml]: Press Enter only
    SAM configuration environment [default]: Press Enter only

    Deploy this changeset? [y/N]: y
```

- Register the channel ID and channel secret in the table
  - Log in to the AWS Management Console and open the DynamoDB console
  - Create an item in the "Table for managing short-term channel access tokens" created earlier, and register the channel ID and channel secret of the Messaging API channel created in [Creating a LINE channel] as follows
    The channel ID and channel secret can be found in the basic channel settings in the [LINE Developers Console](https://developers.line.biz/console/).
    - channelId: Channel ID (String)
    - channelSecret: Channel secret (String)
      ![Registering a channel access token](../images/en/channel-access-token-table-record-en.png)
- Execute the Lambda function for updating the channel access token
  - Log in to the AWS Management Console and open the Lambda console
  - Open the Lambda function you just created (function name is SmartRegister-PutAccessToken-{value specified in Enviroment})
  - Select "Test Event Settings" from the test event selection drop-down menu in the top-right corner of the Lambda function console
  - When the following window opens, enter the event name, leave the event content empty, and click the Create button  
    ![Test event settings](../images/en/test-event-set-en.png)
  - Press the Test button in the top-right corner of the Lambda function console to run the test
- [Confirmation] In the DynamoDB console of the AWS management console, open the channel access token table and confirm that the channelAccessToken, limitDate, and updatedTime items are added to the LINE channel ID data used in this app

## Deploy the application (APP)

Follow these steps to deploy the app:

- Change template.yaml
  Open template.yaml in the backend > APP folder, and modify these parameter items of dev in EnvironmentMap:
  *If you need the S3 access log, uncomment the part that says ACCESS LOG SETTING.

  - `LineOAChannelId` The channel ID of the Messaging API channel created in [Creating a LINE channel]
  - `LIFFChannelId` The channel ID of the LIFF channel created in [Creating a LINE channel]
  - `LiffUrl` LIFF URL of the LIFF app created in [Creating a LINE channel]
  - `LinePayChannelId` The channel ID of the LINE Pay channel created in [Creating a LINE channel]
  - `LinePayChannelSecret` Channel secret for the LINE Pay channel created in [Creating a LINE channel]
  - `LinePayIsSandbox` True or False
    *Specify the basic True
    True: Uses a sandbox environment. You will not be charged by LINE Pay.
    False: LINE Pay "test merchant environment" will be used. The user's LINE Pay balance will be temporarily debited and the amount spent will be refunded after a certain period of time.
  - `RegisterOrderInfoDBName` Any table name (the table to register order information).
  - `RegisterItemInfoDBName` Any table name (table to register product information)
  - `RegisterCouponInfoDBName` Any table name (table to register coupon information)
  - `LINEChannelAccessTokenDBName` Table name of the "table that manages the short-term channel access token" deployed in the [2. Periodic execution batch] procedure
  - `ConfirmUrlPass` The path to transition to after LINE Pay payment is complete
  *The default is /completed.html. If you changed the path of the payment completion screen on the front page, please change it as well.
  - `DetailsPass` The path to the order history screen
  *The default is /history.html. If you pass the order history screen at the front desk, please change it as well.
  - `PaymentImageUrl` The URL of the product image to be displayed on the LINE Pay payment confirmation screen, which can be set to any image URL
  - `FrontS3BucketName` Arbitrary bucket name *This is the S3 bucket name where the front-side module will be placed. Also, capital letters are not allowed in the bucket name. [For more information on naming conventions, click here.](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-s3-bucket-naming-requirements.html)
  - `LayerVersion` The version number of the layer deployed in the [1. Common processing layer] procedure
    Example: LayerVersion: 1
  - `LoggerLevel` INFO or Debug
  - `LambdaMemorySize` Lambda memory size
    Example) LambdaMemorySize: 128 *If you don't need to change it, specify the minimum size of 128
  - `TTL` True or False (whether to delete order information automatically)
  - `TTLDay` Any number (If TTL is True, specify how many days after registration the reservation information will be deleted; if TTL is False, enter 0)
  - `LogS3Bucket` Any bucket name (the name of the S3 where the access log is stored)
  *Cancel the comment and record it only if you need an access log. Also, if you've already built another Use Case app, specify its access log bucket name and alias.
  - `LogFilePrefix` Any name (log file prefix)
  *Cancel the comment and record it only if you need an access log.

- Run this command:

```
cd [backend > APP folder]
sam build --use-container
sam deploy --guided
*Must be specified when using profile information that's not the default (`sam deploy --guided --profile xxx`)
    Stack Name: any stack name
    AWS Region: ap-northeast-1
    Parameter Environment: dev
    #Shows you resources changes to be deployed and require a 'Y' to initiate deploy Confirm changes before deploy [Y/n]: Y
    #SAM needs permission to be able to create roles to connect to the resources in your template Allow SAM CLI IAM role creation[Y/n]: Y
    ××××× may not have authorization defined, Is this okay? [y/N]: y (Input "y" for all)
    Save arguments to samconfig.toml [Y/n]: Y

    SAM configuration file [samconfig.toml]: Press Enter only
    SAM configuration environment [default]: Press Enter only

    Deploy this changeset? [y/N]: y
```

- Notes on API Gateway endpoint URL and CloudFrontDomainName
Take note of the API Gateway endpoint URL and CloudFrontDomainName displayed in OutPut when the deployment is successful.

## Error handling
CloudFrontDomainName
- If you encounter the following error when deploying, follow this procedure to resolve it.
  ```
  Export with name xxxxx is already exported by stack sam-app. Rollback requested by user.
  ```
  - Deploy after modifying backend > Layer > template.yaml with reference to the following:
    ```
    Outputs:
      UseCaseLayerName:
        Description: "UseCaseLayerDev Layer Name"
        Value: !FindInMap [EnvironmentMap, !Ref Environment, LayerName]
        Export:
          Name: SmartRegisterLayerDev > Modify this to any name you want
    ```
  - Modify backend > batch > template.yaml with reference to the following description. There are multiple files, so modify them all.
    ```
    !ImportValue SmartRegisterLayerDev > Modify SmartRegisterLayerDev to the name you just entered
    ```
  - Modify backend > APP > template.yaml with reference to the following description. There are multiple files, so modify them all.
    ```
    !ImportValue SmartRegisterLayerDev > Modify SmartRegisterLayerDev to the name you just entered
    ```

[Next page](front-end-construction.md)

[Back to Table of Contents](README_en.md)
