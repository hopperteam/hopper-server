Feature: Mark notification as done

  Scenario: Simple marking and disappear
    Given User is on hopper
    And User is logged in
    And User has open Notification "Test" by "TestApp"
    And No AppFilter is selected
    And Checkbox "SeeAllNotifications" is not checked
    When User clicks on button "done" in Notification "Test"
    Then Notification "Test" should be done
    And Notification "Test" should not be visible

  Scenario: Simple marking and no disappear
    Given User is on hopper
    And User is logged in
    And User has open Notification "Test" by "TestApp"
    And No AppFilter is selected
    And Checkbox "SeeAllNotifications" is checked
    When User clicks on button "done" in Notification "Test"
    Then Notification "Test" should be done
    And Notification "Test" should be visible

  Scenario: App Selected and disappear
    Given User is on hopper
    And User is logged in
    And User has open Notification "Test" by "TestApp"
    And AppFilter "TestApp" is selected
    And Checkbox "SeeAllNotifications" is not checked
    When User clicks on button "done" in Notification "Test"
    Then Notification "Test" should be done
    And Notification "Test" should not be visible

  Scenario: App Selected and no disappear
    Given User is on hopper
    And User is logged in
    And User has open Notification "Test" by "TestApp"
    And AppFilter "TestApp" is selected
    And Checkbox "SeeAllNotifications" is checked
    When User clicks on button "done" in Notification "Test"
    Then Notification "Test" should be done
    And Notification "Test" should be visible
