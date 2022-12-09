import lume from "lume/mod.ts";
import prism from "lume/plugins/prism.ts";
import inline from "lume/plugins/inline.ts";
import resolveUrls from "lume/plugins/resolve_urls.ts";
import esbuild from "lume/plugins/esbuild.ts";
import imagick from "lume/plugins/imagick.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import sitemap from "lume/plugins/sitemap.ts";
import windi from "lume/plugins/windi_css.ts";

const site = lume(
  {
    location: new URL("https://watzon.tech"),
    server: {
      page404: "/404/",
    },
  },
);

site
  .ignore("README.md")
  .ignore("scripts")
  .copy("static", ".")
  .use(prism())
  .use(windi())
  .use(inline())
  .use(esbuild({
    extensions: [".js"],
  }))
  .use(resolveUrls())
  .use(imagick())
  .use(sitemap())
  .use(minifyHTML());

export default site;
