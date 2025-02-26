const puppeteer = require('puppeteer');
const path = require('path');
const cas = require('../../cas.js');
const assert = require("assert");

(async () => {
    const browser = await puppeteer.launch(cas.browserOptions());
    const page = await cas.newPage(browser);
    const response = await cas.goto(page, "https://localhost:8443/cas/idp/metadata");
    await cas.log(`${response.status()} ${response.statusText()}`);
    assert(response.ok());

    await cas.goto(page, "http://localhost:9443/simplesaml/module.php/core/authenticate.php?as=refeds-sp");
    await page.waitForTimeout(1000);

    await cas.loginWith(page);
    await page.waitForTimeout(2000);

    await cas.log("Fetching Scratch codes from /cas/actuator...");
    let scratch = await cas.fetchGoogleAuthenticatorScratchCode();
    await cas.log(`Using scratch code ${scratch} to login...`);
    await cas.screenshot(page);
    await cas.type(page,'#token', scratch);
    await cas.pressEnter(page);
    await page.waitForNavigation();
    await cas.logPage(page);
    await page.waitForTimeout(3000);
    await cas.screenshot(page);

    await page.waitForSelector('#table_with_attributes', {visible: true});
    await cas.assertInnerTextContains(page, "#content p", "status page of SimpleSAMLphp");
    await cas.assertVisibility(page, "#table_with_attributes");
    let authData = JSON.parse(await cas.innerHTML(page, "details pre"));
    await cas.log(authData);
    assert(authData["saml:sp:AuthnContext"] === "https://refeds.org/profile/mfa");
    
    await cas.gotoLogin(page);
    await cas.assertCookie(page);

    await cas.removeDirectoryOrFile(path.join(__dirname, '/saml-md'));
    await browser.close();
    
})();

