"use client"

import { useState } from "react"

// Types
interface Contact {
  id: string
  name: string
  company: string
  title: string
  email: string
  phone: string
  status: "lead" | "prospect" | "customer" | "churned"
  tags: string[]
  lastContact: Date
  nextContact?: Date
  notes: string
  score: number
  avatar?: string
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
  deals: string[]
  activities: string[]
  customFields: Record<string, any>
  engagementLevel: "low" | "medium" | "high"
  source: string
  socialProfiles?: {
    linkedin?: string
    twitter?: string
    facebook?: string
  }
  preferredContactMethod?: "email" | "phone" | "in-person"
  timezone?: string
  location?: string
  industry?: string
  companySize?: string
  budget?: string
  decisionMaker: boolean
  interests?: string[]
  aiInsights?: string[]
  automationStatus?: "active" | "paused" | "none"
}

interface Deal {
  id: string
  name: string
  value: number
  stage: "lead" | "discovery" | "proposal" | "negotiation" | "closed-won" | "closed-lost"
  probability: number
  expectedCloseDate: Date
  contacts: string[]
  owner: string
  createdAt: Date
  updatedAt: Date
  products: string[]
  notes: string
  activities: string[]
  customFields: Record<string, any>
  tags: string[]
  priority: "low" | "medium" | "high"
  source: string
  lossReason?: string
  winReason?: string
  competitors?: string[]
  documents?: string[]
  aiInsights?: string[]
  automationStatus?: "active" | "paused" | "none"
  nextSteps?: string[]
}

interface Activity {
  id: string
  type: "call" | "email" | "meeting" | "task" | "note" | "other"
  subject: string
  description?: string
  date: Date
  duration?: number
  status: "planned" | "completed" | "canceled"
  relatedTo: {
    type: "contact" | "deal" | "company"
    id: string
  }
  assignedTo: string
  createdAt: Date
  updatedAt: Date
  outcome?: string
  followUp?: boolean
  followUpDate?: Date
  customFields: Record<string, any>
  aiSummary?: string
  automationTrigger?: boolean
}

interface Company {
  id: string
  name: string
  website: string
  industry: string
  size: string
  location: string
  description?: string
  contacts: string[]
  deals: string[]
  createdAt: Date
  updatedAt: Date
  logo?: string
  annualRevenue?: number
  founded?: number
  socialProfiles?: {
    linkedin?: string
    twitter?: string
    facebook?: string
  }
  tags: string[]
  notes: string
  activities: string[]
  customFields: Record<string, any>
  score: number
  aiInsights?: string[]
  competitors?: string[]
  products?: string[]
  technologies?: string[]
  newsEvents?: {
    date: Date
    title: string
    url?: string
  }[]
}

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "sales" | "support"
  avatar?: string
  contacts: string[]
  deals: string[]
  activities: string[]
  performance: {
    dealsWon: number
    dealValue: number
    activities: number
    conversionRate: number
  }
}

interface Pipeline {
  id: string
  name: string
  stages: {
    id: string
    name: string
    order: number
    deals: string[]
  }[]
  createdAt: Date
  updatedAt: Date
  isDefault: boolean
}

