/* =============================================
   MOVIESPHERE – MAIN SCRIPT
   All buttons functional, clean & efficient
   ============================================= */

// ============= API CONFIG =============



/* =============================================
   MOVIESPHERE – MAIN SCRIPT
   OMDb API VERSION
   ============================================= */

// ============= API CONFIG =============

const OMDB_KEY = "2ac57876";
const OMDB_URL = "https://www.omdbapi.com";

// ============= NAV SCROLL EFFECT =============

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  }
}, { passive: true });


// ============= AUTH STATE =============

function initAuth() {
  const email = localStorage.getItem("loggedInUser");

  const authBtn = document.getElementById("authBtn");
  const userProf = document.getElementById("userProfile");
  const userNameEl = document.getElementById("userName");
  const userInitialEl = document.getElementById("userInitial");

  if (email) {
    if (authBtn) {
      authBtn.classList.add("hidden");
    }

    if (userProf) {
      userProf.classList.remove("hidden");
    }

    const displayName = email.split("@")[0];

    if (userNameEl) {
      userNameEl.textContent = displayName;
    }

    if (userInitialEl) {
      userInitialEl.textContent =
        displayName.charAt(0).toUpperCase();
    }

  } else {

    if (authBtn) {
      authBtn.classList.remove("hidden");
    }

    if (userProf) {
      userProf.classList.add("hidden");
    }
  }
}

initAuth();


function handleLogin() {
  window.location.href = "login.html";
}


function handleLogout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("userToken");
  localStorage.removeItem("userData");

  showToast("You've been signed out. See you soon! 👋");

  setTimeout(() => {
    initAuth();
  }, 600);
}


// ============= SCROLL HELPERS =============

function scrollToMovies() {
  document
    .getElementById("mainContent")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
}


function scrollToTrending() {
  document
    .getElementById("section-trending")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
}


// ============= SEE ALL BUTTON =============

function seeAllMovies(sectionId, label) {

  const section =
    document.getElementById("section-" + sectionId);

  if (!section) return;

  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  const row =
    document.getElementById(sectionId);

  if (row) {

    row.style.transition =
      "outline 0.3s ease";

    row.style.outline =
      "2px solid rgba(229,9,20,0.5)";

    row.style.borderRadius = "8px";

    setTimeout(() => {
      row.style.outline = "none";
    }, 1500);
  }

  showToast(`Showing all ${label} movies`);
}


// ============= PAYMENT SYSTEM =============

function handlePayment() {

  const user =
    localStorage.getItem("loggedInUser");

  if (!user) {

    showToast(
      "⚠️ Please sign in to buy or rent movies!"
    );

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);

    return;
  }

  const oldModal =
    document.getElementById("paymentModal");

  if (oldModal) {
    oldModal.remove();
  }

  const modal =
    document.createElement("div");

  modal.className = "payment-modal";
  modal.id = "paymentModal";

  modal.innerHTML = `

    <div class="payment-content">

      <button
        class="popup-close"
        onclick="document.getElementById('paymentModal')?.remove()"
      >
        ✕
      </button>

      <h2>💳 Buy or Rent a Movie</h2>

      <p>
        Choose your preferred payment method
      </p>

      <div class="payment-methods">

        <div
          class="payment-option"
          onclick="selectPayment(this)"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/800px-Mastercard-logo.svg.png"
            alt="Mastercard"
            onerror="this.style.display='none'"
          >

          <span>Debit / Credit</span>
        </div>


        <div
          class="payment-option"
          onclick="selectPayment(this)"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
            alt="PayPal"
            onerror="this.style.display='none'"
          >

          <span>PayPal</span>
        </div>


        <div
          class="payment-option"
          onclick="selectPayment(this)"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg"
            alt="Google Pay"
            onerror="this.style.display='none'"
          >

          <span>Google Pay</span>
        </div>


        <div
          class="payment-option"
          onclick="selectPayment(this)"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg"
            alt="UPI / Apple Pay"
            onerror="this.style.display='none'"
          >

          <span>UPI / Apple Pay</span>
        </div>

      </div>


      <div class="pricing">

        <h3>📽️ Choose Plan</h3>

        <div class="price-option">

          <label>
            <input
              type="radio"
              name="price"
              value="rent"
              checked
            >

            Rent for 48 hours —
            <strong>₹99 / $3.99</strong>
          </label>

        </div>


        <div class="price-option">

          <label>
            <input
              type="radio"
              name="price"
              value="buy"
            >

            Buy Movie —
            <strong>₹399 / $9.99</strong>
          </label>

        </div>

      </div>


      <button
        class="btn-primary"
        onclick="processPayment()"
        style="
          width:100%;
          margin-top:24px;
          justify-content:center;
        "
      >
        Complete Payment →
      </button>

    </div>
  `;

  document.body.appendChild(modal);


  modal.addEventListener("click", (e) => {

    if (e.target === modal) {
      modal.remove();
    }

  });
}


