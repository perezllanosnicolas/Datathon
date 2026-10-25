// UI strings in the four languages (src/i18n, TRD §2d). TypeScript already enforces the same
// keys; this checks that no string was left empty in a translation.
import { describe, expect, it } from "vitest";
import { es } from "@/i18n/es";
import { ca } from "@/i18n/ca";
import { gl } from "@/i18n/gl";
import { eu } from "@/i18n/eu";

type Tree = { [k: string]: unknown };

function leaves(obj: Tree, prefix = ""): [string, unknown][] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v) ? leaves(v as Tree, `${prefix}${k}.`) : [[`${prefix}${k}`, v] as [string, unknown]],
  );
}

const reference = leaves(es).map(([k]) => k).sort();

describe.each([
  ["ca", ca],
  ["gl", gl],
  ["eu", eu],
])("%s", (_, messages) => {
  it("has exactly the Spanish keys", () => {
    expect(leaves(messages).map(([k]) => k).sort()).toEqual(reference);
  });

  it("has no empty strings", () => {
    const empty = leaves(messages).filter(([, v]) => typeof v === "string" && v.trim() === "").map(([k]) => k);
    expect(empty).toEqual([]);
  });
});
