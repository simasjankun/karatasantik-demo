# Karatas Antik — Custom WordPress Theme

![WordPress](https://img.shields.io/badge/WordPress-6.x-21759B?style=flat-square&logo=wordpress&logoColor=white)
![WooCommerce](https://img.shields.io/badge/WooCommerce-8.x-96588A?style=flat-square&logo=woocommerce&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.0%2B-777BB4?style=flat-square&logo=php&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A custom-built premium WordPress + WooCommerce theme for **Karatas Antik**, a handcrafted jewelry e-commerce store. Designed with a focus on elegant aesthetics, performance, and conversion optimization.

---

## Screenshot

> _Screenshot coming soon_

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| CMS          | WordPress 6.x                       |
| E-commerce   | WooCommerce                         |
| Backend      | PHP 8.0+                            |
| Frontend     | Custom CSS / JS (no page builders)  |
| Multilingual | Polylang compatible                 |

---

## Features

- Custom homepage with hero section
- Premium jewelry-focused design language
- Full WooCommerce integration
- Performance optimized (no bloated frameworks)
- Fully responsive layout
- Translation ready (Polylang compatible)

---

## Getting Started

### Requirements

- WordPress 6.0 or higher
- PHP 8.0 or higher
- WooCommerce plugin

### Installation

```bash
# 1. Clone the repository into your WordPress themes directory
git clone https://github.com/simasjankun/karatasantik-demo.git \
  wp-content/themes/karatasantik-demo

# 2. Activate the theme in WordPress
#    Dashboard → Appearance → Themes → Karatas Antik → Activate

# 3. Install and activate the WooCommerce plugin
#    Dashboard → Plugins → Add New → WooCommerce
```

---

## Demo Data Setup

A WP-CLI script is included to populate the site with initial demo content in one command:

```bash
wp eval-file setup-data.php
```

The script is idempotent — safe to re-run, it skips anything that already exists.

**Creates:**

- WooCommerce product categories:
  - **Juvelyrika** → Auksiniai žiedai, Sužadėtuvių žiedai, Auksiniai auskarai, Auksinės sagės, Grandinėlės ir pakabukai, Sidabriniai dirbiniai
  - **Antikvariatas** → Antikvariniai laikrodžiai, Sidabriniai indai ir stalo įrankiai, Veidrodžiai ir rėmai
- WordPress pages: Apie mus, Kontaktai, Dovanų kuponai, Akcijos ir nuolaidos

---

## Project Structure

```
karatasantik-demo/
├── style.css          # Theme header & global styles
├── functions.php      # Theme setup, image sizes, asset enqueueing
├── index.php          # Fallback template
├── front-page.php     # Homepage template
├── header.php         # Site header & navigation
├── footer.php         # Site footer
├── setup-data.php     # WP-CLI demo data setup script
├── .gitignore
└── README.md
```

---

## Author

**Simas Jankūnas** — [LogicX MB](https://logicx.lt)

- GitHub: [@simasjankun](https://github.com/simasjankun)
- Web: [logicx.lt](https://logicx.lt)

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
