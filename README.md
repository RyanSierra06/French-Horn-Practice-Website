# 32-Day French Horn Practice Website

A full-stack web app that helps users track and practice daily French Horn excerpts.
The project uses **React, Vite, and Tailwind CSS** for the frontend, with a **Node.js, Express, and MongoDB** backend for user authentication and progress tracking.

## Features

- **User Authentication** – Secure login and registration with email/password.
- **Daily Excerpts** – 33-day practice schedule with sheet music and audio for each excerpt.
- **Progress Tracking** – Marks completed excerpts and saves progress per user.
- **Profile Management** – View and update profile information, including completed excerpts and favorite excerpts.
- **Responsive Design** – Mobile-friendly interface using Tailwind CSS.

## Pages

- **Home Page** – Landing page with app overview, navbar, and login/register buttons.
- **Today Page** – Displays the excerpt for the current day and allows marking it as completed.
- **Calendar Page** – Browse all 33 daily excerpts with completion status and access sheet music/audio.
- **Profile Page** – View personal progress and account information.
- **Login / Register Pages** – Secure authentication pages for new and returning users.

Each page leverages reusable React components for rendering excerpts, progress, and user data.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express
- **Authentication:** Custom email/password auth with JWTs or sessions
- **Hosting:** Vercel (frontend), Render (backend)

## Getting Started

##Prerequisites
- Node.js installed
- MongoDB account for storing user and progress data

##Setup

1. Clone the repository:
   ```bash
      git clone https://github.com/RyanSierra06/30-Day-French-Horn-Practice.git
      cd 30-Day-French-Horn-Practice
2. Install dependencies:
   ```bash
      npm install
      cd frontend && npm install
3. Configure environment variables:
   ```bash
      VITE_BACKEND_BASE_URL=http://localhost:4000

      MONGO_URI='your mongo URI'
   
      PORT=4000

      JWT_SECRET='your JWT secret'
   
      JWT_EXPIRES_IN=7d
4. Run the backend server:
   ```bash
      cd backend
      node index.js
5. Run the frontend:
   ```bash
      cd frontend
      npm run dev
  
6.Your frontend and backend will be available at http://localhost:5173 and http://localhost:4000 respectively


< img width="1314" height="856" alt="French Horn-Website-1" src="https://github.com/user-attachments/assets/299fc640-5059-4f02-8d5a-c916540d9168" />
<img width="1265" height="848" alt="French Horn-Website-2" src="https://github.com/user-attachments/assets/cf0f38ae-a453-48f1-9e57-9f76898aa532" />
<img width="1277" height="857" alt="French Horn-Website-3" src="https://github.com/user-attachments/assets/210f465c-23f9-4e17-8905-e96c5fa8464c" />
<img width="1267" height="854" alt="French Horn-Website-4" src="https://github.com/user-attachments/assets/bb51dd10-d8a7-496d-b916-c47f52b81fbf" />







