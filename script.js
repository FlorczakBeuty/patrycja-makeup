const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuButton && mainNav) {
  const closeMenu = () => {
    menuButton.classList.remove('is-open');
    mainNav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  };

  menuButton.addEventListener('click', () => {
    const willOpen = !mainNav.classList.contains('is-open');
    menuButton.classList.toggle('is-open', willOpen);
    mainNav.classList.toggle('is-open', willOpen);
    menuButton.setAttribute('aria-expanded', String(willOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const portfolioData = {
  slubny: {
    title: 'Makijaż ślubny',
    images: ['slubny-1.webp', 'slubny-2.webp', 'slubny-3.webp', 'slubny-4.webp', 'slubny-5.webp', 'slubny-6.webp', 'slubny-7.webp', 'slubny-8.webp', 'slubny-9.webp']
  },
  glamour: {
    title: 'Makijaż Wieczorowy GLAMOUR',
    images: ['glamour-1.webp', 'glamour-2.webp', 'glamour-3.webp']
  },
  'smoky-eye': {
    title: 'Makijaż Smoky Eye',
    images: ['smoky-eye-1.webp', 'smoky-eye-2.webp', 'smoky-eye-3.webp']
  },
  kreatywny: {
    title: 'Makijaż Kreatywny',
    images: ['kreatywny-1.webp', 'kreatywny-2.webp', 'kreatywny-3.webp']
  },
  'nude-glam': {
    title: 'Makijaż NUDE GLAM',
    images: ['nude-glam-1.webp', 'nude-glam-2.webp', 'nude-glam-3.webp']
  },
  dojrzaly: {
    title: 'Makijaż dojrzały',
    images: ['dojrzaly-1.webp', 'dojrzaly-2.webp', 'dojrzaly-3.webp']
  },
  okolicznosciowy: {
    title: 'Makijaż okolicznościowy',
    images: ['okolicznosciowy-1.webp', 'okolicznosciowy-2.webp', 'okolicznosciowy-3.webp']
  }
};

const portfolioDialog = document.querySelector('#portfolio-dialog');
const portfolioDialogTitle = document.querySelector('#portfolio-dialog-title');
const portfolioMainImage = document.querySelector('#portfolio-main-image');
const portfolioImageCounter = document.querySelector('#portfolio-image-counter');
const portfolioThumbnails = document.querySelector('#portfolio-thumbnails');
const portfolioPrevButton = document.querySelector('.gallery-arrow--prev');
const portfolioNextButton = document.querySelector('.gallery-arrow--next');
const portfolioZoomButton = document.querySelector('.gallery-zoom');
const portfolioZoomLabel = document.querySelector('[data-zoom-label]');

if (portfolioDialog && portfolioDialogTitle && portfolioMainImage && portfolioImageCounter && portfolioThumbnails) {
  let activeCategory = null;
  let activeImageIndex = 0;
  let faceZoomed = false;

  const closePortfolioDialog = () => {
    if (typeof portfolioDialog.close === 'function') portfolioDialog.close();
    else portfolioDialog.removeAttribute('open');
  };

  const showPortfolioImage = (index) => {
    if (!activeCategory) return;
    const total = activeCategory.images.length;
    activeImageIndex = (index + total) % total;
    const filename = activeCategory.images[activeImageIndex];

    portfolioMainImage.src = `assets/galeria/${filename}`;
    portfolioMainImage.alt = `${activeCategory.title} - zdjęcie ${activeImageIndex + 1}`;
    portfolioImageCounter.textContent = `${activeImageIndex + 1} / ${total}`;

    portfolioThumbnails.querySelectorAll('.portfolio-thumbnail').forEach((thumbnail, thumbnailIndex) => {
      const isActive = thumbnailIndex === activeImageIndex;
      thumbnail.classList.toggle('is-active', isActive);
      thumbnail.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  };

  const setFaceZoom = (enabled) => {
    faceZoomed = enabled;
    portfolioMainImage.classList.toggle('is-face-zoom', enabled);
    portfolioZoomButton?.setAttribute('aria-pressed', String(enabled));
    portfolioZoomButton?.setAttribute('aria-label', enabled ? 'Pokaż całe zdjęcie' : 'Przybliż twarz');
    if (portfolioZoomLabel) portfolioZoomLabel.textContent = enabled ? 'Pokaż całe zdjęcie' : 'Przybliż twarz';
  };

  const showPreviousImage = () => showPortfolioImage(activeImageIndex - 1);
  const showNextImage = () => showPortfolioImage(activeImageIndex + 1);

  document.querySelectorAll('.portfolio-card').forEach((card) => {
    card.addEventListener('click', () => {
      const category = portfolioData[card.dataset.category];
      if (!category) return;

      activeCategory = category;
      activeImageIndex = 0;
      setFaceZoom(false);
      portfolioDialogTitle.textContent = category.title;
      portfolioThumbnails.replaceChildren();

      category.images.forEach((filename, index) => {
        const thumbnail = document.createElement('button');
        const image = document.createElement('img');
        thumbnail.type = 'button';
        thumbnail.className = 'portfolio-thumbnail';
        thumbnail.setAttribute('aria-label', `Pokaż zdjęcie ${index + 1}`);
        image.src = `assets/galeria/thumbs/${filename}`;
        image.alt = '';
        image.width = 100;
        image.height = 100;
        thumbnail.appendChild(image);
        thumbnail.addEventListener('click', () => showPortfolioImage(index));
        portfolioThumbnails.appendChild(thumbnail);
      });

      showPortfolioImage(0);
      if (typeof portfolioDialog.showModal === 'function') portfolioDialog.showModal();
      else portfolioDialog.setAttribute('open', '');
      document.body.style.overflow = 'hidden';
    });
  });

  portfolioPrevButton?.addEventListener('click', showPreviousImage);
  portfolioNextButton?.addEventListener('click', showNextImage);
  portfolioZoomButton?.addEventListener('click', () => setFaceZoom(!faceZoomed));
  portfolioMainImage.addEventListener('click', () => setFaceZoom(!faceZoomed));
  portfolioDialog.querySelector('.dialog-close')?.addEventListener('click', closePortfolioDialog);
  portfolioDialog.addEventListener('click', (event) => {
    if (event.target === portfolioDialog) closePortfolioDialog();
  });
  document.addEventListener('keydown', (event) => {
    if (!portfolioDialog.open) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPreviousImage();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNextImage();
    }
  });
  portfolioDialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    portfolioMainImage.removeAttribute('src');
    portfolioMainImage.alt = '';
    setFaceZoom(false);
    portfolioThumbnails.replaceChildren();
    activeCategory = null;
  });
}

const profilePhotoButton = document.querySelector('.profile-photo-button');
const profileDialog = document.querySelector('#profile-dialog');

if (profilePhotoButton && profileDialog) {
  const closeProfileDialog = () => {
    if (typeof profileDialog.close === 'function') profileDialog.close();
    else profileDialog.removeAttribute('open');
  };

  profilePhotoButton.addEventListener('click', () => {
    if (typeof profileDialog.showModal === 'function') profileDialog.showModal();
    else profileDialog.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
  });
  profileDialog.querySelector('.profile-dialog-close')?.addEventListener('click', closeProfileDialog);
  profileDialog.addEventListener('click', (event) => {
    if (event.target === profileDialog) closeProfileDialog();
  });
  profileDialog.addEventListener('close', () => {
    document.body.style.overflow = '';
  });
}

const reviewForm = document.querySelector('#review-form');
const reviewsList = document.querySelector('#reviews-list');
const reviewsCount = document.querySelector('#reviews-count');
const reviewStatus = document.querySelector('#review-status');
const ratingInput = document.querySelector('#review-rating');
const starButtons = [...document.querySelectorAll('.star-button')];

if (reviewForm && reviewsList && reviewsCount && reviewStatus && ratingInput) {
  try {
    localStorage.removeItem('patrycja-florczak-reviews');
  } catch (_) {
    // Stary zapis lokalny może być niedostępny w trybie prywatnym.
  }

  const config = window.SUPABASE_CONFIG;
  const reviewsDatabase = window.supabase && config
    ? window.supabase.createClient(config.url, config.publishableKey)
    : null;
  const submitButton = reviewForm.querySelector('button[type="submit"]');
  let reviews = [];

  const opinionLabel = (count) => {
    if (count === 1) return '1 opinia';
    const lastTwo = count % 100;
    const last = count % 10;
    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return `${count} opinie`;
    return `${count} opinii`;
  };

  const renderMessage = (titleText, noteText) => {
    reviewsList.replaceChildren();
    const empty = document.createElement('div');
    empty.className = 'reviews-empty';
    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '✦';
    const title = document.createElement('strong');
    title.textContent = titleText;
    const note = document.createElement('p');
    note.textContent = noteText;
    empty.append(icon, title, note);
    reviewsList.appendChild(empty);
  };

  const renderReviews = () => {
    reviewsList.replaceChildren();
    reviewsCount.textContent = opinionLabel(reviews.length);

    if (!reviews.length) {
      renderMessage('Tu pojawi się pierwsza opinia', 'Podziel się swoim doświadczeniem za pomocą formularza.');
      return;
    }

    reviews.forEach((review) => {
      const item = document.createElement('article');
      item.className = 'review-item';
      const header = document.createElement('div');
      header.className = 'review-item-header';
      const name = document.createElement('strong');
      name.className = 'review-item-name';
      name.textContent = review.name;
      const stars = document.createElement('span');
      stars.className = 'review-item-stars';
      stars.setAttribute('aria-label', `Ocena: ${review.rating} na 5 gwiazdek`);
      stars.textContent = `${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}`;
      const text = document.createElement('p');
      text.className = 'review-item-text';
      text.textContent = review.text;
      const date = document.createElement('time');
      date.className = 'review-item-date';
      date.dateTime = review.createdAt;
      date.textContent = new Date(review.createdAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
      header.append(name, stars);
      item.append(header, text, date);
      reviewsList.appendChild(item);
    });
  };

  const loadReviews = async () => {
    if (!reviewsDatabase) {
      reviewsCount.textContent = '—';
      renderMessage('Opinie są chwilowo niedostępne', 'Spróbuj ponownie za kilka minut.');
      return;
    }

    reviewsCount.textContent = 'Wczytywanie…';
    renderMessage('Wczytuję opinie', 'To potrwa tylko chwilę.');

    const { data, error } = await reviewsDatabase
      .from('reviews')
      .select('id, name, text, rating, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      reviewsCount.textContent = '—';
      renderMessage('Nie udało się wczytać opinii', 'Spróbuj ponownie za kilka minut.');
      return;
    }

    reviews = data.map((review) => ({
      id: review.id,
      name: review.name,
      text: review.text,
      rating: review.rating,
      createdAt: review.created_at
    }));
    renderReviews();
  };

  const setRating = (rating) => {
    ratingInput.value = String(rating);
    starButtons.forEach((button) => {
      const selected = Number(button.dataset.rating) <= rating;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(Number(button.dataset.rating) === rating));
    });
    reviewStatus.textContent = '';
    reviewStatus.classList.remove('is-error');
  };

  starButtons.forEach((button) => {
    button.addEventListener('click', () => setRating(Number(button.dataset.rating)));
  });

  reviewForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = reviewForm.elements.name.value.trim();
    const text = reviewForm.elements.text.value.trim();
    const rating = Number(ratingInput.value);

    if (!name || !text || rating < 1 || rating > 5) {
      reviewStatus.textContent = 'Wpisz imię, treść opinii i wybierz liczbę gwiazdek.';
      reviewStatus.classList.add('is-error');
      return;
    }

    if (!reviewsDatabase) {
      reviewStatus.textContent = 'Nie udało się połączyć z bazą opinii. Spróbuj ponownie później.';
      reviewStatus.classList.add('is-error');
      return;
    }

    if (submitButton) submitButton.disabled = true;
    reviewStatus.textContent = 'Wysyłanie opinii…';
    reviewStatus.classList.remove('is-error');

    const { error } = await reviewsDatabase
      .from('reviews')
      .insert({ name, text, rating });

    if (submitButton) submitButton.disabled = false;

    if (error) {
      console.error('Nie udało się wysłać opinii do Supabase:', error);
      reviewStatus.textContent = 'Nie udało się wysłać opinii. Spróbuj ponownie.';
      reviewStatus.classList.add('is-error');
      return;
    }

    reviewForm.reset();
    setRating(0);
    reviewStatus.textContent = 'Dziękuję! Opinia została wysłana i czeka na zatwierdzenie.';
    reviewStatus.classList.remove('is-error');
  });

  loadReviews();
}
