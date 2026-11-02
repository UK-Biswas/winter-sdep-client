# FrostTogether – Social Development Events Platform

**Live Website:** [YOUR_LIVE_SITE_URL](https://winter-sdep-client.vercel.app/)

## About The Project

FrostTogether is a community-driven social development and event management platform. It helps people create, discover, join, and manage local social service events. The platform encourages individuals to participate in meaningful community activities such as winter clothes distribution, tree plantation, cleanup campaigns, and donation programs.

Our goal is to connect people who want to make a positive impact on their communities.

## Features

- **User Authentication:** Secure email and password authentication with Google/GitHub social login.
- **Create Events:** Logged-in users can create community service events by providing event details, images, locations, and dates.
- **Explore Upcoming Events:** Browse upcoming community events and discover opportunities to participate in social activities.
- **Event Details:** View complete event information, including descriptions, locations, event types, and dates.
- **Join Events:** Authenticated users can join events, and their participation is stored in the database.
- **Joined Events:** Users can view and track all the events they have joined.
- **Manage Events:** Event creators can update or delete their own events.
- **Private Routes:** Protected pages ensure that only authenticated users can access personal event management features.
- **Responsive Design:** User-friendly interface optimized for mobile, tablet, and desktop devices.
- **Light & Dark Theme:** Switch between light and dark modes for a comfortable browsing experience.

## Technologies Used

### Frontend
- Next.js (App Router)
- React
- JavaScript / TypeScript
- Tailwind CSS
- HeroUI / UI Components

### Authentication
- Better Auth
- MongoDB Adapter
- JWT

### Backend
- Node.js
- Express.js
- MongoDB

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js
- npm
- MongoDB database

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_CLIENT_GITHUB_REPOSITORY_URL
   ```

2. Navigate to the project directory:

   ```bash
   cd frosettogether
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the root directory and configure the required environment variables.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Purpose

FrostTogether aims to make community participation easier by bringing event organizers and volunteers together on one platform. Whether someone wants to organize a donation campaign or participate in a local cleanup event, FrostTogether provides a simple way to get involved and create positive change.

---

**FrostTogether – Together, We Make a Difference.**