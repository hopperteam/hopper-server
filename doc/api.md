# Hopper API (v1)
All requests are relative to the hopper domain of the instance you are using. Most probably `dev.hoppercloud.net` or `app.hoppercloud.net`.

## General
This document contains function calls to the RESTful-API. They are written relative to the API: `{HOST}/api/v1`. Parameters are passed as query parameters for `GET` and `DELETE` queries and as JSON objects in the body for `POST` and `PUT` calls. When a `POST` or `PUT` call only has one parameter, the name of it is omitted and the value of parameter is passed directly.

# Backend - Frontend communication

## Request without a valid session

### `GET /` 
Returns API info.

`{"version": "1.0", "type": "dev"}`

### `POST /login (email: string, password: string)`
### `POST /register (email: string, password: string, firstName: string, lastName: string)`
### `POST /forgetPassword (email: string)`
## User Management
from this point on, any request requires a valid session

### `GET /user`
### `PUT /user (email?: string, password?: string, firstName?: string, lastName?: string)`
### `DELETE /user`

## Notification Management
### `GET /notifications (offset?: number, limit?: number, app?: string, includeDone?: boolean)`
### `POST /notifications/done (id: string)` 
### `DELETE /notifications (id: string)`

### `WebSocket /ws`

## App (=Service Provider) Management
### `GET /apps`
### `DELETE /apps (id: string)`

# Backend - Service Provider Communication

### `POST /app (name: string, baseUrl: string, logoUrl: string, contactEmail: string, cert: string)` 
`cert` is a base64 encoded PEM-RSA Public Key. The private key is for authentication of the SP to the backend.

### `PUT /app (id: string, data: string)`
`data` is a JSON-Object which is encrypted with the private key of the app and base64 encoded. It has to contain the `id` of the app again.

Updatable fields are:
  - `name`
  - `logoUrl`
  - `contactEmail`
  - `cert`

### `POST /notification (subscriptionId: string, notification: Notification)`
### `PUT /notification (id: string, notification?*: Notification)`
### `DELETE /notification (id: string)`

### `GET /subscribeRequest (id: string, base64: string): SubscribeRequest`
### `POST /subscribeRequest (id: string, base64: string): string`

## Subscribe Process
Navigate the user to `GET {{HOPPER-URL}}/subscribe (id: number, request: string)`

`request` is a encrypted (with the app's key) and base64-encoded representation of the `SubscribeRequest`-JSON.
