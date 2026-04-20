(function () {
  if (typeof navigator === 'undefined' || !navigator.modelContext) return;

  navigator.modelContext.provideContext({
    tools: [
      {
        name: 'navigate',
        description: 'Navigate to a page on kellenmurphy.com',
        inputSchema: {
          type: 'object',
          properties: {
            page: {
              type: 'string',
              enum: ['home', 'about', 'blog'],
              description: 'Page to navigate to'
            }
          },
          required: ['page']
        },
        execute: function (input) {
          var routes = { home: '/', about: '/about.html', blog: '/blog.html' };
          var path = routes[input.page];
          if (path) window.location.href = path;
          return { navigated: path || null };
        }
      },
      {
        name: 'get_contact_info',
        description: 'Get contact information for Kellen Murphy',
        inputSchema: { type: 'object', properties: {} },
        execute: function () {
          return {
            name: 'Kellen Murphy',
            email: 'me@kellenmurphy.com',
            linkedin: 'https://linkedin.com/in/kellenmurphy',
            github: 'https://github.com/kellenmurphy'
          };
        }
      },
      {
        name: 'get_site_info',
        description: 'Get metadata about this site and its owner',
        inputSchema: { type: 'object', properties: {} },
        execute: function () {
          return {
            title: 'Kellen Murphy — Identity Architect & SSO Subject Matter Expert',
            owner: 'Kellen Murphy',
            role: 'Identity Architect, University of Virginia Identity Services',
            specialization: 'SAML, OpenID Connect, Shibboleth, enterprise IAM',
            sitemap: 'https://kellenmurphy.com/sitemap.xml'
          };
        }
      }
    ]
  });
})();
