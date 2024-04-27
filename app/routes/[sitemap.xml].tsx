export const loader = () => {
  // handle "GET" request
  // separating xml content from Response to keep clean code.
  const content = `
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="https://www.w3.org/1999/xhtml">
      <url>
        <loc>https://pleut-il-en-bretagne.fr/</loc>
        
        <xhtml:link
            rel="alternate"
            href="https://www.pleut-il-en-bretagne.fr"
            />
            <xhtml:link
                rel="alternate"
                href="https://pleut-il-en-bretagne.vercel.app"
            />
        
            <lastmod>2024-04-27</lastmod>
        
            <changefreq>daily</changefreq>
        
            <priority>1.0</priority>
      
        </url>
      </urlset>
      `;
  // Return the response with the content, a status 200 message, and the appropriate headers for an XML page
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8",
    },
  });
};
