# TripSpot — Project Guide

## 1. What is TripSpot?

TripSpot is an app for sharing travel places. You can browse destinations, search them by name or category, and see them on a map. Each place has a description, a location, coordinates, and photos.

**Link to the deployed website:** `https://tripspot-silk.vercel.app/`

After signing in, you can add places, edit and delete your own posts, write reviews, like places, and save favorites. Photos can be added with a web link or uploaded from your computer. The gallery lets you flip through images and open them in full screen.

## Features

- Home page and places catalog.
- Text search, category filters, and pagination.
- Toggle between list and map views.
- Detailed view with description, photos, map, author, and reviews.
- User registration, login, logout, and session restoration.
- Create, edit, and delete places.
- Select coordinates by clicking on the map or dragging the marker.
- Map-based search in the catalog and place form.
- Add photos via URL or upload them from a computer.
- Image gallery with navigation arrows when multiple photos are available.
- View full-size images in fullscreen mode in the place details and form preview.
- Map cards displaying place photos and information about each place.
- Reviews with ratings, likes, and favorites.
- User profile displaying their own posts.
- Form validation and loading, error, and empty states.

## 2. Pages and access

| Page                    | What it shows                                 | Who can open it |
| ----------------------- | --------------------------------------------- | --------------- |
| `/`                     | Home and newest places                        | Everyone        |
| `/places`               | Catalog, search, categories, and map          | Everyone        |
| `/places/:placeId`      | Description, photos, and reviews of one place | Everyone        |
| `/login`                | Sign in                                       | Guests          |
| `/register`             | Sign up                                       | Guests          |
| `/places/new`           | Add a place                                   | Signed-in users |
| `/places/:placeId/edit` | Edit a place                                  | Only the author |
| `/favorites`            | Favorite places                               | Signed-in users |
| `/profile`              | Profile and own posts                         | Signed-in users |

Guests cannot add or change content. If they open a private page, the app sends them to the sign-in page. After signing in, the login and register pages are no longer accessible.

## 3. How does the app work?

- **React** builds the pages and forms.
- **TypeScript** helps catch mistakes in the code.
- **React Router DOM** — navigation, URL parameters, and protected pages in the standalone version.
- **Tailwind CSS** — layout and responsiveness across different screen sizes.
- **Vite** runs the project on your computer and prepares the files for publishing.
- **Leaflet** show the places on a map. Address search uses Nominatim and depends on the internet and that service's limits.

## 4. What do you need to run it locally?

1. The downloaded project code.
2. Node.js — use a current LTS version
3. A terminal and an editor, for example Visual Studio Code.
4. Internet and a working database.
5. The three public settings for the project, described in the next section.

Open a terminal in the main folder — the one that contains `package.json`.

## 5. When and where do you add the variables?

Add them **before the first run**. When you switch databases, update them and restart the app.

Create a `.env` file in the main folder, next to `package.json`. If you have `.env.example`, copy it and rename the copy to `.env`. Do not add `.txt` to the name.

```env
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_PUBLISHABLE_KEY
VITE_SUPABASE_URL=YOUR_PROJECT_URL
```

The `YOUR_...` texts are just placeholders — replace them with the real public settings of **the same database**.

| Variable                        | What it means                                                                                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_SUPABASE_PROJECT_ID`      | The project identifier. Keep it if your version's configuration uses it. In the current client, the connection is mainly built from the URL and the public key. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | The public publishable key. For an older external project this may be the public `anon` key.                                                                    |
| `VITE_SUPABASE_URL`             | The full HTTPS address of the project, not the address of your website.                                                                                         |

**For GitHub:** never upload your personal `.env`. Make sure your `.gitignore` contains:

```gitignore
.env
.env.*
!.env.example
```

GitHub may contain only `.env.example` with sample values. If `.env` was already uploaded, adding it to `.gitignore` does not remove it from the history.

**Never use a secret or service-role key in a `VITE_` variable.** Anything with `VITE_` can be seen by visitors of the site. A public key does not replace the access rules in the database.

## 6. How does the code connect to the database?

In the current project the client lives in `src/integrations/supabase/client.ts`. It reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` and creates the connection. You do not need to put keys in pages or forms.

The pages use `src/services/api.ts`, and the real queries are in `src/services/supabase/supabaseApi.ts`.

In a standalone version the minimal idea is:

```ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
```

## 7. Running it on your computer

```bash
npm install
npm run dev
```

## 8. How is the code organized?

| Folder            | What is inside                                           |
| ----------------- | -------------------------------------------------------- |
| `src/routes`      | The checks for who can open pages                        |
| `src/components`  | Reusable pieces: menu, forms, maps, galleries            |
| `src/context`     | Information about the signed-in user and favorite places |
| `src/hooks`       | Shared helpers for forms, loading, and search            |
| `src/integration` | The Supabase client integration                          |
| `src/services`    | The database connection and data operations              |
| `src/types`       | TypeScript descriptions of the data                      |
| `src/utils`       | Field checks, permissions, and formatting                |
| `src/assets`      | Images used by the site's look and other resources       |

## 9. What is in the database?

The database has six tables for the app:

| Table         | What it is for                  | Main data                                                                  |
| ------------- | ------------------------------- | -------------------------------------------------------------------------- |
| `profiles`    | The visible part of the profile | ID, name, avatar, date                                                     |
| `places`      | The published places            | Author, name, description, category, address, coordinates, photo addresses |
| `reviews`     | Reviews                         | Place, author, rating from 1 to 5, comment                                 |
| `favorites`   | Favorite places                 | User and place                                                             |
| `place_likes` | Likes                           | User and place                                                             |
| `user_roles`  | Protected roles                 | User and role                                                              |

When someone registers, a row in `profiles` is created automatically. The links between the tables show who the author is and which place a review belongs to. Deleting a place removes its related reviews, favorites, and likes. **The photo file itself is not deleted automatically with the place row.**
