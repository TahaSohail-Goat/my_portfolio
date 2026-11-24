export type ArchitectureNode = {
  id: string;
  label: string;
  description: string;
  children?: string[];
};

export const projectCategories = [
  "AI & ML",
  "Web Apps",
  "Websites & 3D",
  "Desktop Apps",
  "Games",
  "Algorithms & Systems",
  "Cloud & DevOps",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  categories: ProjectCategory[];
  technologies: string[];
  featured?: boolean;
  context?: string;
  github?: string;
  demo?: string;
  highlights?: string[];
  architecture?: ArchitectureNode[];
};

export const projects: Project[] = [
  {
    id: 'sabaq-ai',
    categories: ["AI & ML", "Web Apps"],
    title: 'Sabaq AI',
    description:
      'A syllabus-grounded AI study companion for Pakistani board students. It answers questions from textbook and past-paper sources, cites the chapter and page, and refuses when retrieval confidence is too low.',
    category: 'Full-Stack AI / Education Platform',
    technologies: ['Next.js', 'TypeScript', 'Supabase', 'Postgres', 'pgvector', 'Gemini', 'Jina AI'],
    featured: true,
    context: 'Personal project',
    github: 'https://github.com/TahaSohail-Goat/SabaqAI',
    demo: 'https://sabaq-ai-three.vercel.app',
    highlights: [
      'Textbook-grounded answers with chapter and page citations',
      'Confidence gate refuses off-syllabus questions before generation',
      'Urdu, Roman Urdu, and English study support',
      'Quizzes, progress tracking, revision plans, and source PDF reader',
    ],
    architecture: [
      {
        id: 'student',
        label: 'Student Experience',
        description: 'Next.js app for doubts, chat, quizzes, study plans, and source reading',
        children: ['retrieval'],
      },
      {
        id: 'retrieval',
        label: 'Grounded Retrieval',
        description: 'Jina embeddings and Supabase pgvector search filtered by board, class, and subject',
        children: ['guardrail'],
      },
      {
        id: 'guardrail',
        label: 'Confidence Guardrail',
        description: 'Blocks generation below the calibrated confidence threshold; validates citations against retrieved sources',
        children: ['generation'],
      },
      {
        id: 'generation',
        label: 'AI Tutor',
        description: 'Gemini generates answers from retrieved textbook chunks only',
      },
    ],
  },
  {
    id: 'studify',
    categories: ["AI & ML", "Web Apps"],
    title: 'Studify',
    description:
      'A full-stack study workspace that turns a student’s own notes into searchable, cited AI conversations, summaries, quizzes, and progress insights.',
    category: 'Full-Stack AI Study Platform',
    technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'pgvector', 'Groq', 'Transformers.js'],
    featured: true,
    context: 'Personal project',
    github: 'https://github.com/TahaSohail-Goat/Studyify',
    demo: 'https://studify-six.vercel.app',
    highlights: [
      'Upload PDF, PowerPoint, Word, and text notes',
      'RAG chat cites the student’s own source documents',
      'Generate summaries and chapter quizzes from uploaded material',
      'Local neural embeddings with pgvector semantic search',
    ],
    architecture: [
      {
        id: 'workspace',
        label: 'React Study Workspace',
        description: 'Document library, chat, summaries, quizzes, and study analytics',
        children: ['api'],
      },
      {
        id: 'api',
        label: 'Express API',
        description: 'Authentication, document processing, AI workflows, and per-user access controls',
        children: ['knowledge'],
      },
      {
        id: 'knowledge',
        label: 'Personal Knowledge Store',
        description: 'Postgres and pgvector store document chunks and local semantic embeddings',
        children: ['models'],
      },
      {
        id: 'models',
        label: 'AI Services',
        description: 'Groq models answer with retrieved context and generate study material',
      },
    ],
  },
  {
    id: 'fleetpulse-ai',
    categories: ["AI & ML", "Web Apps"],
    title: 'FleetPulse AI',
    description:
      'A Streamlit application that estimates the remaining useful life of simulated turbofan engines using NASA C-MAPSS FD001 sensor histories and compares illustrative maintenance schedules.',
    category: 'Applied Machine Learning / Predictive Maintenance',
    technologies: ['Python', 'Streamlit', 'scikit-learn', 'XGBoost', 'SHAP', 'Plotly'],
    featured: true,
    context: 'Academic team project',
    github: 'https://github.com/Artfever/FleetpulseAI',
    demo: 'https://fleetpulseai.streamlit.app/',
    highlights: [
      'Explore simulated engine sensor histories or upload a compatible dataset',
      'Compare five trained models using held-out FD001 benchmark results',
      'Inspect which features influenced a Decision Tree estimate with SHAP',
      'Compare illustrative maintenance schedules under different constraints',
    ],
    architecture: [
      {
        id: 'data',
        label: 'Sensor Data & Features',
        description: 'Validates engine histories and turns cycle-level sensor measurements into features for prediction',
        children: ['models'],
      },
      {
        id: 'models',
        label: 'RUL Models & Evaluation',
        description: 'Frozen model bundles estimate remaining cycles, with benchmark metrics reported on held-out engines',
        children: ['app'],
      },
      {
        id: 'app',
        label: 'Exploration & Planning',
        description: 'Streamlit views display engine histories, model results, feature explanations, and illustrative scheduling scenarios',
      },
    ],
  },
  {
    id: 'eco28',
    categories: ["Websites & 3D"],
    title: 'Eco 28 Studio',
    description:
      'A client website for a residential architecture and interior design studio, built around an animated 3D hero and six sections for interiors, materials, models, portfolio work, studio information, and inquiries.',
    category: 'Web Experience / Studio Website',
    technologies: ['React', 'TypeScript', 'Vite', 'Three.js', 'React Three Fiber', 'GSAP', 'Motion'],
    context: 'Client project',
    github: 'https://github.com/TahaSohail-Goat/Eco-28',
    highlights: [
      'Animated 3D hero with lazy-loaded scenes',
      'Six connected studio sections with retained content and interactions',
      'Responsive photo collections for architecture, interiors, and model studies',
      'Reduced-motion support and documented performance checks',
    ],
    architecture: [
      {
        id: 'experience',
        label: 'Studio Experience',
        description: 'Responsive React site with six sections and native page navigation',
        children: ['scenes'],
      },
      {
        id: 'scenes',
        label: 'Interactive Scenes',
        description: 'Three.js and React Three Fiber hero modules, loaded on demand',
        children: ['content'],
      },
      {
        id: 'content',
        label: 'Studio Content',
        description: 'Curated project photography, materials, models, and inquiry flow',
      },
    ],
  },
  {
    id: 'disaster-management',
    categories: ["Web Apps"],
    title: 'Disaster Management System',
    description:
      'Smart Disaster Response Management Information System for tracking emergencies, allocating resources, and coordinating relief efforts in real time.',
    category: 'Full-Stack Web Application',
    technologies: ['Next.js', 'React', 'Express', 'Node.js', 'SQL Server'],
    context: 'Academic project',
    github: 'https://github.com/TahaSohail-Goat/SmartDisasterResponseMIS',
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
        label: 'SQL Server Database',
        description: 'Persistent storage for incidents, resources, and users',
      },
    ],
  },
  {
    id: 'cdiem',
    categories: ["Desktop Apps"],
    title: 'CDIEM',
    description:
      'A role-based desktop application for managing investigation cases and digital evidence, from case registration and evidence intake through forensic verification and supervisory review.',
    category: 'Software Architecture / Desktop App',
    technologies: ['JavaFX', 'Java', 'SQL Server', 'JDBC', 'FXML', 'Maven'],
    featured: true,
    context: 'Academic project',
    github: 'https://github.com/TahaSohail-Goat/CDIEM',
    highlights: [
      'Role-based workflows for investigating officers, forensic analysts, and supervisors',
      'SHA-256 evidence verification and case freezing when tampering is detected',
      'Chain-of-custody audit logs and recorded closure decisions',
      'Review of escalated cases and summary reports with CSV and PDF export',
    ],
    architecture: [
      {
        id: 'ui',
        label: 'JavaFX UI Layer',
        description: 'FXML views and JavaFX controllers for case intake, evidence review, and reporting',
        children: ['domain'],
      },
      {
        id: 'domain',
        label: 'Domain / Service Layer',
        description: 'Java services handle evidence verification, case transitions, and supervisory decisions',
        children: ['data'],
      },
      {
        id: 'data',
        label: 'Data / Persistence Layer',
        description: 'JDBC repositories persist cases and audit records in SQL Server, with evidence files stored locally',
      },
    ],
  },
  {
    id: 'searoute',
    categories: ["Desktop Apps", "Algorithms & Systems"],
    title: 'SeaRoute Navigator',
    description:
      'An interactive maritime route planner and cargo booking simulation with a visual map of global ports.',
    category: 'Desktop App / Graph Algorithms',
    technologies: ['C++', 'SFML', 'Graph Algorithms', 'Dijkstra', 'A*'],
    github: 'https://github.com/TahaSohail-Goat/SeaRoute-Navigator',
    highlights: [
      'Dijkstra and A* compare routes by cost or time',
      'Interactive world map with animated routes and port details',
      'Cargo booking history and port docking queues',
      'Custom routes with multiple legs and ship preferences',
    ],
    architecture: [
      {
        id: 'input',
        label: 'Interactive world map',
        description: 'An SFML interface for exploring ports and selecting route endpoints',
        children: ['graph'],
      },
      {
        id: 'graph',
        label: 'Graph Engine',
        description: 'A weighted port network with Dijkstra and A* for route planning',
        children: ['output'],
      },
      {
        id: 'output',
        label: 'Routing and booking',
        description: 'Visualizes routes, compares cost and time, and supports cargo bookings and docking queues',
      },
    ],
  },
  {
    id: 'magical-pet',
    categories: ["Games"],
    title: 'Magical Pet Kingdom',
    description:
      'A C++ and SFML fantasy game where players interact with mythical creatures, explore different environments, and take part in battles and mini-games.',
    category: 'Game Development / Object-Oriented Programming',
    technologies: ['C++', 'SFML', 'OOP', 'Class Hierarchy'],
    github: 'https://github.com/TahaSohail-Goat/Magical-Pet-Kingdom-in-C-',
    highlights: [
      'Multi-level inheritance hierarchy',
      'Runtime polymorphism via virtual functions',
      'Encapsulation of pet state and behaviors',
      'Operator overloading and friend functions',
      'Creature battles, mini-games, and an in-game item shop',
    ],
  },
  {
    id: "redline",
    categories: ["Games", "Algorithms & Systems"],
    title: "REDLINE",
    description:
      "A strategy racing game where route choices, fuel, nitro, and changing road conditions affect the outcome of each race.",
    category: "Game Development / Algorithms",
    technologies: ["Python", "Pygame", "Graph Algorithms"],
    context: "Academic project",
    github: "https://github.com/TahaSohail-Goat/Smart-Racing-Championship",
    highlights: [
      "Three-circuit championship with live standings",
      "Route comparison for speed, economy, safety, and balance",
      "Interactive Algorithm Lab with step-by-step traces",
    ],
    architecture: [
      {
        id: "graph",
        label: "Circuit graph",
        description: "Roads, checkpoints, shortcuts, and services share a single graph representation.",
        children: ["simulation"],
      },
      {
        id: "simulation",
        label: "Race simulation",
        description: "A fixed-step engine tracks checkpoints, resources, rivals, and road events.",
        children: ["interface"],
      },
      {
        id: "interface",
        label: "Pygame interface",
        description: "The game, tactical map, and Algorithm Lab visualize the same route and simulation data.",
      },
    ],
  },
  {
    id: "civicpulse",
    categories: ["AI & ML", "Web Apps", "Cloud & DevOps"],
    title: "CivicPulse",
    description:
      "An AI-assisted complaint triage app that turns resident reports into categorized, prioritized cases for municipal operators.",
    category: "Full-Stack Civic Technology",
    technologies: ["React", "TypeScript", "FastAPI", "PostgreSQL", "Redis", "Kubernetes"],
    context: "Academic team project",
    github: "https://github.com/TahaSohail-Goat/CivicPulse",
    highlights: [
      "Residents describe civic issues in their own words",
      "Triage produces a category, priority, and summary",
      "An operator queue surfaces urgent reports first",
    ],
    architecture: [
      {
        id: "intake",
        label: "Resident intake",
        description: "React collects issue descriptions and displays the result of triage.",
        children: ["api"],
      },
      {
        id: "api",
        label: "FastAPI triage service",
        description: "The backend classifies reports and serves prioritized cases to operators.",
        children: ["data"],
      },
      {
        id: "data",
        label: "Storage and deployment",
        description: "PostgreSQL stores complaint records, with Redis and Kubernetes supporting the application.",
      },
    ],
  },
  {
    id: "cat-connect",
    categories: ["Web Apps"],
    title: "Cat Connect",
    description:
      "A shelter management app covering animal intake, medical records, veterinary appointments, fostering, and adoption.",
    category: "Full-Stack Shelter Management",
    technologies: ["React", "Django REST Framework", "PostgreSQL", "Celery", "Redis"],
    context: "Team project",
    github: "https://github.com/Abdullah-SE-bit/shelter-os",
    demo: "https://shelter-os-seven.vercel.app",
    highlights: [
      "Cat registry with intake, discharge, and medical history",
      "Adoption, fostering, and veterinary appointment workflows",
      "Lost and found, donations, messaging, and shelter analytics",
    ],
    architecture: [
      {
        id: "workspace",
        label: "Shelter workspace",
        description: "A React app brings animal records and shelter workflows into one interface.",
        children: ["api"],
      },
      {
        id: "api",
        label: "Django REST API",
        description: "The backend handles shelter operations and stores records in PostgreSQL.",
        children: ["jobs"],
      },
      {
        id: "jobs",
        label: "Background jobs",
        description: "Celery and Redis support scheduled tasks outside the web request flow.",
      },
    ],
  },
  {
    id: "worksync",
    categories: ["Web Apps"],
    title: "WorkSync",
    description:
      "A team-built office management app for projects, tasks, attendance, approvals, and reporting. I led the login and activity log module.",
    category: "Full-Stack Workplace Tools",
    technologies: ["React", "TypeScript", "Express", "PostgreSQL", "Tailwind CSS"],
    context: "Internship team project",
    github: "https://github.com/CODOC-IT/worksync",
    demo: "https://worksync-taupe.vercel.app/",
    highlights: [
      "Role-aware sign-in and session handling",
      "Activity logs that make actions easier to review",
      "Shared project, task, attendance, and approval workflows",
    ],
    architecture: [
      {
        id: "client",
        label: "Office workspace",
        description: "React and TypeScript organize the team’s workflow modules.",
        children: ["api"],
      },
      {
        id: "api",
        label: "Express backend",
        description: "API routes handle user and workspace operations.",
        children: ["records"],
      },
      {
        id: "records",
        label: "PostgreSQL records",
        description: "The database persists activity and office workflow data.",
      },
    ],
  },
  {
    id: "flake",
    categories: ["Web Apps"],
    title: "FLAKE",
    description:
      "A Flask university portal with dedicated dashboards for students, teachers, and administrators, plus course and attendance management.",
    category: "Full-Stack University Portal",
    technologies: ["Python", "Flask", "Jinja2", "SQLite", "HTML", "CSS"],
    context: "Academic team project",
    github: "https://github.com/Artfever/Student-Portal-Project",
    demo: "https://student-portal-project-bice.vercel.app",
    highlights: [
      "Role-specific student, teacher, and admin dashboards",
      "Course and attendance management",
      "Server-rendered views backed by SQLite",
    ],
    architecture: [
      {
        id: "views",
        label: "University dashboards",
        description: "Jinja2 templates render pages for each campus role.",
        children: ["server"],
      },
      {
        id: "server",
        label: "Flask application",
        description: "Routes connect role-specific screens to course and attendance workflows.",
        children: ["storage"],
      },
      {
        id: "storage",
        label: "SQLite database",
        description: "A local relational database stores portal records.",
      },
    ],
  },
  {
    id: "tasbih-prestige",
    categories: ["AI & ML", "Web Apps"],
    title: "Tasbih Prestige",
    description:
      "A digital tasbih counter for tracking repetitions of dhikr, with optional Gemini-powered suggestions.",
    category: "Web App / Personal Tools",
    technologies: ["Next.js", "React", "TypeScript", "Gemini", "Tailwind CSS"],
    context: "Personal project",
    github: "https://github.com/TahaSohail-Goat/tasbih-prestige",
    highlights: [
      "Digital counter for dhikr repetitions",
      "AI-assisted suggestions for dhikr",
    ],
    architecture: [
      {
        id: "counter",
        label: "Digital counter",
        description: "A React interface gives users a place to track repetitions.",
        children: ["suggestions"],
      },
      {
        id: "suggestions",
        label: "Dhikr suggestions",
        description: "The app uses Gemini to generate optional suggestions.",
      },
    ],
  },
  {
    id: "rahbar",
    categories: ["AI & ML", "Web Apps", "Cloud & DevOps"],
    title: "RAHBAR",
    description:
      "A university policy assistant that retrieves public FAST-NUCES policy passages and answers questions with cited evidence.",
    category: "Applied AI / Cloud Architecture",
    technologies: ["Python", "FastAPI", "Chroma", "Redis", "Ollama", "Kubernetes"],
    context: "Academic project",
    github: "https://github.com/TahaSohail-Goat/SCD_Assignment_2",
    highlights: [
      "Searches public university policy PDFs",
      "Returns cited policy passages or declines unsupported questions",
      "Uses a separate indexer and evaluates retrieval with labeled questions",
    ],
    architecture: [
      {
        id: "index",
        label: "Policy indexer",
        description: "A Kubernetes Job prepares the policy corpus for retrieval.",
        children: ["retrieve"],
      },
      {
        id: "retrieve",
        label: "Evidence retrieval",
        description: "Chroma supplies candidate passages from the indexed documents.",
        children: ["answer"],
      },
      {
        id: "answer",
        label: "Answer service",
        description: "FastAPI readers return selected evidence and citations through Kubernetes Ingress.",
      },
    ],
  },
  {
    id: "traffic-intersection",
    title: "Traffic Intersection Simulation",
    description:
      "An operating systems simulation in C that models vehicle priority, parking queues, and coordination between Islamabad’s F10 and F11 intersections.",
    category: "Operating Systems / Concurrent Simulation",
    categories: ["Algorithms & Systems"],
    technologies: ["C", "POSIX Threads", "Pipes", "Semaphores", "Make"],
    context: "Academic project",
    github: "https://github.com/TahaSohail-Goat/traffic-intersection-simulation",
    highlights: [
      "Separate controller processes coordinate the two intersections through bidirectional pipes",
      "Vehicle threads follow emergency, bus, and normal traffic priorities",
      "Semaphores limit parking capacity and keep queues outside the intersection",
      "Graceful shutdown joins threads and releases process and synchronization resources",
    ],
    architecture: [
      {
        id: "controllers",
        label: "Intersection controllers",
        description: "Separate F10 and F11 processes exchange emergency and clearance messages over pipes.",
        children: ["vehicles"],
      },
      {
        id: "vehicles",
        label: "Vehicle threads",
        description: "Mutexes and condition variables coordinate crossings and give emergency vehicles priority.",
        children: ["parking"],
      },
      {
        id: "parking",
        label: "Parking queues",
        description: "POSIX semaphores limit available slots and queue capacity before vehicles request a crossing.",
      },
    ],
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
