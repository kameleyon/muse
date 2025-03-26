# MagicMuse Independent Feature Implementation Plan

This document outlines the plan for implementing independent features for the MagicMuse application, including initial theme alignment and cleanup steps.

## Phase 1: Theme Alignment & Cleanup

This phase focuses on ensuring the markdown rendering utilities align with the application's theme and removing irrelevant code.

1.  **Configure Tailwind Typography:**
    *   Install the `@tailwindcss/typography` plugin if not already present.
    *   Update `tailwind.config.js` to extend the `typography` theme settings. Customize `prose` styles (headings, links, body text, blockquotes, code blocks) to use the project's defined colors (primary terracotta `#ae5630`, neutrals like `#faf9f5`, `#edeae2`) and fonts (Comfortaa, Questrial, Montserrat, Nunito Sans).
2.  **Refactor Markdown Utilities (`src/lib`):**
    *   Review `markdownCleaner.ts`. Keep useful cleaning functions (`cleanMarkdown`, potentially parts of `processArticleContent` if applicable).
    *   **Remove** the placeholder `markdownToHtml` function and any associated irrelevant code/imports (like `linkableTerms`, AfroWiki comments, hardcoded `text-white` styles).
    *   Ensure `markdown.tsx` relies solely on the themed `prose` styles applied via its `className` for rendering.
    *   Consider replacing `htmlToMarkdown.ts` with a more robust library like `turndown` if complex HTML-to-Markdown conversion is anticipated in the future.

## Phase 2: Independent Feature Implementation Strategy

This phase outlines the architectural approach for implementing the 10 identified independent features.

### High-Level Flow

```mermaid
graph TD
    A[Start: Independent Features] --> B{Rich Text Editor};
    A --> C{Dashboard Components};
    A --> D{Authentication System};
    A --> E{Subscription Management};
    A --> F{Analytics Visualization};
    A --> G{Knowledge Base};
    A --> H{Mobile Interface Adaptations};
    A --> I{Export & Format Conversion};
    A --> J{Accessibility Features};
    A --> K{3rd-Party Connectors};

    subgraph "UI/UX Features"
        B --> B1[Integrate Library (e.g., TipTap)];
        B1 --> B2[Style with Theme];
        C --> C1[Create Components in src/components/dashboard];
        C1 --> C2[Define Data Interfaces];
        F --> F1[Create Components in src/features/analytics];
        F1 --> F2[Choose Charting Library (e.g., Recharts)];
        F2 --> F3[Style with Theme];
        H --> H1[Apply Responsive Design (Tailwind Modifiers)];
        J --> J1[Follow WCAG Guidelines];
        J1 --> J2[Use Semantic HTML/ARIA];
    end

    subgraph "Core Systems & Modules"
        D --> D1[Create Module in src/features/auth];
        D1 --> D2[Define API Endpoints/Client Logic];
        D2 --> D3[Build UI Components];
        E --> E1[Create Module in src/features/billing];
        E1 --> E2[Integrate Payment Provider API (e.g., Stripe)];
        E2 --> E3[Build UI Components];
        G --> G1[Structure in src/pages/kb or Separate Service];
        G1 --> G2[Define Content Source (Markdown/API)];
    end

    subgraph "Utilities & Integrations"
        I --> I1[Create Utilities in src/utils/export];
        I1 --> I2[Identify Libraries (e.g., jsPDF)];
        K --> K1[Create Modules in src/services/integrations];
        K1 --> K2[Define Interfaces per Service];
    end

    subgraph "Cross-Cutting Concerns"
       H1 --> X[Apply Throughout Component Dev];
       J2 --> X;
    end

    B2 --> Z[Implementation in Code Mode];
    C2 --> Z;
    D3 --> Z;
    E3 --> Z;
    F3 --> Z;
    G2 --> Z;
    X --> Z;
    I2 --> Z;
    K2 --> Z;
```

### Detailed Strategy per Feature

1.  **Rich Text Editor:** Integrate a suitable library (e.g., TipTap, Slate) within `src/features/editor/`. Style it using Tailwind to match the theme. Manage state locally or via global state management (e.g., Redux, Zustand) as appropriate.
2.  **Dashboard Components:** Develop reusable components within `src/components/dashboard/`. Define clear `props` for data interfaces. Use Tailwind CSS for styling, ensuring consistency with `tailwind.config.js`. Create new CSS files (inspired by `dashboard.css` if applicable) only for complex styles not achievable with utilities.
3.  **Authentication System:** Create a dedicated module `src/features/auth/`. Implement components for Login, Signup, Password Reset, etc. Define functions in `src/services/auth.ts` to handle API calls. Ensure secure handling of tokens/sessions.
4.  **Subscription Management:** Create a module `src/features/billing/`. Integrate with a payment provider's API (e.g., Stripe) via services in `src/services/billing.ts`. Build UI components for plan selection, payment methods, and invoice history.
5.  **Analytics Visualization:** Create components in `src/features/analytics/`. Use a charting library (e.g., Recharts, Chart.js) and configure it to use the application's theme colors and fonts. Define data structures expected by the components.
6.  **Knowledge Base:** Determine if this will be integrated within the main app (e.g., `src/pages/kb/`, rendering markdown files) or a separate deployment. If integrated, leverage the themed markdown rendering established in Phase 1.
7.  **Mobile Interface Adaptations:** This is an ongoing effort. Ensure all new and existing components are built with responsiveness in mind using Tailwind's responsive modifiers (`sm:`, `md:`, `lg:`). Test thoroughly on various screen sizes.
8.  **Export & Format Conversion Tools:** Develop utility functions, likely within `src/utils/export/`. Use libraries like `jsPDF` for PDF, `turndown` (or similar) for Markdown, potentially `mammoth.js` for DOCX import/export if needed. Create UI elements (buttons, menus) to trigger these functions.
9.  **Accessibility Features:** Integrate accessibility best practices (WCAG) throughout development. Use semantic HTML, provide ARIA attributes where necessary, ensure keyboard navigability, sufficient color contrast (check against theme colors), and test with screen readers. Use linting tools (`eslint-plugin-jsx-a11y`).
10. **Third-Party Service Connectors:** Create modules under `src/services/integrations/` for each service (e.g., `wordpress.ts`, `dropbox.ts`). Implement logic to handle authentication (OAuth, API keys) and data exchange. Securely manage credentials.