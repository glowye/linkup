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
        isbn: null, // Will try to fetch from Goodreads
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

// Function to get book cover from Open Library
function getBookCover(isbn) {
    if (!isbn) return null;
    return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
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
        
        // Extract rating from HTML
        const ratingMatch = html.match(/average rating["\s]*>([\d.]+)/i);
        if (ratingMatch) {
            return parseFloat(ratingMatch[1]);
        }
        
        // Alternative: Look for rating in different format
        const ratingMatch2 = html.match(/ratingValue["\s]*>([\d.]+)/i);
        if (ratingMatch2) {
            return parseFloat(ratingMatch2[1]);
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