function selectPayment(el) {

  document
    .querySelectorAll(".payment-option")
    .forEach(option => {

      option.style.borderColor = "";
      option.style.background = "";

    });

  el.style.borderColor =
    "var(--accent)";

  el.style.background =
    "rgba(124,77,255,0.1)";
}


function processPayment() {

  const selected =
    document.querySelector(
      'input[name="price"]:checked'
    );

  if (!selected) return;

  const price =
    selected.value === "rent"
      ? "₹99 / $3.99"
      : "₹399 / $9.99";

  const modal =
    document.getElementById("paymentModal");

  if (modal) {
    modal.remove();
  }

  showToast(
    `✅ Payment of ${price} successful! Enjoy your movie 🎬`,
    3500
  );
}


// ============= BOOKMYSHOW =============

function openBookMyShow() {

  window.open(
    "https://www.bookmyshow.com",
    "_blank",
    "noopener,noreferrer"
  );

  showToast(
    "🎫 Opening BookMyShow in a new tab!"
  );
}


// ============= SKELETON LOADERS =============

function renderSkeletons(
  containerId,
  count = 10
) {

  const c =
    document.getElementById(containerId);

  if (!c) return;

  c.innerHTML =
    Array(count)
      .fill(
        `<div class="skeleton" aria-hidden="true"></div>`
      )
      .join("");
}


// ============= OMDB SEARCH =============

async function searchOMDB(
  searchTerm,
  page = 1
) {

  const url =
    `${OMDB_URL}/?apikey=${OMDB_KEY}` +
    `&s=${encodeURIComponent(searchTerm)}` +
    `&type=movie` +
    `&page=${page}`;

  const response =
    await fetch(url);

  if (!response.ok) {
    throw new Error(
      `HTTP Error: ${response.status}`
    );
  }

  const data =
    await response.json();

  if (data.Response !== "True") {
    throw new Error(
      data.Error || "Movie not found"
    );
  }

  return data;
}


// ============= LOAD MOVIES =============

async function loadMovies(
  searchTerm,
  containerId
) {

  renderSkeletons(containerId);

  try {

    const data =
      await searchOMDB(searchTerm);

    const container =
      document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";


    if (
      !data.Search ||
      data.Search.length === 0
    ) {

      container.innerHTML = `
        <p
          style="
            color:var(--text-muted);
            padding:20px;
          "
        >
          No movies found.
        </p>
      `;

      return;
    }


    data.Search.forEach(movie => {

      const card =
        document.createElement("div");

      card.className =
        "movie-card";

      card.setAttribute(
        "role",
        "listitem"
      );

      card.setAttribute(
        "tabindex",
        "0"
      );

      card.setAttribute(
        "aria-label",
        `${movie.Title}, released ${movie.Year}`
      );


      const poster =
        movie.Poster &&
        movie.Poster !== "N/A"
          ? movie.Poster
          : "https://placehold.co/175x260/0f0f1a/555566?text=No+Poster";


      card.innerHTML = `

        <img
          src="${poster}"
          alt="${movie.Title}"
          loading="lazy"
          onerror="
            this.src='https://placehold.co/175x260/0f0f1a/555566?text=No+Poster'
          "
        >

        <div class="movie-card-overlay">

          <div class="play-btn-overlay">
            ▶
          </div>

        </div>

        <div class="movie-info">

          <h3 title="${movie.Title}">
            ${movie.Title}
          </h3>

          <div class="movie-rating">
            📅 ${movie.Year}
          </div>

        </div>
      `;


      card.addEventListener(
        "click",
        () => showMovie(movie.imdbID)
      );


      card.addEventListener(
        "keydown",
        e => {

          if (e.key === "Enter") {
            showMovie(movie.imdbID);
          }

        }
      );


      container.appendChild(card);

    });

  } catch (error) {

    console.error(
      `Failed to load movies [${containerId}]:`,
      error
    );

    const container =
      document.getElementById(containerId);

    if (container) {

      container.innerHTML = `

        <p
          style="
            color:#ff6b6b;
            padding:20px;
          "
        >
          ⚠️ Failed to load movies.
          <br>
          ${error.message}
        </p>

      `;
    }
  }
}