interface Automation {
  id: string
  name: string
  description: string
  trigger: {
    type: "event" | "schedule" | "condition"
    details: any
  }
  actions: {
    type: string
    details: any
  }[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastRun?: Date
  stats: {
    runs: number
    successful: number
    failed: number
  }
}

// Sample data
const sampleContacts: Contact[] = [
  {
    id: "contact-1",
    name: "John Smith",
    company: "Acme Corp",
    title: "CTO",
    email: "john.smith@acmecorp.com",
    phone: "+1 (555) 123-4567",
    status: "prospect",
    tags: ["tech", "decision-maker", "enterprise"],
    lastContact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    nextContact: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    notes: "Met at TechConf 2023. Interested in our enterprise solution.",
    score: 85,
    assignedTo: "user-1",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    deals: ["deal-1"],
    activities: ["activity-1", "activity-3"],
    customFields: {
      preferredDemoDay: "Wednesday",
      budgetRange: "$100K-$250K",
    },
    engagementLevel: "high",
    source: "conference",
    socialProfiles: {
      linkedin: "linkedin.com/in/johnsmith",
      twitter: "twitter.com/johnsmith",
    },
    preferredContactMethod: "email",
    timezone: "America/New_York",
    location: "New York, NY",
    industry: "Technology",
    companySize: "1000-5000",
    budget: "$200K",
    decisionMaker: true,
    interests: ["AI", "Cloud Infrastructure", "Security"],
    aiInsights: [
      "Shows high engagement with security-related content",
      "Likely in active buying cycle based on recent interactions",
      "Technical background suggests detailed product demos would be effective",
    ],
    automationStatus: "active",
  },
  {
    id: "contact-2",
    name: "Sarah Johnson",
    company: "Globex Inc",
    title: "VP of Marketing",
    email: "sarah.johnson@globexinc.com",
    phone: "+1 (555) 987-6543",
    status: "customer",
    tags: ["marketing", "referral", "mid-market"],
    lastContact: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    nextContact: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    notes: "Current customer looking to expand usage. Referred by David Williams.",
    score: 92,
    assignedTo: "user-2",
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    deals: ["deal-2"],
    activities: ["activity-2"],
    customFields: {
      customerSince: "2022-06-15",
      npsScore: 9,
    },
    engagementLevel: "high",
    source: "referral",
    socialProfiles: {
      linkedin: "linkedin.com/in/sarahjohnson",
    },
    preferredContactMethod: "phone",
    timezone: "America/Chicago",
    location: "Chicago, IL",
    industry: "Retail",
    companySize: "500-1000",
    budget: "$150K",
    decisionMaker: true,
    interests: ["Analytics", "Customer Experience", "Automation"],
    aiInsights: [
      "Regular engagement with product updates and new features",
      "Potential upsell opportunity based on usage patterns",
      "Influential in industry networks - potential for case study",
    ],
    automationStatus: "active",
  },
  {
    id: "contact-3",
    name: "Michael Chen",
    company: "Initech LLC",
    title: "Procurement Manager",
    email: "michael.chen@initech.com",
    phone: "+1 (555) 456-7890",
    status: "lead",
    tags: ["procurement", "smb"],
    lastContact: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    notes: "Downloaded whitepaper on cost optimization.",
    score: 45,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    deals: [],
    activities: ["activity-4"],
    customFields: {
      leadSource: "Website",
    },
    engagementLevel: "low",
    source: "website",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    industry: "Finance",
    companySize: "100-500",
    budget: "Unknown",
    decisionMaker: false,
    interests: ["Cost Optimization", "Procurement"],
    aiInsights: [
      "Early research stage based on content engagement",
      "Potential budget constraints based on company size and role",
      "Recommend educational content focused on ROI",
    ],
    automationStatus: "active",
  },
  {
    id: "contact-4",
    name: "Emily Rodriguez",
    company: "TechStart Inc",
    title: "CEO",
    email: "emily@techstart.io",
    phone: "+1 (555) 234-5678",
    status: "prospect",
    tags: ["startup", "decision-maker"],
    lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    nextContact: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    notes: "Startup founder looking for scalable solution. Price sensitive but growing fast.",
    score: 72,
    assignedTo: "user-1",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    deals: ["deal-3"],
    activities: ["activity-5"],
    customFields: {
      fundingStage: "Series A",
      growthRate: "120% YoY",
    },
    engagementLevel: "medium",
    source: "social media",
    socialProfiles: {
      linkedin: "linkedin.com/in/emilyrodriguez",
      twitter: "twitter.com/emilyrodriguez",
    },
    preferredContactMethod: "email",
    timezone: "America/Los_Angeles",
    location: "San Francisco, CA",
    industry: "SaaS",
    companySize: "10-50",
    budget: "$50K",
    decisionMaker: true,
    interests: ["Scalability", "Pricing", "Integration"],
    aiInsights: [
      "Fast-growing startup with potential for long-term value",
      "Price sensitivity but high growth trajectory",
      "Recommend startup-focused package with growth options",
    ],
    automationStatus: "active",
  },
  {
    id: "contact-5",
    name: "Robert Thompson",
    company: "Enterprise Solutions Ltd",
    title: "IT Director",
    email: "robert.thompson@enterprisesolutions.com",
    phone: "+1 (555) 876-5432",
    status: "churned",
    tags: ["enterprise", "technical", "former-customer"],
    lastContact: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    notes: "Former customer who left due to budget cuts. Worth revisiting in Q3.",
    score: 30,
    assignedTo: "user-2",
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    deals: [],
    activities: [],
    customFields: {
      churnReason: "Budget cuts",
      potentialReactivation: "Q3 2023",
    },
    engagementLevel: "low",
    source: "direct",
    timezone: "Europe/London",
    location: "London, UK",
    industry: "Consulting",
    companySize: "1000-5000",
    budget: "On hold",
    decisionMaker: true,
    interests: ["Cost Efficiency", "Enterprise Integration"],
    aiInsights: [
      "Company showing signs of recovery based on recent news",
      "Potential for reactivation in next quarter",
      "Recommend maintaining light touch engagement with valuable content",
    ],
    automationStatus: "paused",
  },
]

const sampleDeals: Deal[] = [
  {
    id: "deal-1",
    name: "Acme Corp Enterprise Solution",
    value: 250000,
    stage: "proposal",
    probability: 60,
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    contacts: ["contact-1"],
    owner: "user-1",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    products: ["product-1", "product-3"],
    notes: "Proposal sent, awaiting feedback. Decision committee meeting next week.",
    activities: ["activity-1", "activity-3"],
    customFields: {
      decisionCommittee: ["CTO", "CIO", "CFO"],
      competitiveSituation: "Evaluating 2 other vendors",
    },
    tags: ["enterprise", "high-value", "security-focus"],
    priority: "high",
    source: "outbound",
    competitors: ["Competitor A", "Competitor B"],
    documents: ["proposal-acme-v1.pdf", "technical-specs.pdf"],
    aiInsights: [
      "Deal velocity slower than average for enterprise segment",
      "Security and compliance are key decision factors based on engagement",
      "Recommend executive involvement to accelerate decision process",
    ],
    automationStatus: "active",
    nextSteps: [
      "Follow up on proposal by 6/15",
      "Schedule technical demo with IT team",
      "Prepare ROI analysis for CFO",
    ],
  },
  {
    id: "deal-2",
    name: "Globex Inc Expansion",
    value: 150000,
    stage: "negotiation",
    probability: 85,
    expectedCloseDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    contacts: ["contact-2"],
    owner: "user-2",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    products: ["product-2", "product-4"],
    notes: "Existing customer expanding to new department. Negotiating final terms.",
    activities: ["activity-2"],
    customFields: {
      expansionType: "New department",
      currentARR: "$100,000",
    },
    tags: ["expansion", "existing-customer", "marketing"],
    priority: "medium",
    source: "customer success",
    documents: ["globex-expansion-quote.pdf"],
    aiInsights: [
      "High probability of close based on customer history",
      "Potential for additional expansion in Q4 based on company growth",
      "Recommend exploring multi-year agreement to secure longer-term revenue",
    ],
    automationStatus: "active",
    nextSteps: [
      "Send revised pricing by 6/10",
      "Schedule implementation planning call",
      "Prepare customer success handoff",
    ],
  },
  {
    id: "deal-3",
    name: "TechStart Growth Plan",
    value: 50000,
    stage: "discovery",
    probability: 40,
    expectedCloseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    contacts: ["contact-4"],
    owner: "user-1",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    products: ["product-2"],
    notes: "Startup with high growth potential. Need to address scalability concerns.",
    activities: ["activity-5"],
    customFields: {
      fundingStage: "Series A",
      growthProjections: "3x in 18 months",
    },
    tags: ["startup", "growth", "price-sensitive"],
    priority: "medium",
    source: "inbound",
    competitors: ["Competitor C", "Open source alternative"],
    documents: ["techstart-requirements.pdf"],
    aiInsights: [
      "Price sensitivity but high growth potential",
      "Technical founder - focus on API capabilities and customization",
      "Recommend startup package with growth incentives",
    ],
    automationStatus: "active",
    nextSteps: [
      "Technical demo focusing on API",
      "Provide startup pricing options",
      "Connect with similar customer reference",
    ],
  },
  {
    id: "deal-4",
    name: "MegaCorp Global Rollout",
    value: 500000,
    stage: "closed-won",
    probability: 100,
    expectedCloseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    contacts: ["contact-6"],
    owner: "user-2",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    products: ["product-1", "product-2", "product-3", "product-4"],
    notes: "Largest deal of the quarter. Full platform adoption with global rollout plan.",
    activities: [],
    customFields: {
      implementationTimeframe: "6 months",
      strategicValue: "Very High",
    },
    tags: ["enterprise", "global", "strategic"],
    priority: "high",
    source: "partner",
    winReason: "Complete solution offering and executive relationship",
    documents: ["megacorp-contract.pdf", "implementation-plan.pdf"],
    aiInsights: [
      "Significant expansion opportunity in APAC region",
      "High potential for case study and reference",
      "Recommend executive sponsor program enrollment",
    ],
    automationStatus: "active",
    nextSteps: [
      "Schedule implementation kickoff",
      "Assign customer success manager",
      "Plan executive business review for Q3",
    ],
  },
  {
    id: "deal-5",
    name: "Innovative Tech Solution",
    value: 175000,
    stage: "closed-lost",
    probability: 0,
    expectedCloseDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    contacts: ["contact-7"],
    owner: "user-1",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    products: ["product-2", "product-3"],
    notes: "Lost to Competitor A primarily on pricing and existing relationship.",
    activities: [],
    customFields: {
      competitiveDisplacement: "No",
      repEngagement: "High",
    },
    tags: ["competitive-loss", "price-sensitive"],
    priority: "medium",
    source: "inbound",
    lossReason: "Existing relationship with competitor and price",
    competitors: ["Competitor A"],
    documents: ["final-proposal.pdf"],
    aiInsights: [
      "Price sensitivity was higher than initially assessed",
      "Decision influenced by pre-existing vendor relationships",
      "Recommend revisiting in 12 months when contract renewal approaches",
    ],
    automationStatus: "paused",
    nextSteps: ["Send thank you note", "Schedule follow-up in 10 months", "Add to competitive intelligence database"],
  },
]

const sampleActivities: Activity[] = [
  {
    id: "activity-1",
    type: "call",
    subject: "Discovery Call with John Smith",
    description: "Initial discovery call to understand requirements and timeline.",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    duration: 45,
    status: "completed",
    relatedTo: {
      type: "contact",
      id: "contact-1",
    },
    assignedTo: "user-1",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    outcome: "Positive. Client interested in enterprise solution. Needs security details.",
    followUp: true,
    followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    customFields: {
      callNotes: "Discussed security requirements in detail. Send SOC2 report.",
    },
    aiSummary:
      "Call focused on security requirements and compliance needs. Client expressed concerns about data sovereignty and requested additional documentation on security protocols. Follow up with SOC2 report and security whitepaper.",
  },
  {
    id: "activity-2",
    type: "meeting",
    subject: "Quarterly Business Review",
    description: "Quarterly review with Sarah Johnson to discuss expansion opportunities.",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    duration: 60,
    status: "completed",
    relatedTo: {
      type: "contact",
      id: "contact-2",
    },
    assignedTo: "user-2",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    outcome: "Very positive. Client ready to expand to marketing department.",
    followUp: true,
    followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    customFields: {
      location: "Client Office",
      attendees: "Sarah Johnson, Marketing Director, CFO",
    },
    aiSummary:
      "Meeting identified expansion opportunity to marketing department with potential 50% increase in contract value. Client expressed satisfaction with current implementation and ROI. Key decision makers from marketing department were present and supportive.",
  },
  {
    id: "activity-3",
    type: "email",
    subject: "Proposal Follow-up",
    description: "Email to John Smith following up on the proposal sent last week.",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: "completed",
    relatedTo: {
      type: "deal",
      id: "deal-1",
    },
    assignedTo: "user-1",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    outcome: "Received response. Committee meeting next week. Decision expected by end of month.",
    followUp: true,
    followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    customFields: {
      emailTemplate: "Proposal Follow-up",
      attachments: "ROI Calculator",
    },
    aiSummary:
      "Client confirmed receipt of proposal and indicated decision committee will review next week. Timeline for decision is end of month. Client requested additional ROI calculations for specific use cases.",
  },
  {
    id: "activity-4",
    type: "task",
    subject: "Prepare Whitepaper for Michael Chen",
    description: "Customize cost optimization whitepaper for Initech's industry.",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    status: "planned",
    relatedTo: {
      type: "contact",
      id: "contact-3",
    },
    assignedTo: "user-2",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    customFields: {
      priority: "Medium",
      estimatedTime: "2 hours",
    },
    automationTrigger: true,
  },
  {
    id: "activity-5",
    type: "call",
    subject: "Technical Demo with Emily Rodriguez",
    description: "Technical demonstration of API capabilities and scalability features.",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    duration: 60,
    status: "completed",
    relatedTo: {
      type: "contact",
      id: "contact-4",
    },
    assignedTo: "user-1",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    outcome: "Successful demo. Client impressed with API flexibility. Concerned about pricing.",
    followUp: true,
    followUpDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    customFields: {
      demoEnvironment: "Sandbox",
      technicalContact: "Emily Rodriguez",
    },
    aiSummary:
      "Demo focused on API capabilities and scalability. Client showed strong technical understanding and was particularly interested in webhook functionality and custom integrations. Price sensitivity remains a concern - recommend startup pricing package with growth incentives.",
  },
]

const sampleCompanies: Company[] = [
  {
    id: "company-1",
    name: "Acme Corp",
    website: "acmecorp.com",
    industry: "Technology",
    size: "1000-5000",
    location: "New York, NY",
    description: "Leading enterprise technology solutions provider specializing in cloud infrastructure and security.",
    contacts: ["contact-1"],
    deals: ["deal-1"],
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    logo: "/letter-a-abstract.png",
    annualRevenue: 500000000,
    founded: 1995,
    socialProfiles: {
      linkedin: "linkedin.com/company/acmecorp",
      twitter: "twitter.com/acmecorp",
    },
    tags: ["enterprise", "technology", "security"],
    notes: "Strong potential for enterprise-wide deployment. Security is a key concern.",
    activities: ["activity-1", "activity-3"],
    customFields: {
      publiclyTraded: true,
      keyTechnologies: ["Cloud", "AI", "Security"],
    },
    score: 85,
    aiInsights: [
      "Recent security breach in industry has increased interest in security solutions",
      "Company is undergoing digital transformation initiative based on recent press",
      "Potential for expansion to international offices in next fiscal year",
    ],
    competitors: ["TechCorp", "InnovateInc", "SecureWave"],
    products: ["Cloud Infrastructure", "Security Solutions", "Enterprise Software"],
    technologies: ["AWS", "Kubernetes", "TensorFlow", "Java"],
    newsEvents: [
      {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        title: "Acme Corp Announces New CTO",
        url: "https://example.com/news/acme-new-cto",
      },
      {
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        title: "Acme Corp Reports Strong Q2 Earnings",
        url: "https://example.com/news/acme-q2-earnings",
      },
    ],
  },
  {
    id: "company-2",
    name: "Globex Inc",
    website: "globexinc.com",
    industry: "Retail",
    size: "500-1000",
    location: "Chicago, IL",
    description:
      "Innovative retail company with strong online and physical presence. Focus on customer experience and analytics.",
    contacts: ["contact-2"],
    deals: ["deal-2"],
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    logo: "/letter-g-floral.png",
    annualRevenue: 250000000,
    founded: 2005,
    socialProfiles: {
      linkedin: "linkedin.com/company/globexinc",
      twitter: "twitter.com/globexinc",
      facebook: "facebook.com/globexinc",
    },
    tags: ["retail", "analytics", "customer-experience"],
    notes: "Current customer with strong growth. Expanding to new departments.",
    activities: ["activity-2"],
    customFields: {
      publiclyTraded: false,
      keyTechnologies: ["Analytics", "CRM", "E-commerce"],
    },
    score: 92,
    aiInsights: [
      "Planning major e-commerce platform upgrade in next quarter",
      "Expanding to international markets with focus on APAC region",
      "Investing heavily in customer analytics and personalization",
    ],
    competitors: ["RetailGiant", "ShopSmart", "MegaMart"],
    products: ["Retail Analytics", "Customer Experience Platform", "Omnichannel Solutions"],
    technologies: ["Shopify", "Tableau", "Google Analytics", "React"],
    newsEvents: [
      {
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        title: "Globex Inc Opens New Flagship Store",
        url: "https://example.com/news/globex-new-store",
      },
      {
        date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        title: "Globex Inc Partners with Leading Analytics Provider",
        url: "https://example.com/news/globex-analytics-partnership",
      },
    ],
  },
  {
    id: "company-3",
    name: "Initech LLC",
    website: "initech.com",
    industry: "Finance",
    size: "100-500",
    location: "San Francisco, CA",
    description: "Financial services firm specializing in corporate banking and investment management.",
    contacts: ["contact-3"],
    deals: [],
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    logo: "/letter-i-abstract.png",
    annualRevenue: 75000000,
    founded: 2010,
    socialProfiles: {
      linkedin: "linkedin.com/company/initech",
    },
    tags: ["finance", "banking", "compliance"],
    notes: "Interested in cost optimization solutions. Highly regulated industry.",
    activities: ["activity-4"],
    customFields: {
      publiclyTraded: false,
      keyTechnologies: ["Fintech", "Blockchain", "Compliance"],
    },
    score: 45,
    aiInsights: [
      "Recently completed compliance audit with findings related to data management",
      "Exploring cost-cutting measures due to market pressure",
      "Potential interest in automation solutions for compliance reporting",
    ],
    competitors: ["FinCorp", "BankTech", "InvestSolutions"],
    products: ["Corporate Banking", "Investment Management", "Risk Analysis"],
    technologies: ["Java", "Oracle", "Hadoop", "Tableau"],
    newsEvents: [
      {
        date: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
        title: "Initech LLC Announces New Compliance Solution",
        url: "https://example.com/news/initech-compliance",
      },
    ],
  },
  {
    id: "company-4",
    name: "TechStart Inc",
    website: "techstart.io",
    industry: "SaaS",
    size: "10-50",
    location: "San Francisco, CA",
    description: "Fast-growing SaaS startup focused on developer tools and productivity solutions.",
    contacts: ["contact-4"],
    deals: ["deal-3"],
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    logo: "/letter-t-typography.png",
    annualRevenue: 5000000,
    founded: 2020,
    socialProfiles: {
      linkedin: "linkedin.com/company/techstart",
      twitter: "twitter.com/techstart",
    },
    tags: ["startup", "developer-tools", "high-growth"],
    notes: "Series A startup with high growth potential. Price sensitive but scaling rapidly.",
    activities: ["activity-5"],
    customFields: {
      fundingStage: "Series A",
      investors: ["Sequoia", "Y Combinator"],
    },
    score: 72,
    aiInsights: [
      "Recently closed $15M Series A funding round",
      "Growing at 120% YoY with focus on developer market",
      "Exploring enterprise expansion but lacks experience in enterprise sales",
    ],
    competitors: ["DevTools", "CodeFlow", "ProductivityPro"],
    products: ["Developer Productivity Suite", "Code Collaboration Tools"],
    technologies: ["Node.js", "React", "MongoDB", "AWS"],
    newsEvents: [
      {
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        title: "TechStart Inc Raises $15M Series A",
        url: "https://example.com/news/techstart-funding",
      },
      {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        title: "TechStart Inc Launches New Developer Platform",
        url: "https://example.com/news/techstart-platform",
      },
    ],
  },
]

const sampleUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Morgan",
    email: "alex.morgan@company.com",
    role: "sales",
    avatar: "/abstract-am.png",
    contacts: ["contact-1", "contact-4"],
    deals: ["deal-1", "deal-3", "deal-5"],
    activities: ["activity-1", "activity-3", "activity-5"],
    performance: {
      dealsWon: 12,
      dealValue: 1750000,
      activities: 145,
      conversionRate: 35,
    },
  },
  {
    id: "user-2",
    name: "Jamie Taylor",
    email: "jamie.taylor@company.com",
    role: "sales",
    avatar: "/abstract-geometric-jt.png",
    contacts: ["contact-2", "contact-3", "contact-5"],
    deals: ["deal-2", "deal-4"],
    activities: ["activity-2", "activity-4"],
    performance: {
      dealsWon: 15,
      dealValue: 2100000,
      activities: 178,
      conversionRate: 42,
    },
  },
  {
    id: "user-3",
    name: "Sam Wilson",
    email: "sam.wilson@company.com",
    role: "manager",
    avatar: "/stylized-sw.png",
    contacts: [],
    deals: [],
    activities: [],
    performance: {
      dealsWon: 0,
      dealValue: 0,
      activities: 87,
      conversionRate: 0,
    },
  },
  {
    id: "user-4",
    name: "Jordan Lee",
    email: "jordan.lee@company.com",
    role: "admin",
    avatar: "/stylized-jl-logo.png",
    contacts: [],
    deals: [],
    activities: [],
    performance: {
      dealsWon: 0,
      dealValue: 0,
      activities: 42,
      conversionRate: 0,
    },
  },
]

