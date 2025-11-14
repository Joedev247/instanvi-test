import React from 'react';
import { StateProvider } from '@/context/StateContext';
import { Layout } from '@/components/layout/Layout';
import './App.css';

/**
 * Root App Component
 */
const App: React.FC = () => {
  return (
    <StateProvider>
      <Layout />
    </StateProvider>
  );
};

export default App;

