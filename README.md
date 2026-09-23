# PlantCare Store — VS Code + PostgreSQL

Modern rebuild of the original PHP PlantCare website using Next.js, TypeScript, Tailwind CSS, Auth.js, Prisma and PostgreSQL.

## Requirements

- Windows 10/11
- Node.js 22 LTS
- PostgreSQL 16 or newer
- VS Code

## 1. Create the PostgreSQL database

Open pgAdmin Query Tool or `psql` and run:

```sql
CREATE DATABASE plantcare;
```

## 2. Open the project in VS Code

Extract this ZIP, open the extracted `plantcare-postgres` folder in VS Code, then open **Terminal → New Terminal**.

## 3. Install packages

```powershell
npm install
```

## 4. Configure environment variables

Copy `.env.example` to a new file named `.env`:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and replace `YOUR_PASSWORD` with your PostgreSQL password:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/plantcare?schema=public"
AUTH_SECRET="paste-a-long-random-secret-here"
AUTH_TRUST_HOST="true"
```

Generate an Auth.js secret in PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Paste the printed value into `AUTH_SECRET`.

## 5. Create the PostgreSQL tables

```powershell
npx prisma migrate dev --name initial
```

For an existing PlantCare installation that already has the initial tables,
run this after downloading the product-management update:

```powershell
npx prisma migrate dev --name add-products
```

Import the original catalogue into the new PostgreSQL `Product` table:

```powershell
npm run db:seed-products
```

## 6. Start the website

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Open the website from another device

To test from a phone or another computer on the same network, start Next.js on
all network interfaces:

```powershell
npm run dev -- --hostname 0.0.0.0
```

Then open the computer's local IP address from the other device, for example:

```text
http://192.168.1.2:3000
```

The IP address is listed under `allowedDevOrigins` in `next.config.ts`. If your
computer's IPv4 address changes, update that value and restart the development
server. Allow Node.js through Windows Defender Firewall when Windows asks.

The first development compilation can be slow. Later page loads should become
faster after Next.js has created its local cache.

## Optional: create an administrator

Add these temporary values to `.env`:

```env
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="ChangeThisPassword123!"
ADMIN_FIRST_NAME="PlantCare"
ADMIN_LAST_NAME="Admin"
```

Then run:

```powershell
npm run db:seed-admin
```

Remove `ADMIN_PASSWORD` from `.env` after the administrator is created. Sign in and open `http://localhost:3000/admin`.

## Admin product management

Open `http://localhost:3000/admin` after signing in as the administrator. The
**Manage products** section supports:

- creating products;
- editing prices, stock, category, descriptions and product codes;
- uploading JPG, PNG or WebP images up to 5 MB;
- publishing or hiding products from the store; and
- deleting products and their locally uploaded image.

Uploaded files are stored in `public/uploads/products`. This is suitable for a
local Windows server or a normal VPS with persistent storage. Before deploying
to a serverless host, replace local uploads with persistent object storage such
as Cloudinary, Amazon S3 or Cloudflare R2.

## Customer chatbot and order tracking

The **Need help?** button appears at the bottom-right of customer pages. The
assistant works without an external AI API and answers common questions about:

- products and beginner recommendations;
- plant care;
- shipping and delivery;
- returns and damaged arrivals;
- cash-on-delivery payments; and
- authenticated order tracking.

For privacy, order details are returned only for orders belonging to the
currently signed-in customer. A customer can ask `Track my latest order` or
`Track order 123`. Administrators can change an order from **Pending** to
**Confirmed**, **Shipped**, **Delivered** or **Cancelled** in `/admin`; the new
status is then shown by the chatbot immediately.

No chatbot API key or additional database migration is required for this
version. Edit the answer rules in `app/api/chatbot/route.ts` when store policies
change.

## Useful commands

```powershell
npm run dev
npm run build
npm run start
npx prisma studio
npm run db:seed-products
```

## Important security notes

- Do not reuse or import passwords from the old 2021 SQL dump because they were stored as plaintext.
- Never commit `.env` to GitHub.
- The rebuilt checkout uses cash on delivery. It does not collect or store card numbers or CVV values.
