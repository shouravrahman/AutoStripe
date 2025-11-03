import * as cheerio from "cheerio";

interface ScrapedData {
    name: string;
    description: string;
    features: string;
    url: string;
    // We will add pricing info here later
    pricing: { price: number; interval: string; name: string }[];
}

interface ApiCallPreviews {
    stripe: string;
    lemonSqueezy: string;
}

export class ScraperService {

    private generateApiCallPreviews(data: ScrapedData): ApiCallPreviews {
        const stripePlans = data.pricing.map(p => `
    {
        price_data: {
            currency: 'usd',
            product_data: { name: '${p.name}' },
            unit_amount: ${p.price},
            recurring: { interval: '${p.interval}' },
        },
    }
`);

        const stripePreview = `
// Create the product in Stripe
const product = await stripe.products.create({
    name: '${data.name}',
    description: '${data.description}',
});

// Create the pricing plans for the product
const prices = await Promise.all([${stripePlans.join(',')}]);
`;

        const lemonSqueezyPreview = `
// Lemon Squeezy typically combines product and variant creation.
// You would loop through your plans to create variants.

const product = await lemonsqueezy.createProduct({
    name: '${data.name}',
    description: '${data.description}',
    storeId: process.env.LEMONSQUEEZY_STORE_ID,
});

// Example for one variant:
const variant = await lemonsqueezy.createVariant({
    name: '${data.pricing[0]?.name || 'Standard Plan'}',
    price: ${data.pricing[0]?.price || 0},
    interval: '${data.pricing[0]?.interval || 'month'}',
    productId: product.id,
});
`;

        return {
            stripe: stripePreview,
            lemonSqueezy: lemonSqueezyPreview,
        };
    }

    async extractProductInfo(url: string): Promise<{ scrapedData: ScrapedData, apiCallPreviews: ApiCallPreviews }> {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);

            const name = $('meta[property="og:title"]').attr("content") || $("title").text() || $("h1").first().text();
            const description = $('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content") || $("p").first().text();

            // A more sophisticated pricing scraper is needed here.
            // This is a placeholder to find elements with prices.
            const pricing: { price: number; interval: string; name: string }[] = [];
            $("[class*='price'], [id*='price']").each((i, el) => {
                const priceText = $(el).text();
                const priceMatch = priceText.match(/\$(\d+)/);
                if (priceMatch) {
                    const price = parseInt(priceMatch[1], 10) * 100; // convert to cents
                    const parent = $(el).closest("[class*='tier'], [class*='plan']");
                    const name = parent.find("h2, h3, h4").first().text() || `Tier ${i + 1}`;
                    const intervalText = parent.text().toLowerCase();
                    const interval = intervalText.includes("year") ? "year" : "month";
                    pricing.push({ price, interval, name });
                }
            });

            const scrapedData: ScrapedData = {
                name: name.trim() || "Untitled Product",
                description: description.trim() || "No description available",
                features: "", // Features will be part of pricing tiers now
                url,
                pricing: pricing.length > 0 ? pricing : [{ name: "Standard", price: 2900, interval: "month" }], // Default pricing
            };

            const apiCallPreviews = this.generateApiCallPreviews(scrapedData);

            return { scrapedData, apiCallPreviews };

        } catch (error) {
            console.error("Scraping error:", error);
            throw new Error("Failed to extract product information from URL");
        }
    }
}

export const scraperService = new ScraperService();