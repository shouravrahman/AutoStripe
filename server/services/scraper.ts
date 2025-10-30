import * as cheerio from "cheerio";

export class ScraperService {
  async extractProductInfo(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      // More robust extraction logic with cheerio
      const name = 
        $('meta[property="og:title"]').attr("content") ||
        $("title").text() ||
        $("h1").first().text();

      const description = 
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        $("p").first().text();

      const featuresSection = $("#features");
      let features: string[] = [];
      if (featuresSection.length) {
        featuresSection.find('h3, p').each((i, el) => {
          features.push($(el).text().trim());
        });
      }

      return {
        name: name.trim() || "Untitled Product",
        description: description.trim() || "No description available",
        features: features.join(', '),
        url,
      };
    } catch (error) {
      console.error("Scraping error:", error);
      throw new Error("Failed to extract product information from URL");
    }
  }
}

export const scraperService = new ScraperService();
