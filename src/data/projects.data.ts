export type ArchitectureNode = {
  id: string;
  label: string;
  description: string;
  children?: string[];
};

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  github?: string;
  demo?: string;
  highlights?: string[];
  image: string;
  architecture?: ArchitectureNode[];
};

export const projects: Project[] = [
  {
    id: 'disaster-management',
    title: 'Disaster Management System',
    description:
      'Smart Disaster Response Management Information System for tracking emergencies, allocating resources, and coordinating relief efforts in real time.',
    category: 'Full-Stack Web Application',
    technologies: ['React.js', 'Next.js', 'Express.js', 'Node.js', 'MongoDB'],
    github: 'https://github.com/TahaSohail-Goat/SmartDisasterResponseMIS',
    demo: '#',
    image: '/images/disaster-management-bg.png',
    highlights: [
      'Real-time emergency tracking dashboard',
      'Resource allocation engine',
      'Multi-role authentication system',
      'RESTful API with Express.js',
    ],
    architecture: [
      {
        id: 'client',
        label: 'React / Next.js Frontend',
        description: 'Dashboard UI for operators and field responders',
        children: ['api'],
      },
      {
        id: 'api',
        label: 'Express.js REST API',
        description: 'Business logic, validation, routing',
        children: ['db'],
      },
      {
        id: 'db',
        label: 'MongoDB Database',
        description: 'Persistent storage for incidents, resources, and users',
      },
    ],
  },
  {
    id: 'cdiem',
    title: 'CDIEM',
    description:
      'A Software Design & Architecture project engineered with modular components, design patterns, and SOLID principles applied throughout the system.',
    category: 'Software Architecture / Desktop App',
    technologies: ['JavaFX', 'Java', 'CSS', 'OOP', 'Design Patterns'],
    github: 'https://github.com/TahaSohail-Goat/CDIEM',
    demo: '#',
    image: '/images/cdiem-architecture-bg.png',
    highlights: [
      'SOLID principles applied throughout',
      'Multiple design patterns: Factory, Observer, Strategy',
      'Modular component architecture',
      'JavaFX GUI with custom CSS styling',
    ],
    architecture: [
      {
        id: 'ui',
        label: 'JavaFX UI Layer',
        description: 'Presentation layer with custom-styled components',
        children: ['domain'],
      },
      {
        id: 'domain',
        label: 'Domain / Service Layer',
        description: 'Business logic implementing design patterns',
        children: ['data'],
      },
      {
        id: 'data',
        label: 'Data / Persistence Layer',
        description: 'Data management and state handling',
      },
    ],
  },
  {
    id: 'searoute',
    title: 'SeaRoute Navigator',
    description:
      'Efficient pathfinding algorithms for optimal sea routes between ports, featuring graph-based navigation and shortest path optimization.',
    category: 'Algorithms / DSA',
    technologies: ['C++', 'Graph Algorithms', 'Dijkstra', 'DSA'],
    github: 'https://github.com/TahaSohail-Goat/SeaRoute-Navigator',
    image: '/images/project-1-bg.png',
    highlights: [
      'Dijkstra\'s shortest path implementation',
      'Graph-based port network model',
      'Efficient adjacency list representation',
      'CLI interface for route queries',
    ],
    architecture: [
      {
        id: 'input',
        label: 'CLI Input Layer',
        description: 'Port selection and query interface',
        children: ['graph'],
      },
      {
        id: 'graph',
        label: 'Graph Engine',
        description: 'Adjacency list, edge weights, Dijkstra\'s algorithm',
        children: ['output'],
      },
      {
        id: 'output',
        label: 'Route Output',
        description: 'Formatted path and distance results',
      },
    ],
  },
  {
    id: 'magical-pet',
    title: 'Magical Pet Kingdom',
    description:
      'Fantasy pet management system demonstrating key OOP concepts (inheritance, polymorphism, encapsulation, and abstraction) through a rich class hierarchy.',
    category: 'OOP / Systems Design',
    technologies: ['C++', 'OOP', 'Class Hierarchy', 'CLI'],
    github: 'https://github.com/TahaSohail-Goat/Magical-Pet-Kingdom-in-C-',
    image: '/images/magical-pet-kingdom-bg.png',
    highlights: [
      'Multi-level inheritance hierarchy',
      'Runtime polymorphism via virtual functions',
      'Encapsulation of pet state and behaviors',
      'Operator overloading and friend functions',
    ],
  },
];
