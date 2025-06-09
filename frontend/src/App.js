import React, { useState, useMemo } from 'react';
import './App.css';
import { Header, NavigationTabs, PolicyCard, HeroSection, StatsSection, Footer } from './components';

// Mock Policy Data based on Big Beautiful Bill
const mockPolicies = [
  {
    id: 1,
    title: "Permanent Extension of 2017 Tax Cuts",
    description: "Make the individual tax rate reductions from the Tax Cuts and Jobs Act permanent, preventing automatic expiration in 2025.",
    category: "taxation",
    categoryName: "Taxation",
    image: "https://images.pexels.com/photos/4386367/pexels-photo-4386367.jpeg",
    supportVotes: 1847320,
    opposeVotes: 892156,
    endDate: "Dec 31, 2025",
    impactLevel: "High - $1.2T budget impact"
  },
  {
    id: 2,
    title: "Tax-Free Status for Tips and Overtime Pay",
    description: "Eliminate federal income tax on tip income and overtime wages for workers across all industries.",
    category: "taxation",
    categoryName: "Taxation",
    image: "https://images.pexels.com/photos/4386367/pexels-photo-4386367.jpeg",
    supportVotes: 2134567,
    opposeVotes: 643210,
    endDate: "Jan 15, 2026",
    impactLevel: "Medium - $89B revenue reduction"
  },
  {
    id: 3,
    title: "SALT Deduction Cap Increase",
    description: "Raise the state and local tax deduction cap from $10,000 to $40,000 annually for taxpayers.",
    category: "taxation",
    categoryName: "Taxation",
    image: "https://images.pexels.com/photos/4386367/pexels-photo-4386367.jpeg",
    supportVotes: 1523890,
    opposeVotes: 1156743,
    endDate: "Feb 28, 2026",
    impactLevel: "Medium - $67B revenue reduction"
  },
  {
    id: 4,
    title: "Electric Vehicle Annual Fee ($250)",
    description: "Implement a $250 annual federal fee for electric vehicle owners to fund Highway Trust Fund infrastructure.",
    category: "taxation",
    categoryName: "Taxation",
    image: "https://images.pexels.com/photos/31982581/pexels-photo-31982581.jpeg",
    supportVotes: 987654,
    opposeVotes: 1876321,
    endDate: "Mar 15, 2026",
    impactLevel: "Low - $3.2B revenue generation"
  },
  {
    id: 5,
    title: "Medicaid Work Requirements",
    description: "Require able-bodied adults without children to work or participate in job training to receive Medicaid benefits.",
    category: "healthcare",
    categoryName: "Healthcare",
    image: "https://images.pexels.com/photos/7163956/pexels-photo-7163956.jpeg",
    supportVotes: 1456789,
    opposeVotes: 1234567,
    endDate: "Apr 1, 2026",
    impactLevel: "High - 5.2M people affected"
  },
  {
    id: 6,
    title: "Gender-Affirming Care Medicaid Restrictions",
    description: "Prohibit federal Medicaid funding for gender-affirming medical treatments starting in 2027.",
    category: "healthcare",
    categoryName: "Healthcare",
    image: "https://images.pexels.com/photos/7163956/pexels-photo-7163956.jpeg",
    supportVotes: 1123456,
    opposeVotes: 1876543,
    endDate: "Jun 30, 2026",
    impactLevel: "Medium - 180K people affected"
  },
  {
    id: 7,
    title: "Abortion Services Medicaid Funding Ban",
    description: "Restrict Medicaid funding for nonprofit organizations that provide abortion services or referrals.",
    category: "healthcare",
    categoryName: "Healthcare",
    image: "https://images.pexels.com/photos/7163956/pexels-photo-7163956.jpeg",
    supportVotes: 1345678,
    opposeVotes: 1654321,
    endDate: "Jul 15, 2026",
    impactLevel: "High - 2.1M women affected"
  },
  {
    id: 8,
    title: "$150B Additional Defense Spending",
    description: "Increase annual defense budget by $150 billion for military modernization and readiness improvements.",
    category: "defense",
    categoryName: "Defense & Security",
    image: "https://images.pexels.com/photos/12199410/pexels-photo-12199410.jpeg",
    supportVotes: 1987654,
    opposeVotes: 876543,
    endDate: "Aug 31, 2026",
    impactLevel: "High - 18% defense budget increase"
  },
  {
    id: 9,
    title: "$25B Golden Dome Defense System",
    description: "Fund development and deployment of advanced missile defense system for homeland security.",
    category: "defense",
    categoryName: "Defense & Security",
    image: "https://images.pexels.com/photos/12199410/pexels-photo-12199410.jpeg",
    supportVotes: 1567890,
    opposeVotes: 1123456,
    endDate: "Sep 15, 2026",
    impactLevel: "Medium - 5-year development program"
  },
  {
    id: 10,
    title: "$50B Border Wall Construction",
    description: "Complete border wall construction along the southern U.S. border with Mexico using federal funding.",
    category: "defense",
    categoryName: "Defense & Security",
    image: "https://images.pexels.com/photos/12199410/pexels-photo-12199410.jpeg",
    supportVotes: 1789123,
    opposeVotes: 1345678,
    endDate: "Oct 31, 2026",
    impactLevel: "High - 1,200 miles of construction"
  },
  {
    id: 11,
    title: "Clean Energy Tax Credit Repeal",
    description: "Eliminate tax incentives for solar, wind, and other renewable energy installations from the Inflation Reduction Act.",
    category: "energy",
    categoryName: "Energy",
    image: "https://images.unsplash.com/photo-1572449210329-d0bd8b8582f6",
    supportVotes: 1234567,
    opposeVotes: 1876543,
    endDate: "Nov 15, 2026",
    impactLevel: "High - $369B program elimination"
  },
  {
    id: 12,
    title: "Electric Vehicle Incentive Elimination",
    description: "Remove federal tax credits for electric vehicle purchases, including the $7,500 EV tax credit.",
    category: "energy",
    categoryName: "Energy",
    image: "https://images.unsplash.com/photo-1572449210329-d0bd8b8582f6",
    supportVotes: 1098765,
    opposeVotes: 1987654,
    endDate: "Dec 1, 2026",
    impactLevel: "Medium - $7.5B annual program"
  },
  {
    id: 13,
    title: "10-Year AI Regulation Moratorium",
    description: "Prevent states from enforcing artificial intelligence regulations for 10 years to promote innovation.",
    category: "energy",
    categoryName: "Technology",
    image: "https://images.unsplash.com/photo-1547067592-463a85de7fd1",
    supportVotes: 1654321,
    opposeVotes: 1123456,
    endDate: "Jan 31, 2027",
    impactLevel: "Medium - Federal preemption policy"
  },
  {
    id: 14,
    title: "SNAP Benefit Cost-Sharing Reform",
    description: "Shift 5% of SNAP benefit costs and 75% of administrative costs from federal to state governments.",
    category: "social",
    categoryName: "Social Programs",
    image: "https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg",
    supportVotes: 1345678,
    opposeVotes: 1567890,
    endDate: "Feb 15, 2027",
    impactLevel: "High - 42M recipients affected"
  },
  {
    id: 15,
    title: "Enhanced SNAP Eligibility Requirements",
    description: "Implement stricter work requirements and asset limits for Supplemental Nutrition Assistance Program eligibility.",
    category: "social",
    categoryName: "Social Programs",
    image: "https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg",
    supportVotes: 1567890,
    opposeVotes: 1432109,
    endDate: "Mar 1, 2027",
    impactLevel: "High - 6.2M people lose benefits"
  }
];

function App() {
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter policies based on active category
  const filteredPolicies = useMemo(() => {
    if (activeCategory === 'all') {
      return mockPolicies;
    }
    return mockPolicies.filter(policy => policy.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="App min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <StatsSection />
      <NavigationTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Bill Status */}
        <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-lg p-6 mb-8 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                🏛️ Big Beautiful Bill Act (H.R. 2025)
              </h2>
              <p className="text-gray-700 font-light">
                Currently under Senate review. Vote on individual provisions below to influence policy decisions.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-light text-blue-600">127</div>
              <div className="text-sm text-gray-600 font-light">Active Policies</div>
            </div>
          </div>
        </div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPolicies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-lg font-light hover:bg-gray-50 transition-colors">
            Load More Policies
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;