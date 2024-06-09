import { describe, expect, test } from "vitest";
import { fetchTotalCommitCount } from "./gitlab";

describe("Gitlab Tests", () => {
    test("can gather users total gitlab contributions", async () => {
        // https://about.gitlab.com/community/top-annual-contributors/
        const contributions = await fetchTotalCommitCount("ar-mali");
        console.log(`contributions ${contributions}`);
    });
});
