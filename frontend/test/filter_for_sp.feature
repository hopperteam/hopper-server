Feature: Filter for SP

  Scenario: Simple filter for SP
    Given User is on hopper
    And User is logged in
    And User has a Notification "Test" by "TestApp"
    And Notification "Test" is undone
    And User has a Notification "Test2" by "TestApp2"
    And Notification "Test2" is undone
    And No AppFilter is selected
    And Checkbox "seeAllNotification" is not checked
    When User clicks on AppFilter "TestApp"
    Then Notification "Test" should be visible
    Then Notification "Test2" should not be visible
    Then AppFilter "Test" should be selected

  Scenario: Deselect filter for SP
    Given User is on hopper
    And User is logged in
    And User has a Notification "Test" by "TestApp"
    And Notification "Test" is undone
    And User has a Notification "Test2" by "TestApp2"
    And Notification "Test2" is undone
    And AppFilter "TestApp" is selected
    And Checkbox "seeAllNotification" is not checked
    When User clicks on AppFilter "TestApp"
    Then Notification "Test" should be visible
    Then Notification "Test2" should be visible
    Then AppFilter "TestApp" should not be selected

  Scenario: Switch filter for SP
    Given User is on hopper
    And User is logged in
    And User has a Notification "Test" by "TestApp"
    And Notification "Test" is undone
    And User has a Notification "Test2" by "TestApp2"
    And Notification "Test2" is undone
    And AppFilter "TestApp" is selected
    And Checkbox "seeAllNotification" is not checked
    When User clicks on AppFilter "TestApp2"
    Then Notification "Test" should not be visible
    Then Notification "Test2" should be visible
    Then AppFilter "TestApp" should not be selected
    Then AppFilter "TestApp2" should be selected