Feature: Mark notification as done

  Scenario: Simple marking and disappear
    Given User is logged in
    And User has a Notification "Test" by "TestApp"
    And Notification "Test" is undone
    And No AppFilter is selected
    And Checkbox "seeAllNotification" is not checked
    When User clicks on button "done" in Notification "Test"
    Then Notification "Test" should be done
    And Notification "Test" should not be visible

  Scenario: Simple marking and no disappear
    Given User is logged in
    And User has a Notification "Test" by "TestApp"
    And Notification "Test" is undone
    And No AppFilter is selected
    And Checkbox "SeeAllNotification" is checked
    When User clicks on button "done" in Notification "Test"
    Then Notification "Test" should be done
    And Notification "Test" should be visible

  Scenario: App Selected and disappear
    Given User is logged in
    And User has a Notification "Test" by "TestApp"
    And Notification "Test" is undone
    And AppFilter "TestApp" is selected
    And Checkbox "SeeAllNotification" is not checked
    When User clicks on button "done" in Notification "Test"
    Then Notification "Test" should be done
    And Notification "Test" should not be visible

  Scenario: App Selected and no disappear
    Given User is logged in
    And User has a Notification "Test" by "TestApp"
    And Notification "Test" is undone
    And AppFilter "TestApp" is selected
    And Checkbox "SeeAllNotification" is checked
    When User clicks on button "done" in Notification "Test"
    Then Notification "Test" should be done
    And Notification "Test" should be visible
