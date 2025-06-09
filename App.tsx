
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Proposal, VoteOption, NewProposalData, AlertMessage, AlertType, BillClause, User, DecodedGoogleToken } from './types';
import { fetchProposalsFromSheet } from './services/googleSheetService';
import Header from './components/Header';
import ProposalList from './components/ProposalList';
import CreateProposalModal from './components/CreateProposalModal';
import LoadingSpinner from './components/LoadingSpinner';
import AlertDisplay from './components/AlertDisplay';
import HeroPage from './components/HeroPage';
import { GOOGLE_SHEET_ID, GOOGLE_CLIENT_ID } from './constants';
import { jwtDecode } from 'jwt-decode'; // For decoding the ID token (optional, for user info)

// Placeholder for a service that would interact with your backend
const apiService = {
  // This function would send the token to your backend for verification and session creation
  verifyTokenWithBackend: async (idToken: string): Promise<User | null> => {
    console.log("Sending token to backend for verification (simulated):", idToken.substring(0,30) + "...");
    // Simulate backend call
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      const decodedToken: DecodedGoogleToken = jwtDecode(idToken);
      // In a real app, backend confirms token validity and returns user details
      return {
        id: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        picture: decodedToken.picture,
        idToken: idToken, // Store the original token
      };
    } catch (error) {
      console.error("Failed to decode token (simulated frontend decode):", error);
      return null;
    }
  },
  // This function would send the vote to your backend
  submitVoteToBackend: async (proposalId: string, vote: VoteOption, idToken: string): Promise<boolean> => {
    console.log(`Submitting vote to backend (simulated): ${proposalId}, ${vote} with token ${idToken.substring(0,30)}...`);
    // Simulate backend call
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate success/failure (e.g., return true for success)
    // In a real app, backend would write to Google Sheet and confirm.
    if (Math.random() > 0.1) return true; // 90% success rate for simulation
    return false;
  }
};


