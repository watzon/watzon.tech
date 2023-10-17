export async function get() {
  return {
    body: JSON.stringify({
      subject: "acct:watzon@watzonmanor.com",
      aliases: [
        "https://watzonmanor.com/@watzon",
        "https://watzonmanor.com/users/watzon",
      ],
      links: [
        {
          rel: "http://webfinger.net/rel/profile-page",
          type: "text/html",
          href: "https://watzonmanor.com/@watzon",
        },
        {
          rel: "self",
          type: "application/activity+json",
          href: "https://watzonmanor.com/users/watzon",
        },
        {
          rel: "http://ostatus.org/schema/1.0/subscribe",
          template: "https://watzonmanor.com/authorize_interaction?uri={uri}",
        },
      ],
    }),
  };
}
