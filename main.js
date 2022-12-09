import CodeExample from "./scripts/components/code_example.js";
import ThemeToggle from "./scripts/components/theme_toggle.js";

customElements.define("code-examples", CodeExample);
customElements.define("theme-toggle", ThemeToggle);

// For testing purpose of CSP middleware
const userAgentString = navigator.userAgent;
const chromeAgent = userAgentString.indexOf("Chrome") > -1;

if (chromeAgent) {
  const observer = new ReportingObserver((reports) => {
    for (const report of reports) {
      console.log(report.type, report.url, report.body);
    }
  }, { buffered: true });

  observer.observe();
}
