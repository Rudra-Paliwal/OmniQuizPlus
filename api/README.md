# OmniQuiz+

An advanced confidence-based quiz platform with hint economy, timer scoring, analytics, and offline integrity tools.

## 📁 Folder Structure

- `index.html`, `style.css`, `main.js` – Frontend UI
- `/api/*.php` – PHP backend (REST-like)
- `/sql/omniquiz.sql` – MySQL DB schema
- `/c_tools/*.c` – Hash-chain integrity + analytics

## 🚀 Features

- Confidence-based scoring
- Timer-based bonus
- Hint system with penalty
- Admin panel to add/view results
- Offline C-based data checkers

## 🧪 How to Run

1. Import `omniquiz.sql` into MySQL
2. Place files into XAMPP/htdocs
3. Compile C tools using `gcc verifier.c -o verifier`
