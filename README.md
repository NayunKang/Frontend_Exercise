# 🐾 Fetch Dog Matcher

A feature-rich dog adoption interface built with **React**, allowing users to browse, filter, and match with adoptable dogs using the [Fetch Frontend API](https://frontend-take-home-service.fetch.com).

---

## ✨ Features

### ✅ User Authentication
- Login with **name and email**
- Session handled with secure `HttpOnly` cookies
- API calls include `credentials: 'include'` for authenticated access

### 🐶 Dog Search
- Filter dogs by **breed**, **age**, and **location**
- Location filters (choose one):
  - By ZIP Code
  - By City
  - By clicking on a **map** and selecting a radius in kilometers
- Results support:
  - **Pagination**
  - **Sorting** by breed, name, or age in ascending or descending order

### ❤️ Favorite & Match
- Users can favorite dogs from the list
- Generate a match by submitting favorites to the `/dogs/match` endpoint
- Matched dog is shown on a dedicated page

### 🗺 Interactive Map Filtering
- Select center by clicking the map
- Adjust radius via slider (1–50km)
- Bounding box is calculated to query ZIP codes from the `/locations/search` API

### 🔐 Logout
- Fully handled session logout via `/auth/logout` endpoint
- Logout clears session and redirects to login page

---

## 🧪 Tech Stack

| Area        | Tech                                       |
|-------------|--------------------------------------------|
| Frontend    | React, TypeScript, Vite                    |
| Routing     | React Router                               |
| Map         | React Leaflet (w/ Circle Radius Search)    |
| Styling     | Custom CSS                   |
| API Auth    | Cookie-based session with `credentials: include` |
| Deployment  | Vercel                                      |
---

## 🚀 Deployment

**Live site:** [https://frontend-exercise-zeta.vercel.app/](https://frontend-exercise-zeta.vercel.app/)  
**Repo:** [https://github.com/NayunKang/Frontend_Exercise.git](https://github.com/NayunKang/Frontend_Exercise.git)
---


## 📂 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/your-username/fetch-dog-matcher.git
cd fetch-dog-matcher
```
### 2. Install dependencies
```bash
npm install
```
### 3. Run locally
```bash
npm run dev
```

## 📚 API Endpoints Used
Endpoint	Purpose
POST /auth/login	Authenticate user
POST /auth/logout	End session
GET /dogs/breeds	Load all available breeds
GET /dogs/search	Search/filter dog IDs
POST /dogs	Fetch details for selected dogs
POST /dogs/match	Submit favorites, get 1 match
POST /locations	Fetch location info by ZIP
POST /locations/search	Search for ZIPs via geo/city