const App: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const [currentPage, setCurrentPage] = useState<'hero' | 'proposals'>('hero');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const googleSignInInitialized = useRef(false);

  const addAlert = useCallback((message: string, type: AlertType) => {
    const newAlert = { id: crypto.randomUUID(), message, type };
    setAlerts(prevAlerts => [newAlert, ...prevAlerts.slice(0, 4)]);
    setTimeout(() => {
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== newAlert.id));
    }, 7000);
  }, []);

  const handleGoogleSignIn = useCallback(async (response: any /* google.accounts.id.CredentialResponse */) => {
    addAlert("Processing Google Sign-In...", AlertType.INFO);
    const idToken = response.credential;
    if (!idToken) {
        addAlert("Google Sign-In failed: No ID token received.", AlertType.ERROR);
        return;
    }

    // In a real app, you'd send this token to your backend for verification
    // and to create a session or get a user object.
    // For now, we'll simulate this.
    try {
      const user = await apiService.verifyTokenWithBackend(idToken);
      if (user) {
        setCurrentUser(user);
        addAlert(`Welcome, ${user.name || user.email}! Successfully signed in.`, AlertType.SUCCESS);
         // Store token if needed for subsequent backend calls, e.g., in localStorage or context
        localStorage.setItem('innovotes_user_token', user.idToken);
      } else {
        addAlert("Google Sign-In failed: Could not verify user.", AlertType.ERROR);
        localStorage.removeItem('innovotes_user_token');
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      addAlert(`Google Sign-In error: ${error instanceof Error ? error.message : 'Unknown error'}`, AlertType.ERROR);
      localStorage.removeItem('innovotes_user_token');
    }
  }, [addAlert]);

  const handleSignOut = useCallback(() => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.disableAutoSelect(); 
    }
    setCurrentUser(null);
    localStorage.removeItem('innovotes_user_token');
    addAlert("You have been signed out.", AlertType.INFO);
    
    // Re-initialize sign-in button if it was hidden or modified
    if (window.google && window.google.accounts && window.google.accounts.id && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE') {
        try {
            const buttonContainer = document.getElementById('googleSignInButtonContainer');
            if (buttonContainer) {
                 window.google.accounts.id.renderButton(
                    buttonContainer,
                    { theme: "outline", size: "large", type: "standard", text: "signin_with" } 
                );
            }
        } catch(e) { console.error("Error re-rendering Google Sign In button:", e); }
    }
  }, [addAlert]);
  
  useEffect(() => {
    if (googleSignInInitialized.current || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') return;

    if (window.google && window.google.accounts && window.google.accounts.id) {
      googleSignInInitialized.current = true;
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
          auto_select: false, 
        });
        
        const storedToken = localStorage.getItem('innovotes_user_token');
        if (storedToken) {
            apiService.verifyTokenWithBackend(storedToken).then(user => {
                if (user) setCurrentUser(user);
                else localStorage.removeItem('innovotes_user_token'); 
            });
        } else {
            const buttonContainer = document.getElementById('googleSignInButtonContainer');
            if (buttonContainer) {
                 window.google.accounts.id.renderButton(
                    buttonContainer,
                    { theme: "outline", size: "large", type: "standard", text: "signin_with" } 
                );
            } else {
                console.warn("Google Sign In button container not found yet. Will try again on next render.");
            }
        }
      } catch (error) {
        console.error("Error initializing Google Sign-In:", error);
        addAlert("Could not initialize Google Sign-In. Features requiring login may be unavailable.", AlertType.ERROR);
      }
    } else {
        const timeoutId = setTimeout(() => {
            if (window.google && window.google.accounts && window.google.accounts.id && !googleSignInInitialized.current && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE') {
                console.log("Retrying Google Sign-In initialization.");
                 if (document.readyState === 'complete') { 
                    const buttonContainer = document.getElementById('googleSignInButtonContainer');
                     if (buttonContainer && !currentUser) { // Check currentUser here too
                         window.google.accounts.id.renderButton(
                            buttonContainer,
                            { theme: "outline", size: "large", type: "standard", text: "signin_with" } 
                        );
                    }
                 }
            }
        }, 1000); 
        return () => clearTimeout(timeoutId);
    }
  }, [handleGoogleSignIn, addAlert, currentUser]);


  useEffect(() => {
    const loadProposals = async () => {
      // Check for placeholder sheet ID
      if (GOOGLE_SHEET_ID.includes('YOUR_GOOGLE_SHEET_ID_HERE') || GOOGLE_SHEET_ID.startsWith('e/YOUR_') ) {
        addAlert("Google Sheet not configured. Please update constants.ts with your Sheet ID. Displaying sample local data.", AlertType.WARNING);
        const fallbackProposals: Proposal[] = [
          { id: crypto.randomUUID(), title: "Local Park Renovation (Sample)", description: "This is sample data. Configure Google Sheets to load real proposals.", createdBy: "System", createdAt: new Date().toISOString(), votes: { for: 10, against: 2, abstain: 1} },
        ];
        setProposals(fallbackProposals);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        addAlert("Fetching proposals from Google Sheet...", AlertType.INFO);
        const fetchedProposals = await fetchProposalsFromSheet();
        setProposals(fetchedProposals);
        addAlert("Proposals loaded successfully from Google Sheet!", AlertType.SUCCESS);
      } catch (error) {
        console.error("Failed to fetch proposals from Google Sheet:", error);
        addAlert(`Error loading proposals: ${error instanceof Error ? error.message : 'Unknown error'}. Check console for details.`, AlertType.ERROR);
        const fallbackProposals: Proposal[] = [
            { id: crypto.randomUUID(), title: "Error Loading Data (Sample)", description: "Could not load proposals from Google Sheet. Displaying sample data.", createdBy: "System Error", createdAt: new Date().toISOString(), votes: { for: 5, against: 1, abstain: 0} },
          ];
        setProposals(fallbackProposals);
      } finally {
        setIsLoading(false);
      }
    };
    if (currentPage === 'proposals') {
        loadProposals();
    }
  }, [addAlert, currentPage]);

  const handleVote = useCallback(async (proposalId: string, vote: VoteOption) => {
    if (!currentUser || !currentUser.idToken) {
      addAlert("Please sign in to vote.", AlertType.WARNING);
      // Optionally prompt for sign-in, e.g., by opening a sign-in modal or using GIS prompt
      // if (window.google && window.google.accounts && window.google.accounts.id) {
      //    window.google.accounts.id.prompt(); 
      // }
      return;
    }

    addAlert("Submitting your vote...", AlertType.INFO);
    const voteSuccess = await apiService.submitVoteToBackend(proposalId, vote, currentUser.idToken);

    if (voteSuccess) {
      setProposals(prevProposals =>
        prevProposals.map(p => {
          if (p.id === proposalId) {
            const newVotes = { ...p.votes };
            const previousVote = p.userVote;

            // Adjust counts if user is changing their vote or retracting
            if (previousVote) {
              if (previousVote === VoteOption.FOR) newVotes.for = Math.max(0, newVotes.for - 1);
              else if (previousVote === VoteOption.AGAINST) newVotes.against = Math.max(0, newVotes.against - 1);
              else if (previousVote === VoteOption.ABSTAIN) newVotes.abstain = Math.max(0, newVotes.abstain - 1);
            }
            
            // If current vote is same as new vote, it's a retraction
            if (previousVote === vote) {
              addAlert("Your vote has been retracted (locally). Backend update simulated.", AlertType.SUCCESS);
              return { ...p, userVote: undefined, votes: newVotes }; // Clear userVote, newVotes already has decremented count
            } else { 
              // Apply new vote
              if (vote === VoteOption.FOR) newVotes.for += 1;
              else if (vote === VoteOption.AGAINST) newVotes.against += 1;
              else if (vote === VoteOption.ABSTAIN) newVotes.abstain += 1;
              addAlert("Your vote has been recorded (locally)! Backend update simulated.", AlertType.SUCCESS);
              return { ...p, votes: newVotes, userVote: vote };
            }
          }
          return p;
        })
      );
    } else {
      addAlert("Failed to submit vote to backend (simulated). Please try again.", AlertType.ERROR);
    }
  }, [addAlert, currentUser]);

  const handleCreateProposal = useCallback(async (newProposalData: NewProposalData): Promise<void> => {
    if (!currentUser) {
        addAlert("Please sign in to create a proposal.", AlertType.WARNING);
        return;
    }
    const newProposal: Proposal = {
      ...newProposalData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      votes: { for: 0, against: 0, abstain: 0 },
    };
    setProposals(prevProposals => [newProposal, ...prevProposals]);
    setIsCreateModalOpen(false);
    addAlert("Proposal created locally! It will not be saved to the Google Sheet without backend integration.", AlertType.INFO);
  }, [addAlert, currentUser]);

  const heroClauses: BillClause[] = [
    { id: "greenEnergy", title: "Green Energy Initiative", summary: "Transition to 90% renewable energy by 2035.", position: [-2.5, 0.5, 0] },
    { id: "healthAccess", title: "Universal Health Access", summary: "Comprehensive healthcare for all citizens.", position: [2.5, 0.5, 0] },
    { id: "digitalEquity", title: "Digital Equity Project", summary: "Affordable high-speed internet for all.", position: [0, 0.5, -2.5] },
    { id: "educationReform", title: "Education Excellence Fund", summary: "Investments in public education and reduced tuition.", position: [0, 1.5, 2.5]},
    { id: "workerTransition", title: "Worker Transition & UBI", summary: "Support for workers during economic shifts with UBI pilot.", position: [1.5, -0.5, 1.5]},
  ];
  
  useEffect(() => {
    if (!currentUser && window.google && window.google.accounts && window.google.accounts.id && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      const buttonContainer = document.getElementById('googleSignInButtonContainer');
      // Ensure button isn't re-rendered if it's already there (e.g. if initialization was delayed)
      if (buttonContainer && !buttonContainer.hasChildNodes()) { 
        try {
          window.google.accounts.id.renderButton(
            buttonContainer,
            { theme: "outline", size: "large", type: "standard", text: "signin_with" }
          );
        } catch (e) {
            console.error("Error rendering Google Sign In button in effect:", e);
        }
      }
    }
  }, [currentUser, currentPage, GOOGLE_CLIENT_ID]); // Added GOOGLE_CLIENT_ID dependency


  if (currentPage === 'hero') {
    return <HeroPage clauses={heroClauses} onNavigateToProposals={() => setCurrentPage('proposals')} addAlert={addAlert} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Header 
        onOpenCreateModal={() => setIsCreateModalOpen(true)} 
        onNavigateHome={() => setCurrentPage('hero')}
        showHomeButton={currentPage === 'proposals'}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <AlertDisplay alerts={alerts} removeAlert={(id) => setAlerts(prev => prev.filter(a => a.id !== id))} />
        {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <LoadingSpinner large={true} />
              <p className="text-xl mt-4">Loading Proposals...</p>
            </div>
        ) : proposals.length === 0 ? (
            <div className="text-center py-10 card bg-base-200 shadow-xl p-8 max-w-lg mx-auto mt-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 mx-auto text-neutral-content opacity-50 mb-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
                <h2 className="text-3xl font-semibold mb-3 text-base-content">No Proposals Found</h2>
                <p className="mb-6 text-base-content opacity-80">It looks like there are no proposals loaded. This could be due to an empty Google Sheet or a loading issue. {currentUser ? "You can try creating one locally using the button in the header." : "Sign in to create proposals."}</p>
                {!currentUser && (
                    <button
                        onClick={() => {
                            addAlert("Please sign in to create proposals.", AlertType.INFO);
                             // Attempt to trigger Google Sign-In prompt if available and not automatically shown
                            if (window.google && window.google.accounts && window.google.accounts.id) {
                                // This might not always work as user interaction is often required
                                // window.google.accounts.id.prompt(); 
                            }
                        }}
                        className="btn btn-primary"
                    >
                        Sign In to Create
                    </button>
                )}
            </div>
        ) : (
          <ProposalList proposals={proposals} onVote={handleVote} />
        )}
      </main>
      {isCreateModalOpen && ( // Conditionally render modal to ensure it's in DOM when needed
        <CreateProposalModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateProposal}
          addAlert={addAlert}
        />
      )}
      <footer className="footer footer-center p-6 bg-base-200 text-base-content border-t border-base-300">
        <aside>
          <p className="font-semibold">Innovotes.com</p>
          <p className="text-sm opacity-75">&copy; {new Date().getFullYear()} - Direct Democracy, Powered by The People.</p>
        </aside>
      </footer>
    </div>
  );
};

export default App;
