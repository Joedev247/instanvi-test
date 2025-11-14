# Setup Instructions

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Build for production:
```bash
npm run build
```

## Features

- **Geographic Map**: Click on the map to set a geographic location and add markers
- **Floor Plan Editor**: After setting a geographic location, click on the floor plan to add spatial markers
- **State Persistence**: All data is automatically saved to localStorage
- **Dynamic Markers**: Markers are rendered dynamically based on application state
- **View Controls**: Switch between map only, floor plan only, or both views
- **Marker Management**: Edit, delete, and manage markers through the sidebar

## Usage

1. **Set Geographic Location**: Click anywhere on the geographic map to set the primary location
2. **Add Floor Plan Markers**: Once a geographic location is set, click on the floor plan to add spatial markers
3. **Manage Markers**: Use the sidebar to view, edit, and delete markers
4. **View Switching**: Use the header buttons to switch between different view modes

## Technical Stack

- React 18+ with TypeScript
- Leaflet.js for geographic mapping
- React Context API for state management
- localStorage for persistence
- Vite for build tooling

