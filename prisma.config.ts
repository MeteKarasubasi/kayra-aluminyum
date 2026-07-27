import path from "node:path"
import { defineConfig } from "@prisma/config"

// Node 20.12+, 21.7+, 22+ has built-in .env loading
if (process.env.NODE_ENV !== "production") {
  try {
    process.loadEnvFile(".env")
  } catch {
    // .env may not exist in some environments
  }
}

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL,
  },
})