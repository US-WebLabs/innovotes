import React from 'react';
import { Proposal, VoteOption } from '../types';
import ProposalCard from './ProposalCard';

interface ProposalListProps {
  proposals: Proposal[];
  onVote: (proposalId: string, vote: VoteOption) => void;
}

const ProposalList: React.FC<ProposalListProps> = ({ proposals, onVote }) => {
  // The 'No active proposals' message is handled in App.tsx now for better context
  // if (proposals.length === 0) {
  //   return (
  //     <div className="text-center py-10">
  //       <p className="text-xl">No active proposals at the moment.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {proposals.map(proposal => (
        <ProposalCard key={proposal.id} proposal={proposal} onVote={onVote} />
      ))}
    </div>
  );
};

export default ProposalList;