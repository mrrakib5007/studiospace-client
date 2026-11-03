# StudioSpace - Client

StudioSpace is a creative studio booking platform that allows users to discover, list, and book professional spaces for photography, filmmaking, podcasting, and other creative projects. It features secure authentication, studio management, real-time booking conflict prevention, and booking management.

---

## Live Website URL
- **Live Client Application:** [https://studiospace-pro.vercel.app](https://studiospace-pro.vercel.app)
- **Live Server API:** [https://api-studiospace.vercel.app](https://api-studiospace.vercel.app)

---

## Key Features

- **User Authentication** - Email/Password and Google OAuth login via Better-Auth.
- **Route Protection** - Proxy safeguarding private routes and user dashboards.
- **Studio Discovery** - Explore studios across categories, keyword search, and location.
- **Dynamic Filtering** - Filter by category and sort by price, rating, and latest listings.
- **Pagination** - Load studio listings seamlessly with "Show More" pagination.
- **Studio Details** - View detailed specs, amenities, studio rules, and host information.
- **Studio Booking** - Reserve studio time slots with dynamic cost calculation.
- **Collision Prevention** - Instant conflict warnings for overlapping confirmed reservations.
- **Host Studio Management** - Add, edit, and delete studio spaces with modal confirmations.
- **Booking Management** - Track reservations with color-coded status badges.
- **Booking Cancellation** - Cancel pending reservations safely with confirmation modals.
- **User Dashboard Stats** - View total bookings, owned studios, upcoming shoots, and total spent.
- **Direct Image Upload** - Upload and host studio photos and profile avatars via ImgBB.
- **Dark & Light Mode** - Toggle light and dark themes using next-themes and DaisyUI.
- **Responsive UI** - Clean, mobile-friendly design built with Tailwind CSS v4.
---

## Client Tech Stack

- **Framework:** Next.js 16.4.3 (App Router)
- **Styling:** Tailwind CSS v4 & DaisyUI
- **Authentication:** Better-Auth
- **Icons:** React Icons
- **Notifications:** React Hot Toast
- **Carousels & Swipers:** Swiper
- **Theme Management:** Next Themes

---

## Local Setup & Installation

### Prerequisites
- Node.js `v18.17.0` or higher (Node `v20+` recommended)
- npm or pnpm or yarn
- Running backend server on `http://localhost:5000`

### Step 1: Navigate to Client Directory
```bash
cd client
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the `client/` folder:

```env
BETTER_AUTH_SECRET=better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/studio_space?retryWrites=true&w=majority
GOOGLE_CLIENT_ID=google_client_id
GOOGLE_CLIENT_SECRET=google_client_secret
```

### Step 4: Run Development Server
```bash
npm run dev
```

The application will be live at [http://localhost:3000](http://localhost:3000).

### Step 5: Production Build
```bash
npm run build
npm start
```
