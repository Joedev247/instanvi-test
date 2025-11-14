# Instanvi Task - Dynamic Visualization Application

## Project Overview

This project implements a dynamic visualization application that displays markers on both a geographic map and a spatial floor plan, with complete state persistence using browser localStorage.

## Documentation

This project follows a documentation-first approach. All required documentation has been prepared before implementation:

1. **[Architectural Design Document](./ARCHITECTURAL_DESIGN_DOCUMENT.md)**
   - Primary architectural pattern (Component-Based Architecture with Flux/Redux pattern)
   - Component hierarchy and data flow diagrams
   - Complete TypeScript state structure definitions
   - Technical rationale for Leaflet.js mapping library selection

2. **[Project Plan and Milestones](./PROJECT_PLAN_AND_MILESTONES.md)**
   - 6 sequential project milestones
   - Detailed time allocation (24-30 hours total)
   - Risk assessment and mitigation strategies
   - Success criteria for each milestone

3. **[Coding Standards and Conventions](./CODING_STANDARDS_AND_CONVENTIONS.md)**
   - Comprehensive naming conventions (components, hooks, functions, variables)
   - State mutation policy (strict immutability)
   - Code-behind logic separation guidelines
   - File structure, formatting, and code quality standards

## Key Features

- **Dynamic Visualization:** Markers rendered dynamically based on application state for both geographic map and spatial floor plan
- **State Persistence:** Complete state persistence using browser localStorage API
- **Modern Tech Stack:** React 18+ with TypeScript, Leaflet.js, and Vite
- **Professional Architecture:** Component-based architecture with Flux-inspired state management

## Technology Stack

- **Framework:** React 18+ with TypeScript
- **State Management:** React Context API + useReducer
- **Mapping Library:** Leaflet.js + react-leaflet
- **Build Tool:** Vite
- **Styling:** CSS Modules / Tailwind CSS
- **Testing:** Vitest + React Testing Library
- **Code Quality:** ESLint + Prettier

## Project Status

📋 **Documentation Phase:** ✅ Complete  
✅ **Implementation Phase:** ✅ Complete

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## How to Use

1. **Set Geographic Location**: Click anywhere on the geographic map to set the primary location
2. **Add Geographic Markers**: Each click on the map adds a marker at that location
3. **Enable Floor Plan**: Once a geographic location is set, the floor plan editor becomes active
4. **Add Floor Plan Markers**: Click on the floor plan to add spatial markers (pixel coordinates)
5. **Manage Markers**: Use the sidebar to view, edit, and delete markers
6. **View Controls**: Use header buttons to switch between map only, floor plan only, or both views

## Features Implemented

✅ **Dual Coordinate Management**
- Single Geographic Location (Latitude/Longitude) from interactive map
- Array of Spatial Features (Pixel X/Y coordinates) on floor plan

✅ **Geographic Map Interaction**
- Interactive Leaflet map component
- Click to set geographic location
- Dynamic marker rendering

✅ **Spatial Editor**
- Static floor plan image (SVG placeholder)
- Enabled only after geographic location is set
- Click to capture pixel coordinates
- Multiple markers support

✅ **Dynamic Visualization**
- Markers rendered dynamically based on state
- Works for both geographic map and floor plan

✅ **Persistence**
- Complete state persistence using localStorage API
- Auto-save on state changes (300ms debounce)
- Automatic state restoration on page load

## Project Structure

```
src/
├── components/          # React components
│   ├── layout/         # Layout components
│   ├── map/            # Geographic map components
│   ├── floor-plan/     # Floor plan components
│   └── sidebar/        # Sidebar UI components
├── context/            # React Context (State management)
├── hooks/              # Custom React hooks
├── services/           # Business logic services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

**Project for:** Instanvi  
**Website:** www.instanvi.com

