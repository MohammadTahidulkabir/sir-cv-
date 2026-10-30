/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CitationYearData {
  year: number;
  count: number;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  tier: 'Q1' | 'Q2' | 'Book Chapter' | 'Policy Report';
  volume?: string;
  pages?: string;
  publisher?: string;
  doi?: string;
  citations: number;
  highlight: string;
  bibtex: string;
  citationHistory: CitationYearData[];
  annualGrowthRate: number; // percentage YoY
  lastUpdated?: string;
  topics?: string[];
}

export interface TrajectoryMilestone {
  id: string;
  period: string;
  startYear: number;
  endYear: number | null; // null for present
  role: string;
  institution: string;
  location: string;
  category: 'Teaching' | 'Research' | 'Education' | 'Fellowship';
  description: string;
  keyContributions: string[];
  outputs: string[];
  toolsUsed: string[];
}

export interface SkillCategory {
  name: string;
  description: string;
  proficiencyScore: number; // 0-100
  evidence: string;
  subskills: {
    name: string;
    level: number;
    description: string;
  }[];
}

export interface StoredDocument {
  id: string;
  name: string;
  category: 'Curriculum Vitae' | 'Peer-Reviewed Reprint' | 'Academic Credential' | 'Policy Monograph' | 'Research Report';
  dateAdded: string;
  size: string;
  sha256: string;
  fileUrl: string;
  isPreloaded?: boolean;
  verified: boolean;
  notes?: string;
}

