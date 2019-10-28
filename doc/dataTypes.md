# Data Types
## `Notification`
  - `id: string`
  - `heading: string` 
  - `serviceProvider: string`
  - `timestamp: number` 
  - `imageUrl: string?`
  - `isDone: boolean` 
  - `isSilent: boolean` 
  - `type: string` _currently only `"default"`_ 
  - `content: any` _depends on type_ 
  - `actions: Action[]` 
  
## `Notification Type`
  - `default`: `content` is a `string` with the text of the body
  
## `Action`
  - `type: string` _currently only `"submit", "text", "redirect"`_
  - `url: string` _where to POST the result_
  - `markAsDone: boolean` _mark notification as done afterwards?_
  - `text: string` _caption of the action_
 
## `Action Type`
  - `submit`: OnClick: POST Request to `url`
  - `text`: OnSubmit: POST Request to `url` body `{"text": ...}`
  - `redirect`: OnClick: Redirect user in new tab to `url`
  
## `App`
  - `id: string`
  - `name: string`
  - `imageUrl: string`
  - `isActive: boolean`
  - `isHidden: boolean`
  - `baseUrl: string`
  - `manageUrl: string?`

## `SubscribeRequest`
  - `id: number` _App Id_
  - `callback: string(url)`: _Callback to be called after success or failure, has to be in the app's base URL_
  - `name: string`: _The display name for this specific subscription (probably the account name)_
  - `requestedInfos: string[]`
 
