const REQUIRED = [
  "AUTH_SECRET",
  "AUTH_URL",
  "BACKEND_URL",
  "NEXT_PUBLIC_API_URL",
];

function missingVars() {
  return REQUIRED.filter((key) => !process.env[key]?.trim());
}

const missing = missingVars();

if (missing.length > 0) {
  console.error(
    `Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join("\n")}\n\nCopy .env.example to .env.local and fill in the values.`,
  );
  process.exit(1);
}

console.log("Environment validation passed.");
