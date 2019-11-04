# Subscription Process
This document outlines the subscription process, SPs have to go through, to be able to send notifications to users in hopper.

## Prerequisites
The service provider is required to be reachable in the public internet via HTTPS to be able to receive subscription tokens.

Each service provider is required to have a RSA 2048 bit key-pair. This is required for authentication to hopper.


## Registration
First, the service provider performs the `POST /app` request to sign up (available in the API-documentation). the certificate is the Base64-PEM-encoded public key of the backend. 

## Updates
To update the service provider, the `PUT /app` request is performed. The `data` object is a json object which is encrypted with the private key of the SP and base64-encoded.

## Subscription Process
To subscribe a user to a SP, the SP has to create a `SubscripeRequest` for the user. This request gets encrypted with the private key of the SP and is then base64-encoded.

The user is then navigated to this URL:
```URL 
  {{hopper-instance}}/subscripe?id={{spId}}&request={{base64-request}}
```
Hopper will verify the SPs identity by decoding the request with the specified public key.

When the identity is verified, the user will see an UI which to login and give the SP permission. After that, the subscription is created and a `subscriptionId` is generated. 

The user is navigated to the callback, specified in the `SubscripeRequest`. The user will be navigated via an `GET` request, which will receive 2 of 3 query parameters: 
  - `status`: Either `"success"` or `"failed"`
  - `error`: In case of `"failed"`: The error message.
  - `subscriptionId`: In case of `"success"`: The `subscriptionId`
  
After that, the subscription process is done and the SP can send notifications to the user using the `subscriptionId`.  
  
![flow diagram](img/subscriptionProcess.svg "Flow Diagram")