// ============= SEARCH =============

let searchTimeout;

const searchInput =
  document.getElementById("search");

const searchBtn =
  document.getElementById("searchBtn");

const searchSection =
  document.getElementById("searchSection");

const searchResults =
  document.getElementById("searchResults");

const searchTitle =
  document.getElementById("searchTitle");


function doSearch() {

  const q =
    searchInput?.value.trim();

  if (!q) {

    searchSection?.classList.add(
      "hidden"
    );

    return;
  }


  if (searchTitle) {

    searchTitle.textContent =
      `🔍 Results for "${q}"`;

  }


  searchSection?.classList.remove(
    "hidden"
  );


  searchSection?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });


  loadMovies(
    q,
    "searchResults"
  );
}


function clearSearch() {

  if (searchInput) {
    searchInput.value = "";
  }

  searchSection?.classList.add(
    "hidden"
  );

  if (searchResults) {
    searchResults.innerHTML = "";
  }

  document
    .getElementById("mainContent")
    ?.scrollIntoView({
      behavior: "smooth"
    });
}


searchInput?.addEventListener(
  "input",
  () => {

    clearTimeout(searchTimeout);

    if (!searchInput.value.trim()) {

      searchSection?.classList.add(
        "hidden"
      );

      return;
    }

    searchTimeout =
      setTimeout(
        doSearch,
        480
      );

  }
);


searchBtn?.addEventListener(
  "click",
  doSearch
);


searchInput?.addEventListener(
  "keydown",
  e => {

    if (e.key === "Enter") {
      doSearch();
    }

  }
);


// ============= OMDB MOVIE DETAILS =============

async function fetchOMDB(imdbId) {

  if (!imdbId) {
    return null;
  }

  try {

    const response =
      await fetch(
        `${OMDB_URL}/?apikey=${OMDB_KEY}` +
        `&i=${encodeURIComponent(imdbId)}` +
        `&plot=full`
      );


    if (!response.ok) {
      return null;
    }


    const data =
      await response.json();


    return data.Response === "True"
      ? data
      : null;

  } catch (error) {

    console.error(
      "OMDb details error:",
      error
    );

    return null;
  }
}

async function fetchRecommendations(genre, currentImdbId) {
  if (!genre) return [];

  try {
    const data = await searchOMDB(genre);
    return (data.Search || [])
      .filter(movie => movie.imdbID !== currentImdbId)
      .slice(0, 5);
  } catch (error) {
    console.error("Recommendation lookup error:", error);
    return [];
  }
}


// ============= MOVIE DETAIL POPUP =============

