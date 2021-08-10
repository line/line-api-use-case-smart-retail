# Operation check

## LIFF endpoint configuration

Set the endpoint URL of the LIFF app created in [Create LINE channel > Add LIFF app].
*To build a local environment, follow the steps in [Front-end development environment](front-end-development-environment.md) and enter the local URL.

1. In the [LINE Developers Console](https://developers.line.biz/console/), go to the LIFF app page created in [Create LINE channel > Add LIFF app].
![LIFF console](../images/en/liff-console-en.png)

1. Click the Edit button of the Endpoint URL.
![Edit the endpoint URL](../images/en/end-point-url-description-en.png)

1. Enter the CloudFrontDomainName that you took a note of in the [Building the backend > Deploying the application (APP)] procedure with https:// at the beginning, and then click Update.
![Description of the endpoint URL](../images/en/end-point-url-editing-en.png)

## Rich menu settings

If you want to set the rich menu and start the app, see this link to set it up.
https://developers.line.biz/en/docs/messaging-api/using-rich-menus/#creating-a-rich-menu-with-the-line-manager

# Operation check

1. After completing all the steps, access the LIFF URL of the LIFF app created in the [Create LINE channel > Add LIFF app] procedure and check that it works.

1. The following barcodes can be read as test product data.
- Books

![barcode_book](../images/en/barcode_isbn_book.png)
- Apples

![barcode_apple](../images/en/barcode_jan_apple.png)
- Tomato

![barcode_tomato](../images/en/barcode_jan_tomato.png)
- Watermelon

![barcode_watermelon](../images/en/barcode_jan_watermelon.png)

*It may take up to two hours to create the Cloudfront, so if you see the Access Denied screen, please wait a while before checking again.

[Back to Table of Contents](README_en.md)
