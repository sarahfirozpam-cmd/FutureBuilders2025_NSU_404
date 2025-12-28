// src/services/contentLoader.js
/**
 * Service for loading health content from JSON files
 * Supports both src-based imports and public folder fetching
 */

class ContentLoader {
  constructor() {
    this.cache = new Map();
    this.articleManifest = null;
  }

  /**
   * Load all articles for a specific language
   * @param {string} language - 'en' or 'bn'
   * @returns {Promise<Array>} Array of articles
   */
  async loadArticles(language) {
    // Check cache first
    if (this.cache.has(language)) {
      return this.cache.get(language);
    }

    try {
      // Try loading from src folder first (recommended for Vite)
      const articles = await this.loadFromSrc(language);
      
      if (articles.length > 0) {
        this.cache.set(language, articles);
        return articles;
      }

      // Fallback: Try loading from public folder via fetch
      const fetchedArticles = await this.loadFromPublic(language);
      this.cache.set(language, fetchedArticles);
      return fetchedArticles;

    } catch (error) {
      console.error(`Error loading ${language} articles:`, error);
      return [];
    }
  }

  /**
   * Load articles from src folder using Vite's import.meta.glob
   * Place articles in: src/content/articles/en/ and src/content/articles/bn/
   */
  async loadFromSrc(language) {
    try {
      // Import all JSON files from src/content/articles
      const modules = import.meta.glob('/src/content/articles/**/*.json', { eager: false });
      const articles = [];

      for (const path in modules) {
        // Check if this file is for the requested language
        const pathMatch = path.match(/\/articles\/([^/]+)\//);
        if (pathMatch && pathMatch[1] === language) {
          const module = await modules[path]();
          articles.push(module.default || module);
        }
      }

      return articles;
    } catch (error) {
      console.warn('Could not load from src folder:', error);
      return [];
    }
  }

  /**
   * Load articles from public folder using fetch
   * Place articles in: public/health-content/articles/en/ and public/health-content/articles/bn/
   * Requires a manifest file listing all articles
   */
  async loadFromPublic(language) {
    try {
      // First, load the manifest file that lists all articles
      if (!this.articleManifest) {
        const manifestResponse = await fetch('/health-content/manifest.json');
        if (!manifestResponse.ok) {
          throw new Error('Manifest file not found. Create public/health-content/manifest.json');
        }
        this.articleManifest = await manifestResponse.json();
      }

      // Get article filenames for this language
      const articleFiles = this.articleManifest[language] || [];
      const articles = [];

      // Fetch each article
      for (const filename of articleFiles) {
        try {
          const response = await fetch(`/health-content/articles/${language}/${filename}`);
          if (response.ok) {
            const article = await response.json();
            articles.push(article);
          }
        } catch (err) {
          console.error(`Failed to load article: ${filename}`, err);
        }
      }

      return articles;
    } catch (error) {
      console.error('Could not load from public folder:', error);
      return [];
    }
  }

  /**
   * Load articles from API endpoint (for production with backend)
   */
  async loadFromAPI(language) {
    try {
      const response = await fetch(`/api/health-content/${language}`);
      if (!response.ok) throw new Error('API request failed');
      
      const articles = await response.json();
      return articles;
    } catch (error) {
      console.error('API loading failed:', error);
      return [];
    }
  }

  /**
   * Merge articles from different languages into bilingual objects
   */
  mergeArticles(enArticles, bnArticles) {
    const merged = [];
    const enMap = new Map(enArticles.map(a => [a.id, a]));
    const bnMap = new Map(bnArticles.map(a => [a.id, a]));

    const allIds = new Set([...enMap.keys(), ...bnMap.keys()]);

    allIds.forEach(id => {
      const enArticle = enMap.get(id);
      const bnArticle = bnMap.get(id);

      if (!enArticle && !bnArticle) return;

      merged.push({
        id,
        category: enArticle?.category || bnArticle?.category,
        title: {
          en: enArticle?.title || 'Untitled',
          bn: bnArticle?.title || 'শিরোনামহীন'
        },
        description: {
          en: enArticle?.summary || this.truncate(enArticle?.content, 150),
          bn: bnArticle?.summary || this.truncate(bnArticle?.content, 150)
        },
        content: {
          en: enArticle?.content || '',
          bn: bnArticle?.content || ''
        },
        thumbnail: enArticle?.thumbnail || bnArticle?.thumbnail,
        author: enArticle?.author || bnArticle?.author,
        createdAt: enArticle?.createdAt || bnArticle?.createdAt,
        updatedAt: enArticle?.updatedAt || bnArticle?.updatedAt,
        tags: [...new Set([...(enArticle?.tags || []), ...(bnArticle?.tags || [])])],
        size: this.calculateSize(enArticle?.content || bnArticle?.content || '')
      });
    });

    return merged.sort((a, b) => 
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }

  /**
   * Calculate content size
   */
  calculateSize(content) {
    const bytes = new Blob([content]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /**
   * Truncate text
   */
  truncate(text, maxLength = 150) {
    if (!text) return '';
    // Remove HTML tags for summary
    const plainText = text.replace(/<[^>]*>/g, '');
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    this.articleManifest = null;
  }
}

export default new ContentLoader();