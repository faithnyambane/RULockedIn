@chat
Feature: Chat with LLM
  As a user of Frog Prompt
  I want to send messages to the LLM
  So that I can get answers to my questions

  # ── Chat Interface ────────────────────────────────────────────────────────────

  @guest
  Scenario: Guest user sees the chat input on the home page
    Given I navigate to the home page
    Then I should see the chat input field
    And I should see the chat submit button

  @guest
  Scenario: Chat input accepts typed text
    Given I navigate to the home page
    When I type "What is 2 + 2?" into the chat input
    Then the chat input should contain "What is 2 + 2?"

  # ── Navigation based on login state ──────────────────────────────────────────

  @navigation @guest
  Scenario: Guest does not see Chat History link in navigation
    Given I navigate to the home page
    Then the "Chat History" navigation link should be hidden

  @navigation
  Scenario: Logged-in user sees Chat History link in navigation
    Given I am logged in as a new user
    When I navigate to the home page
    Then the "Chat History" navigation link should be visible
