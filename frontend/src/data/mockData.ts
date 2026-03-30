import type { Hackathon, Idea, Contributor, TrendData } from '../types';

export const HACKATHONS: Hackathon[] = [
  {
    id: 1, title: 'AI for Social Good 2026', org: 'Google & NASSCOM', status: 'live', domain: 'AI/ML',
    desc: 'Build AI-powered solutions to tackle pressing social challenges — healthcare access, education equity, climate action, and civic technology. Open to all developers, designers, and researchers globally.',
    prize: '₹10,00,000', participants: 1240, spots: 2000, start: '2026-03-15', end: '2026-04-20',
    tags: ['AI/ML', 'Social Impact', 'Open Source'], emoji: '🤖',
    color: 'linear-gradient(135deg,#0a2a1a,#0a1c2e)', accent: '#00c896',
    rules: [
      'Teams of 2–4 members', 'Original code only — no pre-built projects',
      'All submissions must be open-source during the event', 'Focus on real-world impact, not just demos',
      'Final submission must include a working prototype'
    ],
    timeline: [
      { time: 'Mar 15, 6:00 PM', label: 'Kickoff & Team Formation', sub: 'Opening ceremony + problem statement reveal', done: true },
      { time: 'Mar 20, 10:00 AM', label: 'Mentorship Sessions', sub: '1:1 sessions with industry experts', done: true },
      { time: 'Apr 18, 2:00 PM', label: 'Submission Deadline', sub: 'Code freeze — all PRs must be merged', done: false },
      { time: 'Apr 20, 4:00 PM', label: 'Project Pitches & Awards', sub: 'Live demos to panel judges', done: false }
    ],
    faqs: [
      { q: 'Can I participate alone?', a: "While teams are encouraged, solo participation is allowed. You'll have access to all mentorship resources." },
      { q: 'What are the prizes?', a: '₹5,00,000 for 1st place, ₹3,00,000 for 2nd, ₹2,00,000 for 3rd. Track-specific prizes also available.' },
      { q: 'Is food provided?', a: 'Yes, all meals and snacks are provided throughout the event for in-person participants. Remote participants get a food voucher.' }
    ]
  },
  {
    id: 2, title: 'Web3 Buildathon S2', org: 'Polygon Labs', status: 'live', domain: 'Web3',
    desc: 'Create decentralized applications that push boundaries on-chain. DeFi, NFTs, DAOs, gaming — bring your most ambitious Web3 vision. $15K in bounties available from protocol partners.',
    prize: '$50,000', participants: 890, spots: 1500, start: '2026-03-20', end: '2026-04-25',
    tags: ['Blockchain', 'DeFi', 'NFT'], emoji: '⛓️',
    color: 'linear-gradient(135deg,#0a0f2a,#1a0a2e)', accent: '#a78bfa',
    rules: [
      'Must deploy on Polygon mainnet or Mumbai testnet', 'Smart contracts must be audited by submission',
      'UI/UX is a judging criterion — not just functionality', 'Include a 3-minute demo video', 'Open source required'
    ],
    timeline: [
      { time: 'Mar 20', label: 'Registration Opens', sub: 'Team formation + idea pitching', done: true },
      { time: 'Apr 1', label: 'Hacking Begins', sub: '48-hour build sprint start', done: false },
      { time: 'Apr 22', label: 'Submission Deadline', sub: 'Final code + demo video due', done: false },
      { time: 'Apr 25', label: 'Demo Day', sub: 'Live judging via Zoom', done: false }
    ],
    faqs: [
      { q: 'Which chains are supported?', a: 'Polygon PoS, zkEVM, and Mumbai testnet. Bonus points for zkEVM deployment.' },
      { q: 'Are there prizes for specific tracks?', a: 'Yes — DeFi, Gaming, and Social Impact tracks each have $5,000 dedicated prizes on top of the main prize pool.' }
    ]
  },
  {
    id: 3, title: 'HealthTech Innovation Sprint', org: 'Apollo Hospitals × Startupindia', status: 'live', domain: 'HealthTech',
    desc: 'Design technology solutions for next-gen patient care, preventive medicine, and healthcare accessibility for Tier-2/3 India.',
    prize: '₹5,00,000', participants: 670, spots: 1000, start: '2026-04-01', end: '2026-05-10',
    tags: ['Health', 'IoT', 'ML'], emoji: '🏥',
    color: 'linear-gradient(135deg,#0a1a20,#0a200f)', accent: '#34d399',
    rules: [
      'Must address a real clinical problem — letters from healthcare providers encouraged',
      'HIPAA/DISHA compliance required for any patient data',
      'Teams must include at least one healthcare professional', 'Working prototype mandatory', 'IP stays with the team'
    ],
    timeline: [
      { time: 'Apr 1', label: 'Kickoff', sub: 'Problem statements released', done: false },
      { time: 'Apr 15', label: 'Checkpoint', sub: 'Progress review with mentors', done: false },
      { time: 'May 8', label: 'Submission', sub: 'Final build + 5-page report', done: false },
      { time: 'May 10', label: 'Grand Finale', sub: 'Pitch at Apollo HQ, Mumbai', done: false }
    ],
    faqs: [
      { q: 'Do I need medical credentials?', a: 'No, but your team should include someone with clinical domain knowledge.' },
      { q: 'Can we use existing open-source health datasets?', a: "Yes, as long as you cite them properly and they're publicly licensed." }
    ]
  },
  {
    id: 4, title: 'FinTech Disrupt 2026', org: 'Razorpay + ICICI Bank', status: 'upcoming', domain: 'FinTech',
    desc: 'Reimagine financial services for Bharat. UPI innovation, credit access, insurance, and regulatory technology — everything that makes money move better.',
    prize: '₹8,00,000', participants: 310, spots: 2000, start: '2026-05-01', end: '2026-06-15',
    tags: ['Payments', 'Credit', 'RegTech'], emoji: '💳',
    color: 'linear-gradient(135deg,#1a1a0a,#0a1020)', accent: '#f5a623',
    rules: [
      'Must integrate at least one Razorpay or ICICI API', 'RBI compliance guidelines must be followed',
      'No existing commercial products — new ideas only', 'Open source preferred', 'Financial projections required in pitch'
    ],
    timeline: [
      { time: 'May 1', label: 'Registration Deadline', sub: 'Early applications get API sandbox access', done: false },
      { time: 'May 10', label: 'Hacking Begins', sub: '72-hour build sprint', done: false },
      { time: 'Jun 12', label: 'Final Submissions', sub: 'Code + demo + business pitch', done: false },
      { time: 'Jun 15', label: 'Investor Demo Day', sub: 'Pitch to top VC firms', done: false }
    ],
    faqs: [
      { q: 'Is there mentorship available?', a: 'Yes — weekly office hours with Razorpay and ICICI product leaders.' },
      { q: 'Can international teams apply?', a: 'Yes, but the solution must be deployable in the Indian market.' }
    ]
  },
  {
    id: 5, title: 'EdTech For All Challenge', org: "BYJU'S Foundation", status: 'upcoming', domain: 'EdTech',
    desc: "Create scalable edtech solutions for vernacular learning, skill development, and rural education. Tools that work on feature phones are especially welcome.",
    prize: '₹4,00,000', participants: 180, spots: 1200, start: '2026-05-15', end: '2026-06-30',
    tags: ['Education', 'Vernacular', 'Accessibility'], emoji: '📚',
    color: 'linear-gradient(135deg,#1a100a,#0a1a1a)', accent: '#fb923c',
    rules: [
      'Solution must work in at least 3 Indian languages', 'Must be accessible with 2G connectivity',
      'Target audience: students in Tier-3 cities or rural areas', 'Gamification elements encouraged', 'Free tier must be genuinely free'
    ],
    timeline: [
      { time: 'May 15', label: 'Kickoff', sub: 'Problem statement + dataset release', done: false },
      { time: 'Jun 1', label: 'Mid-check', sub: 'Prototype review', done: false },
      { time: 'Jun 28', label: 'Submission', sub: 'Final build + user testing report', done: false },
      { time: 'Jun 30', label: 'Demo Day', sub: 'Live showcase', done: false }
    ],
    faqs: [
      { q: 'Are NLP/speech tools provided?', a: 'Yes — access to Bhashini API and IndicNLP datasets will be provided.' },
      { q: 'Can we use WhatsApp/SMS as a delivery channel?', a: 'Absolutely encouraged — low-bandwidth delivery mechanisms are a key judging criterion.' }
    ]
  },
  {
    id: 6, title: 'CleanTech & Sustainability Hack', org: 'Tata Cleantech Capital', status: 'past', domain: 'CleanTech',
    desc: 'Solved for a greener planet — energy efficiency, waste management, water tech, and circular economy models.',
    prize: '₹6,00,000', participants: 2100, spots: 2100, start: '2025-10-01', end: '2025-11-15',
    tags: ['Climate', 'Energy', 'Circular Economy'], emoji: '🌿',
    color: 'linear-gradient(135deg,#0a1a0a,#0a0a1a)', accent: '#4d9fff',
    rules: [
      'Focus on measurable environmental impact', 'Scalable to 10,000+ users within 12 months',
      'No green-washing — must have real carbon math', 'Partnerships with certified NGOs a plus'
    ],
    timeline: [
      { time: 'Oct 1, 2025', label: 'Event Started', sub: 'Kickoff ceremony', done: true },
      { time: 'Oct 15, 2025', label: 'Hacking', sub: 'Build sprint week', done: true },
      { time: 'Nov 13, 2025', label: 'Submissions Closed', sub: 'All entries received', done: true },
      { time: 'Nov 15, 2025', label: 'Winners Announced', sub: 'Grand Finale event', done: true }
    ],
    faqs: [
      { q: 'Is this event still accepting applications?', a: 'No — this was a past event. Winners have been announced. Stay tuned for CleanTech Hack 2027.' },
      { q: 'Can I see the winning projects?', a: 'Yes — all projects are open-source and listed on the event GitHub page.' }
    ]
  },
];

