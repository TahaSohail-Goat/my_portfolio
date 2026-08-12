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
    id: 'disaster-mis',
    date: '2024',
    title: 'Disaster Management MIS',
    organization: 'Academic Project · FAST-NUCES',
    description:
      'Built a full-stack Smart Disaster Response Management Information System with real-time emergency tracking, resource allocation, and multi-role authentication. First end-to-end MERN stack application.',
    type: 'project',
    technologies: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB'],
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
