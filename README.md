# AutoBillAI

AutoBillAI is a tool for developers to automate the setup of products, pricing plans, and webhooks in their Stripe and LemonSqueezy accounts.

## Features

- **Instant Setup:** Create products and pricing plans across Stripe and LemonSqueezy in seconds with a single form.
- **Code Generation:** Get ready-to-use code snippets, checkout URLs, and integration configs automatically generated.
- **Auto Webhooks:** Webhook endpoints are created and configured automatically. No manual setup required.
- **AI Suggestions:** Let AI recommend optimal pricing tiers and generate compelling product descriptions.
- **Web Scraping:** Extract product details from a URL to speed up setup.
- **Secure & Reliable:** Your API keys are encrypted and stored securely.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/autobillai.git
   cd autobillai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory and add the following environment variables:
   ```
   MONGODB_URI=
   SESSION_SECRET=
   ENCRYPTION_KEY=
   OPENAI_API_KEY=
   LEMONSQUEEZY_API_KEY=
   STRIPE_API_KEY=
   BASE_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
