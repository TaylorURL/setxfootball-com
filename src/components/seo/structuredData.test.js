import fs from "fs";
import path from "path";
import { breadcrumbList, faqPage } from "./structuredData";
import { PAGE_SEO, SITE_URL } from "./seoContent";
import { FAQ } from "../../content/campContent";

const ISLAND = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

const readShell = () => fs.readFileSync(path.join(process.cwd(), "public", "index.html"), "utf8");

const islandsOf = (html) => [...html.matchAll(ISLAND)].map((match) => match[1]);

describe("the static islands in the shell", () => {
  it("parse, and each declares a context and a type", () => {
    const islands = islandsOf(readShell());
    expect(islands.length).toBeGreaterThan(0);
    islands.forEach((body) => {
      const node = JSON.parse(body);
      expect(node["@context"]).toBe("https://schema.org");
      expect(typeof node["@type"]).toBe("string");
    });
  });

  it("declare the publisher, the place, and what the camp sells", () => {
    const types = islandsOf(readShell()).map((body) => JSON.parse(body)["@type"]);
    expect(types).toEqual(
      expect.arrayContaining(["Organization", "WebSite", "LocalBusiness", "Product"]),
    );
  });

  it("carry no relative URL, which a crawler cannot resolve", () => {
    islandsOf(readShell()).forEach((body) => {
      const urls =
        JSON.stringify(JSON.parse(body)).match(/"(?:url|item|logo|image)":\s*"([^"]+)"/g) || [];
      urls.forEach((pair) => {
        expect(pair).toMatch(/"https?:\/\//);
      });
    });
  });
});

describe("the islands a route emits at runtime", () => {
  it("serialise to JSON that parses back", () => {
    [
      breadcrumbList([
        { label: "Home", to: "/" },
        { label: "About", to: "/about" },
      ]),
      faqPage(FAQ),
    ].forEach((markup) => {
      const node = JSON.parse(JSON.stringify(markup));
      expect(node["@context"]).toBe("https://schema.org");
      expect(typeof node["@type"]).toBe("string");
    });
  });

  it("give every breadcrumb an absolute item and a position", () => {
    const trail = breadcrumbList([
      { label: "Home", to: "/" },
      { label: "About", to: "/about" },
    ]);
    expect(trail.itemListElement).toHaveLength(2);
    expect(trail.itemListElement[0]).toMatchObject({ position: 1, item: SITE_URL });
    expect(trail.itemListElement[1]).toMatchObject({ position: 2, item: `${SITE_URL}/about` });
  });

  it("give every question an answer", () => {
    const page = faqPage(FAQ);
    expect(page.mainEntity.length).toBe(FAQ.length);
    page.mainEntity.forEach((entry) => {
      expect(entry.name.trim()).not.toHaveLength(0);
      expect(entry.acceptedAnswer.text.trim()).not.toHaveLength(0);
    });
  });
});

describe("the head metadata", () => {
  it("gives every route a title and a description of a length a result keeps", () => {
    Object.entries(PAGE_SEO).forEach(([key, page]) => {
      expect(page.title.length).toBeGreaterThan(0);
      expect(page.description.length).toBeGreaterThanOrEqual(70);
      expect(page.description.length).toBeLessThanOrEqual(165);
      expect(page.path.startsWith("/")).toBe(true);
      expect(key).toBe(key.toLowerCase());
    });
  });

  it("repeats no title and no description between routes", () => {
    const titles = Object.values(PAGE_SEO).map((p) => p.title);
    const descriptions = Object.values(PAGE_SEO).map((p) => p.description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
});
