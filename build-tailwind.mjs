import { readFileSync, writeFileSync } from "node:fs";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";

const input = "app/globals.css";
const output = "frontend/css/tailwind.css";

const css = readFileSync(input, "utf8");
const result = await postcss([tailwind()]).process(css, { from: input, to: output });
writeFileSync(output, result.css);
console.log("Tailwind compiled:", output, result.css.length, "bytes");