const samplePipelines: Pipeline[] = [
  {
    id: "pipeline-1",
    name: "Standard Sales Pipeline",
    stages: [
      {
        id: "stage-1",
        name: "Lead",
        order: 1,
        deals: [],
      },
      {
        id: "stage-2",
        name: "Discovery",
        order: 2,
        deals: ["deal-3"],
      },
      {
        id: "stage-3",
        name: "Proposal",
        order: 3,
        deals: ["deal-1"],
      },
      {
        id: "stage-4",
        name: "Negotiation",
        order: 4,
        deals: ["deal-2"],
      },
      {
        id: "stage-5",
        name: "Closed Won",
        order: 5,
        deals: ["deal-4"],
      },
      {
        id: "stage-6",
        name: "Closed Lost",
        order: 6,
        deals: ["deal-5"],
      },
    ],
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    isDefault: true,
  },
  {
    id: "pipeline-2",
    name: "Enterprise Sales Pipeline",
    stages: [
      {
        id: "stage-7",
        name: "Lead",
        order: 1,
        deals: [],
      },
      {
        id: "stage-8",
        name: "Discovery",
        order: 2,
        deals: [],
      },
      {
        id: "stage-9",
        name: "Technical Validation",
        order: 3,
        deals: [],
      },
      {
        id: "stage-10",
        name: "Business Case",
        order: 4,
        deals: [],
      },
      {
        id: "stage-11",
        name: "Proposal",
        order: 5,
        deals: [],
      },
      {
        id: "stage-12",
        name: "Negotiation",
        order: 6,
        deals: [],
      },
      {
        id: "stage-13",
        name: "Closed Won",
        order: 7,
        deals: [],
      },
      {
        id: "stage-14",
        name: "Closed Lost",
        order: 8,
        deals: [],
      },
    ],
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    isDefault: false,
  },
]

