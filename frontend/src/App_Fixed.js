import React, { useState, useMemo } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Header, NavigationTabs, PolicyCard, HeroSection, StatsSection, Footer, HowItWorksPage, SignUpPage, LoginPage, NotFoundPage } from './components';

// Generate comprehensive policy data (200+ policies)
const generateExpandedPolicies = () => {
  const policies = [];
  const endDate = "Jul 31, 2025";
  let id = 1;

  const generateVotes = () => {
    const total = Math.floor(Math.random() * 3000000) + 500000;
    const supportRatio = Math.random();
    return {
      supportVotes: Math.floor(total * supportRatio),
      opposeVotes: Math.floor(total * (1 - supportRatio))
    };
  };

  // All policy categories
  const allCategories = [
    {
      category: "taxation",
      categoryName: "Taxation", 
      image: "https://images.pexels.com/photos/4386367/pexels-photo-4386367.jpeg",
      policies: [
        { title: "Permanent Extension of 2017 Tax Cuts", description: "Make the individual tax rate reductions from the Tax Cuts and Jobs Act permanent, preventing automatic expiration in 2025.", impactLevel: "High - $1.2T budget impact" },
        { title: "Tax-Free Status for Tips and Overtime Pay", description: "Eliminate federal income tax on tip income and overtime wages for workers across all industries.", impactLevel: "Medium - $89B revenue reduction" },
        { title: "SALT Deduction Cap Increase", description: "Raise the state and local tax deduction cap from $10,000 to $40,000 annually for taxpayers.", impactLevel: "Medium - $67B revenue reduction" },
        { title: "Electric Vehicle Annual Fee ($250)", description: "Implement a $250 annual federal fee for electric vehicle owners to fund Highway Trust Fund infrastructure.", impactLevel: "Low - $3.2B revenue generation" },
        { title: "Corporate Tax Rate Reduction", description: "Lower corporate tax rate from 21% to 18% to stimulate business investment and job creation.", impactLevel: "High - $245B revenue reduction" },
        { title: "Capital Gains Tax Indexation", description: "Index capital gains taxes to inflation to prevent taxation of inflationary gains on investments.", impactLevel: "Medium - $34B revenue reduction" },
        { title: "Estate Tax Elimination", description: "Permanently repeal the federal estate tax on inherited wealth and property transfers.", impactLevel: "Medium - $17B revenue reduction" },
        { title: "Small Business 20% Deduction Extension", description: "Make the Section 199A small business deduction permanent for pass-through entities.", impactLevel: "Medium - $42B revenue reduction" },
        { title: "Research & Development Tax Credit Enhancement", description: "Increase R&D tax credits from 20% to 25% for qualifying research expenditures.", impactLevel: "Medium - $18B revenue reduction" },
        { title: "Child Tax Credit Expansion", description: "Increase the Child Tax Credit from $2,000 to $3,000 per child under 18 years old.", impactLevel: "High - $97B revenue reduction" },
        { title: "Mortgage Interest Deduction Restoration", description: "Restore mortgage interest deduction cap from $750,000 to $1,000,000 for home purchases.", impactLevel: "Medium - $23B revenue reduction" },
        { title: "Alternative Minimum Tax Repeal", description: "Eliminate the Alternative Minimum Tax for both individual and corporate taxpayers.", impactLevel: "Medium - $19B revenue reduction" },
        { title: "Retirement Savings Enhancement", description: "Increase 401(k) and IRA contribution limits by 50% for workers over age 50.", impactLevel: "Medium - $14B revenue reduction" },
        { title: "First-Time Homebuyer Tax Credit", description: "Establish a $10,000 refundable tax credit for first-time home purchases.", impactLevel: "Medium - $22B revenue reduction" },
        { title: "Cryptocurrency Tax Clarification", description: "Establish clear tax guidelines for cryptocurrency transactions and mining operations.", impactLevel: "Medium - Regulatory clarity" }
      ]
    },
    {
      category: "healthcare",
      categoryName: "Healthcare",
      image: "https://images.pexels.com/photos/7163956/pexels-photo-7163956.jpeg",
      policies: [
        { title: "Medicaid Work Requirements", description: "Require able-bodied adults without children to work or participate in job training to receive Medicaid benefits.", impactLevel: "High - 5.2M people affected" },
        { title: "Gender-Affirming Care Medicaid Restrictions", description: "Prohibit federal Medicaid funding for gender-affirming medical treatments starting in 2027.", impactLevel: "Medium - 180K people affected" },
        { title: "Abortion Services Medicaid Funding Ban", description: "Restrict Medicaid funding for nonprofit organizations that provide abortion services or referrals.", impactLevel: "High - 2.1M women affected" },
        { title: "Medicare Advantage Expansion", description: "Expand Medicare Advantage options and increase federal support for private Medicare plans.", impactLevel: "High - 28M beneficiaries affected" },
        { title: "Health Savings Account Enhancement", description: "Increase HSA contribution limits and expand eligible expenses to include fitness memberships.", impactLevel: "Medium - 15M account holders affected" },
        { title: "Prescription Drug Price Transparency", description: "Require pharmaceutical companies to disclose drug pricing information in direct-to-consumer advertising.", impactLevel: "Medium - Industry-wide impact" },
        { title: "Telemedicine Permanent Authorization", description: "Make temporary COVID-era telemedicine flexibilities permanent for Medicare and Medicaid.", impactLevel: "High - 45M patients affected" },
        { title: "Mental Health Parity Enforcement", description: "Strengthen enforcement of mental health parity laws in insurance coverage and provider networks.", impactLevel: "High - 75M Americans affected" },
        { title: "Medical Malpractice Reform", description: "Establish federal caps on non-economic damages in medical malpractice lawsuits.", impactLevel: "Medium - Healthcare provider impact" },
        { title: "Rural Hospital Support Program", description: "Establish federal grants and loan programs to support struggling rural hospitals.", impactLevel: "High - 1,800 rural hospitals" },
        { title: "Medical Research Funding Increase", description: "Increase NIH funding by 25% over five years for medical research and drug development.", impactLevel: "High - $12B increase" },
        { title: "Veterans Healthcare Expansion", description: "Expand VA healthcare eligibility and improve mental health services for veterans.", impactLevel: "High - 9M veterans affected" },
        { title: "Opioid Treatment Expansion", description: "Expand access to medication-assisted treatment for opioid addiction in underserved areas.", impactLevel: "High - 2M Americans in treatment" },
        { title: "Pediatric Care Access Improvement", description: "Increase Medicaid reimbursement rates for pediatric specialists and children's hospitals.", impactLevel: "High - 37M children affected" },
        { title: "Public Health Emergency Preparedness", description: "Strengthen federal and state capabilities to respond to future health emergencies.", impactLevel: "High - National preparedness" }
      ]
    },
    {
      category: "defense",
      categoryName: "Defense & Security",
      image: "https://images.pexels.com/photos/12199410/pexels-photo-12199410.jpeg",
      policies: [
        { title: "$150B Additional Defense Spending", description: "Increase annual defense budget by $150 billion for military modernization and readiness improvements.", impactLevel: "High - 18% defense budget increase" },
        { title: "$25B Golden Dome Defense System", description: "Fund development and deployment of advanced missile defense system for homeland security.", impactLevel: "Medium - 5-year development program" },
        { title: "$50B Border Wall Construction", description: "Complete border wall construction along the southern U.S. border with Mexico using federal funding.", impactLevel: "High - 1,200 miles of construction" },
        { title: "$4B Border Patrol Enhancement", description: "Increase Border Patrol agent recruitment and provide advanced surveillance technology.", impactLevel: "Medium - 10,000 new agents" },
        { title: "Space Force Expansion", description: "Double Space Force personnel and establish new space-based defense capabilities.", impactLevel: "High - National security priority" },
        { title: "Naval Fleet Modernization", description: "Fund construction of 50 new naval vessels over the next decade including submarines and destroyers.", impactLevel: "High - $85B naval expansion" },
        { title: "Air Force Fighter Jet Procurement", description: "Purchase 200 additional F-35 fighter jets and upgrade existing aircraft systems.", impactLevel: "High - $45B aircraft purchase" },
        { title: "Cybersecurity Defense Initiative", description: "Establish comprehensive federal cybersecurity program to protect critical infrastructure.", impactLevel: "High - $12B cyber defense" },
        { title: "Veterans Benefits Enhancement", description: "Increase disability compensation rates and expand healthcare benefits for veterans.", impactLevel: "High - 19M veterans affected" },
        { title: "Military Personnel Pay Increase", description: "Provide 4.5% pay raise for all military personnel across all service branches.", impactLevel: "Medium - 2.1M service members" },
        { title: "Intelligence Community Expansion", description: "Increase personnel and capabilities across intelligence agencies for national security.", impactLevel: "High - Intelligence operations" },
        { title: "Critical Infrastructure Protection", description: "Strengthen protection of power grids, water systems, and transportation networks.", impactLevel: "High - Infrastructure security" },
        { title: "Nuclear Arsenal Modernization", description: "Update and maintain nuclear weapons systems and delivery platforms.", impactLevel: "High - Nuclear deterrence" },
        { title: "Coast Guard Fleet Expansion", description: "Modernize and expand Coast Guard vessels and equipment for maritime security.", impactLevel: "Medium - Maritime protection" },
        { title: "International Defense Cooperation", description: "Strengthen defense partnerships and joint training exercises with allies.", impactLevel: "Medium - Global alliances" }
      ]
    },
    {
      category: "energy",
      categoryName: "Energy",
      image: "https://images.unsplash.com/photo-1572449210329-d0bd8b8582f6",
      policies: [
        { title: "Clean Energy Tax Credit Repeal", description: "Eliminate tax incentives for solar, wind, and other renewable energy installations from the Inflation Reduction Act.", impactLevel: "High - $369B program elimination" },
        { title: "Electric Vehicle Incentive Elimination", description: "Remove federal tax credits for electric vehicle purchases, including the $7,500 EV tax credit.", impactLevel: "Medium - $7.5B annual program" },
        { title: "Domestic Oil Production Expansion", description: "Open federal lands for oil and gas exploration and streamline drilling permit processes.", impactLevel: "High - Energy independence" },
        { title: "Nuclear Power Renaissance", description: "Accelerate nuclear power plant construction and extend existing plant licenses.", impactLevel: "High - Clean energy baseload" },
        { title: "Grid Modernization Initiative", description: "Upgrade electrical grid infrastructure for improved reliability and efficiency.", impactLevel: "High - $75B grid investment" },
        { title: "Energy Independence Act", description: "Achieve complete energy independence from foreign oil imports within 10 years.", impactLevel: "High - National energy policy" },
        { title: "Critical Mineral Mining", description: "Streamline permitting for domestic mining of critical minerals for energy technology.", impactLevel: "High - Supply chain security" },
        { title: "Carbon Capture Technology", description: "Fund development of carbon capture and storage technology for fossil fuel plants.", impactLevel: "Medium - $8B technology program" },
        { title: "LNG Export Facility Development", description: "Accelerate construction of liquefied natural gas export terminals for global markets.", impactLevel: "High - Energy exports" },
        { title: "Strategic Petroleum Reserve Expansion", description: "Double the capacity of the Strategic Petroleum Reserve for national energy security.", impactLevel: "Medium - Energy security" },
        { title: "Offshore Drilling Expansion", description: "Open new offshore areas for oil and gas exploration along U.S. coasts.", impactLevel: "High - Energy production" },
        { title: "Renewable Energy Permitting Reform", description: "Streamline federal permitting processes for renewable energy projects on public lands.", impactLevel: "Medium - Project development" },
        { title: "Energy Research and Development", description: "Increase federal funding for energy innovation and breakthrough technologies.", impactLevel: "Medium - Technology advancement" }
      ]
    },
    {
      category: "social",
      categoryName: "Social Programs",
      image: "https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg",
      policies: [
        { title: "SNAP Benefit Cost-Sharing Reform", description: "Shift 5% of SNAP benefit costs and 75% of administrative costs from federal to state governments.", impactLevel: "High - 42M recipients affected" },
        { title: "Enhanced SNAP Eligibility Requirements", description: "Implement stricter work requirements and asset limits for Supplemental Nutrition Assistance Program eligibility.", impactLevel: "High - 6.2M people lose benefits" },
        { title: "Social Security Disability Review", description: "Increase frequency of disability benefit reviews and tighten eligibility criteria.", impactLevel: "High - 12M beneficiaries affected" },
        { title: "Housing Assistance Restructuring", description: "Convert federal housing assistance programs to block grants managed by states.", impactLevel: "High - 5M households affected" },
        { title: "School Lunch Program Changes", description: "Modify nutritional standards and eligibility requirements for federal school meal programs.", impactLevel: "High - 30M students affected" },
        { title: "Childcare Assistance Limitations", description: "Implement stricter income limits and work requirements for federal childcare assistance.", impactLevel: "Medium - 1.6M families affected" },
        { title: "WIC Program Modifications", description: "Tighten eligibility and reduce benefit amounts for Women, Infants, and Children program.", impactLevel: "High - 6.2M participants affected" },
        { title: "Elder Care Support Reduction", description: "Reduce federal funding for Older Americans Act programs including meal delivery.", impactLevel: "Medium - 11M seniors affected" },
        { title: "Disability Services Restructuring", description: "Convert federal disability services to state-managed programs with reduced funding.", impactLevel: "High - Disability community" },
        { title: "Job Training Program Consolidation", description: "Consolidate multiple federal job training programs into single state-managed program.", impactLevel: "Medium - Workforce development" },
        { title: "Community Health Center Funding", description: "Reduce federal funding for Federally Qualified Health Centers by 30%.", impactLevel: "High - 30M patients affected" },
        { title: "Foster Care System Reform", description: "Restructure federal foster care funding and oversight mechanisms.", impactLevel: "High - 400K children in care" },
        { title: "Homeless Services Consolidation", description: "Combine federal homeless assistance programs into single block grant system.", impactLevel: "High - 580K homeless individuals" }
      ]
    },
    {
      category: "technology",
      categoryName: "Technology",
      image: "https://images.unsplash.com/photo-1547067592-463a85de7fd1",
      policies: [
        { title: "10-Year AI Regulation Moratorium", description: "Prevent states from enforcing artificial intelligence regulations for 10 years to promote innovation.", impactLevel: "Medium - Federal preemption policy" },
        { title: "School Choice Expansion", description: "Establish federal education savings accounts for private school tuition and educational expenses.", impactLevel: "High - $10B voucher program" },
        { title: "Student Loan Forgiveness Elimination", description: "Eliminate all federal student loan forgiveness programs including Public Service Loan Forgiveness.", impactLevel: "High - 45M borrowers affected" },
        { title: "Broadband Infrastructure Investment", description: "Fund rural broadband expansion to achieve universal internet access.", impactLevel: "High - $30B broadband program" },
        { title: "5G Network Acceleration", description: "Fast-track 5G wireless network deployment and reduce regulatory barriers.", impactLevel: "High - Telecommunications infrastructure" },
        { title: "Quantum Computing Investment", description: "Establish national quantum computing research initiative with $10B funding.", impactLevel: "High - Technology leadership" },
        { title: "Semiconductor Manufacturing Support", description: "Provide incentives for domestic semiconductor manufacturing facilities.", impactLevel: "High - Supply chain security" },
        { title: "Data Privacy Regulation Preemption", description: "Prevent states from implementing data privacy laws stricter than federal standards.", impactLevel: "Medium - Tech regulation" },
        { title: "Digital Divide Elimination", description: "Ensure all students have access to high-speed internet and devices for learning.", impactLevel: "High - Educational equity" },
        { title: "Educational Technology Investment", description: "Fund deployment of educational technology in K-12 schools nationwide.", impactLevel: "Medium - Digital learning" },
        { title: "Tech Innovation Zones", description: "Establish special economic zones with reduced regulations for technology companies.", impactLevel: "Medium - Tech industry development" }
      ]
    },
    {
      category: "infrastructure",
      categoryName: "Infrastructure",
      image: "https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg",
      policies: [
        { title: "National Infrastructure Investment", description: "Allocate $500B for roads, bridges, airports, and public transportation over 10 years.", impactLevel: "High - National infrastructure overhaul" },
        { title: "High-Speed Rail Development", description: "Fund construction of high-speed rail corridors connecting major metropolitan areas.", impactLevel: "High - $200B rail investment" },
        { title: "Bridge Replacement Initiative", description: "Replace structurally deficient bridges across the United States.", impactLevel: "High - 45,000 bridges affected" },
        { title: "Water Infrastructure Renewal", description: "Replace aging water pipes and treatment facilities nationwide.", impactLevel: "High - Water security" },
        { title: "Electric Vehicle Charging Network", description: "Build comprehensive EV charging infrastructure along major highways.", impactLevel: "High - Clean transportation" },
        { title: "Public Transit Expansion", description: "Expand bus rapid transit and light rail systems in metropolitan areas.", impactLevel: "High - Urban mobility" },
        { title: "Airport Modernization Program", description: "Upgrade airport facilities and air traffic control systems nationwide.", impactLevel: "Medium - Aviation infrastructure" },
        { title: "Smart Traffic Systems", description: "Implement intelligent transportation systems to reduce congestion.", impactLevel: "Medium - Traffic management" },
        { title: "Rural Broadband Expansion", description: "Extend high-speed internet access to underserved rural communities.", impactLevel: "High - Digital inclusion" },
        { title: "Transportation Workforce Development", description: "Train workers for infrastructure construction and maintenance jobs.", impactLevel: "Medium - Job creation" }
      ]
    },
    {
      category: "agriculture",
      categoryName: "Agriculture",
      image: "https://images.pexels.com/photos/4386367/pexels-photo-4386367.jpeg",
      policies: [
        { title: "Farm Subsidy Reform", description: "Restructure agricultural subsidies to support sustainable farming practices.", impactLevel: "High - 2M farms affected" },
        { title: "Agricultural Research Investment", description: "Increase funding for agricultural research and development programs.", impactLevel: "Medium - Innovation support" },
        { title: "Food Safety Modernization", description: "Strengthen food safety regulations and inspection capabilities.", impactLevel: "High - Consumer protection" },
        { title: "Rural Economic Development", description: "Support rural business development and entrepreneurship programs.", impactLevel: "Medium - Economic diversification" },
        { title: "Agricultural Technology Adoption", description: "Incentivize adoption of precision agriculture and modern farming technology.", impactLevel: "Medium - Farm productivity" },
        { title: "Rural Infrastructure Investment", description: "Improve rural roads, utilities, and communication infrastructure.", impactLevel: "High - Rural connectivity" },
        { title: "Sustainable Agriculture Incentives", description: "Provide incentives for organic farming and sustainable practices.", impactLevel: "Medium - Environmental benefits" },
        { title: "Beginning Farmer Support", description: "Provide loans and assistance for new and beginning farmers.", impactLevel: "Medium - Next generation farmers" }
      ]
    },
    {
      category: "immigration",
      categoryName: "Immigration",
      image: "https://images.pexels.com/photos/12199410/pexels-photo-12199410.jpeg",
      policies: [
        { title: "Border Security Enhancement", description: "Increase border patrol agents and surveillance technology along all U.S. borders.", impactLevel: "High - Border security" },
        { title: "Immigration Court Expansion", description: "Hire additional immigration judges to reduce case backlogs.", impactLevel: "High - Legal processing" },
        { title: "E-Verify Mandate", description: "Require all employers to use E-Verify system for employment eligibility verification.", impactLevel: "High - Employment verification" },
        { title: "DACA Program Termination", description: "End the Deferred Action for Childhood Arrivals program.", impactLevel: "High - 640K recipients affected" },
        { title: "Legal Immigration Reduction", description: "Reduce annual legal immigration levels by 50% over five years.", impactLevel: "High - Immigration levels" },
        { title: "Deportation Enforcement Expansion", description: "Increase resources for locating and deporting undocumented immigrants.", impactLevel: "High - Immigration enforcement" },
        { title: "Refugee Admission Reduction", description: "Reduce annual refugee admissions to 15,000 per year.", impactLevel: "High - Humanitarian protection" },
        { title: "Immigration Detention Expansion", description: "Build additional immigration detention facilities nationwide.", impactLevel: "Medium - Detention capacity" }
      ]
    }
  ];

  // Generate all policies
  allCategories.forEach(({ category, categoryName, image, policies: categoryPolicies }) => {
    categoryPolicies.forEach(policy => {
      const votes = generateVotes();
      policies.push({
        id,
        title: policy.title,
        description: policy.description,
        category,
        categoryName,
        image,
        supportVotes: votes.supportVotes,
        opposeVotes: votes.opposeVotes,
        endDate,
        impactLevel: policy.impactLevel
      });
      id++;
    });
  });

  return policies;
};

