import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Header Component with Routing
export const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white border-b-2 border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/logo.svg" 
                alt="Innovotes.com Logo" 
                className="h-12 w-auto mr-2"
              />
            </Link>
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
            <Link 
              to="/how-it-works" 
              className="text-gray-700 hover:text-blue-600 font-light transition-colors"
            >
              How It Works
            </Link>
            <Link 
              to="/my-votes" 
              className="text-gray-700 hover:text-blue-600 font-light transition-colors"
            >
              My Votes
            </Link>
            <Link 
              to="/signup" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-light hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
            <Link 
              to="/login" 
              className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg font-light hover:bg-blue-50 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

// Navigation Tabs Component with Routing
export const NavigationTabs = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { id: 'all', name: 'All Policies', icon: '🏛️' },
    { id: 'taxation', name: 'Taxation', icon: '💰' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
    { id: 'defense', name: 'Defense & Security', icon: '🛡️' },
    { id: 'energy', name: 'Energy', icon: '⚡' },
    { id: 'social', name: 'Social Programs', icon: '🤝' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'infrastructure', name: 'Infrastructure', icon: '🏗️' },
    { id: 'agriculture', name: 'Agriculture', icon: '🌾' },
    { id: 'immigration', name: 'Immigration', icon: '🗽' }
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 policy-card">
      {/* Policy Image */}
      <div className="h-48 bg-gray-100 rounded-t-lg overflow-hidden">
        <img 
          src={policy.image} 
          alt={policy.title}
          className="w-full h-full object-cover responsive-image"
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
            policy.category === 'technology' ? 'bg-indigo-100 text-indigo-800' :
            policy.category === 'education' ? 'bg-purple-100 text-purple-800' :
            policy.category === 'infrastructure' ? 'bg-orange-100 text-orange-800' :
            policy.category === 'agriculture' ? 'bg-emerald-100 text-emerald-800' :
            policy.category === 'immigration' ? 'bg-pink-100 text-pink-800' :
            'bg-gray-100 text-gray-800'
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
          {policy.description.replace(/"/g, '&quot;').replace(/'/g, '&apos;')}
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
          <Link 
            to="/signup"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-light text-lg hover:bg-blue-700 transition-colors"
          >
            Start Voting
          </Link>
          <Link 
            to="/how-it-works"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-light text-lg hover:bg-gray-50 transition-colors border border-blue-200"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

// Stats Component
export const StatsSection = ({ totalPolicies = 200 }) => {
  const stats = [
    { number: '2.4M', label: 'Active Voters', color: 'text-blue-600' },
    { number: totalPolicies.toString(), label: 'Active Policies', color: 'text-red-600' },
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

// How It Works Page
export const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">How Innovotes Works</h1>
          <p className="text-xl text-gray-600 font-light">Participate in direct democracy through our transparent voting platform</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">1</span>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Browse Policies</h3>
            <p className="text-gray-600 font-light">Explore government policy proposals across all major categories including taxation, healthcare, defense, and more.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">2</span>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Cast Your Vote</h3>
            <p className="text-gray-600 font-light">Vote "Yes" or "No" on policies that matter to you. Each vote is recorded and contributes to the democratic process.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">3</span>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Shape Policy</h3>
            <p className="text-gray-600 font-light">Your votes influence policy decisions and help representatives understand constituent preferences.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-medium text-gray-900 mb-6">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🔒 Secure Voting</h4>
              <p className="text-gray-600 font-light">Advanced encryption and verification ensure your votes are secure and anonymous.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📊 Real-Time Results</h4>
              <p className="text-gray-600 font-light">See live voting results and track policy support in real-time.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🎯 Impact Tracking</h4>
              <p className="text-gray-600 font-light">Understand the budget impact and affected populations for each policy.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🤖 AI Assistance</h4>
              <p className="text-gray-600 font-light">AI-powered policy summaries help you understand complex legislation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sign Up Page
export const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-light text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-light text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-light text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-light text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                required
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                aria-label="Agree to terms and conditions"
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-light text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Login Page
export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600 font-light">Sign in to your Innovotes account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-600">Remember me</label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Not Found Page
export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
      <div className="text-center">
        <div className="text-9xl font-light text-blue-600 mb-4">404</div>
        <h1 className="text-4xl font-light text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8 font-light">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-light hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-light hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

// Footer Component
export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">About</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-base text-gray-500 hover:text-gray-900">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/blog" className="text-base text-gray-500 hover:text-gray-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-base text-gray-500 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Social</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a 
                  href="https://twitter.com/innovotes" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a 
                  href="https://facebook.com/innovotes" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a 
                  href="https://linkedin.com/company/innovotes" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Innovotes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};