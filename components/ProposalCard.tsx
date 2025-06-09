
import React from 'react';
import { Proposal, VoteOption } from '../types';
import VoteButtons from './VoteButtons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

interface ProposalCardProps {
  proposal: Proposal;
  onVote: (proposalId: string, vote: VoteOption) => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onVote }) => {
  const totalVotes = proposal.votes.for + proposal.votes.against + proposal.votes.abstain;

  // Using direct hex colors that correspond to DaisyUI theme colors
  // These are typical default values. You might want to adjust them based on the exact theme shades.
  // Success (green) e.g., DaisyUI 'success' with 'night' theme is often around #008900 or similar
  // Error (red) e.g., DaisyUI 'error' with 'night' theme is often around #ff0000 or similar
  // Info (blue) e.g., DaisyUI 'info' with 'night' theme is often around #0095ff or similar

  // For 'night' theme (approximate values based on common DaisyUI themes):
  const colorFor = '#00a96e'; // A typical green for success
  const colorAgainst = '#ff5757'; // A typical red for error
  const colorAbstain = '#00b8ff'; // A typical blue for info

  const voteData = [
    { name: 'For', votes: proposal.votes.for, percentage: totalVotes > 0 ? (proposal.votes.for / totalVotes) * 100 : 0, color: colorFor },
    { name: 'Against', votes: proposal.votes.against, percentage: totalVotes > 0 ? (proposal.votes.against / totalVotes) * 100 : 0, color: colorAgainst },
    { name: 'Abstain', votes: proposal.votes.abstain, percentage: totalVotes > 0 ? (proposal.votes.abstain / totalVotes) * 100 : 0, color: colorAbstain },
  ];

  return (
    <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col">
      <div className="card-body flex-grow">
        <h2 className="card-title text-primary text-2xl mb-1">{proposal.title}</h2>
        <div className="text-xs text-base-content opacity-70 mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1.5 opacity-80">
            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
          </svg>
           <span className="mr-1">By: {proposal.createdBy}</span>
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1 ml-2 opacity-80">
            <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c0-.414.336-.75.75-.75h10.5a.75.75 0 0 1 0 1.5H5.5a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H5.5Z" clipRule="evenodd" />
          </svg>
           <span>{new Date(proposal.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-base-content opacity-90 mb-4 whitespace-pre-line leading-relaxed text-sm flex-grow min-h-[60px]">{proposal.description}</p>
        
        <div className="divider my-1"></div>

        <div className="my-2">
          <h4 className="text-md font-medium mb-3 text-base-content">Cast Your Vote:</h4>
          <VoteButtons
            proposalId={proposal.id}
            currentVote={proposal.userVote}
            onVote={(vote) => onVote(proposal.id, vote)}
            disabled={false} // This could be dynamic based on user auth or proposal status
          />
        </div>

        <div className="divider my-1"></div>
        
        <div className="mt-2">
          <h4 className="text-md font-medium mb-3 text-base-content">Current Results: <span className="opacity-70">({totalVotes} total)</span></h4>
          {totalVotes > 0 ? (
            <div className="h-64 sm:h-72"> {/* Adjusted height for better responsiveness */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={voteData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--bc) / 0.15)" />
                  <XAxis type="number" stroke="hsl(var(--bc) / 0.5)" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--bc) / 0.5)" width={60} fontSize={12} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--b3) / 0.2)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--b1))', border: '1px solid hsl(var(--b3))', borderRadius: '0.375rem', color: 'hsl(var(--bc))', padding: '0.5rem 0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1)' }}
                    labelStyle={{ color: 'hsl(var(--bc))', fontWeight: '600', marginBottom: '0.25rem' }}
                    itemStyle={{ color: 'hsl(var(--bc))', fontSize: '0.875rem' }}
                    formatter={(value, name, props_ ) => [`${props_.payload.votes} votes (${(value as number).toFixed(1)}%)`, props_.payload.name]}
                  />
                  <Legend wrapperStyle={{ color: 'hsl(var(--bc) / 0.7)', bottom: 0, fontSize: '0.75rem' }} />
                  <Bar dataKey="percentage" name="Vote %" unit="%" barSize={20}>
                    {voteData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} radius={[0, 4, 4, 0]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="italic opacity-60 text-sm py-8 text-center">No votes cast yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;