async function showMovie(imdbId) {

  const popup =
    document.getElementById("popup");

  const content =
    document.getElementById("popupContent");


  if (!popup || !content) {
    return;
  }


  popup.classList.remove(
    "hidden"
  );

  document.body.style.overflow =
    "hidden";


  content.innerHTML = `

    <button
      class="popup-close"
      onclick="closePopup()"
      aria-label="Close"
    >
      ✕
    </button>

    <div
      class="popup-body"
      style="
        padding:80px 32px;
        text-align:center;
      "
    >

      <div
        style="
          width:48px;
          height:48px;
          border:3px solid var(--red);
          border-top-color:transparent;
          border-radius:50%;
          animation:spin 0.8s linear infinite;
          margin:0 auto 20px;
        "
      ></div>

      <p
        style="
          color:var(--text-muted);
          font-size:15px;
        "
      >
        Loading movie details…
      </p>

    </div>
  `;


  if (!document.getElementById("spinStyle")) {

    const style =
      document.createElement("style");

    style.id =
      "spinStyle";

    style.textContent =
      "@keyframes spin{to{transform:rotate(360deg)}}";

    document.head.appendChild(style);
  }


  try {

    const movie =
      await fetchOMDB(imdbId);


    if (!movie) {
      throw new Error(
        "Movie details not found"
      );
    }


    const poster =
      movie.Poster &&
      movie.Poster !== "N/A"
        ? movie.Poster
        : "https://placehold.co/400x600/0f0f1a/555566?text=No+Poster";


    const rating =
      movie.imdbRating &&
      movie.imdbRating !== "N/A"
        ? movie.imdbRating
        : "N/A";

    const trailerQuery = encodeURIComponent(
      `${movie.Title} ${movie.Year || ""} official trailer`
    );

    const youtubeTrailerUrl =
      `https://www.youtube.com/results?search_query=${trailerQuery}`;


    const genres =
      movie.Genre &&
      movie.Genre !== "N/A"
        ? movie.Genre
            .split(",")
            .map(
              genre =>
                `<span class="genre-chip">${genre.trim()}</span>`
            )
            .join("")
        : "";

    const primaryGenre = movie.Genre && movie.Genre !== "N/A"
      ? movie.Genre.split(",")[0].trim()
      : "";

    const recommendations = await fetchRecommendations(primaryGenre, movie.imdbID);

    const recommendationMarkup = recommendations.length
      ? `
        <section class="recommendations" aria-label="You may also like">
          <h3>You May Also Like</h3>
          <div class="recommendation-row">
            ${recommendations.map(recommendation => {
              const recommendationPoster = recommendation.Poster && recommendation.Poster !== "N/A"
                ? recommendation.Poster
                : "https://placehold.co/120x180/0f0f1a/555566?text=No+Poster";
              return `
                <button class="recommendation-card" type="button" onclick="showMovie('${recommendation.imdbID}')" aria-label="View ${recommendation.Title}">
                  <img src="${recommendationPoster}" alt="${recommendation.Title}" loading="lazy">
                  <span>${recommendation.Title}</span>
                </button>
              `;
            }).join("")}
          </div>
        </section>
      `
      : "";


    content.innerHTML = `

      <button
        class="popup-close"
        onclick="closePopup()"
        aria-label="Close"
      >
        ✕
      </button>


      <div class="popup-body">


        <div class="popup-poster-wrap">

          <img
            src="${poster}"
            alt="${movie.Title}"
            loading="lazy"
          >

        </div>


        <div class="popup-meta">


          <h2 class="popup-title">
            ${movie.Title}
          </h2>


          <div class="popup-tags">

            <span
              class="popup-tag"
            >
              ⭐ ${rating}
            </span>


            ${
              movie.Year &&
              movie.Year !== "N/A"
                ? `
                  <span class="popup-tag">
                    📅 ${movie.Year}
                  </span>
                `
                : ""
            }


            ${
              movie.Runtime &&
              movie.Runtime !== "N/A"
                ? `
                  <span class="popup-tag">
                    ⏱ ${movie.Runtime}
                  </span>
                `
                : ""
            }


            ${
              movie.Rated &&
              movie.Rated !== "N/A"
                ? `
                  <span class="popup-tag">
                    🎬 ${movie.Rated}
                  </span>
                `
                : ""
            }

          </div>


          ${
            genres
              ? `
                <div class="popup-genres">
                  ${genres}
                </div>
              `
              : ""
          }


          ${
            movie.Plot &&
            movie.Plot !== "N/A"
              ? `
                <p class="popup-overview">
                  ${movie.Plot}
                </p>
              `
              : `
                <p class="popup-overview">
                  No description available.
                </p>
              `
          }


          ${
            movie.Actors &&
            movie.Actors !== "N/A"
              ? `
                <p
                  style="
                    color:var(--text-muted);
                    font-size:14px;
                    margin-bottom:16px;
                  "
                >
                  <strong
                    style="color:var(--text-dim);"
                  >
                    Cast:
                  </strong>

                  ${movie.Actors}
                </p>
              `
              : ""
          }


          ${
            movie.Director &&
            movie.Director !== "N/A"
              ? `
                <p
                  style="
                    color:var(--text-muted);
                    font-size:14px;
                    margin-bottom:16px;
                  "
                >
                  <strong
                    style="color:var(--text-dim);"
                  >
                    Director:
                  </strong>

                  ${movie.Director}
                </p>
              `
              : ""
          }


          ${
            movie.Writer &&
            movie.Writer !== "N/A"
              ? `
                <p
                  style="
                    color:var(--text-muted);
                    font-size:14px;
                    margin-bottom:16px;
                  "
                >
                  <strong
                    style="color:var(--text-dim);"
                  >
                    Writer:
                  </strong>

                  ${movie.Writer}
                </p>
              `
              : ""
          }


          ${
            movie.Language &&
            movie.Language !== "N/A"
              ? `
                <p
                  style="
                    color:var(--text-muted);
                    font-size:14px;
                    margin-bottom:16px;
                  "
                >
                  <strong
                    style="color:var(--text-dim);"
                  >
                    Language:
                  </strong>

                  ${movie.Language}
                </p>
              `
              : ""
          }


          ${
            movie.Country &&
            movie.Country !== "N/A"
              ? `
                <p
                  style="
                    color:var(--text-muted);
                    font-size:14px;
                    margin-bottom:16px;
                  "
                >
                  <strong
                    style="color:var(--text-dim);"
                  >
                    Country:
                  </strong>

                  ${movie.Country}
                </p>
              `
              : ""
          }


          ${
            movie.imdbVotes &&
            movie.imdbVotes !== "N/A"
              ? `
                <p
                  style="
                    color:var(--text-muted);
                    font-size:13px;
                    margin-bottom:20px;
                  "
                >
                  <strong>
                    IMDb:
                  </strong>

                  ${rating}/10 —
                  ${movie.imdbVotes} votes
                </p>
              `
              : ""
          }


          <section class="trailer-section" aria-label="Movie trailer">

            <div class="trailer-header">
              <h3>Official Trailer</h3>
              <a
                href="${youtubeTrailerUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="trailer-youtube-link"
              >
                Watch on YouTube ↗
              </a>
            </div>

            <a class="trailer-fallback" href="${youtubeTrailerUrl}" target="_blank" rel="noopener noreferrer">
              ▶ Watch the official trailer on YouTube
            </a>

          </section>


          <div class="popup-actions">


            <a
              href="${youtubeTrailerUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="popup-btn popup-btn-primary"
            >
              ▶ Watch Trailer
            </a>


            ${
              movie.imdbID
                ? `
                  <a
                    href="https://www.imdb.com/title/${movie.imdbID}/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="popup-btn popup-btn-primary"
                  >
                    🎬 View on IMDb
                  </a>
                `
                : ""
            }


            <button
              class="popup-btn popup-btn-secondary"
              onclick="closePopup()"
            >
              ✕ Close
            </button>


          </div>

          ${recommendationMarkup}


        </div>

      </div>
    `;


  } catch (error) {

    console.error(
      "Failed to load movie details:",
      error
    );


    content.innerHTML = `

      <button
        class="popup-close"
        onclick="closePopup()"
        aria-label="Close"
      >
        ✕
      </button>


      <div
        class="popup-body"
        style="
          padding:80px 32px;
          text-align:center;
        "
      >

        <p
          style="
            font-size:48px;
            margin-bottom:16px;
          "
        >
          ⚠️
        </p>


        <p
          style="
            color:#ff6b6b;
            font-size:16px;
            margin-bottom:24px;
          "
        >
          Could not load movie details.
          <br>
          ${error.message}
        </p>


        <button
          class="popup-btn popup-btn-secondary"
          onclick="closePopup()"
        >
          ✕ Close
        </button>

      </div>
    `;
  }
}


