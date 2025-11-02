## PayFlow

StripeSyncer is a tool for developers to automate the setup of products, pricing plans, and webhooks in their Stripe and LemonSqueezy accounts.

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
   git clone https://github.com/your-username/stripesyncer.git
   cd stripesyncer
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
   GOOGLE_API_KEY=

   BASE_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deployment

PayFlow can be deployed to various cloud providers. The recommended approach for a seamless deployment of both frontend and backend is using Render.

### Deploying to Render

Render allows you to deploy both your frontend (as a Static Site) and backend (as a Web Service) from a single Git repository.

#### Prerequisites

*   Your application code pushed to a Git repository (e.g., GitHub, GitLab).
*   A Render account.

#### Frontend Deployment (Static Site)

1.  **Create a New Static Site:** In your Render dashboard, click "New" and select "Static Site".
2.  **Connect Repository:** Connect your Git provider and select the repository containing PayFlow.
3.  **Configuration:**
    *   **Name:** Choose a unique name for your frontend service.
    *   **Branch:** Specify the branch to deploy from (e.g., `main`).
    *   **Root Directory:** `client`
    *   **Build Command:** `npm install && npm run build`
    *   **Publish Directory:** `dist`
4.  **Create Static Site:** Click "Create Static Site".

#### Backend Deployment (Web Service)

1.  **Create a New Web Service:** In your Render dashboard, click "New" and select "Web Service".
2.  **Connect Repository:** Connect your Git provider and select the repository containing PayFlow.
3.  **Configuration:**
    *   **Name:** Choose a unique name for your backend service.
    *   **Branch:** Specify the branch to deploy from (e.g., `main`).
    *   **Root Directory:** (Leave blank or specify the root of your repository if `package.json` is there)
    *   **Build Command:** `npm install && npm run build:server`
    *   **Start Command:** `npm start`
    *   **Environment Variables:** Add all necessary environment variables (e.g., `MONGODB_URI`, `SESSION_SECRET`, `ENCRYPTION_KEY`, `GOOGLE_API_KEY`, `STRIPE_API_KEY`, `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID`, `BASE_URL`) in the "Environment" section of your Render service settings. Ensure `BASE_URL` points to your deployed frontend URL.
4.  **Create Web Service:** Click "Create Web Service".

Render will automatically build and deploy your application. Subsequent pushes to your connected Git branch will trigger new deployments.
