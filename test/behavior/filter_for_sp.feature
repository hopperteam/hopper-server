Feature: Filter for SP

  Scenario: Filter for SP
    Given User is logged in
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