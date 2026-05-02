# Public model testing was not included in the automated test because the current implementation is focused on locally available Ollama models.
# The local model and comparison functionality were tested through Cucumber.js and Puppeteer.

Feature: Iteration 3 LLM Features
  As a user of Frog Prompt
  I want to select backend models, ask questions, compare model responses, and use comparison history
  So that I can use the main Iteration 3 features

 # Backend LLM Selection and Small Local Models
Scenario: User can select and use a small local backend LLM
  Given I am on the chat page for Iteration 3
  Then I should see the model selection dropdown
  When I select a local model from the model dropdown
  And I enter "Hello, can you respond using this selected model?" into the chat input for Iteration 3
  And I send the Iteration 3 chat prompt
  Then I should see a response in the chat window
  And the selected model should stay selected

  # Math Questions
  Scenario: User can ask math questions to the backend LLM
    Given I am on the chat page for Iteration 3
    When I select a local model from the model dropdown
    And I enter "What is 12 times 8?" into the chat input for Iteration 3
    And I send the Iteration 3 chat prompt
    Then I should see a response in the chat window

  # Weather Questions
  Scenario: User can ask weather questions to the backend LLM
    Given I am on the chat page for Iteration 3
    When I select a local model from the model dropdown
    And I enter "What is the weather like today?" into the chat input for Iteration 3
    And I send the Iteration 3 chat prompt
    Then I should see a response in the chat window

  # Compare Two Models
  Scenario: User can compare two models side by side
    Given I am on the chat page for Iteration 3
    When I click the Iteration 3 compare models button
    And I select two local models to compare for Iteration 3
    And I click the Iteration 3 start comparing button
    And I enter "Explain what an API is" into the chat input for Iteration 3
    And I send the Iteration 3 chat prompt
    Then I should see comparison results in the chat window

  # Save Comparison Results
  Scenario: User can save model comparison results in chat history
    Given I am on the chat page for Iteration 3
    When I click the Iteration 3 compare models button
    And I select two local models to compare for Iteration 3
    And I click the Iteration 3 start comparing button
    And I enter "Compare JS and Python in two sentences" into the chat input for Iteration 3
    And I send the Iteration 3 chat prompt
    And I click the comparison history tab
    Then I should see the comparison history area

  # Continue Comparison Conversation
  Scenario: User can continue a previous comparison conversation
  Given I am on the chat page for Iteration 3
  When I click the comparison history tab
  And I open the first comparison conversation
  And I enter "Add one more difference" into the chat input for Iteration 3
  And I send the Iteration 3 chat prompt
  Then I should see comparison results in the chat window
