// Communication Books Data
// This file contains book information with Goodreads links
// Ratings will be fetched dynamically from Goodreads

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
    // Try Open Library first (more reliable for most books)
    if (isbn) {
        return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
    }
    
    // Fallback to Goodreads cover URL format
    if (goodreadsId) {
        const id = goodreadsId.toString();
        if (id.length >= 6) {
            const id1 = id.substring(0, 3);
            const id2 = id.substring(3, 6);
            const id3 = id.substring(6) || '0';
            return `https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/${id1}/${id2}/${id3}/l/${id}.jpg`;
        } else if (id.length >= 3) {
            const id1 = id.substring(0, 3);
            const id2 = id.substring(3) || '0';
            return `https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/${id1}/${id2}/l/${id}.jpg`;
        }
    }
    
    return null;
}

// Function to fetch book cover from Goodreads page (similar to rating fetch)
async function fetchGoodreadsCover(goodreadsId) {
    try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.goodreads.com/book/show/${goodreadsId}`)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const html = data.contents;
        
        // Try multiple patterns to find cover image
        // Pattern 1: Look for img tag with book cover
        let coverMatch = html.match(/<img[^>]*id=["']coverImage["'][^>]*src=["']([^"']+)["']/i);
        if (!coverMatch) {
            // Pattern 2: Look for og:image meta tag
            coverMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
        }
        if (!coverMatch) {
            // Pattern 3: Look for bookCoverContainer img
            coverMatch = html.match(/<img[^>]*class=["'][^"']*bookCover[^"']*["'][^>]*src=["']([^"']+)["']/i);
        }
        if (!coverMatch) {
            // Pattern 4: Look for any img with "cover" in src
            coverMatch = html.match(/<img[^>]*src=["']([^"']*cover[^"']*)["']/i);
        }
        
        if (coverMatch && coverMatch[1]) {
            let coverUrl = coverMatch[1];
            // Remove size parameters to get larger image
            coverUrl = coverUrl.replace(/[?&]s=\d+/gi, '');
            coverUrl = coverUrl.replace(/[?&]w=\d+/gi, '');
            coverUrl = coverUrl.replace(/[?&]h=\d+/gi, '');
            // Ensure we get a good size
            if (!coverUrl.includes('?') && !coverUrl.includes('_')) {
                // Try to get large version
                coverUrl = coverUrl.replace(/\._([^_]+)_\./, '.');
            }
            return coverUrl;
        }
        
        return null;
    } catch (error) {
        console.error(`Error fetching cover for book ${goodreadsId}:`, error);
        return null;
    }
}

// Function to fetch Goodreads rating (using a proxy or scraping)
// Note: Goodreads doesn't have a public API anymore, so we'll use a workaround
async function fetchGoodreadsRating(goodreadsId) {
    try {
        // Using a CORS proxy to fetch Goodreads page
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.goodreads.com/book/show/${goodreadsId}`)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const html = data.contents;
        
        // Extract rating from HTML - try multiple patterns
        let ratingMatch = html.match(/average rating["\s]*>([\d.]+)/i);
        if (!ratingMatch) {
            ratingMatch = html.match(/ratingValue["\s]*>([\d.]+)/i);
        }
        if (!ratingMatch) {
            ratingMatch = html.match(/avg rating[^>]*>([\d.]+)/i);
        }
        if (!ratingMatch) {
            ratingMatch = html.match(/class="average"[^>]*>([\d.]+)/i);
        }
        if (!ratingMatch) {
            // Try pattern: "4.3" near "average" or "rating"
            ratingMatch = html.match(/(?:average|rating)[^>]*>[\s]*([\d.]+)/i);
        }
        if (!ratingMatch) {
            // Try to find rating in JSON-LD structured data
            const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/is);
            if (jsonLdMatch) {
                try {
                    const jsonData = JSON.parse(jsonLdMatch[1]);
                    if (jsonData.aggregateRating && jsonData.aggregateRating.ratingValue) {
                        return parseFloat(jsonData.aggregateRating.ratingValue);
                    }
                } catch (e) {
                    // JSON parse failed, continue
                }
            }
        }
        if (!ratingMatch) {
            // Try pattern: itemprop="ratingValue"
            ratingMatch = html.match(/itemprop=["']ratingValue["'][^>]*>([\d.]+)/i);
        }
        if (!ratingMatch) {
            // Try pattern: data-rating or rating data attribute
            ratingMatch = html.match(/(?:data-rating|rating)=["']([\d.]+)["']/i);
        }
        
        if (ratingMatch && ratingMatch[1]) {
            const rating = parseFloat(ratingMatch[1]);
            // Validate rating is in reasonable range (0-5)
            if (rating >= 0 && rating <= 5) {
                return rating;
            }
        }
        
        return null;
    } catch (error) {
        console.error(`Error fetching rating for book ${goodreadsId}:`, error);
        return null;
    }
}

// Function to render stars based on rating
function renderStars(rating) {
    if (!rating) return '⭐⭐⭐⭐⭐';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '⭐';
    }
    if (hasHalfStar) {
        stars += '½';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '☆';
    }
    return stars;
}

// Function to render books in the container
function renderBooks(books) {
    const booksContainer = document.getElementById('books-container');
    if (!booksContainer) return;
    
    booksContainer.innerHTML = books.map(book => {
        // Get cover URL (prioritizes Open Library)
        const primaryCover = getBookCover(book.isbn, book.goodreadsId, book.title);
        const placeholderUrl = `https://via.placeholder.com/200x300/6366F1/FFFFFF?text=${encodeURIComponent(book.title.substring(0, 15).replace(/\s+/g, '+'))}`;
        
        const ratingDisplay = book.rating ? book.rating.toFixed(1) : '...';
        const starsDisplay = book.rating ? renderStars(book.rating) : '⭐⭐⭐⭐⭐';
        
        // Store book data for async cover fetching
        if (!book.coverUrl) {
            book.coverUrl = primaryCover;
        }
        
        return `
            <a href="${book.goodreadsUrl}" target="_blank" 
               class="resource-card bg-white rounded-lg p-3 border border-gray-200 hover:shadow-xl transition-all transform hover:scale-105 hover:border-pink-300"
               data-book-id="${book.goodreadsId}">
                <div class="mb-3">
                    <img src="${book.coverUrl || primaryCover || placeholderUrl}" 
                         alt="${book.title}" 
                         class="w-full h-48 object-cover rounded-lg shadow-md book-cover"
                         data-book-id="${book.goodreadsId}"
                         data-isbn="${book.isbn || ''}"
                         onerror="handleCoverError(this, '${book.goodreadsId}', '${book.isbn || ''}')">
                </div>
                <h4 class="font-semibold text-gray-800 mb-1 text-sm leading-tight">${book.title}</h4>
                <p class="text-xs text-gray-500 mb-2 line-clamp-2">${book.description}</p>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-yellow-600 book-stars" data-book-id="${book.goodreadsId}">${starsDisplay}</span>
                    <span class="text-xs text-gray-400 book-rating" data-book-id="${book.goodreadsId}">${ratingDisplay}</span>
                </div>
            </a>
        `;
    }).join('');
}

// Load communication books function
async function loadBooks() {
    const booksContainer = document.getElementById('books-container');
    if (!booksContainer) return;
    
    // Initial render (before ratings are fetched)
    renderBooks(communicationBooks);
    
    // Fetch covers and ratings for all books (with delay to avoid rate limiting)
    const ratingPromises = communicationBooks.map(async (book, index) => {
        return new Promise((resolve) => {
            setTimeout(async () => {
                // Fetch rating
                const rating = await fetchGoodreadsRating(book.goodreadsId);
                if (rating) {
                    book.rating = rating;
                }
                
                // Fetch cover from Goodreads if Open Library failed (for problematic books)
                const coverImg = document.querySelector(`.book-cover[data-book-id="${book.goodreadsId}"]`);
                if (coverImg && coverImg.complete && coverImg.naturalHeight === 0) {
                    // Image failed to load, try fetching from Goodreads
                    const goodreadsCover = await fetchGoodreadsCover(book.goodreadsId);
                    if (goodreadsCover) {
                        book.coverUrl = goodreadsCover;
                        coverImg.src = goodreadsCover;
                    }
                }
                
                resolve(rating);
            }, index * 500); // 500ms delay between each request
        });
    });
    
    // Function to sort and re-render books
    function sortAndRenderBooks() {
        // Sort books by rating (highest first), books without ratings go to the end
        const sortedBooks = [...communicationBooks].sort((a, b) => {
            const ratingA = a.rating;
            const ratingB = b.rating;
            
            // If both have ratings, sort by rating descending
            if (ratingA && ratingB) {
                return ratingB - ratingA;
            }
            // If only one has rating, prioritize it
            if (ratingA && !ratingB) return -1;
            if (ratingB && !ratingA) return 1;
            // If neither has rating, maintain original order
            return 0;
        });
        
        // Re-render with sorted books
        renderBooks(sortedBooks);
    }
    
    // Track how many ratings have been fetched
    let fetchedCount = 0;
    const totalBooks = communicationBooks.length;
    
    // Wait for all ratings to be fetched, then sort and re-render
    ratingPromises.forEach((promise, index) => {
        promise.then((rating) => {
            fetchedCount++;
            
            // Update the rating display immediately
            if (rating) {
                const book = communicationBooks[index];
                book.rating = rating;
                
                // Update display for this book
                const ratingEl = document.querySelector(`.book-rating[data-book-id="${book.goodreadsId}"]`);
                const starsEl = document.querySelector(`.book-stars[data-book-id="${book.goodreadsId}"]`);
                if (ratingEl) ratingEl.textContent = rating.toFixed(1);
                if (starsEl) starsEl.textContent = renderStars(rating);
            }
            
            // Re-sort and re-render after each rating is fetched
            // This ensures books are sorted as ratings come in
            sortAndRenderBooks();
        });
    });
}

// Global function to handle cover image errors
async function handleCoverError(imgElement, goodreadsId, isbn) {
    // Try Goodreads cover URL format first
    if (goodreadsId) {
        const id = goodreadsId.toString();
        if (id.length >= 6) {
            const id1 = id.substring(0, 3);
            const id2 = id.substring(3, 6);
            const id3 = id.substring(6) || '0';
            const goodreadsUrl = `https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/${id1}/${id2}/${id3}/l/${id}.jpg`;
            imgElement.onerror = null; // Reset error handler
            imgElement.src = goodreadsUrl;
            imgElement.onerror = function() {
                // If Goodreads URL also fails, try fetching from page
                fetchGoodreadsCover(goodreadsId).then(coverUrl => {
                    if (coverUrl) {
                        imgElement.src = coverUrl;
                    } else {
                        // Final fallback to placeholder
                        const placeholderUrl = `https://via.placeholder.com/200x300/6366F1/FFFFFF?text=No+Cover`;
                        imgElement.src = placeholderUrl;
                    }
                });
            };
            return;
        }
    }
    
    // If no goodreadsId, try fetching from Goodreads page
    if (goodreadsId) {
        const coverUrl = await fetchGoodreadsCover(goodreadsId);
        if (coverUrl) {
            imgElement.src = coverUrl;
            return;
        }
    }
    
    // Final fallback
    const placeholderUrl = `https://via.placeholder.com/200x300/6366F1/FFFFFF?text=No+Cover`;
    imgElement.src = placeholderUrl;
}

// Auto-load books when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBooks);
} else {
    // DOM is already loaded
    loadBooks();
}

