// Communication Books Data
// This file contains book information with Goodreads links
// Ratings will be fetched dynamically from your backend API (which scrapes Goodreads)

// Define API_BASE_URL on window object if not already defined
// This will be used by script.js and this file
if (typeof window.API_BASE_URL === 'undefined') {
    window.API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000'
        : 'https://linkup-backend-oz1f.vercel.app';
}

// Use window.API_BASE_URL directly (no const declaration to avoid conflicts)
// Access it via window.API_BASE_URL or create a local reference function
function getApiBaseUrl() {
    return window.API_BASE_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000'
        : 'https://linkup-backend-oz1f.vercel.app');
}

const communicationBooks = [
  {
    title: "The Next Conversation",
    author: "Jefferson Fisher",
    goodreadsUrl: "https://www.goodreads.com/book/show/215514806-the-next-conversation",
    goodreadsId: "215514806",
    description: "Argue less, talk more - practical communication strategies",
    isbn: "9780593716250",
    rating: null, // Will be fetched dynamically
    coverUrl: null // Will be fetched from Open Library or Goodreads
  },
  {
    title: "Crucial Conversations",
    author: "Kerry Patterson, Joseph Grenny, Ron McMillan, Al Switzler",
    goodreadsUrl: "https://www.goodreads.com/book/show/62927923-crucial-conversations",
    goodreadsId: "62927923",
    description: "Tools for talking when stakes are high",
    isbn: "9780071771320",
    rating: null,
    coverUrl: null
  },
  {
    title: "How to Talk to Anyone",
    author: "Leil Lowndes",
    goodreadsUrl: "https://www.goodreads.com/book/show/35210.How_to_Talk_to_Anyone",
    goodreadsId: "35210",
    description: "92 little tricks for big success in relationships",
    isbn: "9780071418584",
    rating: null,
    coverUrl: null
  },
  {
    title: "Talk Like TED",
    author: "Carmine Gallo",
    goodreadsUrl: "https://www.goodreads.com/book/show/17910144-talk-like-ted",
    goodreadsId: "17910144",
    description: "The 9 public-speaking secrets of the world's top minds",
    isbn: "9781250061539",
    rating: null,
    coverUrl: null
  },
  {
    title: "What Every Body is Saying",
    author: "Joe Navarro",
    goodreadsUrl: "https://www.goodreads.com/book/show/1173576.What_Every_Body_is_Saying",
    goodreadsId: "1173576",
    description: "An ex-FBI agent's guide to speed-reading people",
    isbn: "9780061438295",
    rating: null,
    coverUrl: null
  },
  {
    title: "The Art of Reading Minds",
    author: "Henrik Fexeus",
    goodreadsUrl: "https://www.goodreads.com/book/show/52279225-the-art-of-reading-minds",
    goodreadsId: "52279225",
    description: "How to understand and influence others without them noticing",
    isbn: "9781250237231",
    rating: null,
    coverUrl: null
  },
  {
    title: "Never Split the Difference",
    author: "Chris Voss",
    goodreadsUrl: "https://www.goodreads.com/book/show/32444582-never-split-the-difference",
    goodreadsId: "32444582",
    description: "Negotiating as if your life depended on it",
    isbn: "9780062407801",
    rating: null,
    coverUrl: null
  },
  {
    title: "How to Become a People Magnet",
    author: "Marc Reklau",
    goodreadsUrl: "https://www.goodreads.com/book/show/50841095-how-to-become-a-people-magnet",
    goodreadsId: "50841095",
    description: "62 simple strategies to build strong relationships",
    isbn: "9781734314500",
    rating: null,
    coverUrl: null
  },
  {
    title: "Think Faster, Talk Smarter",
    author: "Matt Abrahams",
    goodreadsUrl: "https://www.goodreads.com/book/show/101021597-think-faster-talk-smarter",
    goodreadsId: "101021597",
    description: "How to speak successfully when you're put on the spot",
    isbn: "9781668005296",
    rating: null,
    coverUrl: null
  },
  {
    title: "Difficult Conversations",
    author: "Douglas Stone, Bruce Patton, Sheila Heen",
    goodreadsUrl: "https://www.goodreads.com/book/show/774088.Difficult_Conversations",
    goodreadsId: "774088",
    description: "How to discuss what matters most",
    isbn: "9780143118442",
    rating: null,
    coverUrl: null
  },
  {
    title: "Getting to Yes",
    author: "Roger Fisher, William Ury, Bruce Patton",
    goodreadsUrl: "https://www.goodreads.com/book/show/313605.Getting_to_Yes",
    goodreadsId: "313605",
    description: "Negotiating agreement without giving in",
    isbn: "9780143118756",
    rating: null,
    coverUrl: null
  },
  {
    title: "Inner Mastery, Outer Impact",
    author: "Hitendra Wadhwa",
    goodreadsUrl: "https://www.goodreads.com/book/show/59227927-inner-mastery-outer-impact",
    goodreadsId: "59227927",
    description: "How your five core energies hold the key to success",
    isbn: "9780593421019",
    rating: null,
    coverUrl: null
  }
];

