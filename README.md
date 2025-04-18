
# ❄️ Ice Breaker

> **Track, Share & Obsess — All in One Place**  
Built with ❤️ using **Next.js** (App Router), Ice Breaker lets you track everything from movies to books, show off your taste via **Ice Cards**, and connect with people who *actually get it*.
![image](https://github.com/user-attachments/assets/7fd550e3-c7b2-47b8-8b11-abee7acfdaac)

---

## 🧠 What is Ice Breaker?

Ice Breaker is your personalized hub for discovering and tracking media — movies, anime, books, games, shows, and music — with social features baked right in.

> Think: **MyAnimeList + Goodreads + Trakt**, but ✨modernized✨ and friendlier.

---

## 🧊 Features (with screenshots)

### 🔐 Authentication System  
Login using Google, Discord, or email — powered by **NextAuth + JWT**.

![image](https://github.com/user-attachments/assets/2ac83454-b76c-4673-91dd-6def2d093313)


---

### 🎞️ Explore Any Media

A seamless search interface to explore across **movies, anime, books, shows, music, games**.

![image](https://github.com/user-attachments/assets/7d8b2f05-f6a7-4b62-995c-fa3b4c1b819b)


---

### 💳 Your Shareable Ice Card

Every user gets a dynamic, auto-updating **Ice Card** that showcases your taste.  
Share it anywhere — social bios, forums, even dating apps.

![image](https://github.com/user-attachments/assets/b9b7de06-0fcd-4eae-9c5a-421d78e36186)


> 🔁 Auto-updates with your activity  
> 🎯 Highlights your favorite genres & recent content  
> 🌐 One-click sharing

---

### 📊 Real-Time Stats

Track all your media consumption stats: likes, reviews, items added, badges earned.

![image](https://github.com/user-attachments/assets/8ed508a7-8ec1-4a99-86ce-f1e1cd78ea8f)


---

### 🏆 Milestone Badges

Gamified profile experience — earn badges for reviewing, tracking, or sharing.

![image](https://github.com/user-attachments/assets/694e4c2d-8742-4762-a063-677f3b2e6adf)


---

### 🔥 Trending Content

The “Trending Now” section is updated live based on user activity and external APIs.

![image](https://github.com/user-attachments/assets/a384492a-33fc-4404-9ab9-3668da1f8c84)



## ⚙️ Tech Stack

| Layer         | Tech Used                                      |
|---------------|-------------------------------------------------|
| **Frontend**  | Next.js 14 (App Router), Tailwind CSS, Framer Motion |
| **Backend**   | Express.js + Node.js                            |
| **Database**  | MongoDB + Mongoose                              |
| **Auth**      | NextAuth (Google, Discord, Credentials)         |
| **APIs**      | TMDB, AniList, Spotify, Goodreads, RAWG         |
| **CI/CD**     | Vercel + GitHub Actions                         |

---

## 🛠️ Project Setup

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/icebreaker.git
cd icebreaker
```

### 2. Install & Run Frontend
```bash
cd client
npm install
npm run dev
```

### 3. Install & Run Backend
```bash
cd server
npm install
npm run dev
```

---

## 🔐 Environment Variables

### `client/.env.local`
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### `server/.env`
```env
PORT=5000
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_secret_key
```

---

## 📂 Folder Structure

```
icebreaker/
├── app/                 # Next.js App Router
│   ├── components/      # Reusable components
│   ├── api/             # Route handlers (Next.js API)
│   └── pages/           # Static + dynamic pages
├── server/              # Node.js backend (Express)
│   ├── routes/
│   ├── controllers/
│   └── models/
├── public/              # Static files (icons, posters)
└── screenshots/         # App screenshots for docs
```

---

## 👥 Contributing

```bash
git checkout -b feat/your-feature
git commit -m "Add: your-feature 💡"
git push origin feat/your-feature
```

Create a PR and tag a reviewer 🙌

---

## 🔗 Useful Links

- 🌍 [Live App](https://icebreaker-nine.vercel.app)
- 💾 [View Source](https://github.com/yourusername/icebreaker)
- 🧾 [API Docs](https://icebreaker.app/api-docs)
- 💬 [Join Discord](https://discord.gg/icebreaker)

---