export const MOCK_IDEAS: Idea[] = [
  {
    id: 1, title: 'AI-Powered Medication Adherence Coach', domain: 'HealthTech',
    description: 'A conversational AI that helps patients remember to take medication, tracks side effects, and alerts caregivers — reducing readmission rates by up to 40% in pilot tests. Integrates with popular wearables.',
    status: 'SHORTLISTED', totalVoteWeight: 24, recentVotesLastHour: 5, voteHistory: [12, 14, 18, 20, 24],
    createdByUserId: 1, createdByName: 'Priya Sharma', hackathonId: 3,
    rationale: 'Strong clinical impact potential. The caregiver alert loop is a standout differentiator — no other submission addressed readmission reduction this directly.',
    tags: ['AI', 'Healthcare', 'Chatbot'], createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), cmts: []
  },
  {
    id: 2, title: 'Decentralized Micro-lending for Farmers', domain: 'FinTech',
    description: 'Smart contract-based micro-loans for smallholder farmers using satellite data for creditworthiness assessment. No collateral, no bank visits — just fair credit via a mobile-first dApp.',
    status: 'SUBMITTED', totalVoteWeight: 18, recentVotesLastHour: 3, voteHistory: [8, 10, 14, 16, 18],
    createdByUserId: 2, createdByName: 'Rahul Verma', hackathonId: 4,
    tags: ['Web3', 'Agri', 'DeFi'], createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), cmts: []
  },
  {
    id: 3, title: 'Vernacular STEM Learning via WhatsApp', domain: 'EdTech',
    description: 'Interactive STEM curriculum delivered through WhatsApp in 12 Indian languages. Works on feature phones with no app download required. Targeting 50M rural students. Backed by pilot results from 3 states.',
    status: 'SELECTED', totalVoteWeight: 41, recentVotesLastHour: 8, voteHistory: [20, 25, 30, 38, 41],
    createdByUserId: 3, createdByName: 'Ananya Krishnan', hackathonId: 5, rationale: 'Exceptional reach, real pilot data, and zero-infrastructure delivery model.',
    tags: ['Education', 'Accessibility', 'AI'], createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), cmts: []
  },
  {
    id: 4, title: 'Carbon Credit Marketplace for MSMEs', domain: 'CleanTech',
    description: 'A simplified platform for small businesses to measure, reduce, and monetize carbon credits. AI auditing reduces verification cost by 80% versus traditional methods.',
    status: 'SHORTLISTED', totalVoteWeight: 19, recentVotesLastHour: 2, voteHistory: [9, 12, 15, 17, 19],
    createdByUserId: 4, createdByName: 'Arjun Mehta', hackathonId: 6,
    rationale: '80% cost reduction in verification is a compelling headline. Judges noted the Polygon settlement layer as a smart choice for auditability.',
    tags: ['Climate', 'Blockchain', 'ESG'], createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), cmts: []
  },
  {
    id: 5, title: 'Real-time Pothole Detection with Dashcams', domain: 'AI/ML',
    description: 'Crowdsourced pothole mapping using existing dashcam footage processed with edge AI. Municipal integration API included. Proven in Pune pilot — 12,000 potholes mapped in 30 days.',
    status: 'SUBMITTED', totalVoteWeight: 15, recentVotesLastHour: 4, voteHistory: [5, 8, 11, 13, 15],
    createdByUserId: 5, createdByName: 'Kavya Nair', hackathonId: 1,
    tags: ['CV', 'Smart City', 'IoT'], createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), cmts: []
  },
  {
    id: 6, title: 'Mental Health First Responder Network', domain: 'HealthTech',
    description: 'Peer-to-peer mental health support network connecting trained volunteers with people in distress. Integrates with teleconsultation for escalation. HIPAA-compliant, privacy-first architecture.',
    status: 'SUBMITTED', totalVoteWeight: 12, recentVotesLastHour: 1, voteHistory: [4, 6, 8, 10, 12],
    createdByUserId: 2, createdByName: 'Rahul Verma', hackathonId: 3,
    tags: ['MentalHealth', 'P2P', 'Telehealth'], createdAt: new Date(Date.now() - 86400000 * 6).toISOString(), cmts: []
  },
  {
    id: 7, title: 'ZK-proof Identity for Government Services', domain: 'Web3',
    description: "Zero-knowledge proof based identity verification for government portals. Prove you're eligible without revealing PII. Built on Polygon zkEVM — gas-optimized for scale.",
    status: 'SHORTLISTED', totalVoteWeight: 22, recentVotesLastHour: 6, voteHistory: [10, 13, 17, 20, 22],
    createdByUserId: 3, createdByName: 'Ananya Krishnan', hackathonId: 2,
    rationale: 'Privacy-preserving identity is the right problem. The Aadhaar integration angle is highly relevant to Bharat-scale deployment — this team needs to nail the UX story.',
    tags: ['ZKP', 'Aadhaar', 'Privacy'], createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), cmts: []
  },
  {
    id: 8, title: 'Gamified Financial Literacy for Gen Z', domain: 'FinTech',
    description: 'A mobile-first game that teaches investing, tax, and savings through simulated markets and social challenges. First 100 users gained 37% more financial confidence in user tests.',
    status: 'SUBMITTED', totalVoteWeight: 9, recentVotesLastHour: 2, voteHistory: [3, 5, 7, 8, 9],
    createdByUserId: 1, createdByName: 'Priya Sharma', hackathonId: 4,
    tags: ['FinLit', 'Gaming', 'Mobile'], createdAt: new Date(Date.now() - 86400000 * 8).toISOString(), cmts: []
  },
  {
    id: 9, title: 'AI Crop Disease Diagnostics via SMS', domain: 'AI/ML',
    description: 'Farmers send a text or photo via SMS to get instant AI-powered crop disease diagnosis and treatment recommendations. Works offline, supports 8 crops in pilot — 94% accuracy on field test.',
    status: 'SUBMITTED', totalVoteWeight: 14, recentVotesLastHour: 3, voteHistory: [6, 8, 11, 12, 14],
    createdByUserId: 4, createdByName: 'Arjun Mehta', hackathonId: 1,
    tags: ['AgriTech', 'CV', 'SMS'], createdAt: new Date(Date.now() - 86400000 * 9).toISOString(), cmts: []
  },
  {
    id: 10, title: 'Peer-to-peer Solar Energy Trading', domain: 'CleanTech',
    description: 'Neighborhood-level solar energy marketplace using smart meters and blockchain settlement. Rooftop solar owners earn real-time income; neighbors get cheaper green power.',
    status: 'ARCHIVED', totalVoteWeight: 7, recentVotesLastHour: 0, voteHistory: [4, 5, 6, 7, 7],
    createdByUserId: 5, createdByName: 'Kavya Nair', hackathonId: 6,
    tags: ['Solar', 'P2P', 'GridTech'], createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), cmts: []
  },
];

