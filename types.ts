
// Add this declaration at the top or in a separate .d.ts file
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: any /* google.accounts.id.CredentialResponse */) => void; auto_select?: boolean; ux_mode?: 'popup' | 'redirect'; nonce?: string; context?: string; state_cookie_domain?: string; cancel_on_tap_outside?: boolean; }) => void;
          renderButton: (
            parentElement: HTMLElement,
            options: {
                type?: 'standard' | 'icon';
                theme?: 'outline' | 'filled_blue' | 'filled_black';
                size?: 'large' | 'medium' | 'small';
                text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
                shape?: 'rectangular' | 'pill' | 'circle' | 'square';
                logo_alignment?: 'left' | 'center';
                width?: string; /* CSS value */
                locale?: string;
                click_listener?: () => void;
            }
          ) => void;
          prompt: (momentListener?: (notification: any /* google.accounts.id.PromptMomentNotification */) => void) => void;
          disableAutoSelect: () => void;
          // Add other methods like signOut, revoke if you use them directly
        };
      };
    };
  }
}

export enum VoteOption {
  FOR = 'FOR',
  AGAINST = 'AGAINST',
  ABSTAIN = 'ABSTAIN',
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string; // ISO date string
  votes: {
    for: number;
    against: number;
    abstain: number;
  };
  userVote?: VoteOption; // Tracks the current user's vote on this proposal
}

export interface NewProposalData {
  title: string;
  description: string;
  createdBy: string;
}

// For Google Sheet parsing
export interface RawSheetProposal {
  id: string;
  title: string;
  description: string;
  createdby: string;
  createdatiso: string; 
  votesfor?: string; // Initially parsed as string, might be missing
  votesagainst?: string; // Initially parsed as string, might be missing
  votesabstain?: string; // Initially parsed as string, might be missing
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

export enum AlertType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  INFO = 'INFO',
  WARNING = 'WARNING',
}

export interface AlertMessage {
  id: string;
  type: AlertType;
  message: string;
}

// For Three.js Hero Page
export interface BillClause {
  id: string;
  title: string;
  summary: string;
  position: [number, number, number]; // x, y, z coordinates for 3D positioning
}

// User interface for Google Sign-In
export interface User {
  id: string; // Google User ID
  name?: string;
  email?: string;
  picture?: string;
  idToken: string; // The Google ID Token
}

// For jwt-decode
export interface DecodedGoogleToken {
  email: string;
  name: string;
  picture: string;
  sub: string; // This is the Google User ID
  exp: number;
  // ... other fields
}

// Ensure this file is treated as a module.
// If there are no other imports/exports, this line can ensure it.
// If you already have imports/exports, this is not strictly necessary
// but doesn't hurt.
export {};
