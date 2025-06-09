
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  onOpenCreateModal: () => void;
  onNavigateHome: () => void;
  showHomeButton: boolean;
  currentUser: User | null;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onOpenCreateModal, 
  onNavigateHome, 
  showHomeButton,
  currentUser,
  onSignOut
}) => {
  return (
    <header className="navbar bg-base-300 shadow-lg px-4 sticky top-0 z-50">
      <div className="navbar-start">
        {showHomeButton && (
          <button onClick={onNavigateHome} className="btn btn-ghost text-xl normal-case" aria-label="Go to Home Page">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
            </svg>
            Home
          </button>
        )}
         <div 
            className={`btn btn-ghost text-2xl normal-case ${showHomeButton ? 'ml-2' : ''} text-primary hover:opacity-80 transition-opacity duration-150`}
            onClick={showHomeButton ? onNavigateHome : undefined} // Make clickable if not on home
            style={{ cursor: showHomeButton ? 'pointer' : 'default' }}
            role="banner"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Innovotes.com
        </div>
      </div>
      <div className="navbar-end space-x-3">
        {currentUser && (
            <button
            onClick={onOpenCreateModal}
            className="btn btn-accent"
            title="Create a new proposal"
            aria-label="Create New Proposal"
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Proposal
            </button>
        )}

        {currentUser ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar" role="button" aria-haspopup="true" aria-expanded="false" aria-label="User menu">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                {currentUser.picture ? (
                  <img src={currentUser.picture} alt={currentUser.name ? `${currentUser.name}'s profile picture` : 'User profile picture'} />
                ) : (
                  <span className="text-xl align-middle">{(currentUser.name || currentUser.email || 'U').charAt(0).toUpperCase()}</span>
                )}
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-56">
              <li className="menu-title px-4 py-2">
                <span className="font-semibold truncate block">{currentUser.name || 'User'}</span>
                <span className="text-xs opacity-70 truncate block">{currentUser.email}</span>
              </li>
              <li><div className="divider my-0"></div></li>
              <li><button onClick={onSignOut} className="text-error">Sign Out</button></li>
            </ul>
          </div>
        ) : (
          // This div will be used by Google Identity Services to render the Sign-In button
          <div id="googleSignInButtonContainer">
            {/* Google's library will render the button here. You can add a placeholder. */}
            {/* The placeholder button is useful if GIS fails to load or is slow */}
            <button className="btn btn-primary" aria-label="Sign in with Google">Sign in with Google</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