export const MOCK_CONTRIBUTORS: Contributor[] = [
  { userId: 3, userName: 'Ananya Krishnan', role: 'PARTICIPANT', ideasSubmitted: 4, votesCast: 28, commentsPosted: 15, score: 127 },
  { userId: 1, userName: 'Priya Sharma', role: 'PARTICIPANT', ideasSubmitted: 3, votesCast: 22, commentsPosted: 11, score: 98 },
  { userId: 4, userName: 'Arjun Mehta', role: 'PARTICIPANT', ideasSubmitted: 3, votesCast: 19, commentsPosted: 8, score: 87 },
  { userId: 2, userName: 'Rahul Verma', role: 'PARTICIPANT', ideasSubmitted: 2, votesCast: 17, commentsPosted: 13, score: 74 },
  { userId: 5, userName: 'Kavya Nair', role: 'PARTICIPANT', ideasSubmitted: 2, votesCast: 14, commentsPosted: 6, score: 58 },
  { userId: 6, userName: 'Dev Patel', role: 'PARTICIPANT', ideasSubmitted: 1, votesCast: 11, commentsPosted: 9, score: 42 },
  { userId: 7, userName: 'Shreya Iyer', role: 'MENTOR', ideasSubmitted: 0, votesCast: 8, commentsPosted: 21, score: 37 },
];

