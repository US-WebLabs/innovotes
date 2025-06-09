import React, { useState, useMemo } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Header, NavigationTabs, PolicyCard, HeroSection, StatsSection, Footer, HowItWorksPage, SignUpPage, LoginPage, NotFoundPage } from './components';

// Complete Mock Policy Data based on Big Beautiful Bill (200+ policies)
const generateMockPolicies = () => {
  const policies = [];
  const endDate = "Jul 31, 2025"; // All voting ends July 31, 2025
  
  // Helper function to generate realistic vote counts
  const generateVotes = () => {
    const total = Math.floor(Math.random() * 3000000) + 500000; // 500K to 3.5M total votes
    const supportRatio = Math.random();
    return {
      supportVotes: Math.floor(total * supportRatio),
      opposeVotes: Math.floor(total * (1 - supportRatio))
    };
  };

  // TAXATION POLICIES (30 policies)
  const taxationPolicies = [
    { title: "Permanent Extension of 2017 Tax Cuts", description: "Make the individual tax rate reductions from the Tax Cuts and Jobs Act permanent, preventing automatic expiration in 2025.", impactLevel: "High - $1.2T budget impact" },
    { title: "Tax-Free Status for Tips and Overtime Pay", description: "Eliminate federal income tax on tip income and overtime wages for workers across all industries.", impactLevel: "Medium - $89B revenue reduction" },
    { title: "SALT Deduction Cap Increase", description: "Raise the state and local tax deduction cap from $10,000 to $40,000 annually for taxpayers.", impactLevel: "Medium - $67B revenue reduction" },
    { title: "Electric Vehicle Annual Fee ($250)", description: "Implement a $250 annual federal fee for electric vehicle owners to fund Highway Trust Fund infrastructure.", impactLevel: "Low - $3.2B revenue generation" },
    { title: "Hybrid Vehicle Annual Fee ($100)", description: "Establish a $100 annual federal fee for hybrid vehicle owners to support road maintenance funding.", impactLevel: "Low - $1.8B revenue generation" },
    { title: "Corporate Tax Rate Reduction", description: "Lower corporate tax rate from 21% to 18% to stimulate business investment and job creation.", impactLevel: "High - $245B revenue reduction" },
    { title: "Capital Gains Tax Indexation", description: "Index capital gains taxes to inflation to prevent taxation of inflationary gains on investments.", impactLevel: "Medium - $34B revenue reduction" },
    { title: "Estate Tax Elimination", description: "Permanently repeal the federal estate tax on inherited wealth and property transfers.", impactLevel: "Medium - $17B revenue reduction" },
    { title: "Small Business 20% Deduction Extension", description: "Make the Section 199A small business deduction permanent for pass-through entities.", impactLevel: "Medium - $42B revenue reduction" },
    { title: "Research & Development Tax Credit Enhancement", description: "Increase R&D tax credits from 20% to 25% for qualifying research expenditures.", impactLevel: "Medium - $18B revenue reduction" },
    { title: "Opportunity Zone Extension", description: "Extend Opportunity Zone tax incentives for 10 additional years in designated low-income areas.", impactLevel: "Medium - $12B revenue reduction" },
    { title: "Bonus Depreciation Permanent Extension", description: "Make 100% bonus depreciation permanent for business equipment and machinery purchases.", impactLevel: "High - $156B revenue reduction" },
    { title: "Child Tax Credit Expansion", description: "Increase the Child Tax Credit from $2,000 to $3,000 per child under 18 years old.", impactLevel: "High - $97B revenue reduction" },
    { title: "Earned Income Tax Credit Enhancement", description: "Expand EITC eligibility and increase credit amounts for working families with children.", impactLevel: "Medium - $28B revenue reduction" },
    { title: "Mortgage Interest Deduction Restoration", description: "Restore mortgage interest deduction cap from $750,000 to $1,000,000 for home purchases.", impactLevel: "Medium - $23B revenue reduction" },
    { title: "Student Loan Interest Deduction Expansion", description: "Remove income limits and increase annual deduction cap for student loan interest payments.", impactLevel: "Low - $8B revenue reduction" },
    { title: "Medical Expense Deduction Threshold Reduction", description: "Lower medical expense deduction threshold from 7.5% to 5% of adjusted gross income.", impactLevel: "Medium - $15B revenue reduction" },
    { title: "Charitable Deduction Above-the-Line", description: "Allow charitable deductions for non-itemizing taxpayers up to $600 annually.", impactLevel: "Low - $6B revenue reduction" },
    { title: "Energy Efficiency Tax Credits", description: "Extend and enhance tax credits for home energy efficiency improvements and installations.", impactLevel: "Medium - $12B revenue reduction" },
    { title: "First-Time Homebuyer Tax Credit", description: "Establish a $10,000 refundable tax credit for first-time home purchases.", impactLevel: "Medium - $22B revenue reduction" },
    { title: "Military Spouse Employment Tax Credit", description: "Create tax credits for employers hiring military spouses to address employment challenges.", impactLevel: "Low - $3B revenue reduction" },
    { title: "Rural Business Investment Credit", description: "Establish enhanced tax credits for businesses investing in rural and underserved communities.", impactLevel: "Low - $5B revenue reduction" },
    { title: "Alternative Minimum Tax Repeal", description: "Eliminate the Alternative Minimum Tax for both individual and corporate taxpayers.", impactLevel: "Medium - $19B revenue reduction" },
    { title: "Retirement Savings Enhancement", description: "Increase 401(k) and IRA contribution limits by 50% for workers over age 50.", impactLevel: "Medium - $14B revenue reduction" },
    { title: "Small Business Equipment Expensing", description: "Raise Section 179 equipment expensing limits from $1M to $2M for small businesses.", impactLevel: "Low - $7B revenue reduction" },
    { title: "Digital Services Tax Elimination", description: "Prohibit state and local governments from imposing taxes on digital services and platforms.", impactLevel: "Medium - $8B revenue reduction" },
    { title: "Cryptocurrency Tax Clarification", description: "Establish clear tax guidelines for cryptocurrency transactions and mining operations.", impactLevel: "Medium - Regulatory clarity" },
    { title: "International Tax Competition Act", description: "Reduce corporate tax rates to compete with international tax havens and retain businesses.", impactLevel: "High - $89B revenue reduction" },
    { title: "Family Business Succession Planning", description: "Provide tax relief for family business transfers and succession planning.", impactLevel: "Medium - $12B revenue reduction" },
    { title: "Angel Investor Tax Credit Program", description: "Create federal tax credits for angel investors supporting startup companies.", impactLevel: "Low - $4B revenue reduction" }
  ];

  // HEALTHCARE POLICIES (25 policies)
  const healthcarePolicies = [
    { title: "Medicaid Work Requirements", description: "Require able-bodied adults without children to work or participate in job training to receive Medicaid benefits.", impactLevel: "High - 5.2M people affected" },
    { title: "Gender-Affirming Care Medicaid Restrictions", description: "Prohibit federal Medicaid funding for gender-affirming medical treatments starting in 2027.", impactLevel: "Medium - 180K people affected" },
    { title: "Abortion Services Medicaid Funding Ban", description: "Restrict Medicaid funding for nonprofit organizations that provide abortion services or referrals.", impactLevel: "High - 2.1M women affected" },
    { title: "Medicare Advantage Expansion", description: "Expand Medicare Advantage options and increase federal support for private Medicare plans.", impactLevel: "High - 28M beneficiaries affected" },
    { title: "Health Savings Account Enhancement", description: "Increase HSA contribution limits and expand eligible expenses to include fitness memberships.", impactLevel: "Medium - 15M account holders affected" },
    { title: "Prescription Drug Price Transparency", description: "Require pharmaceutical companies to disclose drug pricing information in direct-to-consumer advertising.", impactLevel: "Medium - Industry-wide impact" },
    { title: "Telemedicine Permanent Authorization", description: "Make temporary COVID-era telemedicine flexibilities permanent for Medicare and Medicaid.", impactLevel: "High - 45M patients affected" },
    { title: "Mental Health Parity Enforcement", description: "Strengthen enforcement of mental health parity laws in insurance coverage and provider networks.", impactLevel: "High - 75M Americans affected" },
    { title: "Medical Malpractice Reform", description: "Establish federal caps on non-economic damages in medical malpractice lawsuits.", impactLevel: "Medium - Healthcare provider impact" },
    { title: "Interstate Insurance Sales", description: "Allow health insurance companies to sell policies across state lines to increase competition.", impactLevel: "Medium - Insurance market impact" },
    { title: "Association Health Plans Expansion", description: "Expand access to Association Health Plans for small businesses and self-employed individuals.", impactLevel: "Medium - 12M workers affected" },
    { title: "Short-Term Health Plan Extension", description: "Extend maximum duration of short-term health insurance plans from 3 months to 12 months.", impactLevel: "Medium - 2.5M consumers affected" },
    { title: "Price Transparency Hospital Requirements", description: "Require hospitals to publish standard charges for all services and procedures online.", impactLevel: "High - All hospitals affected" },
    { title: "Direct Primary Care Recognition", description: "Establish federal recognition and tax advantages for direct primary care arrangements.", impactLevel: "Medium - Primary care sector impact" },
    { title: "Medical Device Innovation Incentives", description: "Accelerate FDA approval processes and provide tax incentives for breakthrough medical devices.", impactLevel: "Medium - Medical device industry" },
    { title: "Rural Hospital Support Program", description: "Establish federal grants and loan programs to support struggling rural hospitals.", impactLevel: "High - 1,800 rural hospitals" },
    { title: "Nursing Workforce Development", description: "Fund nursing education programs and loan forgiveness to address healthcare worker shortages.", impactLevel: "High - Nursing profession" },
    { title: "Medical Research Funding Increase", description: "Increase NIH funding by 25% over five years for medical research and drug development.", impactLevel: "High - $12B increase" },
    { title: "Veterans Healthcare Expansion", description: "Expand VA healthcare eligibility and improve mental health services for veterans.", impactLevel: "High - 9M veterans affected" },
    { title: "Maternal Mortality Prevention", description: "Fund state programs to reduce maternal mortality rates and improve pregnancy outcomes.", impactLevel: "Medium - $500M program" },
    { title: "Opioid Treatment Expansion", description: "Expand access to medication-assisted treatment for opioid addiction in underserved areas.", impactLevel: "High - 2M Americans in treatment" },
    { title: "Healthcare Cybersecurity Standards", description: "Establish mandatory cybersecurity standards for healthcare providers and medical devices.", impactLevel: "Medium - Healthcare industry" },
    { title: "Pediatric Care Access Improvement", description: "Increase Medicaid reimbursement rates for pediatric specialists and children's hospitals.", impactLevel: "High - 37M children affected" },
    { title: "Long-Term Care Reform", description: "Restructure long-term care financing and improve quality standards for nursing facilities.", impactLevel: "High - 1.4M nursing home residents" },
    { title: "Public Health Emergency Preparedness", description: "Strengthen federal and state capabilities to respond to future health emergencies.", impactLevel: "High - National preparedness" }
  ];

  // DEFENSE & SECURITY POLICIES (28 policies)
  const defensePolicies = [
    { title: "$150B Additional Defense Spending", description: "Increase annual defense budget by $150 billion for military modernization and readiness improvements.", impactLevel: "High - 18% defense budget increase" },
    { title: "$25B Golden Dome Defense System", description: "Fund development and deployment of advanced missile defense system for homeland security.", impactLevel: "Medium - 5-year development program" },
    { title: "$50B Border Wall Construction", description: "Complete border wall construction along the southern U.S. border with Mexico using federal funding.", impactLevel: "High - 1,200 miles of construction" },
    { title: "$4B Border Patrol Enhancement", description: "Increase Border Patrol agent recruitment and provide advanced surveillance technology.", impactLevel: "Medium - 10,000 new agents" },
    { title: "Space Force Expansion", description: "Double Space Force personnel and establish new space-based defense capabilities.", impactLevel: "High - National security priority" },
    { title: "Hypersonic Weapons Development", description: "Accelerate development and deployment of hypersonic missile systems for national defense.", impactLevel: "High - $15B investment" },
    { title: "Naval Fleet Modernization", description: "Fund construction of 50 new naval vessels over the next decade including submarines and destroyers.", impactLevel: "High - $85B naval expansion" },
    { title: "Air Force Fighter Jet Procurement", description: "Purchase 200 additional F-35 fighter jets and upgrade existing aircraft systems.", impactLevel: "High - $45B aircraft purchase" },
    { title: "Cybersecurity Defense Initiative", description: "Establish comprehensive federal cybersecurity program to protect critical infrastructure.", impactLevel: "High - $12B cyber defense" },
    { title: "Military Base Infrastructure", description: "Modernize and expand military base facilities across all service branches.", impactLevel: "Medium - $25B infrastructure" },
    { title: "Veterans Benefits Enhancement", description: "Increase disability compensation rates and expand healthcare benefits for veterans.", impactLevel: "High - 19M veterans affected" },
    { title: "National Guard Modernization", description: "Upgrade National Guard equipment and increase federal funding for state operations.", impactLevel: "Medium - 450,000 Guard members" },
    { title: "Intelligence Community Expansion", description: "Increase personnel and capabilities across intelligence agencies for national security.", impactLevel: "High - Intelligence operations" },
    { title: "Counter-Terrorism Operations", description: "Enhance domestic counter-terrorism capabilities and international cooperation efforts.", impactLevel: "High - National security" },
    { title: "Military Personnel Pay Increase", description: "Provide 4.5% pay raise for all military personnel across all service branches.", impactLevel: "Medium - 2.1M service members" },
    { title: "Defense Manufacturing Expansion", description: "Increase domestic defense manufacturing capacity and reduce foreign dependency.", impactLevel: "High - Defense industrial base" },
    { title: "Arctic Defense Strategy", description: "Establish new Arctic military installations and capabilities to counter foreign threats.", impactLevel: "Medium - Arctic operations" },
    { title: "Joint Strike Fighter Program", description: "Continue development of next-generation fighter aircraft with allied nations.", impactLevel: "High - $20B program" },
    { title: "Military Medical Research", description: "Fund advanced medical research for combat casualty care and veteran healthcare.", impactLevel: "Medium - $3B research funding" },
    { title: "Homeland Security Technology", description: "Deploy advanced screening technology at airports, ports, and border crossings.", impactLevel: "Medium - $8B technology upgrade" },
    { title: "Emergency Response Capabilities", description: "Enhance federal disaster response capabilities and equipment stockpiles.", impactLevel: "Medium - FEMA operations" },
    { title: "Critical Infrastructure Protection", description: "Strengthen protection of power grids, water systems, and transportation networks.", impactLevel: "High - Infrastructure security" },
    { title: "Military Housing Improvement", description: "Renovate and build new housing facilities for military families on bases.", impactLevel: "Medium - $12B housing program" },
    { title: "Defense Research Partnerships", description: "Expand university partnerships for defense research and technology development.", impactLevel: "Medium - Research collaboration" },
    { title: "Coast Guard Fleet Expansion", description: "Modernize and expand Coast Guard vessels and equipment for maritime security.", impactLevel: "Medium - Maritime protection" },
    { title: "Nuclear Arsenal Modernization", description: "Update and maintain nuclear weapons systems and delivery platforms.", impactLevel: "High - Nuclear deterrence" },
    { title: "Special Operations Enhancement", description: "Expand special operations capabilities and training facilities.", impactLevel: "Medium - Elite forces" },
    { title: "International Defense Cooperation", description: "Strengthen defense partnerships and joint training exercises with allies.", impactLevel: "Medium - Global alliances" }
  ];

  // ENERGY POLICIES (22 policies)
  const energyPolicies = [
    { title: "Clean Energy Tax Credit Repeal", description: "Eliminate tax incentives for solar, wind, and other renewable energy installations from the Inflation Reduction Act.", impactLevel: "High - $369B program elimination" },
    { title: "Electric Vehicle Incentive Elimination", description: "Remove federal tax credits for electric vehicle purchases, including the $7,500 EV tax credit.", impactLevel: "Medium - $7.5B annual program" },
    { title: "Domestic Oil Production Expansion", description: "Open federal lands for oil and gas exploration and streamline drilling permit processes.", impactLevel: "High - Energy independence" },
    { title: "Natural Gas Pipeline Acceleration", description: "Fast-track approval of natural gas pipeline projects for energy transportation.", impactLevel: "High - Energy infrastructure" },
    { title: "Nuclear Power Renaissance", description: "Accelerate nuclear power plant construction and extend existing plant licenses.", impactLevel: "High - Clean energy baseload" },
    { title: "Coal Industry Support", description: "Provide financial support and regulatory relief for coal-powered electricity generation.", impactLevel: "Medium - Coal industry jobs" },
    { title: "Strategic Petroleum Reserve Expansion", description: "Double the capacity of the Strategic Petroleum Reserve for national energy security.", impactLevel: "Medium - Energy security" },
    { title: "LNG Export Facility Development", description: "Accelerate construction of liquefied natural gas export terminals for global markets.", impactLevel: "High - Energy exports" },
    { title: "Grid Modernization Initiative", description: "Upgrade electrical grid infrastructure for improved reliability and efficiency.", impactLevel: "High - $75B grid investment" },
    { title: "Energy Independence Act", description: "Achieve complete energy independence from foreign oil imports within 10 years.", impactLevel: "High - National energy policy" },
    { title: "Fracking Technology Support", description: "Provide research funding and regulatory support for hydraulic fracturing technology.", impactLevel: "Medium - Domestic energy production" },
    { title: "Energy Storage Development", description: "Fund development of advanced battery and energy storage technologies.", impactLevel: "Medium - $15B investment" },
    { title: "Critical Mineral Mining", description: "Streamline permitting for domestic mining of critical minerals for energy technology.", impactLevel: "High - Supply chain security" },
    { title: "Offshore Wind Moratorium", description: "Place 10-year moratorium on new offshore wind projects pending environmental review.", impactLevel: "High - Renewable energy sector" },
    { title: "Energy Efficiency Standards Rollback", description: "Eliminate energy efficiency standards for appliances and industrial equipment.", impactLevel: "Medium - Regulatory relief" },
    { title: "Carbon Capture Technology", description: "Fund development of carbon capture and storage technology for fossil fuel plants.", impactLevel: "Medium - $8B technology program" },
    { title: "Biofuel Production Incentives", description: "Expand incentives for ethanol and biodiesel production from domestic sources.", impactLevel: "Medium - Agricultural energy sector" },
    { title: "Energy Transportation Infrastructure", description: "Improve pipelines, transmission lines, and energy transportation networks.", impactLevel: "High - $45B infrastructure" },
    { title: "Offshore Drilling Expansion", description: "Open new offshore areas for oil and gas exploration along U.S. coasts.", impactLevel: "High - Energy production" },
    { title: "Renewable Energy Permitting Reform", description: "Streamline federal permitting processes for renewable energy projects on public lands.", impactLevel: "Medium - Project development" },
    { title: "Hydroelectric Power Modernization", description: "Upgrade existing hydroelectric facilities and remove barriers to new construction.", impactLevel: "Medium - Renewable baseload" },
    { title: "Energy Research and Development", description: "Increase federal funding for energy innovation and breakthrough technologies.", impactLevel: "Medium - Technology advancement" }
  ];

  // SOCIAL PROGRAMS (25 policies)
  const socialPolicies = [
    { title: "SNAP Benefit Cost-Sharing Reform", description: "Shift 5% of SNAP benefit costs and 75% of administrative costs from federal to state governments.", impactLevel: "High - 42M recipients affected" },
    { title: "Enhanced SNAP Eligibility Requirements", description: "Implement stricter work requirements and asset limits for Supplemental Nutrition Assistance Program eligibility.", impactLevel: "High - 6.2M people lose benefits" },
    { title: "Temporary Assistance Work Requirements", description: "Strengthen work requirements for Temporary Assistance for Needy Families (TANF) recipients.", impactLevel: "High - 2.5M families affected" },
    { title: "Social Security Disability Review", description: "Increase frequency of disability benefit reviews and tighten eligibility criteria.", impactLevel: "High - 12M beneficiaries affected" },
    { title: "Unemployment Insurance Reform", description: "Reduce maximum unemployment benefit duration from 26 weeks to 20 weeks.", impactLevel: "Medium - Unemployment system" },
    { title: "Housing Assistance Restructuring", description: "Convert federal housing assistance programs to block grants managed by states.", impactLevel: "High - 5M households affected" },
    { title: "School Lunch Program Changes", description: "Modify nutritional standards and eligibility requirements for federal school meal programs.", impactLevel: "High - 30M students affected" },
    { title: "Head Start Program Restructuring", description: "Convert Head Start early childhood education program to state-managed block grants.", impactLevel: "Medium - 1M children affected" },
    { title: "Childcare Assistance Limitations", description: "Implement stricter income limits and work requirements for federal childcare assistance.", impactLevel: "Medium - 1.6M families affected" },
    { title: "Energy Assistance Program Cuts", description: "Reduce funding for Low Income Home Energy Assistance Program (LIHEAP) by 25%.", impactLevel: "Medium - 6M households affected" },
    { title: "Community Development Block Grants", description: "Eliminate Community Development Block Grant program for local infrastructure projects.", impactLevel: "Medium - 1,200 communities affected" },
    { title: "WIC Program Modifications", description: "Tighten eligibility and reduce benefit amounts for Women, Infants, and Children program.", impactLevel: "High - 6.2M participants affected" },
    { title: "Social Services Block Grant Elimination", description: "Eliminate federal Social Services Block Grant funding to states.", impactLevel: "Medium - State social services" },
    { title: "Elder Care Support Reduction", description: "Reduce federal funding for Older Americans Act programs including meal delivery.", impactLevel: "Medium - 11M seniors affected" },
    { title: "Disability Services Restructuring", description: "Convert federal disability services to state-managed programs with reduced funding.", impactLevel: "High - Disability community" },
    { title: "Rural Development Program Cuts", description: "Reduce funding for USDA rural development and infrastructure programs.", impactLevel: "Medium - Rural communities" },
    { title: "Job Training Program Consolidation", description: "Consolidate multiple federal job training programs into single state-managed program.", impactLevel: "Medium - Workforce development" },
    { title: "Public Transportation Funding Cuts", description: "Reduce federal funding for public transportation systems in urban areas.", impactLevel: "Medium - Public transit systems" },
    { title: "Community Health Center Funding", description: "Reduce federal funding for Federally Qualified Health Centers by 30%.", impactLevel: "High - 30M patients affected" },
    { title: "Legal Aid Funding Elimination", description: "Eliminate federal funding for Legal Services Corporation providing legal aid to low-income Americans.", impactLevel: "Medium - Legal aid access" },
    { title: "Foster Care System Reform", description: "Restructure federal foster care funding and oversight mechanisms.", impactLevel: "High - 400K children in care" },
    { title: "Homeless Services Consolidation", description: "Combine federal homeless assistance programs into single block grant system.", impactLevel: "High - 580K homeless individuals" },
    { title: "Food Bank Support Reduction", description: "Reduce federal support for food banks and emergency food assistance programs.", impactLevel: "Medium - Food security networks" },
    { title: "Senior Nutrition Program Changes", description: "Modify eligibility and funding for senior meal delivery and nutrition programs.", impactLevel: "Medium - 2.4M seniors affected" },
    { title: "Workforce Development Restructuring", description: "Combine job training and employment services into state-managed programs.", impactLevel: "Medium - Employment services" }
  ];

  // TECHNOLOGY & EDUCATION (25 policies)
  const educationTechPolicies = [
    { title: "10-Year AI Regulation Moratorium", description: "Prevent states from enforcing artificial intelligence regulations for 10 years to promote innovation.", impactLevel: "Medium - Federal preemption policy" },
    { title: "School Choice Expansion", description: "Establish federal education savings accounts for private school tuition and educational expenses.", impactLevel: "High - $10B voucher program" },
    { title: "Student Loan Forgiveness Elimination", description: "Eliminate all federal student loan forgiveness programs including Public Service Loan Forgiveness.", impactLevel: "High - 45M borrowers affected" },
    { title: "Common Core Standards Repeal", description: "Prohibit federal funding for states implementing Common Core educational standards.", impactLevel: "High - K-12 education standards" },
    { title: "Title I Education Funding Cuts", description: "Reduce federal Title I funding for schools with high percentages of low-income students.", impactLevel: "High - 50,000 schools affected" },
    { title: "Federal Education Department Restructuring", description: "Significantly reduce Department of Education staff and transfer responsibilities to states.", impactLevel: "High - Federal education oversight" },
    { title: "University Research Funding Cuts", description: "Reduce federal research grants to universities by 40% over five years.", impactLevel: "High - Higher education research" },
    { title: "STEM Education Initiative", description: "Increase funding for science, technology, engineering, and mathematics education programs.", impactLevel: "Medium - $5B STEM investment" },
    { title: "Tech Innovation Zones", description: "Establish special economic zones with reduced regulations for technology companies.", impactLevel: "Medium - Tech industry development" },
    { title: "Broadband Infrastructure Investment", description: "Fund rural broadband expansion to achieve universal internet access.", impactLevel: "High - $30B broadband program" },
    { title: "Data Privacy Regulation Preemption", description: "Prevent states from implementing data privacy laws stricter than federal standards.", impactLevel: "Medium - Tech regulation" },
    { title: "5G Network Acceleration", description: "Fast-track 5G wireless network deployment and reduce regulatory barriers.", impactLevel: "High - Telecommunications infrastructure" },
    { title: "Quantum Computing Investment", description: "Establish national quantum computing research initiative with $10B funding.", impactLevel: "High - Technology leadership" },
    { title: "Semiconductor Manufacturing Support", description: "Provide incentives for domestic semiconductor manufacturing facilities.", impactLevel: "High - Supply chain security" },
    { title: "Special Education Funding Changes", description: "Convert federal special education funding to block grants with reduced oversight.", impactLevel: "High - 7M students affected" },
    { title: "Teacher Preparation Program Reform", description: "Eliminate federal oversight of teacher preparation programs in universities.", impactLevel: "Medium - Teacher education" },
    { title: "Educational Technology Investment", description: "Fund deployment of educational technology in K-12 schools nationwide.", impactLevel: "Medium - Digital learning" },
    { title: "Adult Education Program Cuts", description: "Reduce federal funding for adult basic education and literacy programs.", impactLevel: "Medium - Adult learners" },
    { title: "Digital Divide Elimination", description: "Ensure all students have access to high-speed internet and devices for learning.", impactLevel: "High - Educational equity" },
    { title: "Vocational Training Expansion", description: "Increase funding for trade schools and vocational training programs.", impactLevel: "Medium - Skills development" },
    { title: "Charter School Authorization", description: "Remove barriers to charter school establishment and expand funding options.", impactLevel: "High - School choice" },
    { title: "Higher Education Accountability", description: "Implement stricter accountability measures for colleges and universities receiving federal funding.", impactLevel: "High - Higher education quality" },
    { title: "Student Privacy Protection", description: "Strengthen data protection laws for student educational records and information.", impactLevel: "Medium - Student rights" },
    { title: "Early Childhood Education Reform", description: "Restructure federal early childhood education programs and funding mechanisms.", impactLevel: "High - Early learning" },
    { title: "Digital Literacy Requirements", description: "Establish federal standards for digital literacy education in K-12 curricula.", impactLevel: "Medium - 21st century skills" }
  ];

  // Combine all policies with IDs and common properties
  let id = 1;
  const allPolicyArrays = [
    { policies: taxationPolicies, category: "taxation", categoryName: "Taxation", image: "https://images.pexels.com/photos/4386367/pexels-photo-4386367.jpeg" },
    { policies: healthcarePolicies, category: "healthcare", categoryName: "Healthcare", image: "https://images.pexels.com/photos/7163956/pexels-photo-7163956.jpeg" },
    { policies: defensePolicies, category: "defense", categoryName: "Defense & Security", image: "https://images.pexels.com/photos/12199410/pexels-photo-12199410.jpeg" },
    { policies: energyPolicies, category: "energy", categoryName: "Energy", image: "https://images.unsplash.com/photo-1572449210329-d0bd8b8582f6" },
    { policies: socialPolicies, category: "social", categoryName: "Social Programs", image: "https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg" },
    { policies: educationTechPolicies, category: "technology", categoryName: "Technology", image: "https://images.unsplash.com/photo-1547067592-463a85de7fd1" },
    { policies: infrastructurePolicies, category: "infrastructure", categoryName: "Infrastructure", image: "https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg" },
    { policies: agriculturePolicies, category: "agriculture", categoryName: "Agriculture", image: "https://images.pexels.com/photos/4386367/pexels-photo-4386367.jpeg" },
    { policies: immigrationPolicies, category: "immigration", categoryName: "Immigration", image: "https://images.pexels.com/photos/12199410/pexels-photo-12199410.jpeg" }
  ];

  allPolicyArrays.forEach(({ policies: policyArray, category, categoryName, image }) => {
    policyArray.forEach(policy => {
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

const mockPolicies = generateMockPolicies();

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