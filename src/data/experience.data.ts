export type TimelineItem = {
  id: string;
  date: string;
  title: string;
  organization: string;
  description: string;
  type: 'education' | 'project' | 'work';
  technologies?: string[];
};

export const timelineItems: TimelineItem[] = [
  {
    id: 'magical-pet',
    date: '2023',
    title: 'Magical Pet Kingdom',
    organization: 'Academic Project · FAST-NUCES',
    description:
      'Built a C++ system demonstrating multi-level inheritance, runtime polymorphism via virtual functions, operator overloading, and encapsulation through a rich pet class hierarchy.',
    type: 'project',
    technologies: ['C++', 'OOP', 'Inheritance', 'Polymorphism'],
  },
  {
    id: 'searoute',
    date: '2023',
    title: 'SeaRoute Navigator',
    organization: 'Academic Project · FAST-NUCES',
    description:
      'Implemented graph-based pathfinding with Dijkstra\'s algorithm for optimal sea route computation between ports. Deep dive into efficient data structures and algorithm design in C++.',
    type: 'project',
    technologies: ['C++', 'Graph Algorithms', 'Dijkstra', 'DSA'],
  },
  {
    id: 'cdiem',
    date: '2024',
    title: 'CDIEM: Software Architecture Project',
    organization: 'Academic Project · FAST-NUCES',
    description:
      'Engineered a desktop application applying SOLID principles and multiple design patterns (Factory, Observer, Strategy) throughout a modular component architecture using JavaFX.',
    type: 'project',
    technologies: ['JavaFX', 'Java', 'Design Patterns', 'SOLID'],
  },
  {
    id: 'disaster-management',
    date: '2024',
    title: 'Disaster Management MIS',
    organization: 'Academic Project · FAST-NUCES',
    description:
      'Built a full-stack Smart Disaster Response Management Information System with real-time emergency tracking, resource allocation, and role-based authentication.',
    type: 'project',
    technologies: ['React', 'Next.js', 'Node.js', 'Express', 'SQL Server'],
  },
  {
    id: 'studify',
    date: 'Jun 2026',
    title: 'Studify',
    organization: 'Personal project',
    description: 'Built a study workspace that turns uploaded notes into cited answers, summaries, and quizzes.',
    type: 'project',
    technologies: ['React', 'Express', 'pgvector'],
  },
  {
    id: 'worksync',
    date: 'Jul 2026',
    title: 'WorkSync',
    organization: 'Codoc IT internship',
    description: 'Led the login and activity log module for a team-built office management app.',
    type: 'work',
    technologies: ['React', 'TypeScript', 'Express'],
  },
  {
    id: 'sabaq-ai',
    date: 'Aug 2026',
    title: 'Sabaq AI',
    organization: 'Bano Qabil AI Hackathon',
    description: 'Built a study companion that grounds answers in Pakistani board textbooks and cites the source chapter and page.',
    type: 'project',
    technologies: ['Next.js', 'Supabase', 'pgvector'],
  },
  {
    id: 'fleetpulse-ai',
    date: 'Nov 2026',
    title: 'FleetPulse AI',
    organization: 'Academic team project · FAST-NUCES',
    description: 'Worked on a team project that compares models for estimating the remaining life of simulated turbofan engines.',
    type: 'project',
    technologies: ['Python', 'Streamlit', 'scikit-learn'],
  },
  {
    id: 'redline',
    date: 'Nov 2026',
    title: 'REDLINE',
    organization: 'Academic project · FAST-NUCES',
    description: 'Built a strategy racing game with graph-based routes, fuel management, and an interactive Algorithm Lab.',
    type: 'project',
    technologies: ['Python', 'Pygame', 'Graph Algorithms'],
  },
  {
    id: 'fast-nuces',
    date: '2023 - Present',
    title: 'BS Software Engineering',
    organization: 'FAST-NUCES, Pakistan',
    description:
      'Pursuing a Bachelor of Science in Software Engineering at FAST National University of Computer and Emerging Sciences. Core coursework includes Data Structures & Algorithms, Object-Oriented Programming, Software Design & Architecture, Database Systems, and Web Engineering.',
    type: 'education',
    technologies: ['C++', 'Java', 'Python', 'DSA', 'OOP', 'Software Architecture'],
  },
];
