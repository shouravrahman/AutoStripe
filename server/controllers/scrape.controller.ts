import { Request, Response } from "express";
import axios from "axios";
import * as cheerio from "cheerio";

export const extractFromUrl = async (req: Request, res: Response) => {
	const { url } = req.body;

	if (!url) {
		return res.status(400).json({ message: "URL is required" });
	}

	try {
		const { data } = await axios.get(url);
		const $ = cheerio.load(data);

		// Basic extraction logic (can be made much more sophisticated)
		const name =
			$("h1").first().text().trim() ||
			$('meta[property="og:title"]').attr("content") ||
			$("title").text().trim();

		const description =
			$('meta[property="og:description"]').attr("content") ||
			$('meta[name="description"]').attr("content") ||
			$("h2").first().text().trim();

		const features: string[] = [];
		$("ul li:contains('✓'), ul li:contains('Check')").each((_, el) => {
			features.push($(el).text().trim());
		});

		res.json({
			extractedData: {
				name,
				description,
				features: features.join(", "),
			},
		});
	} catch (error) {
		console.error("Scraping failed:", error);
		res.status(500).json({ message: "Failed to scrape the provided URL." });
	}
};