// Function to get book cover from multiple sources
function getBookCover(isbn, goodreadsId, title) {
  // Special handling for books with known cover issues
  const specialCovers = {
    "215514806": "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1730753595i/215514806.jpg", // The Next Conversation
    "50841095": "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1561188423l/50841095.jpg", // How to Become a People Magnet
    "101021597": "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1686093094i/101021597.jpg", // Think Faster, Talk Smarter
    "59227927": "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1649650354i/59227927.jpg" // Inner Mastery, Outer Impact
  };
  
  if (goodreadsId && specialCovers[goodreadsId]) {
    return specialCovers[goodreadsId];
  }
  
  if (isbn) {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  }

  if (goodreadsId) {
    const id = goodreadsId.toString();
    if (id.length >= 6) {
      const id1 = id.substring(0, 3);
      const id2 = id.substring(3, 6);
      const id3 = id.substring(6) || "0";
      return `https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/${id1}/${id2}/${id3}/l/${id}._SY475_.jpg`;
    } else if (id.length >= 3) {
      const id1 = id.substring(0, 3);
      const id2 = id.substring(3) || "0";
      return `https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/${id1}/${id2}/l/${id}._SY475_.jpg`;
    }
  }

  return null;
}

// (封面抓取仍保持原逻辑；核心诉求是评分+排序，所以不强制你改封面)
async function fetchGoodreadsCover(goodreadsId) {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://www.goodreads.com/book/show/${goodreadsId}`
    )}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    const html = data.contents;

    let coverMatch = html.match(/<img[^>]*id=["']coverImage["'][^>]*src=["']([^"']+)["']/i);
    if (!coverMatch) coverMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    if (!coverMatch) coverMatch = html.match(/<img[^>]*class=["'][^"']*bookCover[^"']*["'][^>]*src=["']([^"']+)["']/i);
    if (!coverMatch) coverMatch = html.match(/<img[^>]*src=["']([^"']*cover[^"']*)["']/i);

    if (coverMatch && coverMatch[1]) {
      let coverUrl = coverMatch[1];
      coverUrl = coverUrl.replace(/[?&]s=\d+/gi, "");
      coverUrl = coverUrl.replace(/[?&]w=\d+/gi, "");
      coverUrl = coverUrl.replace(/[?&]h=\d+/gi, "");
      if (!coverUrl.includes("?") && !coverUrl.includes("_")) {
        coverUrl = coverUrl.replace(/\._([^_]+)_\./, ".");
      }
      return coverUrl;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching cover for book ${goodreadsId}:`, error);
    return null;
  }
}

/**
 * ✅ 核心改动 1：
 * 评分不再用 allorigins 去抓 Goodreads（容易被 CORS/反爬影响）
 * 改为调用你自己的后端：/api/goodreads-rating?id=xxxx
 */
async function fetchGoodreadsRating(goodreadsId) {
  try {
    // 使用全局 API_BASE_URL
    const apiUrl = getApiBaseUrl();
    const url = `${apiUrl}/api/goodreads-rating?id=${encodeURIComponent(goodreadsId)}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();

    const rating = data?.rating;
    return Number.isFinite(rating) ? rating : null;
  } catch (error) {
    console.error(`Error fetching rating for book ${goodreadsId}:`, error);
    return null;
  }
}


// Function to render stars based on rating
function renderStars(rating) {
  if (!Number.isFinite(rating)) return "⭐⭐⭐⭐⭐";
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  let stars = "";
  for (let i = 0; i < fullStars; i++) stars += "⭐";
  if (hasHalfStar) stars += "½";

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) stars += "☆";

  return stars;
}

// Function to render books in the container
function renderBooks(books) {
  const booksContainer = document.getElementById("books-container");
  if (!booksContainer) return;

  const currentRatings = {};
  document.querySelectorAll(".book-rating").forEach((el) => {
    const bookId = el.getAttribute("data-book-id");
    const ratingText = el.textContent;
    if (ratingText && ratingText !== "...") {
      const n = parseFloat(ratingText);
      if (Number.isFinite(n)) currentRatings[bookId] = n;
    }
  });

  booksContainer.innerHTML = books
    .map((book) => {
      const primaryCover = getBookCover(book.isbn, book.goodreadsId, book.title);
      const placeholderUrl = `https://via.placeholder.com/200x300/6366F1/FFFFFF?text=${encodeURIComponent(
        book.title.substring(0, 15).replace(/\s+/g, "+")
      )}`;

      const currentRating = Number.isFinite(currentRatings[book.goodreadsId])
        ? currentRatings[book.goodreadsId]
        : book.rating;

      const ratingDisplay = Number.isFinite(currentRating) ? currentRating.toFixed(1) : "...";
      const starsDisplay = Number.isFinite(currentRating) ? renderStars(currentRating) : "⭐⭐⭐⭐⭐";

      if (!book.coverUrl) book.coverUrl = primaryCover;

      return `
        <a href="${book.goodreadsUrl}" target="_blank" 
          class="resource-card bg-white rounded-lg p-3 border border-gray-200 hover:shadow-xl transition-all transform hover:scale-105 hover:border-pink-300"
          data-book-id="${book.goodreadsId}">
          <div class="mb-3">
            <img src="${book.coverUrl || primaryCover || placeholderUrl}" 
              alt="${book.title}" 
              class="w-full h-48 object-cover rounded-lg shadow-md book-cover"
              data-book-id="${book.goodreadsId}"
              data-isbn="${book.isbn || ""}"
              onerror="handleCoverError(this, '${book.goodreadsId}', '${book.isbn || ""}')">
          </div>
          <h4 class="font-semibold text-gray-800 mb-1 text-sm leading-tight">${book.title}</h4>
          <p class="text-xs text-gray-500 mb-2 line-clamp-2">${book.description}</p>
          <div class="flex items-center justify-between">
            <span class="text-xs text-yellow-600 book-stars" data-book-id="${book.goodreadsId}">${starsDisplay}</span>
            <span class="text-xs text-gray-400 book-rating" data-book-id="${book.goodreadsId}">${ratingDisplay}</span>
          </div>
        </a>
      `;
    })
    .join("");
}

// ✅ 核心改动 2：排序逻辑使用 Number.isFinite，确保 rating = null 的排最后
function sortBooksByRatingDesc(books) {
  return [...books].sort((a, b) => {
    const aHas = Number.isFinite(a.rating);
    const bHas = Number.isFinite(b.rating);

    if (aHas && bHas) return b.rating - a.rating; // 高 → 低
    if (aHas && !bHas) return -1;
    if (!aHas && bHas) return 1;
    return 0;
  });
}

// Load communication books function
async function loadBooks() {
  const booksContainer = document.getElementById("books-container");
  if (!booksContainer) {
    // Retry after a short delay if container not found
    console.warn("books-container not found, retrying...");
    setTimeout(loadBooks, 100);
    return;
  }

  console.log("Loading books into container...");
  // 初次渲染（此时 rating 还是 null）
  renderBooks(communicationBooks);

  // 逐本抓取评分（错峰避免触发限制）
  communicationBooks.forEach((book, index) => {
    setTimeout(async () => {
      const rating = await fetchGoodreadsRating(book.goodreadsId);
      if (Number.isFinite(rating)) {
        book.rating = rating;

        // 每拿到一本的 rating，就重新排序+渲染（用户立刻看到变化）
        const sorted = sortBooksByRatingDesc(communicationBooks);
        renderBooks(sorted);
      } else {
        // 失败就不改，保持 null 排最后
        const sorted = sortBooksByRatingDesc(communicationBooks);
        renderBooks(sorted);
      }
    }, index * 250); // 250ms 间隔（比你原来的 500 更快一些，也不容易炸）
  });
}

// Global function to handle cover image errors
async function handleCoverError(imgElement, goodreadsId, isbn) {
  // Special handling for books with known cover issues
  const specialCovers = {
    "215514806": "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1730753595i/215514806.jpg",
    "50841095": "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1561188423l/50841095.jpg",
    "101021597": "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1686093094i/101021597.jpg",
    "59227927": "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1649650354i/59227927.jpg"
  };
  
  if (goodreadsId && specialCovers[goodreadsId]) {
    imgElement.onerror = null; // Remove error handler to prevent infinite loop
    imgElement.src = specialCovers[goodreadsId];
    return;
  }
  
  if (goodreadsId) {
    const id = goodreadsId.toString();
    if (id.length >= 6) {
      const id1 = id.substring(0, 3);
      const id2 = id.substring(3, 6);
      const id3 = id.substring(6) || "0";
      // Try with _SY475_ suffix first (standard Goodreads format)
      const goodreadsUrl1 = `https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/${id1}/${id2}/${id3}/l/${id}._SY475_.jpg`;
      imgElement.onerror = null;
      imgElement.src = goodreadsUrl1;
      imgElement.onerror = function() {
        // Try without _SY475_ suffix
        const goodreadsUrl2 = `https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/${id1}/${id2}/${id3}/l/${id}.jpg`;
        imgElement.onerror = null;
        imgElement.src = goodreadsUrl2;
        imgElement.onerror = async function() {
          // Last resort: fetch from Goodreads page
          const coverUrl = await fetchGoodreadsCover(goodreadsId);
          imgElement.src = coverUrl || `https://via.placeholder.com/200x300/6366F1/FFFFFF?text=No+Cover`;
        };
      };
      return;
    }
  }

  if (goodreadsId) {
    const coverUrl = await fetchGoodreadsCover(goodreadsId);
    if (coverUrl) {
      imgElement.src = coverUrl;
      return;
    }
  }

  imgElement.src = `https://via.placeholder.com/200x300/6366F1/FFFFFF?text=No+Cover`;
}

// Auto-load books when DOM is ready
function initBooks() {
  // Wait a bit to ensure all elements are rendered
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(loadBooks, 200);
    });
  } else {
    // DOM already loaded, but wait a bit for dynamic content
    setTimeout(loadBooks, 200);
  }
}

// Initialize books loading
initBooks();

// Also try loading when page becomes visible (in case of dynamic page switching)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    setTimeout(loadBooks, 100);
  }
});

// Also listen for any page changes (if using SPA-like navigation)
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(loadBooks, 300);
  });
}
