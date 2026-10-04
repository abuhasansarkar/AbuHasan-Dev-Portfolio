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
    // Generated files, third-party output and the agent worktree must never be linted.
    ignores: [".next/**", "node_modules/**", ".kilo/**", "public/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
