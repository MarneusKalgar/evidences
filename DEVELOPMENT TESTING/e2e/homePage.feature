@smoke @sanity @homepage
Feature: Home Page works as expected

Background: Launch GoPuff Application
  Given I Launch GoPuff Application

  @644 @desktop-web @mobile-web @dynamic-user
Scenario: A user can scroll on the Home Page and see the expected content
  Given I logout of application if already logged in
  When I login with newly created user phone number and otp code "000000"
  Then I should land on Home Page
  And I click to Address Bar
  And I select default address "1 Pyrohova St" or create address "Vinnitsa, Vinnitsa Oblast, Pyrohova Street, 1, Ukraine"
  And I should land on Home Page
  When I scroll down the Home Page
  Then I should see the Shop Categories section
  When I scroll up the Home Page
  Then I should see the category pills

  @645 @desktop-web @mobile-web @dynamic-user
Scenario: Navigation Buttons X and Back work as expected
  Given I logout of application if already logged in
  When I login with newly created user phone number and otp code "000000"
  Then I should land on Home Page
  And I click to Address Bar
  And I select default address "1 Pyrohova St" or create address "Vinnitsa, Vinnitsa Oblast, Pyrohova Street, 1, Ukraine"
  When I add first available product to My Bag
  And I click My Bag Button
  Then I should see the X button on the top left on the Bag Page
  When I click the return button
  Then I should land on Home Page
  And I click My Bag Button
  And I increment until over MOV
  And Checkout Button is enabled
  When I click Checkout Button
  Then the Fam screen should be displayed
  When I click Continue to Checkout
  And I click Add delivery instructions
  Then I should disable Non-contact delivery checkbox
  And I click Confirm
  And I click on Add Payment method
  And I click on pay with cash
  And Pay with cash should be displayed
  And Delivery instructions should be displayed
  And I click Place order button
  And I should see the X button on the top left on Order Page
  When I tap the X button on Order Page
  Then I navigate from Home Page to Account Page
  And I should see Edit Profile button
  And I navigate to Home Page

  @wip @iOS @android
Scenario: Navigation Buttons X work as expected on the Product Page
  Given I logout of application if already logged in
  When I login with newly created user phone number and otp code "000000"
  Then I should land on Home Page
  When I click on an item
  Then I should land on the Product page
  And I should see the X button on the top left on the Product Page
  When I tap the X button
  Then I should land on Home Page
