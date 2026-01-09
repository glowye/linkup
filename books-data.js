// Communication Books Data
// This file contains book information with Goodreads links
// Ratings will be fetched dynamically from your backend API (which scrapes Goodreads)


// ↑ 改成你自己的 Vercel 后端域名（就是你测试成功返回 {"rating":3.67} 的那个域名）

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
  }
];

// Function to get book cover from multiple sources
function getBookCover(isbn, goodreadsId, title) {
  if (isbn) {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  }

  if (goodreadsId) {
    const id = goodreadsId.toString();
    if (id.length >= 6) {
      const id1 = id.substring(0, 3);
      const id2 = id.substring(3, 6);
      const id3 = id.substring(6) || "0";
      return `https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/${id1}/${id2}/${id3}/l/${id}.jpg`;
    } else if (id.length >= 3) {
      const id1 = id.substring(0, 3);
      const id2 = id.substring(3) || "0";
      return `https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/${id1}/${id2}/l/${id}.jpg`;
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
    // 复用 script.js 里定义的 API_BASE_URL
    const url = `${API_BASE_URL}/api/goodreads-rating?id=${encodeURIComponent(goodreadsId)}`;
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
  if (!booksContainer) return;

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
  if (goodreadsId) {
    const id = goodreadsId.toString();
    if (id.length >= 6) {
      const id1 = id.substring(0, 3);
      const id2 = id.substring(3, 6);
      const id3 = id.substring(6) || "0";
      const goodreadsUrl = `https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/${id1}/${id2}/${id3}/l/${id}.jpg`;
      imgElement.onerror = null;
      imgElement.src = goodreadsUrl;
      imgElement.onerror = function () {
        fetchGoodreadsCover(goodreadsId).then((coverUrl) => {
          imgElement.src = coverUrl || `https://via.placeholder.com/200x300/6366F1/FFFFFF?text=No+Cover`;
        });
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
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadBooks);
} else {
  loadBooks();
}
