// Lazy Loader class
class LazyLoader {
  constructor(options = {}) {
    this.options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
      loadingClass: "loading",
      loadedClass: "loaded",
      errorClass: "error",
      selector: ".lazy,.lazy-image,[data-srcset],[data-src]",
      ...options,
    };
    this.observer = null;
    this.init();
  }

  init() {
    this.observer = new IntersectionObserver(
      this.onIntersection.bind(this),
      this.options
    );
    this.observe();
  }

  observe() {
    const images = document.querySelectorAll(this.options.selector);
    images.forEach((img) => {
      if (this.observer) {
        this.observer.observe(img);
      } else {
        this.loadImage(img);
      }
    });
  }

  onIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }

  loadImage(img) {
    img.classList.add(this.options.loadingClass);

    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    }

    if (img.srcset && !img.dataset.srcset) {
    } else if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
      img.removeAttribute("data-srcset");
    }

    if (img.dataset.sizes) {
      img.sizes = img.dataset.sizes;
      img.removeAttribute("data-sizes");
    }

    img.onload = () => {
      img.classList.remove(this.options.loadingClass);
      img.classList.add(this.options.loadedClass);
    };

    img.onerror = () => {
      img.classList.remove(this.options.loadingClass);
      img.classList.add(this.options.errorClass);
    };
  }
}

// Usage
export default LazyLoader;
