# Garage Sale - Project Wiki

Welcome to the **Garage Sale** project wiki! This documentation provides comprehensive information about the project's architecture, setup, development, and deployment.

## 📋 Overview

Garage Sale is a modern, static web application built with React, TypeScript, and Vite for displaying and browsing garage sale items. The application features:

- **Time-based activation** - Automatically shows/hides content based on configured sale window
- **Client-side filtering** - Filter by status, condition, and category
- **Advanced sorting** - Sort by price or name
- **Responsive design** - Works seamlessly on desktop, tablet, and mobile
- **Modal item details** - Rich detail view with image carousel and browser history integration
- **Accessibility-first** - WCAG compliant with keyboard navigation and ARIA attributes
- **Image optimization** - Optional build-time image variants using Sharp

## 🚀 Quick Links

### Getting Started
- **[Setup Guide](./Setup.md)** - Installation and configuration instructions
- **[Development Guide](./Development-Guide.md)** - Development workflows and best practices
- **[Deployment](./Deployment.md)** - Deployment options and Firebase hosting setup

### Architecture & Design
- **[Architecture Overview](./Architecture.md)** - System architecture and technology stack
- **[Component Diagram](./Component-Diagram.md)** - React component hierarchy and relationships
- **[Database Schema](./Database-Schema.md)** - Data model and item structure (ERM)
- **[Sequence Diagrams](./Sequence-Diagrams.md)** - User interaction flows

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 (functional components with hooks)
- **Type Safety**: TypeScript 5.2+
- **Build Tool**: Vite 5
- **Styling**: CSS3 with responsive grid layout
- **Image Carousel**: Embla Carousel
- **Testing**: Vitest + React Testing Library + jest-axe
- **Deployment**: Firebase Hosting (static site)

## 📊 Project Status

- **Version**: 1.0.0
- **Status**: Active Development
- **Sale Window**: November 15, 2025 - January 6, 2026
- **License**: Personal/Educational Use

## 📁 Repository Structure

```
Garage-Sale/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── data/              # Item data (CSV & generated TS)
│   ├── App.tsx            # Main application
│   ├── types.ts           # TypeScript definitions
│   └── constants.ts       # Configuration constants
├── public/                # Static assets
├── scripts/               # Build and data seeding scripts
├── tests/                 # Test suites
├── wiki/                  # Project documentation (you are here!)
└── dist/                  # Production build output
```

## 🤝 Contributing

This is a personal garage sale project. For suggestions or improvements, please open an issue on GitHub.

## 📞 Support

For questions or issues, please refer to the documentation pages linked above or open an issue on the GitHub repository.

---

**Last Updated**: November 2025
