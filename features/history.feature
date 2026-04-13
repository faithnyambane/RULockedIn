@history
Feature: Conversation History
  As a logged-in user of Frog Prompt
  I want to view and continue my past conversations
  So that I can reference and build on previous chats

  # ── Viewing History ───────────────────────────────────────────────────────────

  @view
  Scenario: Logged-in user can navigate to the chat history page
    Given I am logged in as a new user
    When I navigate to the chat history page
    Then the page title should contain "Frog Prompt"

  @view
  Scenario: Chat history page has a prompt history section
    Given I am logged in as a new user
    When I navigate to the chat history page
    Then I should see the prompt history container

  @view
  Scenario: Chat history page has a continue chat button
    Given I am logged in as a new user
    When I navigate to the chat history page
    Then I should see the continue chat frog button

  # ── Continuing a Conversation ─────────────────────────────────────────────────

  @continue
  Scenario: Continue chat button does nothing when no prompt is selected
    Given I am logged in as a new user
    When I navigate to the chat history page
    And I click the continue chat frog button without selecting a prompt
    Then I should still be on the chat history page