const sampleAutomations: Automation[] = [
  {
    id: "automation-1",
    name: "Lead Nurturing Sequence",
    description: "Automatically send personalized emails to new leads based on their interests and engagement.",
    trigger: {
      type: "event",
      details: {
        event: "New Lead Created",
        conditions: [
          {
            field: "score",
            operator: ">=",
            value: 50,
          },
        ],
      },
    },
    actions: [
      {
        type: "email",
        details: {
          template: "welcome-email",
          delay: 0,
        },
      },
      {
        type: "email",
        details: {
          template: "industry-whitepaper",
          delay: 3,
        },
      },
      {
        type: "task",
        details: {
          assignee: "owner",
          subject: "Follow up with {{contact.name}}",
          delay: 7,
        },
      },
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    lastRun: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    stats: {
      runs: 87,
      successful: 82,
      failed: 5,
    },
  },
  {
    id: "automation-2",
    name: "Deal Stage Progression",
    description: "Trigger actions when deals move between stages to ensure consistent follow-up and process adherence.",
    trigger: {
      type: "event",
      details: {
        event: "Deal Stage Changed",
        conditions: [
          {
            field: "newStage",
            operator: "=",
            value: "proposal",
          },
        ],
      },
    },
    actions: [
      {
        type: "notification",
        details: {
          recipients: ["owner", "manager"],
          message: "Deal {{deal.name}} has moved to Proposal stage",
        },
      },
      {
        type: "task",
        details: {
          assignee: "owner",
          subject: "Schedule proposal review meeting",
          delay: 1,
        },
      },
      {
        type: "email",
        details: {
          template: "proposal-follow-up",
          delay: 3,
        },
      },
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    lastRun: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    stats: {
      runs: 42,
      successful: 40,
      failed: 2,
    },
  },
  {
    id: "automation-3",
    name: "Customer Health Monitoring",
    description: "Monitor customer engagement and trigger alerts for at-risk accounts.",
    trigger: {
      type: "schedule",
      details: {
        frequency: "weekly",
        day: "Monday",
        time: "09:00",
      },
    },
    actions: [
      {
        type: "script",
        details: {
          script: "calculate-health-score",
        },
      },
      {
        type: "condition",
        details: {
          condition: "{{contact.healthScore}} < 70",
          actions: [
            {
              type: "notification",
              details: {
                recipients: ["owner", "customer_success"],
                message: "Customer {{contact.name}} health score is low: {{contact.healthScore}}",
              },
            },
            {
              type: "task",
              details: {
                assignee: "customer_success",
                subject: "Review account health for {{contact.name}}",
                delay: 0,
              },
            },
          ],
        },
      },
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    lastRun: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    stats: {
      runs: 24,
      successful: 24,
      failed: 0,
    },
  },
  {
    id: "automation-4",
    name: "AI-Powered Lead Scoring",
    description: "Automatically score leads based on behavior, engagement, and fit using machine learning.",
    trigger: {
      type: "schedule",
      details: {
        frequency: "daily",
        time: "01:00",
      },
    },
    actions: [
      {
        type: "ai",
        details: {
          model: "lead-scoring",
          parameters: {
            dataSource: "all_contacts",
            scoringFactors: ["engagement", "firmographics", "behavior", "technographics"],
          },
        },
      },
      {
        type: "condition",
        details: {
          condition: "{{contact.score}} >= 80",
          actions: [
            {
              type: "tag",
              details: {
                tag: "hot-lead",
              },
            },
            {
              type: "notification",
              details: {
                recipients: ["sales"],
                message: "New hot lead identified: {{contact.name}}",
              },
            },
          ],
        },
      },
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    lastRun: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    stats: {
      runs: 59,
      successful: 57,
      failed: 2,
    },
  },
]

// Helper functions
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date)
}

function getDaysSince(date: Date): number {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

function getStatusColor(status: string): string {
  switch (status) {
    case "lead":
      return "bg-blue-500"
    case "prospect":
      return "bg-purple-500"
    case "customer":
      return "bg-green-500"
    case "churned":
      return "bg-red-500"
    case "completed":
      return "bg-green-500"
    case "planned":
      return "bg-blue-500"
    case "canceled":
      return "bg-red-500"
    case "discovery":
      return "bg-blue-500"
    case "proposal":
      return "bg-purple-500"
    case "negotiation":
      return "bg-amber-500"
    case "closed-won":
      return "bg-green-500"
    case "closed-lost":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

// Main component
export function EnhancedCRM() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);
  const [deals, setDeals] = useState<Deal[]>(sampleDeals);
  const [activities, setActivities] = useState<Activity[]>(sampleActivities);
  const [companies, setCompanies] = useState<Company[]>(sampleCompanies);
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [pipelines, setPipelines] = useState<Pipeline[]>(samplePipelines);
  const [automations, setAutomations] = useState<Automation[]>(sampleAutomations);

  // Dashboard metrics
  const totalDeals = deals.length;
  const openDeals = deals.filter(deal => !["closed-won", "closed-lost"].includes(deal.stage)).length;
  const totalDealValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const wonDealValue = deals.filter(deal => deal.stage === "closed-won").reduce((sum, deal) => sum + deal.value, 0);
  const totalContacts = contacts.length;
  const totalCompanies = companies.length;
  const upcomingActivities = activities.filter(activity =>
    activity.status === "planned" && new Date(activity.date) > new Date()
  ).length;

  // Pipeline data for visualization
  const pipelineData = pipelines[0].stages.map(stage => {
    const stageDeals = deals.filter(deal =>
      deal.stage === stage.name.toLowerCase().replace(" ", "-")
    );
    const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
    return {
      name: stage.name,
      count: stageDeals.length,
      value: stageValue
    };
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">Enhanced CRM</h1>
        <p className="text-muted-foreground">Manage your contacts, deals, and activities</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b mt-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "dashboard" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "contacts" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("contacts")}
        >
          Contacts
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "deals" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("deals")}
        >
          Deals
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "activities" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("activities")}
        >
          Activities
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "companies" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("companies")}
        >
          Companies
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "automations" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("automations")}
        >
          Automations
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-muted-foreground">Total Deals</h3>
                <p className="text-2xl font-bold">{totalDeals}</p>
                <p className="text-sm text-muted-foreground">{openDeals} open</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-muted-foreground">Deal Value</h3>
                <p className="text-2xl font-bold">{formatCurrency(totalDealValue)}</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(wonDealValue)} won</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-muted-foreground">Contacts</h3>
                <p className="text-2xl font-bold">{totalContacts}</p>
                <p className="text-sm text-muted-foreground">{totalCompanies} companies</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-muted-foreground">Activities</h3>
                <p className="text-2xl font-bold">{activities.length}</p>
                <p className="text-sm text-muted-foreground">{upcomingActivities} upcoming</p>
              </div>
            </div>

            {/* Pipeline */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Pipeline Overview</h3>
              <div className="h-64">
                <div className="flex h-full items-end space-x-2">
                  {pipelineData.map((stage, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-primary/80 rounded-t"
                        style={{
                          height: `${Math.max(5, (stage.value / totalDealValue) * 100)}%`,
                          backgroundColor: getStatusColor(stage.name.toLowerCase().replace(" ", "-"))
                        }}
                      ></div>
                      <div className="w-full text-center mt-2">
                        <p className="text-sm font-medium truncate">{stage.name}</p>
                        <p className="text-xs text-muted-foreground">{stage.count} deals</p>
                        <p className="text-xs font-medium">{formatCurrency(stage.value)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity) => {
                  const contact = contacts.find(c =>
                    activity.relatedTo.type === "contact" && activity.relatedTo.id === c.id
                  );
                  const deal = deals.find(d =>
                    activity.relatedTo.type === "deal" && activity.relatedTo.id === d.id
                  );
                  const user = users.find(u => u.id === activity.assignedTo);

                  return (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className={`w-2 h-2 mt-2 rounded-full ${getStatusColor(activity.status)}`}></div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} with {" "}
                          {contact?.name || deal?.name || "Unknown"}
                        </p>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <span>{formatDateTime(activity.date)}</span>
                          <span className="mx-2">•</span>
                          <span>{user?.name || "Unassigned"}</span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${getStatusColor(activity.status)} bg-opacity-10 text-${getStatusColor(activity.status).replace('bg-', '')}`}>
                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Contacts</h2>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                Add Contact
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted">
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-xs text-muted-foreground">{contact.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{contact.company}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{contact.title}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{contact.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)} bg-opacity-10 text-${getStatusColor(contact.status).replace('bg-', '')}`}>
                            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div>
                            <p>{formatDate(contact.lastContact)}</p>
                            <p className="text-xs text-muted-foreground">{getDaysSince(contact.lastContact)} days ago</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  contact.score >= 80 ? 'bg-green-500' :
                                  contact.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${contact.score}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm">{contact.score}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "deals" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Deals</h2>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                Add Deal
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
              {pipelines[0].stages.map((stage, index) => {
                const stageDeals = deals.filter(deal =>
                  deal.stage === stage.name.toLowerCase().replace(" ", "-")
                );
                const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);

                return (
                  <div key={stage.id} className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="p-3 border-b">
                      <h3 className="font-medium">{stage.name}</h3>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{stageDeals.length} deals</span>
                        <span>{formatCurrency(stageValue)}</span>
                      </div>
                    </div>
                    <div className="p-2 space-y-2 max-h-[600px] overflow-y-auto">
                      {stageDeals.map(deal => {
                        const dealContact = contacts.find(c => deal.contacts.includes(c.id));
                        const dealOwner = users.find(u => u.id === deal.owner);

                      return (
                        <div key={deal.id} className="p-3 bg-muted/50 rounded-md">
                          <h4 className="font-medium">{deal.name}</h4>
                          <p className="text-sm text-muted-foreground">{dealContact?.company}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="font-medium">{formatCurrency(deal.value)}</span>
                            <span className="text-xs text-muted-foreground">{formatDate(deal.expectedCloseDate)}</span>
                          </div>
                          <div className="mt-2 flex items-center text-xs text-muted-foreground">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-[10px]">
                              {dealOwner?.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="ml-1">{dealOwner?.name}</span>
                            <span className="ml-auto">{deal.probability}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "activities" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Activities</h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                Add Activity
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="space-y-6">
              {activities.map((activity) => {
                const contact = contacts.find(c =>
                  activity.relatedTo.type === "contact" && activity.relatedTo.id === c.id
                );
                const deal = deals.find(d =>
                  activity.relatedTo.type === "deal" && activity.relatedTo.id === d.id
                );
                const user = users.find(u => u.id === activity.assignedTo);

                return (
                  <div key={activity.id} className="flex">
                    <div className="mr-4 relative">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(activity.status)} flex items-center justify-center`}>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      {/* Vertical line connecting activities */}
                      <div className="absolute top-4 bottom-0 left-1/2 w-0.5 -ml-px bg-muted"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{activity.subject}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(activity.status)} bg-opacity-10 text-${getStatusColor(activity.status).replace('bg-', '')}`}>
                          {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} with {" "}
                        {contact?.name || deal?.name || "Unknown"}
                      </p>
                      {activity.description && (
                        <p className="mt-2 text-sm">{activity.description}</p>
                      )}
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <span>{formatDateTime(activity.date)}</span>
                        <span className="mx-2">•</span>
                        <span>{user?.name || "Unassigned"}</span>
                        {activity.duration && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{activity.duration} min</span>
                          </>
                        )}
                      </div>
                      {activity.outcome && (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                          <p className="font-medium">Outcome:</p>
                          <p>{activity.outcome}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "companies" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Companies</h2>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Add Company
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => {
              const companyContacts = contacts.filter(c => c.company === company.name);
              const companyDeals = deals.filter(d => company.deals.includes(d.id));
              const totalDealValue = companyDeals.reduce((sum, deal) => sum + deal.value, 0);

              return (
                <div key={company.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {company.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">{company.industry}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{company.location}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Size:</span>
                        <span>{company.size}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Website:</span>
                        <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-primary">
                          {company.website}
                        </a>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Contacts</p>
                        <p className="font-medium">{companyContacts.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Deals</p>
                        <p className="font-medium">{companyDeals.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Deal Value</p>
                        <p className="font-medium">{formatCurrency(totalDealValue)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Score</p>
                        <div className="flex items-center">
                          <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                company.score >= 80 ? 'bg-green-500' :
                                company.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${company.score}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm">{company.score}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "automations" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Automations</h2>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Create Automation
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Trigger</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Run</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Performance</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted">
                  {automations.map((automation) => (
                    <tr key={automation.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <p className="font-medium">{automation.name}</p>
                          <p className="text-xs text-muted-foreground">{automation.description}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {automation.trigger.type === "event" ? "E" : automation.trigger.type === "schedule" ? "S" : "C"}
                          </div>
                          <span className="ml-2 text-sm capitalize">{automation.trigger.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${automation.isActive ? 'bg-green-500' : 'bg-red-500'} bg-opacity-10 ${automation.isActive ? 'text-green-500' : 'text-red-500'}`}>
                          {automation.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {automation.lastRun ? (
                          <div>
                            <p>{formatDate(automation.lastRun)}</p>
                            <p className="text-xs text-muted-foreground">{getDaysSince(automation.lastRun)} days ago</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="flex items-center">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{ width: `${(automation.stats.successful / automation.stats.runs) * 100}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-xs">
                              {Math.round((automation.stats.successful / automation.stats.runs) * 100)}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {automation.stats.successful} / {automation.stats.runs} successful
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="p-1 text-muted-foreground hover:text-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button className="p-1 text-muted-foreground hover:text-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <button className="p-1 text-muted-foreground hover:text-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}\
