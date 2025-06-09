import React, { useState } from 'react';

// Header Component
export const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white border-b-2 border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img 
                src="/logo.svg" 
                alt="Innovotes.com Logo" 
                className="h-12 w-auto mr-2"
              />
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search policy proposals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-light"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <button className="text-gray-700 hover:text-blue-600 font-light transition-colors">
              How It Works
            </button>
            <button className="text-gray-700 hover:text-blue-600 font-light transition-colors">
              My Votes
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-light hover:bg-blue-700 transition-colors">
              Sign Up
            </button>
            <button className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg font-light hover:bg-blue-50 transition-colors">
              Log In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Navigation Tabs Component
export const NavigationTabs = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { id: 'all', name: 'All Policies', icon: '🏛️' },
    { id: 'taxation', name: 'Taxation', icon: '💰' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
    { id: 'defense', name: 'Defense & Security', icon: '🛡️' },
    { id: 'energy', name: 'Energy', icon: '⚡' },
    { id: 'social', name: 'Social Programs', icon: '🤝' },
    { id: 'technology', name: 'Technology', icon: '💻' }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`py-4 px-2 border-b-2 font-light text-sm whitespace-nowrap transition-colors ${
                activeCategory === category.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Policy Card Component
export const PolicyCard = ({ policy }) => {
  const [userVote, setUserVote] = useState(null);

  const handleVote = (vote) => {
    setUserVote(vote);
  };

  const supportPercentage = Math.round((policy.supportVotes / (policy.supportVotes + policy.opposeVotes)) * 100);
  const opposePercentage = 100 - supportPercentage;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Policy Image */}
      <div className="h-48 bg-gray-100 rounded-t-lg overflow-hidden">
        <img 
          src={policy.image} 
          alt={policy.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-light ${
            policy.category === 'taxation' ? 'bg-green-100 text-green-800' :
            policy.category === 'healthcare' ? 'bg-red-100 text-red-800' :
            policy.category === 'defense' ? 'bg-blue-100 text-blue-800' :
            policy.category === 'energy' ? 'bg-yellow-100 text-yellow-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {policy.categoryName}
          </span>
          <span className="text-xs text-gray-500 font-light">
            Voting ends: {policy.endDate}
          </span>
        </div>

        {/* Policy Title */}
        <h3 className="text-lg font-normal text-gray-900 mb-2 leading-tight">
          {policy.title}
        </h3>

        {/* Policy Description */}
        <p className="text-sm text-gray-600 mb-4 font-light leading-relaxed">
          {policy.description}
        </p>

        {/* Voting Percentages */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
              <span className="text-sm font-light text-gray-700">Support</span>
              <span className="text-lg font-light text-blue-600 ml-2">{supportPercentage}%</span>
            </div>
            <div className="flex items-center">
              <span className="text-lg font-light text-red-600 mr-2">{opposePercentage}%</span>
              <span className="text-sm font-light text-gray-700">Oppose</span>
              <div className="w-3 h-3 bg-red-600 rounded-full ml-2"></div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${supportPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Vote Buttons */}
        <div className="flex space-x-3 mb-4">
          <button
            onClick={() => handleVote('support')}
            className={`flex-1 py-3 px-4 rounded-lg font-light text-sm transition-all duration-200 ${
              userVote === 'support'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            {userVote === 'support' ? '✓ Voted Support' : 'Vote Yes'}
          </button>
          <button
            onClick={() => handleVote('oppose')}
            className={`flex-1 py-3 px-4 rounded-lg font-light text-sm transition-all duration-200 ${
              userVote === 'oppose'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
            }`}
          >
            {userVote === 'oppose' ? '✓ Voted Oppose' : 'Vote No'}
          </button>
        </div>

        {/* Voting Stats */}
        <div className="flex justify-between text-xs text-gray-500 font-light">
          <span>{(policy.supportVotes + policy.opposeVotes).toLocaleString()} total votes</span>
          <span>Impact: {policy.impactLevel}</span>
        </div>
      </div>
    </div>
  );
};

// Hero Section Component
export const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-red-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
          Direct Democracy for the
          <span className="text-blue-600"> Digital Age</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
          Vote directly on government policies and legislation. Your voice shapes policy through 
          AI-assisted proposal generation and transparent democratic participation.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-light text-lg hover:bg-blue-700 transition-colors">
            Start Voting
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-light text-lg hover:bg-gray-50 transition-colors">
            Learn How It Works
          </button>
        </div>
      </div>
    </div>
  );
};

// Stats Component
export const StatsSection = () => {
  const stats = [
    { number: '2.4M', label: 'Active Voters', color: 'text-blue-600' },
    { number: '127', label: 'Active Policies', color: 'text-red-600' },
    { number: '89%', label: 'Participation Rate', color: 'text-green-600' },
    { number: '$2.4T', label: 'Budget Impact', color: 'text-purple-600' }
  ];

  return (
    <div className="bg-white py-12 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-3xl font-light ${stat.color} mb-2`}>
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 font-light">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Footer Component
export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="/logo.svg" 
                alt="Innovotes.com" 
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              Empowering citizens through direct democracy and transparent policy voting. 
              Every voice matters in shaping our collective future.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">f</span>
              </div>
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">t</span>
              </div>
              <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">in</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 font-light">How It Works</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 font-light">Security</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 font-light">Transparency</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 font-light">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 font-light">Help Center</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 font-light">Contact</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 font-light">Privacy</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 font-light">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500 font-light">
            © 2025 Innovotes.com. Empowering democracy through technology.
          </p>
        </div>
      </div>
    </footer>
  );
};