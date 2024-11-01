// eslint.config.mjs

import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import jest from 'eslint-plugin-jest';
import globals from "globals";


export default [
    // Use ESLint recommended rules
    js.configs.recommended,

    {
        files: ['**/*.{js,ts,jsx,tsx}'], // Target files
        languageOptions: {
            ecmaVersion: 2021, // ECMAScript version
            sourceType: 'commonjs', // ES module
            globals: {
                ...globals.node,
                ...globals.jest,
                ...globals.browser
            },
        },
        plugins: {
            prettier, // Prettier plugin for formatting
            jest,     // Jest plugin for testing
        },
        rules: {
            // Possible Errors
            'no-console': 'warn',
            'no-debugger': 'error',
            'no-extra-semi': 'error',
            'no-unreachable': 'error',

            // Best Practices
            'curly': ['error', 'all'],
            'eqeqeq': ['error', 'always'],
            'no-alert': 'warn',
            'no-caller': 'warn',
            'no-empty-function': 'error',
            'no-eval': 'warn',
            'no-multi-spaces': 'error',
            'no-param-reassign': 'error',
            'no-return-assign': ['error', 'always'],
            'no-undef': 'error',
            'no-unused-vars': 'warn',

            // Stylistic Issues
            'camelcase': ['error', { properties: 'always' }],
            'indent': ['error', 2],
            'linebreak-style': ['error', 'unix'],
            'quotes': ['error', 'single', { avoidEscape: true }],
            'semi': ['error', 'always'],
            'comma-dangle': ['error', 'always-multiline'],

            // ES6+ Features
            'arrow-body-style': ['error', 'as-needed'],
            'prefer-const': 'error',
            'no-var': 'error',
            'prefer-arrow-callback': 'error',
            'object-shorthand': ['error', 'always'],

            // Jest-specific rules
            'jest/no-disabled-tests': 'warn',
            'jest/no-focused-tests': 'error',
            'jest/no-identical-title': 'error',
            'jest/prefer-to-have-length': 'warn',
            // 'jest/prefer-to-be-null': 'warn',
            'jest/consistent-test-it': ['error', { fn: 'test', withinDescribe: 'test' }],
            'jest/no-commented-out-tests': 'warn',
            'jest/no-conditional-expect': 'error',
            'jest/no-done-callback': 'error',
            'jest/no-test-return-statement': 'error',
        },
    },
];
