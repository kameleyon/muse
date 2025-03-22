# MagicMuse.io Component Style Guide

This guide provides practical instructions for implementing the MagicMuse.io brand identity across UI components. It serves as a reference for designers and developers to ensure consistency throughout the application.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Typography Implementation](#typography-implementation)
3. [Color System](#color-system)
4. [Button Components](#button-components)
5. [Form Elements](#form-elements)
6. [Card Components](#card-components)
7. [Navigation Components](#navigation-components)
8. [Modal Components](#modal-components)
9. [Data Visualization](#data-visualization)
10. [Loading States](#loading-states)
11. [Dark Mode Implementation](#dark-mode-implementation)
12. [Responsive Design](#responsive-design)
13. [Accessibility Considerations](#accessibility-considerations)

## Getting Started

### Including the Brand Styles

To implement the MagicMuse.io brand identity, include the brand CSS file in your project:

```html
<link rel="stylesheet" href="/src/styles/brand.css">
```

For React applications, import the styles in your main entry file:

```jsx
import '/src/styles/brand.css';
```

### Basic Page Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MagicMuse.io</title>
  <link rel="stylesheet" href="/src/styles/brand.css">
  <link rel="icon" href="/public/favicon.ico.png">
</head>
<body>
  <header class="site-header">
    <img src="/public/mmiologo.png" alt="MagicMuse.io" class="logo">
    <!-- Navigation goes here -->
  </header>
  
  <main>
    <!-- Page content goes here -->
  </main>
  
  <footer class="site-footer">
    <!-- Footer content goes here -->
  </footer>
</body>
</html>
```

## Typography Implementation

### Heading Examples

```html
<h1>Primary Heading</h1>
<h2>Secondary Heading</h2>
<h3>Tertiary Heading</h3>
<h4>Fourth Level Heading</h4>
<h5>Fifth Level Heading</h5>
<h6>Sixth Level Heading</h6>
```

#### React Component Implementation

```jsx
const Heading = ({ level = 1, children, className = '', ...props }) => {
  const Tag = `h${level}`;
  return <Tag className={className} {...props}>{children}</Tag>;
};

// Usage
<Heading level={1}>Primary Heading</Heading>
<Heading level={2}>Secondary Heading</Heading>
```

### Body Text Examples

```html
<p>Standard paragraph text using Nunito Sans. This text should be used for the majority of content throughout the application.</p>

<p class="text-secondary">Secondary text with muted appearance.</p>

<small>Smaller text for captions and secondary information.</small>

<p class="caption">Caption text for images and supplementary content.</p>
```

#### Text Color Utilities

```html
<p class="text-primary">Primary text color</p>
<p class="text-secondary">Secondary text color</p>
<p class="text-accent">Accent text color (teal)</p>
<p class="text-gold">Gold accent text</p>
<p class="text-light">Light text (for dark backgrounds)</p>
<p class="text-success">Success message text</p>
<p class="text-alert">Alert message text</p>
```

## Color System

### Background Color Implementation

```html
<div class="bg-off-white">Off-white background</div>
<div class="bg-light-grey">Light grey background</div>
<div class="bg-navy">Navy background with light text</div>
<div class="bg-deep-grey">Deep grey background with light text</div>
<div class="bg-gold">Gold accent background</div>
<div class="bg-teal">Teal accent background</div>
<div class="bg-purple">Purple accent background</div>
```

### Color Combinations

For optimal readability, use these text and background combinations:

| Background | Text Color | Usage |
|------------|------------|-------|
| Off-white | Navy | Primary content |
| Light grey | Navy | Secondary content areas |
| Navy | Off-white | Dark sections, headers |
| Deep grey | Off-white | Dark mode backgrounds |
| Gold | Navy | Highlighted content, CTAs |
| Teal | Off-white | Secondary CTAs, accents |

## Button Components

### Basic Button Styles

```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-tertiary">Tertiary Button</button>
<button class="btn btn-tertiary gold">Gold Tertiary Button</button>
```

### Button Sizes

```html
<button class="btn btn-primary btn-sm">Small Button</button>
<button class="btn btn-primary">Default Button</button>
<button class="btn btn-primary btn-lg">Large Button</button>
```

### Button States

```html
<button class="btn btn-primary">Default State</button>
<button class="btn btn-primary" disabled>Disabled State</button>
<button class="btn btn-primary active">Active State</button>
```

### Button with Icon

```html
<button class="btn btn-primary">
  <span class="btn-icon">
    <svg><!-- Icon SVG --></svg>
  </span>
  Button with Icon
</button>
```

### React Button Component

```jsx
const Button = ({
  variant = 'primary',
  size = 'default',
  children,
  className = '',
  ...props
}) => {
  const buttonClasses = `btn btn-${variant} ${size !== 'default' ? `btn-${size}` : ''} ${className}`;
  
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

// Usage
<Button variant="primary">Primary Button</Button>
<Button variant="secondary" size="sm">Small Secondary</Button>
<Button variant="tertiary" disabled>Disabled Tertiary</Button>
```

## Form Elements

### Text Input

```html
<div class="form-group">
  <label for="exampleInput" class="form-label">Input Label</label>
  <input type="text" class="form-control" id="exampleInput" placeholder="Placeholder text">
  <span class="form-text">Helper text provides additional guidance.</span>
</div>
```

### Textarea

```html
<div class="form-group">
  <label for="exampleTextarea" class="form-label">Text Area Label</label>
  <textarea class="form-control" id="exampleTextarea" rows="4"></textarea>
</div>
```

### Checkbox and Radio

```html
<div class="form-check">
  <input class="form-check-input" type="checkbox" id="exampleCheck">
  <label class="form-check-label" for="exampleCheck">Checkbox Label</label>
</div>

<div class="form-check">
  <input class="form-check-input" type="radio" name="exampleRadio" id="exampleRadio1">
  <label class="form-check-label" for="exampleRadio1">Radio Option 1</label>
</div>
```

### Select Input

```html
<div class="form-group">
  <label for="exampleSelect" class="form-label">Select Label</label>
  <select class="form-control" id="exampleSelect">
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
  </select>
</div>
```

### Input Validation States

```html
<div class="form-group">
  <label for="validInput" class="form-label">Valid Input</label>
  <input type="text" class="form-control is-valid" id="validInput">
  <span class="form-text text-success">Success message</span>
</div>

<div class="form-group">
  <label for="invalidInput" class="form-label">Invalid Input</label>
  <input type="text" class="form-control is-invalid" id="invalidInput">
  <span class="form-text text-alert">Error message</span>
</div>
```

## Card Components

### Basic Card

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
    <p class="card-subtitle">Card subtitle</p>
  </div>
  <div class="card-body">
    <p>Card content goes here. This can include text, images, and other components.</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

### Content Card

```html
<div class="card">
  <img src="example-image.jpg" alt="Card image" class="card-img-top">
  <div class="card-body">
    <h4 class="card-title">Content Title</h4>
    <p>Card description text providing context about the content.</p>
    <div class="d-flex justify-content-between">
      <span class="text-secondary">Category</span>
      <span class="text-secondary">Date</span>
    </div>
  </div>
</div>
```

### Feature Card

```html
<div class="card text-center">
  <div class="card-body">
    <div class="feature-icon mb-md">
      <svg><!-- Icon SVG --></svg>
    </div>
    <h4 class="card-title">Feature Name</h4>
    <p>Description of the feature and its benefits.</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-tertiary">Learn More</button>
  </div>
</div>
```

## Navigation Components

### Main Navigation

```html
<nav class="main-nav">
  <ul class="nav-list">
    <li class="nav-item"><a href="#" class="nav-link active">Home</a></li>
    <li class="nav-item"><a href="#" class="nav-link">Features</a></li>
    <li class="nav-item"><a href="#" class="nav-link">Pricing</a></li>
    <li class="nav-item"><a href="#" class="nav-link">About</a></li>
  </ul>
</nav>
```

### Tab Navigation

```html
<div class="tabs">
  <div class="tab-list" role="tablist">
    <button class="tab active" role="tab" aria-selected="true">Tab 1</button>
    <button class="tab" role="tab" aria-selected="false">Tab 2</button>
    <button class="tab" role="tab" aria-selected="false">Tab 3</button>
  </div>
  
  <div class="tab-panels">
    <div class="tab-panel active" role="tabpanel">
      Content for Tab 1
    </div>
    <div class="tab-panel" role="tabpanel" hidden>
      Content for Tab 2
    </div>
    <div class="tab-panel" role="tabpanel" hidden>
      Content for Tab 3
    </div>
  </div>
</div>
```

### Breadcrumb Navigation

```html
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="#">Home</a></li>
    <li class="breadcrumb-item"><a href="#">Library</a></li>
    <li class="breadcrumb-item active" aria-current="page">Current Page</li>
  </ol>
</nav>
```

## Modal Components

### Basic Modal

```html
<div class="modal-backdrop"></div>
<div class="modal" role="dialog" aria-modal="true">
  <div class="modal-content">
    <div class="modal-header">
      <h4 class="modal-title">Modal Title</h4>
      <button class="modal-close" aria-label="Close modal">&times;</button>
    </div>
    <div class="modal-body">
      <p>Modal content goes here.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-tertiary">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Alert Modal

```html
<div class="modal-backdrop"></div>
<div class="modal" role="alertdialog" aria-modal="true">
  <div class="modal-content">
    <div class="modal-header bg-alert">
      <h4 class="modal-title text-light">Warning</h4>
      <button class="modal-close" aria-label="Close modal">&times;</button>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to proceed?</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-tertiary">Cancel</button>
      <button class="btn btn-alert">Delete</button>
    </div>
  </div>
</div>
```

## Data Visualization

### Charts and Graphs

When implementing charts and graphs, use the brand color palette in this preferred sequence:

1. Primary Series: Gold (#F2B705)
2. Secondary Series: Teal (#00A6A6)
3. Tertiary Series: Purple (#5F4BB6)
4. Additional Series: Navy (#2D3142), Medium Grey (#9195A1)

```jsx
// Example React component using Recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BrandedBarChart = ({ data }) => (
  <BarChart width={600} height={400} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="value1" fill="#F2B705" name="Primary Metric" />
    <Bar dataKey="value2" fill="#00A6A6" name="Secondary Metric" />
    <Bar dataKey="value3" fill="#5F4BB6" name="Tertiary Metric" />
  </BarChart>
);
```

### Data Tables

```html
<table class="data-table">
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
      <th>Header 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data Cell 1</td>
      <td>Data Cell 2</td>
      <td>Data Cell 3</td>
    </tr>
    <tr>
      <td>Data Cell 4</td>
      <td>Data Cell 5</td>
      <td>Data Cell 6</td>
    </tr>
  </tbody>
</table>
```

## Loading States

### Spinner

```html
<div class="spinner" aria-label="Loading">
  <div class="spinner-circle"></div>
</div>
```

### Progress Bar

```html
<div class="progress" aria-label="Loading 70% complete">
  <div class="progress-bar" style="width: 70%"></div>
</div>
```

### Skeleton Loader

```html
<div class="skeleton-loader">
  <div class="skeleton-header"></div>
  <div class="skeleton-text"></div>
  <div class="skeleton-text"></div>
  <div class="skeleton-text"></div>
</div>
```

## Dark Mode Implementation

The brand.css file includes a `.dark-mode` class that can be applied to the `<body>` or any container element to enable dark mode styling.

### Toggling Dark Mode

```html
<button id="darkModeToggle" class="btn btn-tertiary">
  <span class="light-mode-visible">Switch to Dark Mode</span>
  <span class="dark-mode-visible">Switch to Light Mode</span>
</button>

<script>
  document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
</script>
```

### React Dark Mode Implementation

```jsx
import { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);
  
  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);

// Usage in a component
const DarkModeToggle = () => {
  const { isDarkMode, setIsDarkMode } = useDarkMode();
  
  return (
    <button 
      className="btn btn-tertiary"
      onClick={() => setIsDarkMode(!isDarkMode)}
    >
      {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  );
};
```

## Responsive Design

The brand.css file includes responsive adjustments for different screen sizes. Key breakpoints are:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Responsive Component Example

```html
<div class="responsive-container">
  <div class="content-card">
    <h3 class="card-title">Responsive Card</h3>
    <p>This card adjusts its layout based on screen size.</p>
  </div>
</div>
```

```css
/* Additional CSS for responsive components */
.responsive-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

@media (min-width: 768px) {
  .responsive-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .responsive-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Accessibility Considerations

### Color Contrast

All text and UI elements must maintain sufficient color contrast:
- Normal text: 4.5:1 contrast ratio
- Large text (18pt+): 3:1 contrast ratio
- UI components and graphical objects: 3:1 contrast ratio

### Focus States

All interactive elements must have visible focus states:

```css
.btn:focus, .form-control:focus, .nav-link:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 166, 166, 0.4);
}
```

### Screen Reader Support

Include appropriate ARIA attributes for screen reader users:

```html
<button aria-label="Close dialog" class="close-btn">
  <svg><!-- Icon SVG --></svg>
</button>

<div role="alert" aria-live="assertive" class="notification">
  Form submitted successfully!
</div>
```

### Keyboard Navigation

Ensure all interactive elements are accessible via keyboard:

```jsx
// React example of keyboard navigation
const KeyboardNavigableMenu = () => {
  const handleKeyDown = (e, index, items) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % items.length;
      items[nextIndex].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + items.length) % items.length;
      items[prevIndex].focus();
    }
  };
  
  return (
    <ul role="menu">
      {menuItems.map((item, index) => (
        <li key={index} role="menuitem">
          <button 
            onKeyDown={(e) => handleKeyDown(e, index, menuItems)}
            tabIndex={0}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
};
```

## Best Practices Summary

1. **Consistency**: Use the provided components and styles consistently throughout the application.

2. **Simplicity**: Maintain clean, minimal designs that emphasize content.

3. **Typography Hierarchy**: Respect the typographic scale and use appropriate heading levels.

4. **Color Usage**: Apply the brand colors purposefully, following the recommended combinations.

5. **Accessibility**: Always consider accessibility in design and implementation decisions.

6. **Responsive Design**: Design for mobile first, then enhance for larger screens.

7. **Animation Restraint**: Use animations sparingly and purposefully.

8. **Brand Voice**: Maintain consistent tone in all text content following the brand guidelines.

9. **Performance**: Optimize images and components for performance.

10. **Documentation**: Document any custom components following this style guide's format.
