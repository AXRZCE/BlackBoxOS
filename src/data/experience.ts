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
    id: 'gov-ontario-aiml-intern',
    organization: 'Government of Ontario',
    location: 'Toronto, ON',
    role: 'AI/ML Intern',
    timeframe: 'May 2025 - Dec 2025',
    stack: ['Azure AI Foundry', 'RAG', 'Power BI', 'Microsoft Fabric', 'Jira', 'Python', 'SQL'],
    tldr: 'Configured Azure AI Foundry models, used RAG techniques, and built portfolio dashboards while helping reduce architecture review cycle time by 30%.',
    context: `The Enterprise Architecture Office needed better ways to review architecture inputs, ground AI support in real portfolio context, and understand the software application portfolio across ministries and clusters. I worked across AI configuration, dashboard development, and product execution so the work became something people could actually use, not just a prototype.`,
    whatIDid: [
      'Configured Azure AI Foundry models to support drafting, summarization, and structured architecture review inputs inside the workflow.',
      'Used RAG techniques to ground AI responses in relevant architecture and portfolio context instead of generic model output.',
      'Built Power BI and Microsoft Fabric dashboards for the EAO Director and Application Portfolio team to analyze the software application portfolio across ministries and clusters.',
      'Owned product scope, roadmap, Jira backlog, milestones, and release planning while staying hands-on with the AI and dashboard work.',
      'Standardized review artifacts and automated manual handoff steps across 3+ organizational branches.',
    ],
    impact: [
      'Reduced architecture review cycle time by 30%',
      'Removed manual handoffs across 3+ branches',
      'Gave EAO leadership and the Application Portfolio team clearer visibility into the software application portfolio across ministries and clusters',
      'Moved AI support from idea to working Azure AI Foundry configuration inside the review workflow',
      'Made AI outputs more useful by grounding them with RAG-style context',
    ],
    learned: [
      'AI product work gets stronger when model configuration, retrieval context, dashboards, and workflow design are built together.',
      'RAG is only useful when the source context and user journey are clear.',
      'Dashboards work best when they answer real leadership questions, not just display data.',
      'Product ownership helped me ship the technical work instead of leaving it as a prototype.',
    ],
    challengesFaced: [
      'Balanced hands-on AI configuration with product ownership responsibilities across roadmap, backlog, and stakeholder alignment.',
      'Worked with portfolio data that needed to make sense to technical architects, the EAO Director, and application portfolio stakeholders.',
      'Kept AI outputs useful, grounded, and appropriate for a public-sector architecture workflow.',
    ],
    teamSize: 'Worked with 10+ architects across multiple branches',
    reportedTo: 'Senior Enterprise Architects',
    funFact: 'The best part was seeing the same work support both AI-assisted review and leadership-level portfolio visibility.',
  },
  {
    id: 'beautynbrushes-pm-intern',
    organization: 'BeautyNBrushes',
    location: 'Toronto, ON',
    role: 'Product Manager Intern',
    timeframe: 'Jan 2026 - Apr 2026',
    stack: ['Jira', 'Figma', 'Notion', 'SQL', 'Analytics'],
    tldr: 'Supported the BeautyNBrushes 2.0 relaunch across 4 markets by running product rituals, tightening backlog quality, and keeping launch work moving.',
    context: `BeautyNBrushes was preparing a relaunch across Canada, the U.S., Ghana, and Nigeria. I supported the product team by defining client and provider workflows, leading sprint reviews and stakeholder meetings, refining backlog items, and validating launch-critical features across onboarding, booking, payments, tipping, notifications, disputes, and policies.`,
    whatIDid: [
      'Wrote and prioritized user stories, acceptance criteria, and feature requirements for 8+ core workflows.',
      'Mapped client and provider experiences for onboarding, profiles, booking, payments, tipping, notifications, disputes, and policy flows.',
      'Led sprint reviews and stakeholder meetings to keep product decisions, open questions, and delivery progress visible.',
      'Acted as APM while the PM was away, helping manage day-to-day product execution and unblock sprint work.',
      'Led UAT and release QA for sprint deliverables, documenting defects with clear reproduction steps and validating fixes before launch.',
      'Produced market and competitor research across 4 regions to support roadmap decisions, feature prioritization, and go-to-market planning.',
      'Onboarded new interns by walking them through product context, team workflows, backlog structure, and current release priorities.',
    ],
    impact: [
      'Reduced launch risk across client and provider platform experiences',
      'Improved backlog clarity for engineering execution',
      'Kept sprint reviews, stakeholder updates, and day-to-day product work moving when extra ownership was needed',
      'Helped new interns ramp faster into the product and release workflow',
      'Supported multi-market product decisions across Canada, the U.S., Ghana, and Nigeria',
      'Turned competitor research into product and go-to-market inputs',
    ],
    learned: [
      'Clear acceptance criteria reduce ambiguity for both product and engineering teams.',
      'Leading sprint reviews forces you to know the work well enough to explain tradeoffs clearly.',
      'Stakeholder meetings work best when decisions, blockers, and next steps are obvious before people leave the call.',
      'Good QA starts with understanding the full user journey, not only testing isolated screens.',
      'Competitive research is most useful when it becomes prioritization, positioning, or launch guidance.',
    ],
    challengesFaced: [
      'Ramped into an active relaunch while learning the product, team workflow, and market context at the same time.',
      'Took on APM-style ownership while balancing execution work across backlog refinement, QA, meetings, and intern onboarding.',
      'Balanced speed with release quality while validating launch-critical features across two platform experiences.',
    ],
    teamSize: '5-person product & engineering team',
    funFact: 'The work sharpened how I think about marketplace products, especially when one change affects both supply and demand sides.',
  },
  {
    id: 'gdg-marketing-lead',
    organization: 'Google Developer Group on Campus',
    location: 'Toronto, ON',
    role: 'Marketing Lead',
    timeframe: 'Jan 2026 - Mar 2026',
    stack: ['Notion', 'Canva', 'AI Tools', 'Discord', 'Instagram', 'Google Analytics'],
    tldr: 'Led go-to-market planning for a campus developer community by creating content, testing engagement ideas, and turning campaigns into repeatable systems.',
    context: `Google Developer Group on Campus needed consistent event promotion and clearer messaging for a busy student audience. I led marketing planning by shaping campaign strategy, creating and editing social content with AI tools, managing a monthly content calendar, and coordinating promotion across community channels.`,
    whatIDid: [
      'Planned event campaigns from positioning and content creation to launch timing and community promotion.',
      'Created, edited, and posted social media content with help from AI tools while keeping the voice useful for student developers.',
      'Built and managed a monthly content calendar to keep campaigns consistent across channels.',
      'Came up with engagement ideas for events and community posts, then discussed and presented them to the organizing team.',
      'Tracked engagement KPIs and used performance signals to refine messaging, timing, and channel tactics.',
    ],
    impact: [
      'Improved event reach and participation through stronger positioning',
      'Created a repeatable content planning system for the organizing team',
      'Turned content ideas into posts, campaigns, and team discussion points instead of leaving them as random brainstorms',
      'Used engagement data to make channel strategy more disciplined',
    ],
    learned: [
      'Developer audiences respond to clear value, credible messaging, and practical reasons to attend.',
      'AI tools are useful when they speed up drafting and editing, but the final message still needs human taste.',
      'A repeatable content cadence creates more momentum than isolated campaign pushes.',
      'Good engagement ideas get stronger when they are shared early, challenged by the team, and turned into clear next steps.',
      'Community growth depends on trust, consistency, and a clear reason for people to keep showing up.',
    ],
    challengesFaced: [
      'Made event value clear enough to compete with busy student schedules.',
      'Used AI tools without letting the content feel generic or disconnected from the community.',
      'Balanced campaign quality with the realities of a volunteer team and an academic workload.',
    ],
    teamSize: 'Core team of 8 organizers',
    funFact: 'The role made community growth feel like a product problem: understand the audience, test the message, and improve the loop.',
  },
];

export function getExperiences(): Experience[] {
  return experiences;
}

export function getExperienceById(id: string): Experience | undefined {
  return experiences.find((exp) => exp.id === id);
}
