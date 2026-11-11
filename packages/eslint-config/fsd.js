import boundaries from "eslint-plugin-boundaries";

/**
 * Feature-Sliced Design layer boundaries.
 * Higher layers may import from lower layers; the reverse is forbidden.
 * Order (top → bottom): app → widgets → features → entities → shared.
 *
 * Expects FSD sources under `src/{app,widgets,features,entities,shared}`.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const fsdConfig = [
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**" },
        { type: "widgets", pattern: "src/widgets/*" },
        { type: "features", pattern: "src/features/*" },
        { type: "entities", pattern: "src/entities/*" },
        { type: "shared", pattern: "src/shared/*" },
      ],
      "boundaries/ignore": ["**/*.test.*", "**/*.spec.*"],
    },
    rules: {
      "boundaries/element-types": [
        2,
        {
          default: "disallow",
          rules: [
            {
              from: "app",
              allow: ["widgets", "features", "entities", "shared"],
            },
            { from: "widgets", allow: ["features", "entities", "shared"] },
            { from: "features", allow: ["entities", "shared"] },
            { from: "entities", allow: ["shared"] },
            { from: "shared", allow: ["shared"] },
          ],
        },
      ],
      "boundaries/no-unknown-files": 0,
    },
  },
];
