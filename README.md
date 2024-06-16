# Admits Website

A website designed to document the experiences of BITS graduates that applied for higher studies.

## Stack

This project uses Astro and Tailwind for the frontend, and we intend to use [Cloudflare D1](https://developers.cloudflare.com/d1/) as our database, [Cloudflare R2](https://developers.cloudflare.com/r2/) for our object storage, and [Cloudflare Pages](https://developers.cloudflare.com/pages/) for deployment.

The code is written with the long term in mind, and the main priority we kept in mind while making decisions about the code and the libraries used is maintainability.

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
