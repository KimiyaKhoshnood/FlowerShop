import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: ["public/sw.js", "public/workbox-*.js", ".next/**", "next-env.d.ts"],
  },
  {
    rules: {
      // Product images are plain SVGs/URLs coming from the API.
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
