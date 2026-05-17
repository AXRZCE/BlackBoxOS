export interface Experience {
  id: string;
  organization: string;
  location: string;
  role: string;
  timeframe: string;
  stack: string[];
  // Story content
  tldr: string; // One-liner summary
  context: string; // What was the situation/opportunity
  whatIDid: string[]; // Key responsibilities broken down
  impact: string[]; // Measurable outcomes
  learned: string[]; // Personal growth & takeaways
  challengesFaced: string[]; // Real challenges and how I overcame them
  // Optional extras
  teamSize?: string;
  reportedTo?: string;
  funFact?: string; // Something memorable/human
}

export const experiences: Experience[] = [
  {
    id: 'beautynbrushes-pm-intern',
    organization: 'BeautyNBrushes',
    location: 'Toronto, ON',
    role: 'Product Manager Intern',
    timeframe: 'Jan 2026 - Present',
    stack: ['Jira', 'Figma', 'Notion', 'SQL', 'Analytics'],
    tldr: 'Driving a full platform relaunch—owning the backlog, running QA, and making sure we ship features that actually work.',
    context: `BeautyNBrushes is a marketplace connecting beauty service providers with clients. When I joined, the team was gearing up for a major relaunch—rebuilding core flows from signup to payments. I came in as the PM intern responsible for keeping the backlog tight, making sure nothing ships broken, and understanding what competitors were doing better than us.`,
    whatIDid: [
      'Wrote and refined user stories with clear acceptance criteria for every flow—signup, profiles, booking, payments, and notifications. If it touched the user, I documented it.',
      'Owned UAT and QA for every sprint. I logged bugs with actual repro steps (not just "it\'s broken"), validated fixes, and made sure we weren\'t shipping embarrassing issues.',
      'Did deep competitor teardowns—not just screenshots, but actual analysis of what they do well and where we can differentiate. This directly shaped our feature priorities.',
    ],
    impact: [
      'Reduced release risk by catching critical bugs before they hit production',
      'Created a backlog that the dev team actually trusts and can execute against',
      'Competitor insights directly influenced 3 feature prioritization decisions',
    ],
    learned: [
      'Good acceptance criteria save everyone time. Vague tickets create vague features.',
      'QA isn\'t just about finding bugs—it\'s about understanding the user journey deeply enough to know when something feels wrong.',
      'Competitor research is only useful if you translate it into actionable product decisions.',
    ],
    challengesFaced: [
      'Joining mid-relaunch meant ramping up fast while the train was already moving. I had to learn the product, the codebase context, and team dynamics simultaneously.',
      'Balancing thoroughness with speed—sometimes you need to ship, but you also can\'t ship garbage. Finding that line is an ongoing challenge.',
    ],
    teamSize: '5-person product & engineering team',
    funFact: 'I\'ve probably tested the booking flow 200+ times. I could book a haircut in my sleep at this point.',
  },
  {
    id: 'gdg-marketing-lead',
    organization: 'Google Developer Group on Campus',
    location: 'Toronto, ON',
    role: 'Marketing Lead',
    timeframe: 'Jan 2026 - Present',
    stack: ['Notion', 'Canva', 'Discord', 'Instagram', 'Google Analytics'],
    tldr: 'Running marketing for a developer community—planning events, creating content, and figuring out what actually gets people to show up.',
    context: `GDG on Campus is Google\'s official developer community for students. As Marketing Lead, I\'m responsible for getting people excited about our events and growing our community. It\'s part strategy, part execution, and a lot of figuring out what resonates with busy students.`,
    whatIDid: [
      'Plan and execute event campaigns end-to-end—from positioning and content creation to launch timing and community promotion. Every event needs a story.',
      'Built a monthly content calendar and actually stick to it. Consistency matters more than virality.',
      'Track engagement signals obsessively—what posts work, what times work, what topics resonate. Then iterate.',
    ],
    impact: [
      'Grew event attendance through targeted campaigns and better positioning',
      'Built a repeatable content system that doesn\'t rely on last-minute scrambles',
      'Improved reach by iterating on channel strategy based on actual data',
    ],
    learned: [
      'Marketing for developers is different—they smell BS instantly. Authenticity and value-first content wins.',
      'Consistency beats perfection. A good post every week beats a perfect post once a month.',
      'Community building is a long game. Quick wins are nice, but trust takes time.',
    ],
    challengesFaced: [
      'Getting students to show up to anything is hard. Everyone\'s busy, everyone\'s tired. You have to make the value proposition crystal clear.',
      'Balancing quality with the reality that this is a volunteer role alongside school and other work.',
    ],
    teamSize: 'Core team of 8 organizers',
    funFact: 'Our Discord server has more memes than technical discussions, and honestly, that\'s probably why people stick around.',
  },
  {
    id: 'gov-ontario-aiml-intern',
    organization: 'Government of Ontario',
    location: 'Toronto, ON',
    role: 'AI/ML Intern',
    timeframe: 'May 2025 - Dec 2025',
    stack: ['Azure AI Foundry', 'Power BI', 'Microsoft Fabric', 'Jira', 'Python', 'SQL'],
    tldr: 'Built an AI-powered tool that cut architecture review time by 30%—from product strategy to shipping the actual AI integration.',
    context: `I joined the Enterprise Architecture Office at a time when architecture reviews were painfully slow. Multiple handoffs, inconsistent artifacts, and no centralized visibility meant reviews took forever and leadership couldn\'t see the big picture. My job was to fix that—not just as a developer, but as the product owner driving the entire initiative.`,
    whatIDid: [
      'Owned the product end-to-end: scope, roadmap, Jira backlog, milestones, and release planning. I worked directly with senior architects to define what success looked like.',
      'Standardized review artifacts and automated manual steps. This alone removed multiple handoffs and made the process actually repeatable.',
      'Built a leadership dashboard in Power BI / Microsoft Fabric that centralized application portfolios across clusters. Finally, leadership could see everything in one place.',
      'Designed and integrated an Azure AI Foundry model to help draft, summarize, and structure architecture inputs. This was the "wow" feature that got stakeholders excited.',
      'Ran demos, collected feedback, translated requirements into tickets, and supported adoption with documentation and training. Shipping is only half the battle—adoption is the other half.',
    ],
    impact: [
      'Cut architecture review cycle time by ~30%—that\'s weeks saved across the organization',
      'Eliminated multiple handoffs between branches that were causing delays and confusion',
      'Gave leadership visibility they never had before through centralized dashboards',
      'Successfully integrated AI into a government workflow—not trivial given security and compliance requirements',
    ],
    learned: [
      'Product ownership in government is a different beast. Stakeholder alignment takes longer, but when you get it, you can move mountains.',
      'Process improvement often has more impact than fancy features. Sometimes the boring stuff is the most valuable.',
      'AI integration works best when it solves a specific, well-defined pain point—not when it\'s "AI for AI\'s sake."',
      'Documentation and training are not afterthoughts. If people don\'t know how to use what you built, you didn\'t really ship anything.',
    ],
    challengesFaced: [
      'Government security and compliance requirements meant every AI decision needed extra scrutiny. I had to learn to navigate these constraints while still moving fast.',
      'Getting buy-in from senior architects who\'ve been doing things a certain way for years. Change management is real.',
      'Balancing the product owner role with hands-on technical work. Some days I was in strategy meetings, other days I was debugging Power BI queries.',
    ],
    teamSize: 'Worked with 10+ architects across multiple branches',
    reportedTo: 'Senior Enterprise Architects',
    funFact: 'I presented to directors who\'ve been in government longer than I\'ve been alive. Terrifying at first, but they were genuinely excited about the AI features.',
  },
];

export function getExperiences(): Experience[] {
  return experiences;
}

export function getExperienceById(id: string): Experience | undefined {
  return experiences.find((exp) => exp.id === id);
}