export const MOCK_TRENDS: TrendData[] = [
  { domain: 'AI/ML', ideasCount: 12, voteWeight: 89, recentVotesLastHour: 14, growth: '+23%' },
  { domain: 'HealthTech', ideasCount: 8, voteWeight: 61, recentVotesLastHour: 9, growth: '+18%' },
  { domain: 'Web3', ideasCount: 7, voteWeight: 55, recentVotesLastHour: 11, growth: '+31%' },
  { domain: 'FinTech', ideasCount: 9, voteWeight: 48, recentVotesLastHour: 6, growth: '+9%' },
  { domain: 'EdTech', ideasCount: 6, voteWeight: 42, recentVotesLastHour: 5, growth: '+14%' },
  { domain: 'CleanTech', ideasCount: 5, voteWeight: 35, recentVotesLastHour: 3, growth: '+7%' },
  { domain: 'Open Innovation', ideasCount: 4, voteWeight: 21, recentVotesLastHour: 2, growth: '+5%' },
];

export const USERS = ['Priya Sharma', 'Rahul Verma', 'Ananya Krishnan', 'Arjun Mehta', 'Kavya Nair', 'Dev Patel', 'Shreya Iyer'];
export const ACCENT_COLORS = ['#00c896', '#4d9fff', '#a78bfa', '#f5a623', '#fb923c', '#ff5f6d'];
export const CHART_COLORS = ['#00c896', '#4d9fff', '#f5a623', '#a78bfa', '#ff5f6d', '#34d399', '#fb923c'];
export const VOTE_THRESHOLD = 15;

export const DEFAULT_PROFILE = {
  name: 'Arjun Joshi', email: 'arjun@example.com', userId: 1,
  skills: 'React, Node.js', handle: '@arjun', bio: 'Full-stack developer passionate about AI tooling.'
};

export const DEFAULT_PREFS = {
  accent: '#00c896', density: 'comfortable' as const,
  notifVotes: true, notifComments: true, notifStatus: true, notifApplications: true, notifLive: false,
  privLeaderboard: true, privVotes: false, privEmail: false,
};
