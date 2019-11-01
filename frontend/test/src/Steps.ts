import {Given, When, Then, AfterAll} from 'cucumber'
const { Builder, By, Capabilities, Key } = require('selenium-webdriver');
const { expect } = require('chai');

require("chromedriver");

// driver setup
const capabilities = Capabilities.chrome();
capabilities.set('chromeOptions', { "w3c": false });
const driver = new Builder().withCapabilities(capabilities).build();

Given(/^User is on hopper$/, function () {
    driver.get("http://localhost/")
});
Given(/^User is logged in$/, async function () {

});
Given(/^User has a Notification "([^"]*)" by "([^"]*)"$/, function (name, sender) {

});
Given(/^Notification "([^"]*)" is undone$/, function (name) {

});
Given(/^((No AppFilter)|(AppFilter "([^"]*)")) is selected$/, function (filter) {

});
Given(/^Checkbox "([^"]*)" is( not)? checked$/, function (checkbox, not) {

});
When(/^User clicks on button "([^"]*)" in Notification "([^"]*)"$/, function (button, notification) {

});
When(/^User clicks on AppFilter "([^"]*)"$/, function (filter) {

});
Then(/^Notification "([^"]*)" should be done$/, function (name) {

});
Then(/^Notification "([^"]*)" should( not)? be visible$/, function (name, not) {

});
Then(/^AppFilter "([^"]*)" should( not)? be selected$/, function (filter, not) {

});
AfterAll('end', async function(){
    await driver.quit();
});