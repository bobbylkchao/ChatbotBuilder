import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {files: ["src/**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'quotes': ['error', 'single'],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];