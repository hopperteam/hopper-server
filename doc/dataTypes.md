# Data Types
## `Notification`
  - `id: string`
  - `heading: string` 
  - `serviceProvider: number`
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
