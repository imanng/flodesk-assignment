import type { Template } from "@/types/template";

const INITIAL_IMAGE_URL = "https://placehold.co/600x400";

const portfolio: Template = {
  id: "portfolio",
  name: "Portfolio",
  description: "Clean, minimal personal page with lots of whitespace.",
  pageSettings: {
    backgroundColor: "#ffffff",
    fontPreset: "modern-sans",
    maxWidth: "800px",
  },
  sections: [
    {
      id: "hero",
      layout: "stack",
      gap: "0",
      settings: { padding: "0" },
      elements: [
        {
          id: "hero-heading",
          type: "heading",
          settings: {
            fontSize: "48px",
            color: "#1a1a1a",
            textAlign: "center",
            padding: "48px 16px 8px",
            backgroundColor: "transparent",
          },
          data: { text: "Hi, I'm Jane", level: 1 },
        },
        {
          id: "hero-subheading",
          type: "text",
          settings: {
            fontSize: "20px",
            color: "#6b7280",
            textAlign: "center",
            padding: "0 16px 32px",
            backgroundColor: "transparent",
          },
          data: { text: "Designer & developer crafting digital experiences" },
        },
      ],
    },
    {
      id: "about",
      layout: "stack",
      gap: "0",
      settings: { padding: "0" },
      elements: [
        {
          id: "about-divider",
          type: "divider",
          settings: {
            fontSize: "16px",
            color: "#e5e7eb",
            textAlign: "center",
            padding: "0 120px",
            backgroundColor: "transparent",
          },
          data: {},
        },
        {
          id: "about-text",
          type: "text",
          settings: {
            fontSize: "16px",
            color: "#374151",
            textAlign: "left",
            padding: "32px 24px",
            backgroundColor: "transparent",
          },
          data: {
            text: "I'm a multidisciplinary designer and developer based in San Francisco. I focus on building thoughtful digital products that combine clean aesthetics with intuitive functionality. When I'm not designing, you'll find me hiking trails or experimenting with film photography.",
          },
        },
        {
          id: "about-image",
          type: "image",
          settings: {
            fontSize: "16px",
            color: "#1a1a1a",
            textAlign: "center",
            padding: "16px 24px",
            backgroundColor: "transparent",
            borderRadius: "8px",
          },
          data: {
            src: INITIAL_IMAGE_URL,
            alt: "Portfolio showcase",
          },
        },
      ],
    },
    {
      id: "cta",
      layout: "stack",
      gap: "0",
      settings: { padding: "0" },
      elements: [
        {
          id: "cta-heading",
          type: "heading",
          settings: {
            fontSize: "28px",
            color: "#1a1a1a",
            textAlign: "center",
            padding: "32px 16px 16px",
            backgroundColor: "transparent",
          },
          data: { text: "Let's work together", level: 2 },
        },
        {
          id: "cta-button",
          type: "button",
          settings: {
            fontSize: "16px",
            color: "#ffffff",
            textAlign: "center",
            padding: "14px 32px",
            backgroundColor: "#1a1a1a",
            borderRadius: "999px",
          },
          data: { label: "Get in Touch", href: "#", target: "_self" },
        },
        {
          id: "footer-text",
          type: "text",
          settings: {
            fontSize: "14px",
            color: "#9ca3af",
            textAlign: "center",
            padding: "48px 16px 24px",
            backgroundColor: "transparent",
          },
          data: { text: "© 2026 Jane Doe" },
        },
      ],
    },
  ],
};

