export default class CodeExample extends HTMLElement {
  constructor() {
    super();
    this.themeToggleBtn = this.querySelector("#theme-toggle");
    this.themeToggleDarkIcon = this.themeToggleBtn.querySelector(
      "#theme-toggle-dark-icon",
    );
    this.themeToggleLightIcon = this.themeToggleBtn.querySelector(
      "#theme-toggle-light-icon",
    );

    // Change the icons inside the button based on previous settings
    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      this.themeToggleLightIcon.classList.remove("hidden");
    } else {
      this.themeToggleDarkIcon.classList.remove("hidden");
    }

    this.onclick = this.toggleTheme.bind(this);
  }

  toggleTheme() {
    // toggle icons inside button
    this.themeToggleDarkIcon.classList.toggle("hidden");
    this.themeToggleLightIcon.classList.toggle("hidden");

    // if set via local storage previously
    if (localStorage.getItem("color-theme")) {
      if (localStorage.getItem("color-theme") === "light") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
      }

      // if NOT set via local storage previously
    } else {
      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
      }
    }
  }
}