// ============= CLOSE POPUP =============

function closePopup() {

  const popup =
    document.getElementById("popup");

  if (popup) {
    popup.classList.add("hidden");
  }

  document.body.style.overflow = "";
}


function handlePopupClick(event) {

  const popup =
    document.getElementById("popup");

  if (
    popup &&
    event.target === popup
  ) {
    closePopup();
  }
}


// ============= ESCAPE KEY =============

document.addEventListener(
  "keydown",
  e => {

    if (e.key === "Escape") {

      closePopup();
      closeInfoModal();

    }

  }
);


// ============= TOAST NOTIFICATION =============

let toastTimer;


function showToast(
  msg,
  duration = 2800
) {

  const toast =
    document.getElementById("toast");

  if (!toast) return;

  clearTimeout(toastTimer);

  toast.textContent = msg;

  toast.classList.remove("hidden");


  requestAnimationFrame(() => {

    requestAnimationFrame(() => {

      toast.classList.add("show");

    });

  });


  toastTimer =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

      setTimeout(() => {

        toast.classList.add(
          "hidden"
        );

      }, 350);

    }, duration);
}


// ============= INFO MODALS =============

const infoContent = {

  about: {

    title: "🎬 About MovieSphere",

    body: `
      <p>
        MovieSphere is your ultimate destination
        for discovering movies from around the world.
      </p>

      <p>
        Discover blockbusters, award-winning movies,
        timeless classics and regional movies.
      </p>

      <p>
        <strong>Our Mission:</strong>
        Make entertainment accessible to everyone,
        everywhere.
      </p>

      <ul>
        <li>Movies from around the world</li>
        <li>Movie ratings and details</li>
        <li>Cast and director information</li>
        <li>IMDb information</li>
      </ul>
    `
  },


  privacy: {

    title: "🔒 Privacy Policy",

    body: `
      <p>
        <strong>Last Updated:</strong>
        August 2026
      </p>

      <p>
        MovieSphere respects your privacy and
        is committed to protecting your personal data.
      </p>

      <ul>
        <li>
          We collect only the information
          necessary to provide our service.
        </li>

        <li>
          Your data is never sold to third parties.
        </li>

        <li>
          Passwords are encrypted before storage.
        </li>

        <li>
          JWT tokens are used for session management.
        </li>

        <li>
          You may request deletion of your data.
        </li>
      </ul>

      <p>
        For questions, contact us at
        privacy@moviesphere.com
      </p>
    `
  },


  terms: {

    title: "📋 Terms of Service",

    body: `
      <p>
        <strong>Effective:</strong>
        August 2026
      </p>

      <p>
        By using MovieSphere,
        you agree to the following terms:
      </p>

      <ul>
        <li>
          You must be 13 years or older
          to create an account.
        </li>

        <li>
          You may not share your account
          credentials with others.
        </li>

        <li>
          Content is for personal,
          non-commercial viewing only.
        </li>

        <li>
          Downloading or redistributing
          content is prohibited.
        </li>

        <li>
          We reserve the right to terminate
          accounts that violate these terms.
        </li>
      </ul>

      <p>
        Questions?
        support@moviesphere.com
      </p>
    `
  },


  contact: {

    title: "📬 Contact Us",

    body: `
      <p>
        We'd love to hear from you!
      </p>

      <ul>

        <li>
          <strong>Email:</strong>
          support@moviesphere.com
        </li>

        <li>
          <strong>Help Center:</strong>
          help.moviesphere.com
        </li>

        <li>
          <strong>Twitter / X:</strong>
          @MovieSphereApp
        </li>

        <li>
          <strong>Instagram:</strong>
          @moviesphere
        </li>

      </ul>

      <p>
        Our support team is available 24/7.
      </p>
    `
  }

};


