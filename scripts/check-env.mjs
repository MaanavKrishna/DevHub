import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
const required = ["DATABASE_URL", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL"];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  console.error(
    `Missing required build environment variables: ${missing.join(", ")}`,
  );
  process.exit(1);
}
if (process.env.BETTER_AUTH_SECRET.length < 32) {
  console.error("BETTER_AUTH_SECRET must be at least 32 characters.");
  process.exit(1);
}
