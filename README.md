# Saloni Furniture

Premium furniture catalogue (no cart or checkout). React + Vite, Tailwind CSS v4, Framer Motion, Lenis, Supabase, EmailJS.

## Run
    npm install
    cp .env.example .env   # then fill in the values
    npm run dev            # http://localhost:5173
    npm run build          # production build in dist/

## Supabase
1. Create a project at supabase.com. Copy the Project URL and anon public key into `.env` (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). Never use the service-role key.
2. SQL Editor: run `supabase/migrations/001_init.sql`, then `002_map_location.sql` and `003_theme_fonts.sql` (tables, Row Level Security, `product-images` storage bucket).
3. Authentication > Users > Add user (email + password). In Authentication settings, turn off public sign-ups.
4. Make that user an admin (SQL Editor): `update public.profiles set is_admin=true where id=(select id from auth.users where email='YOU@EXAMPLE.COM');`
5. Open `/admin` and log in.

## EmailJS
Create a service and an email template at emailjs.com. The template can use these variables: `{{name}}`, `{{email}}`, `{{phone}}`, `{{message}}`, `{{product}}`, `{{reply_to}}`. Put the Service ID, Template ID and Public Key in `.env`.

## Admin guide
Categories first, then Products (add images and specifications after the first Save; set Status to Published). Homepage, Carousel and Business settings control the public pages. Nothing is hardcoded: sections with no content stay hidden.

## Deploy (Vercel or Netlify)
Import the repo, build command `npm run build`, output `dist`. Add the five environment variables in the host's settings. SPA rewrites are included (`vercel.json`, `public/_redirects`). Add the deployed URL to Supabase Authentication > URL Configuration.

## Themes and fonts
Admin > Design lets the owner pick one of 12 colour themes and a heading and body font. The change previews instantly and applies to the whole site after Save.
