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
      const modules = import.meta.glob('/src/content/articles/**/*.json', { eager: false });
      const articles = [];

      for (const path in modules) {
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
   */
  async loadFromPublic(language) {
    try {
      // 1. Load the manifest file
      if (!this.articleManifest) {
        const manifestUrl = '/health-content/manifest.json';
        console.log(`Fetching manifest from: ${manifestUrl}`);
        
        const manifestResponse = await fetch(manifestUrl);
        if (!manifestResponse.ok) {
          throw new Error(`Manifest not found at ${manifestUrl}. Check your public folder structure.`);
        }
        this.articleManifest = await manifestResponse.json();
      }

      // 2. Get article filenames for this language
      const articleFiles = this.articleManifest[language] || [];
      const articles = [];

      // 3. Fetch each article with debugging
      for (const filename of articleFiles) {
        try {
          const fetchUrl = `/health-content/articles/${language}/${filename}`;
          console.log(`Attempting to fetch article: ${fetchUrl}`);

          const response = await fetch(fetchUrl);
          
          if (!response.ok) {
            console.error(`Failed to reach ${fetchUrl} - Status: ${response.status}`);
            continue; 
          }

          // Checking if response is actually JSON and not an HTML error page
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            console.error(`Expected JSON from ${fetchUrl} but received ${contentType}. Check if file exists.`);
            continue;
          }

          const article = await response.json();
          articles.push(article);
        } catch (err) {
          console.error(`Error processing ${filename}:`, err);
        }
      }

      return articles;
    } catch (error) {
      console.error('Could not load from public folder:', error);
      return [];
    }
  }

  /**
   * Load articles from API endpoint
   */
  async loadFromAPI(language) {
    try {
      const response = await fetch(`/api/health-content/${language}`);
      if (!response.ok) throw new Error('API request failed');
      return await response.json();
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

  calculateSize(content) {
    const bytes = new Blob([content]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  truncate(text, maxLength = 150) {
    if (!text) return '';
    const plainText = text.replace(/<[^>]*>/g, '');
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  }

  clearCache() {
    this.cache.clear();
    this.articleManifest = null;
  }
}

export default new ContentLoader();