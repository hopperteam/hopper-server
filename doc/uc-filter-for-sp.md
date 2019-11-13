# 1 UC: Filter notifications for one SP

## 1.1 Brief Description
Every user will receive notifications. These notifications will be filterable by the SP which sent them.

When the user selects one SP, only notifications by this SP should be visible.

# 2 Flow of Events
## 2.1 Basic Flow
- User selects one SP from the list of the providers
- Only notifications from this SP will be visible

### 2.1.1 Activity Diagram
![Organization Application Activity Diagram](./img/uc-filter-for-sp-flow.svg)

### 2.1.2 Mock-up
![Mockup](./mockups/hopper_main.png)

### 2.1.3 Narrative
The productive gherkin file can be found [in the project](./../frontend/test/filter_for_sp.feature).
```gherkin 
Feature: Filter for SP

  Scenario: Simple filter for SP
    Given User is on hopper
    And User is logged in
    And User has open Notification "Test" by "TestApp"
    And User has open Notification "Test2" by "TestApp2"
    And No AppFilter is selected
    And Checkbox "SeeAllNotifications" is not checked
    When User clicks on AppFilter "TestApp"
    Then Notification "Test" should be visible
    Then Notification "Test2" should not be visible
    Then AppFilter "TestApp" should be selected

  Scenario: Deselect filter for SP
    Given User is on hopper
    And User is logged in
    And User has open Notification "Test" by "TestApp"
    And User has open Notification "Test2" by "TestApp2"
    And AppFilter "TestApp" is selected
    And Checkbox "SeeAllNotifications" is not checked
    When User clicks on AppFilter "TestApp"
    Then Notification "Test" should be visible
    Then Notification "Test2" should be visible
    Then AppFilter "TestApp" should not be selected

  Scenario: Switch filter for SP
    Given User is on hopper
    And User is logged in
    And User has open Notification "Test" by "TestApp"
    And User has open Notification "Test2" by "TestApp2"
    And AppFilter "TestApp" is selected
    And Checkbox "SeeAllNotifications" is not checked
    When User clicks on AppFilter "TestApp2"
    Then Notification "Test" should not be visible
    Then Notification "Test2" should be visible
    Then AppFilter "TestApp" should not be selected
    Then AppFilter "TestApp2" should be selected
```

## 2.2 Alternative Flows
(n/a)

# 3 Special Requirements
(n/a)

# 4 Preconditions
## 4.1 Logged in
The user has to be logged in to the system.
## 4.2 User has at least one notification
The user has to have at least one notification in the current filter for the SP to become visible, to filter for it.

# 5 Postconditions
## 5.1 SP highlighted
The selected SP is highlighted in some way.
## 5.2 Only SP's notifications visible
Only the notifications, sent by the selected SP, will be visible.
 
# 6 Extension Points
(n/a)
