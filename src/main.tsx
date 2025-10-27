import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import SelectFieldDemo from './pages/SelectFieldDemo'
import DesignSandboxPage from './pages/DesignSandboxPage'
import PageSwitcher from './components/PageSwitcher'
import './index.css'

function Root() {
  const [currentPage, setCurrentPage] = useState<'app' | 'design-sandbox' | 'select-field-demo'>('app');

  const renderPage = () => {
    switch (currentPage) {
      case 'app':
        return <App />;
      case 'design-sandbox':
        return <DesignSandboxPage />;
      case 'select-field-demo':
        return <SelectFieldDemo />;
      default:
        return <App />;
    }
  };

  return (
    <>
      {renderPage()}
      <PageSwitcher currentPage={currentPage} onPageChange={setCurrentPage} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