// ============= OPEN INFO MODAL =============

function openInfoModal(type) {

  const modal =
    document.getElementById("infoModal");

  const title =
    document.getElementById(
      "infoModalTitle"
    );

  const body =
    document.getElementById(
      "infoModalBody"
    );

  const info =
    infoContent[type];


  if (
    !info ||
    !modal ||
    !title ||
    !body
  ) {
    return;
  }


  title.textContent =
    info.title;

  body.innerHTML =
    info.body;


  modal.classList.remove(
    "hidden"
  );

  document.body.style.overflow =
    "hidden";
}


// ============= CLOSE INFO MODAL =============

function closeInfoModal() {

  const modal =
    document.getElementById(
      "infoModal"
    );

  if (modal) {

    modal.classList.add(
      "hidden"
    );

  }

  document.body.style.overflow =
    "";
}


document
  .getElementById("infoModal")
  ?.addEventListener(
    "click",
    e => {

      if (
        e.target ===
        document.getElementById("infoModal")
      ) {

        closeInfoModal();

      }

    }
  );


// ============= LOAD HOME SECTIONS =============

// OMDb does NOT have TMDB's
// trending/top-rated/discover APIs.
//
// Therefore we use OMDb searches
// for different sections.

loadMovies(
  "Avengers",
  "trending"
);

loadMovies(
  "Batman",
  "toprated"
);

loadMovies(
  "Comedy",
  "comedy"
);

loadMovies(
  "Horror",
  "horror"
);

loadMovies(
  "Action",
  "action"
);
