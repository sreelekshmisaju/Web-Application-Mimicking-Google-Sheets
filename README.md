# Google Sheets Clone

A powerful spreadsheet application built with modern web technologies, offering features like formula evaluation, cell dependencies, and real-time updates.

## Tech Stack

### Core Technologies

- **React (v19)**: Chosen for its efficient virtual DOM, component-based architecture, and robust ecosystem. The latest version brings improved performance and concurrent rendering capabilities.

- **TypeScript**: Ensures type safety and better developer experience. Particularly valuable for managing complex spreadsheet operations and data structures.

- **Vite**: Selected as the build tool for its exceptional development experience with instant server start and lightning-fast HMR (Hot Module Replacement).

### State Management

- **Redux Toolkit**: Manages the application's global state, particularly useful for:
  - Tracking cell values and formulas
  - Managing selected cells and ranges
  - Handling undo/redo operations
  - Maintaining consistent state across components

### UI Components

- **Material-UI (v6)**: Provides a comprehensive set of pre-built components that follow Material Design principles, ensuring a professional and consistent user interface.

## Data Structures

### Spreadsheet State

```typescript
interface SpreadsheetState {
  cells: Record<string, Cell>;
  selectedCell: string | null;
  selectedRange: string[] | null;
}
```

- Uses a hash map structure for O(1) cell access
- Cells are indexed by their coordinates (e.g., "A1", "B2")
- Supports efficient updates and lookups

### Cell Structure

```typescript
interface Cell {
  value: string;
  formula: string;
  dependencies: string[];
  format: CellFormat;
}
```

- Separates display value from formula
- Tracks cell dependencies for formula evaluation
- Stores formatting information independently

### Dependency Management

Implements a directed graph structure to:
- Track cell dependencies
- Detect circular references
- Efficiently update dependent cells

### Formula Evaluation

Utilizes a recursive descent parser to:
- Parse and evaluate formulas
- Handle cell references
- Support mathematical operations
- Manage error conditions

## Project Structure

```
src/
├── components/      # React components
├── store/          # Redux store and slices
├── types/          # TypeScript type definitions
└── utils/          # Helper functions and utilities
    ├── cellDependencyManager.ts
    ├── formulaParser.ts
    └── spreadsheetFunctions.ts
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ESLint Configuration

The project uses a comprehensive ESLint setup with:
- Type-aware lint rules
- React-specific plugins
- Strict TypeScript checks

For detailed configuration, see `eslint.config.js`.
# Web-Application-Mimicking-Google-Sheets
