export default [
  js.configs.recommended,
  {
    files: ["src/**/*.ts"], // Explicitly target the src folder
    ignores: ["node_modules"], // Ensure node_modules is ignored
    languageOptions: {
      parser: tsParser
    },
    plugins: {
      "@typescript-eslint": ts,
      prettier
    },
    rules: {
      ...ts.configs.recommended.rules,
      "prettier/prettier": "error",
      "semi": ["error", "always"],
      "quotes": ["error", "double"]
    }
  },
  prettierConfig
];
