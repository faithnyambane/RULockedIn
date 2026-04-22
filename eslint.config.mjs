import js from "@eslint/js";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["node_modules/**", "package-lock.json"],
  },
  {
    files: ["server.js", "lib/**/*.js"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        require: "readonly", module: "readonly", exports: "readonly",
        process: "readonly", __dirname: "readonly", console: "readonly",
        setTimeout: "readonly", fetch: "readonly",
      },
    },
    rules: { "no-unused-vars": "warn" },
  },
  {
    files: ["client.js"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        document: "readonly", window: "readonly", fetch: "readonly",
        console: "readonly", alert: "readonly",
      },
    },
    rules: { "no-unused-vars": "warn", "no-empty": "warn" },
  },
  {
    files: ["spec/**/*.js", "tests/**/*.js", "features/**/*.js"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        require: "readonly", module: "readonly", process: "readonly",
        console: "readonly", setTimeout: "readonly", describe: "readonly",
        it: "readonly", expect: "readonly", beforeAll: "readonly",
        afterAll: "readonly", beforeEach: "readonly", afterEach: "readonly",
        document: "readonly", window: "readonly", jasmine: "readonly",
      },
    },
    rules: { "no-unused-vars": "warn" },
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
]);