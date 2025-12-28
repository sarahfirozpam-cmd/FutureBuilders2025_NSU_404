# Health Content

This directory contains offline health education resources.

## Structure

```
health-content/
├── articles/
│   ├── en/           # English articles
│   └── bn/           # Bengali articles
└── videos/
    └── thumbnails/   # Video thumbnails
```

## Adding Content

1. Place article JSON files in the appropriate language folder
2. Articles should follow this format:

```json
{
  "id": "unique-id",
  "title": "Article Title",
  "category": "general|maternal|child|infectious|chronic|nutrition|hygiene",
  "content": "Full article content with HTML support",
  "summary": "Brief summary for preview",
  "createdAt": "2025-01-01",
  "author": "Author Name"
}
```

## Categories

- `general` - General health tips
- `maternal` - Pregnancy and maternal care
- `child` - Child health and development
- `infectious` - Infectious diseases (dengue, cholera, etc.)
- `chronic` - Chronic conditions (diabetes, hypertension)
- `nutrition` - Diet and nutrition
- `hygiene` - Hygiene and sanitation
