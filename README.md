# Concept Explorer - Revisiting the Known

A web application designed to explore various concepts, including political ideologies, philosophical movements, and more. The project aims to provide an interactive way for users to learn about different ideas, their positive and negative aspects, historical contexts, and related concepts.

## Features

- **Rich Concept Library**: 
  - Extensive collection of concepts from politics, philosophy, spirituality, and more
  - Detailed information about each concept's aspects and applications
  - Historical context and modern relevance

- **Multi-faceted Exploration**: 
  - Category and tag-based browsing
  - Chronological or alphabetical sorting
  - Full-text search with suggestions
  - Collapsible category groups

- **Interactive Cards**: 
  - Expandable concept cards with detailed information
  - Color-coded sections for different aspects
  - Related concepts navigation
  - Historical context and modern applications

- **Interactive Games**:
  - "Guess the Concept" game for testing knowledge
  - Intelligent concept censoring in questions
  - Score tracking and hints system
  - More game modes coming soon

- **Responsive Design**: 
  - Optimized for both desktop and mobile
  - Efficient use of screen space
  - Smooth transitions and animations
  - Consistent navigation header

## Technologies Used

- **Frontend**: Svelte 5 with TypeScript
- **Styling**: TailwindCSS for responsive design
- **Icons**: Lucide Svelte for interactive features
- **State Management**: Native Svelte stores

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/revisiting-the-known.git
   cd revisiting-the-known
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open your browser and visit `http://localhost:5173` to explore the concepts.

## Usage

- **Browse Concepts**: Navigate through categories or use the search function
- **Play Games**: Test your knowledge with interactive concept games
- **Explore Details**: Click on concept cards to view comprehensive information
- **Filter Content**: Use tags and categories to focus on specific areas
- **Sort Options**: Choose between chronological or alphabetical ordering
- **Related Concepts**: Follow concept connections to discover related ideas

## Project Structure

```
src/
├── lib/
│   ├── components/    # Reusable UI components
│   ├── stores/        # State management
│   └── types/         # TypeScript definitions
├── routes/           # SvelteKit routes
│   ├── about/        # About page
│   ├── games/        # Games section
│   └── +page.svelte  # Main concept explorer
└── app.css          # Global styles
```

## Contributing

Contributions are welcome! Whether it's adding new concepts, improving the UI, or fixing bugs.

### How to contribute

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Submit a pull request

### Areas for Contribution

- Adding new concepts
- Creating new game modes
- Improving concept descriptions
- Enhancing UI/UX
- Adding new features
- Fixing bugs
- Improving documentation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