const eventLaunch: Template = {
  id: "event-launch",
  name: "Event Launch",
  description:
    "Bold, vibrant event page with dark background and accent colors.",
  pageSettings: {
    backgroundColor: "#0f172a",
    fontPreset: "modern-sans",
    maxWidth: "960px",
  },
  sections: [
    {
      id: "hero",
      layout: "stack",
      gap: "0",
      settings: { padding: "0" },
      elements: [
        {
          id: "event-date",
          type: "text",
          settings: {
            fontSize: "14px",
            color: "#818cf8",
            textAlign: "center",
            padding: "48px 16px 16px",
            backgroundColor: "transparent",
            fontWeight: "medium",
            letterSpacing: "2px",
          },
          data: { text: "JUNE 15, 2026 • SAN FRANCISCO" },
        },
        {
          id: "event-heading",
          type: "heading",
          settings: {
            fontSize: "56px",
            color: "#f8fafc",
            textAlign: "center",
            padding: "0 16px 16px",
            backgroundColor: "transparent",
          },
          data: { text: "Design Systems Conference", level: 1 },
        },
        {
          id: "event-description",
          type: "text",
          settings: {
            fontSize: "20px",
            color: "#94a3b8",
            textAlign: "center",
            padding: "0 24px 40px",
            backgroundColor: "transparent",
          },
          data: {
            text: "Join 500+ designers and engineers for a day of talks, workshops, and connection.",
          },
        },
        {
          id: "event-cta",
          type: "button",
          settings: {
            fontSize: "16px",
            color: "#0f172a",
            textAlign: "center",
            padding: "16px 40px",
            backgroundColor: "#818cf8",
            borderRadius: "8px",
            fontWeight: "medium",
          },
          data: { label: "Register Now", href: "#", target: "_self" },
        },
      ],
    },
    {
      id: "highlights",
      layout: "columns",
      gap: "24px",
      settings: { padding: "48px 24px" },
      columns: [
        {
          id: "col-talks",
          elements: [
            {
              id: "talks-heading",
              type: "heading",
              settings: {
                fontSize: "22px",
                color: "#f8fafc",
                textAlign: "left",
                padding: "24px 24px 12px",
                backgroundColor: "#111827",
                borderRadius: "12px 12px 0 0",
              },
              data: { text: "Talks", level: 3 },
            },
            {
              id: "talks-text",
              type: "text",
              settings: {
                fontSize: "15px",
                color: "#94a3b8",
                textAlign: "left",
                padding: "0 24px 24px",
                backgroundColor: "#111827",
                borderRadius: "0 0 12px 12px",
              },
              data: {
                text: "Keynote speakers from leading design teams sharing real-world lessons on scaling design systems.",
              },
            },
          ],
        },
        {
          id: "col-workshops",
          elements: [
            {
              id: "workshops-heading",
              type: "heading",
              settings: {
                fontSize: "22px",
                color: "#f8fafc",
                textAlign: "left",
                padding: "24px 24px 12px",
                backgroundColor: "#111827",
                borderRadius: "12px 12px 0 0",
              },
              data: { text: "Workshops", level: 3 },
            },
            {
              id: "workshops-text",
              type: "text",
              settings: {
                fontSize: "15px",
                color: "#94a3b8",
                textAlign: "left",
                padding: "0 24px 24px",
                backgroundColor: "#111827",
                borderRadius: "0 0 12px 12px",
              },
              data: {
                text: "Hands-on sessions on design tokens, component APIs, accessibility testing, and documentation.",
              },
            },
          ],
        },
        {
          id: "col-community",
          elements: [
            {
              id: "community-heading",
              type: "heading",
              settings: {
                fontSize: "22px",
                color: "#f8fafc",
                textAlign: "left",
                padding: "24px 24px 12px",
                backgroundColor: "#111827",
                borderRadius: "12px 12px 0 0",
              },
              data: { text: "Community", level: 3 },
            },
            {
              id: "community-text",
              type: "text",
              settings: {
                fontSize: "15px",
                color: "#94a3b8",
                textAlign: "left",
                padding: "0 24px 24px",
                backgroundColor: "#111827",
                borderRadius: "0 0 12px 12px",
              },
              data: {
                text: "Networking sessions, after-party, and lasting connections with the design systems community.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "media",
      layout: "stack",
      gap: "0",
      settings: { padding: "0 24px" },
      elements: [
        {
          id: "event-image",
          type: "image",
          settings: {
            fontSize: "16px",
            color: "#f8fafc",
            textAlign: "center",
            padding: "16px 0",
            backgroundColor: "transparent",
            borderRadius: "12px",
          },
          data: {
            src: INITIAL_IMAGE_URL,
            alt: "Conference venue",
          },
        },
      ],
    },
    {
      id: "footer",
      layout: "stack",
      gap: "0",
      settings: { padding: "0" },
      elements: [
        {
          id: "event-footer",
          type: "text",
          settings: {
            fontSize: "14px",
            color: "#64748b",
            textAlign: "center",
            padding: "40px 16px 24px",
            backgroundColor: "transparent",
          },
          data: { text: "Have questions? hello@designconf.com" },
        },
      ],
    },
  ],
};

const restaurant: Template = {
  id: "restaurant",
  name: "Restaurant",
  description:
    "Warm, elegant restaurant page with earthy tones and serif typography.",
  pageSettings: {
    backgroundColor: "#faf7f2",
    fontPreset: "editorial-serif",
    maxWidth: "880px",
  },
  sections: [
    {
      id: "hero",
      layout: "stack",
      gap: "0",
      settings: { padding: "0" },
      elements: [
        {
          id: "restaurant-name",
          type: "heading",
          settings: {
            fontSize: "52px",
            color: "#3c2415",
            textAlign: "center",
            padding: "56px 16px 8px",
            backgroundColor: "transparent",
          },
          data: { text: "The Golden Pear", level: 1 },
        },
        {
          id: "restaurant-tagline",
          type: "text",
          settings: {
            fontSize: "16px",
            color: "#8b7355",
            textAlign: "center",
            padding: "0 16px 32px",
            backgroundColor: "transparent",
            fontWeight: "medium",
          },
          data: { text: "Est. 2019 • Farm to Table Dining" },
        },
        {
          id: "restaurant-hero-image",
          type: "image",
          settings: {
            fontSize: "16px",
            color: "#3c2415",
            textAlign: "center",
            padding: "0 24px",
            backgroundColor: "transparent",
            borderRadius: "4px",
          },
          data: {
            src: INITIAL_IMAGE_URL,
            alt: "Restaurant interior",
          },
        },
      ],
    },
    {
      id: "story",
      layout: "stack",
      gap: "0",
      settings: { padding: "0" },
      elements: [
        {
          id: "story-divider",
          type: "divider",
          settings: {
            fontSize: "16px",
            color: "#d4c5a9",
            textAlign: "center",
            padding: "32px 160px",
            backgroundColor: "transparent",
          },
          data: {},
        },
        {
          id: "story-heading",
          type: "heading",
          settings: {
            fontSize: "32px",
            color: "#3c2415",
            textAlign: "center",
            padding: "0 16px 16px",
            backgroundColor: "transparent",
          },
          data: { text: "Our Story", level: 2 },
        },
        {
          id: "story-text",
          type: "text",
          settings: {
            fontSize: "17px",
            color: "#5c4a32",
            textAlign: "left",
            padding: "0 24px 32px",
            backgroundColor: "transparent",
            lineHeight: "1.7",
          },
          data: {
            text: "Nestled in the heart of downtown, The Golden Pear brings seasonal ingredients from local farms to your plate. Every dish tells a story of craftsmanship, tradition, and fresh flavors.",
          },
        },
      ],
    },
    {
      id: "visit",
      layout: "stack",
      gap: "0",
      settings: { padding: "0" },
      elements: [
        {
          id: "visit-heading",
          type: "heading",
          settings: {
            fontSize: "32px",
            color: "#3c2415",
            textAlign: "center",
            padding: "16px 16px 16px",
            backgroundColor: "transparent",
          },
          data: { text: "Visit Us", level: 2 },
        },
        {
          id: "visit-info",
          type: "text",
          settings: {
            fontSize: "16px",
            color: "#8b7355",
            textAlign: "center",
            padding: "0 24px 24px",
            backgroundColor: "transparent",
            lineHeight: "1.8",
          },
          data: {
            text: "123 Main Street, Downtown\nOpen Tue–Sun, 5pm–10pm\nReservations: (555) 123-4567",
          },
        },
        {
          id: "reserve-button",
          type: "button",
          settings: {
            fontSize: "16px",
            color: "#faf7f2",
            textAlign: "center",
            padding: "14px 36px",
            backgroundColor: "#3c2415",
            borderRadius: "4px",
          },
          data: { label: "Reserve a Table", href: "#", target: "_self" },
        },
        {
          id: "restaurant-footer",
          type: "text",
          settings: {
            fontSize: "14px",
            color: "#b8a88a",
            textAlign: "center",
            padding: "48px 16px 24px",
            backgroundColor: "transparent",
          },
          data: { text: "© 2026 The Golden Pear" },
        },
      ],
    },
  ],
};

export const TEMPLATES: Template[] = [portfolio, eventLaunch, restaurant];
