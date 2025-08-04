import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import pluginQuery from "@tanstack/eslint-plugin-query";
import { globalIgnores } from "eslint/config";
import gitignore from "eslint-config-flat-gitignore";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  gitignore(),
  globalIgnores(["src/components/ui/*"]),
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Custom ESLint configuration
  {
    plugins: {
      eslintPluginImport,
    },
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    rules: {
      "eslintPluginImport/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "unknown",
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
          named: {
            enabled: true,
          },
          "newlines-between": "always",
        },
      ],
    },
    settings: {
      "eslintPluginImport/resolver": {
        node: true,
        typescript: true,
      },
    },
  },
  ...pluginQuery.configs["flat/recommended"],
  eslintPluginPrettierRecommended,
  eslintConfigPrettier,
];

export default eslintConfig;