const mockPolicies = generateExpandedPolicies();

// Home Component with Routing
const Home = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(category || 'all');

  const handleCategoryChange = (newCategory) => {
    setActiveCategory(newCategory);
    if (newCategory === 'all') {
      navigate('/');
    } else {
      navigate(`/category/${newCategory}`);
    }
  };

  const filteredPolicies = useMemo(() => {
    if (activeCategory === 'all') {
      return mockPolicies;
    }
    return mockPolicies.filter(policy => policy.category === activeCategory);
  }, [activeCategory]);

  React.useEffect(() => {
    if (category && category !== activeCategory) {
      setActiveCategory(category);
    } else if (!category && activeCategory !== 'all') {
      setActiveCategory('all');
    }
  }, [category, activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <StatsSection totalPolicies={mockPolicies.length} />
      <NavigationTabs 
        activeCategory={activeCategory} 
        setActiveCategory={handleCategoryChange} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <div className="text-2xl font-light text-blue-600">{mockPolicies.length}</div>
              <div className="text-sm text-gray-600 font-light">Active Policies</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPolicies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-lg font-light hover:bg-gray-50 transition-colors">
            Load More Policies
          </button>
        </div>
      </main>
    </div>
  );
};

// My Votes Page
const MyVotesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">My Voting History</h1>
          <p className="text-xl text-gray-600 font-light">Track your civic participation and voting patterns</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🗳️</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Start Voting to See Your History</h3>
            <p className="text-gray-600 font-light mb-6">
              Once you begin voting on policies, your voting history and preferences will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:category" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/my-votes" element={<MyVotesPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;