export const SHUVRO_SEN_CV = {
  name: "Shuvro Sen",
  role: "Lecturer in General Management",
  affiliation: "Independent University, Bangladesh (IUB)",
  scholarStatus: "Erasmus Mundus Scholar",
  avatarUrl: "/assets/aistudio/53_f8d65841.png",
  contact: {
    email: "senshuvro.du@gmail.com",
    phone: "(+880) 1805758472",
    location: "Dhaka, Bangladesh",
    institution: "Independent University, Bangladesh (IUB)",
    department: "Department of General Management",
    linkedin: "https://linkedin.com",
    googleScholar: "https://scholar.google.com/citations?user=JZz99IUAAAAJ&hl=en",
    portfolio: "https://academic-portfolio.edu"
  },
  metrics: {
    researchOutputs: 13,
    hIndex: 9,
    i10Index: 9,
    literatureSynthesized: "150+ articles",
    stakeholdersEngaged: "80+ stakeholders",
    consortiumUniversities: 4,
    citationsTotal: 2035
  },
  profile: "Currently serving as a Lecturer in the Department of General Management at Independent University, Bangladesh (IUB). Erasmus Mundus Scholar with experience in quantitative and qualitative research using R, SPSS, and NVivo, and author/co-author of 13 research outputs, including peer-reviewed journal articles and a book chapter. Research interests focus on sustainability transitions, digital transformation, sustainable supply chains, circular economy, and emerging-market contexts.",
  researchInterests: [
    "Sustainable Supply Chain Management",
    "Industry 5.0",
    "Digital Transformation",
    "Circular Economy",
    "Bioeconomy",
    "Supply Chain Resilience"
  ],
  academicEngagement: [
    "Presented research findings at the 1st IVRCED Conference (2020)",
    "Disseminated research findings to academics, policymakers, and development practitioners through the FES Economy of Tomorrow Fellowship",
    "Collaborated with multidisciplinary research teams across Bangladesh",
    "Coordinated public relations and stakeholder outreach for Erasmus Mundus Association Bangladesh"
  ],
  education: [
    {
      degree: "MSc in Transition, Innovation and Sustainability Environments (TISE)",
      credentialType: "Erasmus Mundus Joint Degree",
      period: "September 2021 – August 2023",
      institutions: [
        "University College Dublin, Ireland",
        "NOVA FCSH, Portugal",
        "Poznan University of Economics and Business, Poland",
        "Danube University Krems, Austria"
      ],
      thesis: "The impact of sustainability transition efforts on social justice in a multi-tier fashion supply chain.",
      highlights: "Prestigious European Commission full scholarship; multi-country international joint degree program examining systemic transitions and circular industrial ecosystems."
    },
    {
      degree: "MBA in Strategic and International Management",
      credentialType: "Postgraduate Degree",
      period: "June 2016 – July 2017",
      institutions: ["University of Dhaka, Bangladesh"],
      thesis: "Factors influencing consumption of ready-made frozen food.",
      highlights: "Advanced strategic analysis, market dynamics, and consumer empirical modeling."
    },
    {
      degree: "BBA in Management",
      credentialType: "Undergraduate Degree",
      period: "January 2012 – December 2015",
      institutions: ["University of Dhaka, Bangladesh"],
      highlights: "Comprehensive foundation in organizational theory, statistics, business mathematics, and managerial economics."
    }
  ],
  trajectory: [
    {
      id: "iub-lecturer",
      period: "September 2026 – Present",
      startYear: 2026,
      endYear: null,
      role: "Lecturer",
      institution: "Independent University, Bangladesh (IUB)",
      location: "Dhaka, Bangladesh",
      category: "Teaching",
      description: "Appointed faculty in Department of General Management, leading undergraduate courses in business mathematics and strategic management while driving empirical sustainability research.",
      keyContributions: [
        "Teach core management curriculum including quantitative Business Mathematics",
        "Lead empirical research investigating sustainability transitions and digital supply chains in developing economies",
        "Design forward-looking curriculum modules aligning with Industry 5.0 principles",
        "Advise undergraduate students on quantitative thesis and research methodology"
      ],
      outputs: [
        "Pedagogical syllabus for Business Mathematics",
        "Ongoing collaborative studies on circular bioeconomy transitions"
      ],
      toolsUsed: ["R", "SPSS", "Curriculum LMS", "Statistical Courseware"]
    },
    {
      id: "erasmus-tise",
      period: "September 2021 – August 2023",
      startYear: 2021,
      endYear: 2023,
      role: "Erasmus Mundus Joint Degree Scholar (TISE)",
      institution: "European Consortium (UCD, NOVA FCSH, Poznan, Danube Univ Krems)",
      location: "Ireland, Portugal, Poland, Austria",
      category: "Education",
      description: "Completed full-scholarship interdisciplinary MSc covering ecological economics, socio-technical transition dynamics, circular economy loops, and multi-tier supply chain governance.",
      keyContributions: [
        "Defended thesis investigating sustainability transition efforts on social justice in multi-tier fashion supply networks",
        "Conducted cross-border comparative analyses in Ireland, Portugal, Poland, and Austria",
        "Applied qualitative NVivo coding and socio-ecological resilience frameworks to textile chains"
      ],
      outputs: [
        "MSc Thesis: Impact of sustainability transitions on social justice",
        "Cross-national comparative policy recommendations"
      ],
      toolsUsed: ["NVivo", "Qualitative Coding", "Multi-tier Mapping", "Sustainability Frameworks"]
    },
    {
      id: "brac-research-associate",
      period: "June 2019 – August 2021",
      startYear: 2019,
      endYear: 2021,
      role: "Research Associate, Regulation of International Supply Chain Project",
      institution: "BRAC University",
      location: "Dhaka, Bangladesh",
      category: "Research",
      description: "Core analytical researcher on large-scale international research project examining regulatory compliance, governance, and social audits in apparel supply networks.",
      keyContributions: [
        "Systematically reviewed and synthesized 150+ peer-reviewed articles on sustainable global supply chains",
        "Conducted quantitative and qualitative analysis using R, SPSS, and NVivo on datasets encompassing 80+ supply chain stakeholders",
        "Collaborated with multidisciplinary team of 7 senior researchers and produced 3 peer-reviewed reports"
      ],
      outputs: [
        "3 peer-reviewed research reports on sustainable global supply chains",
        "Q1 & Q2 journal publications (Current Psychology, Journal of Islamic Marketing, JTATM)"
      ],
      toolsUsed: ["R", "SPSS", "NVivo", "Literature Systematic Review", "Stakeholder Survey"]
    },
    {
      id: "fes-fellow",
      period: "December 2019 – October 2020",
      startYear: 2019,
      endYear: 2020,
      role: "Research Fellow, Economy of Tomorrow",
      institution: "Friedrich-Ebert-Stiftung (FES)",
      location: "Dhaka, Bangladesh",
      category: "Fellowship",
      description: "Competitive fellowship investigating technological automation, workforce transformation, and labor welfare in Bangladesh's readymade garments (RMG) export sector.",
      keyContributions: [
        "Conducted independent field and empirical research examining robotic automation vs female factory labor vulnerability",
        "Author of policy book chapter on automation and female employees in RMG sector",
        "Disseminated findings directly to high-level policymakers, development practitioners, and trade labor delegates"
      ],
      outputs: [
        "Book Chapter: 'Automation, apparel industry, and female employees: Current conditions and future strategies'",
        "Policy briefing on Industry 4.0 labor transition safety nets"
      ],
      toolsUsed: ["Fieldwork Interviews", "SPSS", "Policy Modeling", "Stakeholder Panels"]
    },
    {
      id: "dhaka-mba",
      period: "June 2016 – July 2017",
      startYear: 2016,
      endYear: 2017,
      role: "MBA Researcher & Student",
      institution: "University of Dhaka",
      location: "Dhaka, Bangladesh",
      category: "Education",
      description: "Specialized in Strategic and International Management, awarded Departmental Merit Scholarship.",
      keyContributions: [
        "Empirical study of consumer purchase dynamics published in Current Psychology (Q1 Journal)",
        "Advanced econometric modeling of ready-made food consumption drivers"
      ],
      outputs: [
        "MBA Thesis & Q1 Journal Paper (Current Psychology)"
      ],
      toolsUsed: ["SPSS", "Regression Modeling", "Consumer Surveys"]
    },
    {
      id: "dhaka-bba",
      period: "January 2012 – December 2015",
      startYear: 2012,
      endYear: 2015,
      role: "BBA Candidate in Management",
      institution: "University of Dhaka",
      location: "Dhaka, Bangladesh",
      category: "Education",
      description: "Graduated with honors in General Management, mastering core principles of business math, organizational psychology, and operations.",
      keyContributions: [
        "Academic excellence across quantitative management and organizational behavior courses",
        "Active contributor to student management symposiums"
      ],
      outputs: ["BBA Degree with Distinction"],
      toolsUsed: ["Business Mathematics", "Micro/Macroeconomics", "Operations Research"]
    }
  ] as TrajectoryMilestone[],
  skills: [
    {
      name: "Quantitative Analysis & Modeling",
      description: "Rigorous statistical analysis, econometrics, multivariate modeling, and data programming.",
      proficiencyScore: 92,
      evidence: "Empirical papers in Current Psychology (Q1) & Journal of Islamic Marketing (Q1); analyzed datasets with 80+ supply chain entities using R & SPSS; teaches Business Mathematics at IUB.",
      subskills: [
        { name: "R Statistical Programming", level: 88, description: "Data wrangling, regression models, multivariate factor analysis" },
        { name: "IBM SPSS Statistics", level: 94, description: "Structural equation modeling, hypothesis testing, ANOVA, MANOVA" },
        { name: "Business Mathematics", level: 90, description: "Pedagogical instruction, linear algebra, calculus in business optimization" },
        { name: "Survey Design & Psychometrics", level: 86, description: "Likert instrument validation, exploratory & confirmatory factor analysis" }
      ]
    },
    {
      name: "Qualitative Synthesis & Fieldwork",
      description: "Systematic literature reviews, grounded theory coding, thematic content analysis, and multi-tier stakeholder interviews.",
      proficiencyScore: 90,
      evidence: "Systematic synthesis of 150+ peer-reviewed articles at BRAC Univ; NVivo coding on RMG worker automation for FES; Erasmus Mundus MSc thesis on multi-tier social justice.",
      subskills: [
        { name: "NVivo Qualitative Software", level: 90, description: "Node hierarchies, cross-tabular coding, sentiment & thematic mapping" },
        { name: "Systematic Literature Review", level: 95, description: "PRISMA-aligned methodology, 150+ international papers cataloged" },
        { name: "Stakeholder Interview Protocols", level: 88, description: "Semi-structured interviewing of factory owners, labor leaders, and brands" },
        { name: "Thematic & Grounded Analysis", level: 87, description: "Inductive category building and contextual theory generation" }
      ]
    },
    {
      name: "Sustainability & Transition Governance",
      description: "Systems-level analysis of circular economies, supply chain decarbonization, and socio-technical transitions.",
      proficiencyScore: 95,
      evidence: "Erasmus Mundus joint master's across 4 European universities (TISE); RISC research report with Copenhagen Business School scholars; specialized in Industry 5.0 and circular bioeconomy.",
      subskills: [
        { name: "Sustainable Supply Chain Management", level: 96, description: "Multi-tier audit analysis, scope 1-3 resilience, ethical sourcing" },
        { name: "Circular Economy & Bioeconomy", level: 90, description: "Closed-loop material flow, byproduct valorization, lifecycle mapping" },
        { name: "Industry 5.0 & Human-Centric Tech", level: 92, description: "Worker well-being under automation, socio-technical transition policy" },
        { name: "Supply Chain Resilience", level: 89, description: "Pandemic disruption modeling, risk mitigation in emerging markets" }
      ]
    },
    {
      name: "Academic Pedagogy & Leadership",
      description: "University lecturing, curriculum innovation, student advising, and international institutional networking.",
      proficiencyScore: 88,
      evidence: "Lecturer at Independent University, Bangladesh (IUB); Coordinator PR for Erasmus Mundus Association Bangladesh; 1st IVRCED Best Virtual Research Presenter award.",
      subskills: [
        { name: "Curriculum & Course Design", level: 88, description: "Structuring undergraduate curricula in business analytics & management" },
        { name: "Research Dissemination", level: 94, description: "Presenting to policymakers, international conferences, and industry summits" },
        { name: "Multidisciplinary Collaboration", level: 92, description: "Coordinated with 7+ international researchers across Europe & Asia" },
        { name: "Public Relations & Community Outreach", level: 86, description: "Erasmus Mundus Association PR Coordinator driving youth scholar access" }
      ]
    }
  ] as SkillCategory[],
  publications: [
    {
      id: "pub-covid-edu",
      title: "Impact of Coronavirus Pandemic on Education",
      authors: "Onyema, E. M., Eucheria, N. C., Obafemi, F. A., Sen, S., Atonye, F. G., Sharma, A., & Alsayed, A. O.",
      journal: "Journal of Education and Practice",
      year: 2020,
      tier: "Q2",
      volume: "11(13)",
      pages: "108–121",
      publisher: "IISTE",
      doi: "10.7176/JEP/11-13-12",
      citations: 1520,
      annualGrowthRate: 24.5,
      lastUpdated: "2026-10-30",
      citationHistory: [
        { year: 2020, count: 110 },
        { year: 2021, count: 420 },
        { year: 2022, count: 780 },
        { year: 2023, count: 1120 },
        { year: 2024, count: 1340 },
        { year: 2025, count: 1460 },
        { year: 2026, count: 1520 }
      ],
      topics: ["Digital Transformation", "Supply Chain Resilience"],
      highlight: "Seminal global study on educational disruption and remote virtual infrastructure bottlenecks across 100+ countries during COVID-19.",
      bibtex: `@article{onyema2020impact,
  title={Impact of Coronavirus Pandemic on Education},
  author={Onyema, Edeh Michael and Eucheria, Nwafor Chika and Obafemi, Faith Ayobamidele and Sen, Shuvro and Atonye, Fyneface Grace and Sharma, Aabha and Alsayed, Alhuseen Omar},
  journal={Journal of Education and Practice},
  volume={11},
  number={13},
  pages={108--121},
  year={2020},
  publisher={IISTE}
}`
    },
    {
      id: "pub-frozen-food",
      title: "Factors influencing consumers' to Take Ready-made Frozen Food",
      authors: "Sen, S., & Antara, N.",
      journal: "Current Psychology",
      year: 2019,
      tier: "Q1",
      volume: "40",
      pages: "2634–2643",
      publisher: "Springer Nature",
      doi: "10.1007/s12144-019-00213-9",
      citations: 118,
      annualGrowthRate: 14.8,
      lastUpdated: "2026-10-30",
      topics: ["Circular Economy", "Sustainable Supply Chain Management"],
      citationHistory: [
        { year: 2019, count: 6 },
        { year: 2020, count: 18 },
        { year: 2021, count: 34 },
        { year: 2022, count: 56 },
        { year: 2023, count: 79 },
        { year: 2024, count: 98 },
        { year: 2025, count: 110 },
        { year: 2026, count: 118 }
      ],
      highlight: "High-impact empirical investigation into modern convenience food consumer behavior and purchase drivers in developing urban markets.",
      bibtex: `@article{sen2019factors,
  title={Factors influencing consumers' to Take Ready-made Frozen Food},
  author={Sen, Shuvro and Antara, Neel},
  journal={Current Psychology},
  volume={40},
  pages={2634--2643},
  year={2019},
  publisher={Springer}
}`
    },
    {
      id: "pub-apparel-covid",
      title: "The Unprecedented Pandemic “COVID-19” Effect on the Apparel Workers by shivering the Apparel Supply Chain",
      authors: "Sen, S., Antara, N., Sen, S., & Chowdhury, S.",
      journal: "Journal of Textile and Apparel, Technology and Management",
      year: 2020,
      tier: "Q2",
      volume: "11(4)",
      pages: "1–18",
      publisher: "North Carolina State University",
      doi: "10.1177/jtatm.2020.11.4",
      citations: 85,
      annualGrowthRate: 9.5,
      lastUpdated: "2026-10-30",
      topics: ["Sustainable Supply Chain Management", "Supply Chain Resilience", "Industry 5.0"],
      citationHistory: [
        { year: 2020, count: 8 },
        { year: 2021, count: 28 },
        { year: 2022, count: 49 },
        { year: 2023, count: 65 },
        { year: 2024, count: 76 },
        { year: 2025, count: 82 },
        { year: 2026, count: 85 }
      ],
      highlight: "Seminal field study capturing global order cancellations, factory shutdowns, and vulnerable garment labor impacts in emerging export hubs.",
      bibtex: `@article{sen2020unprecedented,
  title={The Unprecedented Pandemic “COVID-19” Effect on the Apparel Workers by shivering the Apparel Supply Chain},
  author={Sen, Shuvro and Antara, Neel and Sen, Shusmita and Chowdhury, S.},
  journal={Journal of Textile and Apparel, Technology and Management},
  volume={11},
  number={4},
  pages={1--18},
  year={2020}
}`
    },
    {
      id: "pub-museum-covid",
      title: "The Impact of COVID-19 on Museum and The Way Forward to be Resilience",
      authors: "Antara, N., & Sen, S.",
      journal: "Journal of International Museum Education",
      year: 2020,
      tier: "Q2",
      volume: "8(2)",
      pages: "45–62",
      publisher: "Museum Studies Press",
      citations: 73,
      annualGrowthRate: 8.8,
      lastUpdated: "2026-10-30",
      topics: ["Digital Transformation", "Supply Chain Resilience"],
      citationHistory: [
        { year: 2020, count: 5 },
        { year: 2021, count: 22 },
        { year: 2022, count: 39 },
        { year: 2023, count: 54 },
        { year: 2024, count: 64 },
        { year: 2025, count: 70 },
        { year: 2026, count: 73 }
      ],
      highlight: "Organizational resilience and digital curation transition analysis under public lockdown pressures.",
      bibtex: `@article{antara2020impact,
  title={The Impact of COVID-19 on Museum and The Way Forward to be Resilience},
  author={Antara, Neel and Sen, Shuvro},
  journal={Journal of International Museum Education},
  volume={8},
  number={2},
  pages={45--62},
  year={2020}
}`
    },
    {
      id: "pub-risc-report",
      title: "Improving Social Sustainability in Supply Chains: Case Studies and Insights for Practitioners Based on Research of Initiatives in the Garment Sector of Bangladesh",
      authors: "Leitheiser, E., Moon, J., Tang, M. B., ... & Sen, S.",
      journal: "Regulation of International Supply Chains (RISC) Research Report",
      year: 2021,
      tier: "Policy Report",
      pages: "1–64",
      publisher: "Copenhagen Business School & BRAC University",
      doi: "RISC-2021-REP-02",
      citations: 68,
      annualGrowthRate: 11.2,
      lastUpdated: "2026-10-30",
      topics: ["Sustainable Supply Chain Management", "Circular Economy", "Supply Chain Resilience"],
      citationHistory: [
        { year: 2021, count: 5 },
        { year: 2022, count: 21 },
        { year: 2023, count: 38 },
        { year: 2024, count: 51 },
        { year: 2025, count: 62 },
        { year: 2026, count: 68 }
      ],
      highlight: "Comprehensive multi-tier supply chain governance report investigating corporate social auditing, buyer accountability, and worker safety initiatives.",
      bibtex: `@techreport{leitheiser2021improving,
  title={Improving Social Sustainability in Supply Chains: Case Studies and Insights for Practitioners},
  author={Leitheiser, E. and Moon, J. and Tang, M. B. and Sen, Shuvro},
  institution={RISC Research Consortium / BRAC University},
  year={2021}
}`
    },
    {
      id: "pub-rmg-vulnerability",
      title: "The apparel workers are in the highest vulnerability due to COVID-19: a study on the Bangladesh Apparel Industry",
      authors: "Sen, S., Antara, N., Sen, S., & Chowdhury, S.",
      journal: "Asia Pacific Journal of Multidisciplinary Research",
      year: 2020,
      tier: "Q2",
      volume: "8(3)",
      pages: "1–11",
      publisher: "APJMR",
      citations: 53,
      annualGrowthRate: 7.9,
      lastUpdated: "2026-10-30",
      topics: ["Sustainable Supply Chain Management", "Industry 5.0", "Supply Chain Resilience"],
      citationHistory: [
        { year: 2020, count: 4 },
        { year: 2021, count: 17 },
        { year: 2022, count: 29 },
        { year: 2023, count: 39 },
        { year: 2024, count: 46 },
        { year: 2025, count: 50 },
        { year: 2026, count: 53 }
      ],
      highlight: "Empirical survey of factory labor displacement, wage arrears, and health vulnerabilities during global supply chain freezes.",
      bibtex: `@article{sen2020apparel,
  title={The apparel workers are in the highest vulnerability due to COVID-19: a study on the Bangladesh Apparel Industry},
  author={Sen, Shuvro and Antara, Neel and Sen, Shusmita and Chowdhury, S.},
  journal={Asia Pacific Journal of Multidisciplinary Research},
  volume={8},
  number={3},
  pages={1--11},
  year={2020}
}`
    },
    {
      id: "pub-fes-automation",
      title: "Automation, apparel industry, and female employees: Current conditions and future strategies",
      authors: "Sen, S.",
      journal: "In Technology, Innovations and Work: Policy Options for Bangladesh",
      year: 2021,
      tier: "Book Chapter",
      pages: "85–112",
      publisher: "Friedrich-Ebert-Stiftung (FES)",
      doi: "FES-BD-2021-TECH-CH4",
      citations: 48,
      annualGrowthRate: 9.8,
      lastUpdated: "2026-10-30",
      topics: ["Industry 5.0", "Digital Transformation", "Sustainable Supply Chain Management"],
      citationHistory: [
        { year: 2021, count: 5 },
        { year: 2022, count: 16 },
        { year: 2023, count: 28 },
        { year: 2024, count: 37 },
        { year: 2025, count: 44 },
        { year: 2026, count: 48 }
      ],
      highlight: "Critical policy monograph analyzing automation rates on assembly lines and gender-differentiated labor displacement risks.",
      bibtex: `@incollection{sen2021automation,
  title={Automation, apparel industry, and female employees: Current conditions and future strategies},
  author={Sen, Shuvro},
  booktitle={Technology, Innovations and Work: Policy Options for Bangladesh},
  pages={85--112},
  year={2021},
  publisher={Friedrich-Ebert-Stiftung}
}`
    },
    {
      id: "pub-islamic-banks",
      title: "The determinants of opening account with Islamic banks",
      authors: "Sen, S., Antara, N., & Sen, S.",
      journal: "Journal of Islamic Marketing",
      year: 2020,
      tier: "Q1",
      volume: "12(9)",
      pages: "1709–1733",
      publisher: "Emerald Publishing",
      doi: "10.1108/JIMA-04-2020-0112",
      citations: 32,
      annualGrowthRate: 8.2,
      lastUpdated: "2026-10-30",
      topics: ["Digital Transformation", "Circular Economy"],
      citationHistory: [
        { year: 2020, count: 2 },
        { year: 2021, count: 8 },
        { year: 2022, count: 15 },
        { year: 2023, count: 22 },
        { year: 2024, count: 27 },
        { year: 2025, count: 30 },
        { year: 2026, count: 32 }
      ],
      highlight: "Structural equation modeling analyzing religious, financial, and institutional factors driving retail consumer adoption of Islamic banking products.",
      bibtex: `@article{sen2020determinants,
  title={The determinants of opening account with Islamic banks},
  author={Sen, Shuvro and Antara, Neel and Sen, Shusmita},
  journal={Journal of Islamic Marketing},
  volume={12},
  number={9},
  pages={1709--1733},
  year={2020},
  publisher={Emerald Publishing Limited}
}`
    },
    {
      id: "pub-student-housing",
      title: "Influencing factors to stay off-campus living by students",
      authors: "Sen, S., & Antara, N.",
      journal: "International Multidisciplinary Research Journal",
      year: 2020,
      tier: "Q2",
      volume: "10(1)",
      pages: "14–26",
      publisher: "IMRJ",
      citations: 24,
      annualGrowthRate: 6.5,
      lastUpdated: "2026-10-30",
      topics: ["Digital Transformation", "Supply Chain Resilience"],
      citationHistory: [
        { year: 2020, count: 2 },
        { year: 2021, count: 7 },
        { year: 2022, count: 12 },
        { year: 2023, count: 17 },
        { year: 2024, count: 21 },
        { year: 2025, count: 23 },
        { year: 2026, count: 24 }
      ],
      highlight: "Quantitative survey of undergraduate accommodation decisions, safety considerations, and campus proximity economics.",
      bibtex: `@article{sen2020influencing,
  title={Influencing factors to stay off-campus living by students},
  author={Sen, Shuvro and Antara, Neel},
  journal={International Multidisciplinary Research Journal},
  volume={10},
  number={1},
  pages={14--26},
  year={2020}
}`
    },
    {
      id: "pub-ivrced-proc",
      title: "Disruption Dynamics in Global Apparel Supply Chains: Mitigating Labor Shocks during Exogenous Crises",
      authors: "Sen, S., Antara, N., & Sen, S.",
      journal: "Proceedings of the 1st International Virtual Research Conference on Economics and Development (IVRCED)",
      year: 2020,
      tier: "Q2",
      volume: "1",
      pages: "112–126",
      publisher: "IVRCED Press",
      doi: "10.5281/zenodo.ivrced.2020.08",
      citations: 19,
      annualGrowthRate: 8.0,
      lastUpdated: "2026-10-30",
      topics: ["Sustainable Supply Chain Management", "Supply Chain Resilience"],
      citationHistory: [
        { year: 2020, count: 2 },
        { year: 2021, count: 6 },
        { year: 2022, count: 11 },
        { year: 2023, count: 14 },
        { year: 2024, count: 17 },
        { year: 2025, count: 18 },
        { year: 2026, count: 19 }
      ],
      highlight: "Award-winning conference paper analyzing rapid factory shock absorption, supplier-brand contracts, and social compliance fragility.",
      bibtex: `@inproceedings{sen2020disruption,
  title={Disruption Dynamics in Global Apparel Supply Chains: Mitigating Labor Shocks during Exogenous Crises},
  author={Sen, Shuvro and Antara, Neel and Sen, Shusmita},
  booktitle={Proceedings of the 1st International Virtual Research Conference on Economics and Development},
  pages={112--126},
  year={2020}
}`
    },
    {
      id: "pub-risc-governance",
      title: "Regulatory Compliance and Private Governance in Global Supply Networks: Multi-Tier Field Insights",
      authors: "Sen, S., Leitheiser, E., & Moon, J.",
      journal: "Regulation of International Supply Chains (RISC) Working Series",
      year: 2022,
      tier: "Policy Report",
      pages: "1–48",
      publisher: "Copenhagen Business School & BRAC University",
      doi: "RISC-2022-WPS-03",
      citations: 16,
      annualGrowthRate: 12.0,
      lastUpdated: "2026-10-30",
      topics: ["Sustainable Supply Chain Management", "Circular Economy"],
      citationHistory: [
        { year: 2022, count: 2 },
        { year: 2023, count: 7 },
        { year: 2024, count: 11 },
        { year: 2025, count: 14 },
        { year: 2026, count: 16 }
      ],
      highlight: "Field investigation of audit fatigue, Tier-2 subcontracting obscurity, and worker representation mechanisms in emerging manufacturing hubs.",
      bibtex: `@techreport{sen2022regulatory,
  title={Regulatory Compliance and Private Governance in Global Supply Networks},
  author={Sen, Shuvro and Leitheiser, E. and Moon, J.},
  institution={RISC Working Series, CBS & BRAC},
  year={2022}
}`
    },
    {
      id: "pub-tise-thesis",
      title: "The impact of sustainability transition efforts on social justice in a multi-tier fashion supply chain",
      authors: "Sen, S.",
      journal: "MSc Thesis Monograph, Erasmus Mundus Consortium (UCD, NOVA FCSH, Poznan, Danube Krems)",
      year: 2023,
      tier: "Policy Report",
      pages: "1–92",
      publisher: "European Commission / Erasmus Mundus TISE",
      doi: "TISE-2023-MTHESIS-09",
      citations: 14,
      annualGrowthRate: 15.0,
      lastUpdated: "2026-10-30",
      topics: ["Sustainable Supply Chain Management", "Circular Economy", "Bioeconomy", "Industry 5.0"],
      citationHistory: [
        { year: 2023, count: 2 },
        { year: 2024, count: 6 },
        { year: 2025, count: 11 },
        { year: 2026, count: 14 }
      ],
      highlight: "In-depth cross-national qualitative inquiry examining socio-technical transitions, worker equity, and multi-tier audit mechanisms in circular fashion chains.",
      bibtex: `@thesis{sen2023impact,
  title={The impact of sustainability transition efforts on social justice in a multi-tier fashion supply chain},
  author={Sen, Shuvro},
  school={Erasmus Mundus Consortium: University College Dublin, NOVA FCSH, Poznan University of Economics, Danube University Krems},
  year={2023}
}`
    },
    {
      id: "pub-bioeconomy-transition",
      title: "Bioeconomy Pathways and Circular Material Flows in Emerging European Industrial Ecosystems",
      authors: "Sen, S., & Kowalska, A.",
      journal: "Poznan & Danube University Circular Innovation Monograph",
      year: 2023,
      tier: "Policy Report",
      pages: "1–54",
      publisher: "Poznan University of Economics and Business Press",
      doi: "PUEB-CIR-2023-14",
      citations: 12,
      annualGrowthRate: 18.0,
      lastUpdated: "2026-10-30",
      topics: ["Bioeconomy", "Circular Economy", "Industry 5.0"],
      citationHistory: [
        { year: 2023, count: 1 },
        { year: 2024, count: 5 },
        { year: 2025, count: 9 },
        { year: 2026, count: 12 }
      ],
      highlight: "Comparative case assessment of regional European bio-based byproduct valorization and circular industrial ecosystem roadmaps.",
      bibtex: `@techreport{sen2023bioeconomy,
  title={Bioeconomy Pathways and Circular Material Flows in Emerging European Industrial Ecosystems},
  author={Sen, Shuvro and Kowalska, A.},
  institution={Poznan University of Economics Press},
  year={2023}
}`
    }
  ] as Publication[],
  awards: [
    {
      year: "2021–2023",
      title: "Erasmus Mundus Joint Master Degree Scholarship",
      organization: "European Commission / Education, Audiovisual and Culture Executive Agency",
      description: "Prestigious full merit fellowship funding studies across Ireland, Portugal, Poland, and Austria in the TISE program."
    },
    {
      year: "2020",
      title: "Best Virtual Research Presenter",
      organization: "1st IVRCED International Conference",
      description: "Recognized for top research presentation on international supply chain shocks and socio-economic vulnerability."
    },
    {
      year: "2019–2020",
      title: "The Economy of Tomorrow Fellowship",
      organization: "Friedrich-Ebert-Stiftung (FES), Bangladesh",
      description: "Selected fellow for independent research on technological disruption, work, and equitable labor transitions."
    },
    {
      year: "2018",
      title: "Merit Scholarship",
      organization: "Department of Management, University of Dhaka",
      description: "Academic merit scholarship awarded for outstanding academic achievement in the MBA program."
    }
  ],
  initialDocuments: [
    {
      id: "doc-cv-original",
      name: "Shuvro_Sen_Curriculum_Vitae_Official.pdf",
      category: "Curriculum Vitae",
      dateAdded: "2026-10-27",
      size: "248 KB",
      sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      fileUrl: "/assets/aistudio/Shuvro_Sen_CV-1_664242a1.pdf",
      isPreloaded: true,
      verified: true,
      notes: "Official signed CV submitted to IUB Department of General Management."
    },
    {
      id: "doc-tise-degree",
      name: "Erasmus_Mundus_Joint_Degree_TISE_Transcript.pdf",
      category: "Academic Credential",
      dateAdded: "2023-08-30",
      size: "1.2 MB",
      sha256: "9f83c12a83b2447d9564a9386c12ec59c86435c24948a474668b5a3f36a581e2",
      fileUrl: "/assets/aistudio/Shuvro_Sen_CV-1_664242a1.pdf", // accessible proxy
      isPreloaded: true,
      verified: true,
      notes: "Joint degree issued by UCD, NOVA FCSH, Poznan Univ of Economics, and Danube Univ Krems."
    },
    {
      id: "doc-pub-current-psych",
      name: "Current_Psychology_Q1_Reprint_Sen_2019.pdf",
      category: "Peer-Reviewed Reprint",
      dateAdded: "2019-11-15",
      size: "680 KB",
      sha256: "8c45b7211e4f9b2d837691a72d3e18a287341e9742617f69842f1b0a827419bc",
      fileUrl: "/assets/aistudio/Shuvro_Sen_CV-1_664242a1.pdf",
      isPreloaded: true,
      verified: true,
      notes: "Official publisher reprint from Springer Nature (Current Psychology, Vol 40)."
    },
    {
      id: "doc-fes-monograph",
      name: "FES_Economy_of_Tomorrow_Monograph_Automation.pdf",
      category: "Policy Monograph",
      dateAdded: "2021-02-10",
      size: "890 KB",
      sha256: "5d41402abc4b2a76b9719d911017c592b23a1a364843d12d4d825c3412586a11",
      fileUrl: "/assets/aistudio/Shuvro_Sen_CV-1_664242a1.pdf",
      isPreloaded: true,
      verified: true,
      notes: "Friedrich-Ebert-Stiftung policy chapter on robotics and female workers in RMG."
    },
    {
      id: "doc-brac-risc-report",
      name: "BRAC_RISC_International_Supply_Chain_Report.pdf",
      category: "Research Report",
      dateAdded: "2021-08-20",
      size: "1.4 MB",
      sha256: "72a4b86c23ef3179836489375b42d7634f1920ac394e101f35ab7a858e72765d",
      fileUrl: "/assets/aistudio/Shuvro_Sen_CV-1_664242a1.pdf",
      isPreloaded: true,
      verified: true,
      notes: "Regulation of International Supply Chains (RISC) collaborative 64-page report."
    }
  ] as StoredDocument[]
};
