# 🌟 AnimeExplorer

A modern, accessible web app for discovering anime, built with **Next.js**, **TypeScript** and **Tailwind CSS**. Browse trending and popular anime, or let AI pick your next watch. 🎌📺

![AnimeExplorer Preview](https://github.com/user-attachments/assets/afc732d4-2eb6-4b7b-99bf-35f6dd7afdf9)

## 🎯 Features

- 🔥 **Trending** – The current top anime, with genre shortcuts for Action, Romance and Comedy.
- 🏆 **Popular** – The most popular anime of all time.
- 🎯 **Editor's Picks** – A hand-picked top 12.
- 🤖 **AI Picks** – Name an anime you like, a genre or a mood, and Claude AI recommends anime with covers, scores and direct MyAnimeList links.
- 🧩 **Responsive** – Works on mobile, tablet and desktop.
- 🦾 **Accessible** – Keyboard-friendly, screen-reader labels and good color contrast.

## 🛠️ Tech Stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS**
- **Jikan API** (unofficial MyAnimeList API) for anime lists
- **Claude API** (Anthropic) for AI recommendations
- **AniList API** for covers and MyAnimeList links in AI Picks

## 🚀 Getting Started

```bash
npm install
```

Create a `.env.local` file in the project root with your [Anthropic API key](https://console.anthropic.com):

```
ANTHROPIC_API_KEY=your-key-here
```

Then start the dev server and open http://localhost:3000:

```bash
npm run dev
```

## 🌐 Live Demo

[🔗 View the Website](https://anime-search-explore.vercel.app)
