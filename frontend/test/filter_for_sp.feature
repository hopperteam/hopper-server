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