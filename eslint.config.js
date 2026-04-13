const js = require('@eslint/js');

module.exports = [
    js.configs.recommended,
    {
        // Main source files
        files: ['server.js', 'client.js', 'lib/**/*.js'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'commonjs',
            globals: {
                // Node.js
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                process: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                fetch: 'readonly',
                // Browser (client.js)
                window: 'readonly',
                document: 'readonly',
                localStorage: 'readonly',
                // Functions called via HTML onclick attributes
                submitSignup: 'readonly',
                submitLogin: 'readonly',
                logout: 'readonly',
                submitPrompt: 'readonly',
                continueChat: 'readonly',
                openNavbar: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-console': 'off',
            'semi': ['error', 'always'],
            'eqeqeq': ['error', 'always'],
            'no-var': 'error',
            'prefer-const': 'warn'
        }
    },
    {
        // Jasmine unit test files
        files: ['spec/**/*.js'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'commonjs',
            globals: {
                require: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-console': 'off',
            'semi': ['error', 'always'],
            'eqeqeq': ['error', 'always'],
            'no-var': 'error',
            'prefer-const': 'warn'
        }
    },
    {
        // Cucumber step definitions — Node.js + browser globals used inside page.evaluate()
        files: ['features/**/*.js'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'commonjs',
            globals: {
                require: 'readonly',
                module: 'readonly',
                process: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                // Browser globals used inside Puppeteer page.evaluate() callbacks
                window: 'readonly',
                document: 'readonly',
                fetch: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-console': 'off',
            'semi': ['error', 'always'],
            'eqeqeq': ['error', 'always'],
            'no-var': 'error',
            'prefer-const': 'warn'
        }
    },
    {
        // Ignore old/unused files, config files, and generated directories
        ignores: ['node_modules/**', 'backend.js', 'mongo.js', 'tests/**', 'eslint.config.js']
    }
];
