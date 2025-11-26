# House-Sale Listing App

Use a google sheet to manage selling your things / create a simple static website to share

A lightweight, no-backend listing app powered by **Google Sheets + Google Apps Script + GitHub Pages**.  

This setup lets you maintain your items in a spreadsheet while instantly updating a public webpage.

---
#### Home Page to show the listings from the sheet
<img width="1341" height="851" alt="Screenshot 2025-11-26 at 11 41 41" src="https://github.com/user-attachments/assets/2e88597b-d8c6-430a-bddd-4c5652fe1c88" />

#### Label filters pulled from the sheet (can be combined)
<img width="1341" height="851" alt="Screenshot 2025-11-26 at 11 41 28" src="https://github.com/user-attachments/assets/4f9633b5-6e80-440d-97d3-29cf1426954e" />

#### Free toggle (combines with labels)
<img width="1341" height="851" alt="Screenshot 2025-11-26 at 11 42 01" src="https://github.com/user-attachments/assets/63177752-7f69-4420-af2d-0ec635ea63f0" />

#### Click on an image to enlarge
<img width="1341" height="851" alt="Screenshot 2025-11-26 at 11 42 39" src="https://github.com/user-attachments/assets/ca60e398-2f02-4678-8236-ae33950db5b9" />
---

This guide explains the **broad steps** needed to recreate the project. It assumes you are comfortable editing simple code files.

---

## Overview

This project:

- Reads item data from a **Google Sheet**
- Uses an **Apps Script Web App** as a JSON API endpoint
- Fetches that endpoint from `app.js`
- Renders the items using HTML, CSS, and JavaScript
- Is deployed using **GitHub Pages** for free hosting

You control everything by editing your Google Sheet.

---

## 1. Google Sheet Setup

Create a new Google Sheet.  
Add the following columns (order can vary — **just make sure your Apps Script points to the correct indices**):

| Purpose | Example Content |
|--------|-----------------|
| **Name** | `IKEA Lamp` |
| **Labels / Categories** | `furniture, lighting` |
| **Price** | `50` or `free` |
| **Images** | One cell containing 1–many image URLs |
| **Sold Flag** | `true`, `yes`, `sold`, or `1` |

You are responsible for ensuring the column indexes in your Apps Script match your actual sheet.

You may add more columns for your own use — unused columns are ignored.

---

## 2. Google Apps Script (Backend)

From the Google Sheet:

1. **Extensions → Apps Script**
2. Replace the contents with the `code.gs` file in this repo
3. Update the column indexes if your sheet uses different positions
4. Deploy the script:
   - **Deploy → New Deployment → Web App**
   - Access set to: **Anyone**
   - Copy the web app URL (this is your JSON endpoint)

Paste that URL into the `API_URL` inside `app.js`.

---

## 3. HTML / JS / CSS Setup

This project uses three main files:

- `index.html` — layout + where you insert the Apps Script endpoint and text content
- `app.js` — handles loading listings, filtering, gallery modal, and display logic
- `style.css` — visual styling

### Required Edits:

- In **index.html**, update the visible text (title, headers, description, footer)
- In **index.html**, update any placeholder images
- In **app.js**, change only the `API_URL` constant to point to your Apps Script endpoint

No other JavaScript or CSS changes are required unless you want custom behavior.

---

## 4. Deployment (GitHub Pages)

1. Create a GitHub repository
2. Add the files from this project (`index.html`, `app.js`, `style.css`, etc.)
3. Commit and push
4. Go to **Settings → Pages**
5. Select **Deploy from branch** → `main` → `/ (root)`
6. GitHub Pages will provide a public URL like:
