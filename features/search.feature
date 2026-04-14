@search
Feature: Search Conversation History
  As a logged-in user of Frog Prompt
  I want to search through my conversation history
  So that I can quickly find past prompts and responses

  # ── Search UI ─────────────────────────────────────────────────────────────────

  @search
  Scenario: Chat history page has a search input
    Given I am logged in as a new user
    When I navigate to the chat history page
    Then I should see the search input field

  @search
  Scenario: Search input accepts typed text
    Given I am logged in as a new user
    When I navigate to the chat history page
    And I type "hello" into the search input
    Then the search input should contain "hello"

  @search
  Scenario: Typing in search input does not leave the chat history page
    Given I am logged in as a new user
    When I navigate to the chat history page
    And I type "hello" into the search input
    Then I should still be on the chat history page
