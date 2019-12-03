import {Given, When, Then, AfterAll} from 'cucumber'
import {Builder, By, Capabilities, Key, until, WebElement, WebElementPromise} from 'selenium-webdriver';
import { expect } from 'chai';
import HopperAdapter from "./hopperAdapter";

require("chromedriver");

// driver setup
const capabilities = Capabilities.chrome();
capabilities.set('chromeOptions',
    {
        "w3c": false,
        'args': ['--disable-gpu', '--disable-dev-shm-usage', '--no-sandbox', '-headless']
    }
);
const driver = new Builder().withCapabilities(capabilities).build();
let adapter = new HopperAdapter();

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

Given(/^User is on hopper$/, async function () {
    await driver.manage().deleteAllCookies();
    (await driver.manage().getTimeouts()).implicit = 2 * 1000;
    await driver.get("http://localhost/?dummy")
});

Given(/^User is logged in$/, async function () {
    await (await driver.findElement(By.id("loginButton"))).click();
    await driver.wait(until.elementLocated(By.id('notificationContainer')), 2 * 1000);
    adapter = new HopperAdapter();
    await adapter.setup(driver);
});

Given(/^User has open Notification "([^"]*)" by "([^"]*)"$/, async function (name, sender) {
    await adapter.insertNotification(driver, name, sender);
});

Given(/^No AppFilter is selected$/, async function () {
    let sel = await driver.findElements(By.className("appFilterSelected"));
    if (sel.length == 1) {
        await sel[0].click()
    }
    await sleep(200);
});
Given(/^AppFilter "([^"]*)" is selected$/, async function(filter) {
    let id = await adapter.getAppId(filter, driver);
    let el = driver.findElement(By.id('app-' + id));
    await el.click();
    await sleep(200);
});

Given(/^Checkbox "([^"]*)" is( not)? checked$/, async function (checkbox, not) {
    let box = undefined;

    switch (checkbox) {
        case "SeeAllNotifications":
            box = await driver.findElement(By.id("includeDoneSelector"));
            break;
        default:
            expect.fail("Unknown checkbox!");
    }
    if (await box!.isSelected()) {
        if (not != undefined) {
            await box!.click()
        }
    } else {
        if (not == undefined) {
            await box!.click()
        }
    }
});

When(/^User clicks on button "([^"]*)" in Notification "([^"]*)"$/, async function (button, notification) {
    let id = adapter.getNotificationId(notification);
    let el = driver.findElement(By.id('not-' + id));
    let buttonEl: WebElement|undefined;
    switch (button) {
        case "done":
            buttonEl = await el.findElement(By.className("markDoneButton"));
            break;
        default:
            expect.fail("Unknown checkbox!");
    }
    expect(buttonEl).not.to.be.undefined;

    await buttonEl!.click();
    await sleep(100);
});

When(/^User clicks on AppFilter "([^"]*)"$/, async function (filter) {
    let id = await adapter.getAppId(filter, driver);
    let el = driver.findElement(By.id('app-' + id));
    await el.click();
    await sleep(2000);
});

Then(/^Notification "([^"]*)" should be done$/, async function (name) {
    let isDone = await adapter.isNotificationDone(driver, name);
    expect(isDone).to.equal(true);
});
Then(/^Notification "([^"]*)" should( not)? be visible$/, async function (name, not) {
    let id = await adapter.getNotificationId(name);
    if (not != undefined) {
        let el = await driver.findElements(By.id('not-' + id));
        if (el.length > 0) expect.fail("Notification is visible!");
        return;
    }
    await driver.findElement(By.id('not-' + id));


});

Then(/^AppFilter "([^"]*)" should( not)? be selected$/, async function (filter, not) {
    let id = await adapter.getAppId(filter, driver);
    let el = driver.findElement(By.id('app-' + id));
    let classes = await el.getAttribute("class");
    if (not == undefined)
        expect(classes).to.contain("appFilterSelected");
    else
        expect(classes).not.to.contain("appFilterSelected");
});

AfterAll('end', async function(){
    await driver.quit();
});
