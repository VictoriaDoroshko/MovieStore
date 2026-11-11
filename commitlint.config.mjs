export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "web",
        "api",
        "ui",
        "eslint-config",
        "typescript-config",
        "deps",
        "repo",
      ],
    ],
    "subject-case": [0],
  },
};
