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
### `GET /notifications (offset?: number, limit?: number, app?: number)`
### `POST /notifications/done (id: number)` 
### `DELETE /notifications (id: number)`

### `WebSocket /ws`

## App (=Service Provider) Management
### `GET /apps`
### `DELETE /apps (id: number)`

# Backend - Service Provider Communication

### `POST /app (name: string, baseUrl: string, logoUrl: string, contactEmail: string)` 
### `PUT /app (name?: string, logoUrl?: string, contactEmail?: string)`

### `POST /notification (notification: Notification)`
### `PUT /notification (id: number, notification?*: Notification)`
### `DELETE /notification (id: number)`
