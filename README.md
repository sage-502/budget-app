# budget-app

A simple personal budget tracker built with vanilla JavaScript.

This app was created for personal use to track monthly spending without ads, subscriptions, or external services.

---

## Live Demo

https://sage-502.github.io/budget-app

## Features

* Monthly budget management
* Expense tracking with categories
* Progress bars for budget usage
* Total spending and remaining budget
* Transaction list with delete option
* JSON export / import for manual backups
* Installable as a PWA (works like a mobile app)

## Tech Stack

* HTML
* CSS
* Vanilla JavaScript
* LocalStorage
* Progressive Web App (PWA)

## How Data Is Stored

All data is stored locally in the browser using **localStorage**.

No accounts, servers, or external databases are used.

Data structure example:

```
data
 └ months
     └ YYYY-MM
         ├ budgets
         └ transactions
```

## Backup

You can manually back up your data using:

* **Export JSON**
* **Import JSON**

This allows you to save your monthly data and restore it later.

## Installation (PWA)

The app can be installed on mobile devices:

1. Open the site in your browser
2. Tap **Add to Home Screen** or **Install**
3. The app will run like a native application

## Motivation

Most budgeting apps require subscriptions or display ads.
This project was created as a lightweight personal alternative that works offline and stores data locally.

## License

Unlicense

※ Made by chatGPT including this doc.
