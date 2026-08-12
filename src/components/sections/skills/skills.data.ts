import { ComponentType } from 'react';
import {
  SiCplusplus,
  SiC,
  SiPython,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiVite,
  SiHtml5,
  SiTailwindcss,
  SiFramer,
  SiNodedotjs,
  SiExpress,
  SiDjango,
  SiFlask,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiGit,
  SiGithub,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa6';
import { VscCode } from 'react-icons/vsc';
import {
  Database,
  Server,
  BrainCircuit,
  Workflow,
  BarChart3,
  GitBranch,
  Code2,
  Boxes,
  Component as ComponentIcon,
  ShieldCheck,
  Cpu,
  AppWindow,
} from 'lucide-react';

export type Skill = {
  id: string;
  name: string;
  icon: ComponentType<{ style?: React.CSSProperties; className?: string }>;
  description: string;
  related: string[];
};

export type SkillCategory = {
  id: string;
  label: string;
  color: string;
  skills: Skill[];
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'languages',
    label: 'Languages',
    color: '#00f5d4',
    skills: [
      { id: 'cpp', name: 'C++', icon: SiCplusplus, description: 'Core language for low-level systems, high performance algorithms, and competitive programming.', related: ['DSA', 'Algorithms', 'OOP', 'Systems'] },
      { id: 'c', name: 'C', icon: SiC, description: 'Fundamental systems programming language used for memory management and OS concepts.', related: ['Systems', 'C++'] },
      { id: 'python', name: 'Python', icon: SiPython, description: 'Versatile language used for AI/ML, automation scripts, backend services, and data analysis.', related: ['ML/AI', 'Django', 'Flask', 'Automation', 'Data Analysis'] },
      { id: 'javascript', name: 'JavaScript', icon: SiJavascript, description: 'Primary language for modern interactive web development across client and server.', related: ['React', 'Node.js', 'Express', 'Vite', 'HTML / CSS'] },
      { id: 'typescript', name: 'TypeScript', icon: SiTypescript, description: 'Strongly typed JavaScript superset for scalable, type-safe application architecture.', related: ['React', 'Next.js', 'Node.js'] },
      { id: 'java', name: 'Java', icon: FaJava, description: 'Object-oriented language used for enterprise desktop software and architectural design patterns.', related: ['JavaFX', 'OOP', 'Design Patterns'] },
      { id: 'sql', name: 'SQL', icon: Database, description: 'Declarative language for relational database querying, schema design, and data manipulation.', related: ['PostgreSQL', 'MySQL'] },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    color: '#38bdf8',
    skills: [
      { id: 'react', name: 'React', icon: SiReact, description: 'Component-driven UI library for building dynamic, state-driven web applications.', related: ['Next.js', 'Vite', 'TypeScript', 'Tailwind', 'Framer Motion', 'JavaScript'] },
      { id: 'nextjs', name: 'Next.js', icon: SiNextdotjs, description: 'Production React framework for server-side rendering, static generation, and routing.', related: ['React', 'TypeScript', 'Node.js'] },
      { id: 'vite', name: 'Vite', icon: SiVite, description: 'Next-generation frontend tooling and lightning-fast HMR module bundler.', related: ['React', 'JavaScript'] },
      { id: 'htmlcss', name: 'HTML / CSS', icon: SiHtml5, description: 'Semantic HTML5 structure and responsive CSS3 layout, flexbox, and grid styling.', related: ['React', 'Tailwind'] },
      { id: 'tailwind', name: 'Tailwind', icon: SiTailwindcss, description: 'Utility-first CSS framework for rapid, responsive, and custom UI design systems.', related: ['React', 'HTML / CSS'] },
      { id: 'framer', name: 'Framer Motion', icon: SiFramer, description: 'Production-ready motion library for fluid React micro-interactions and transitions.', related: ['React'] },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    color: '#a78bfa',
    skills: [
      { id: 'nodejs', name: 'Node.js', icon: SiNodedotjs, description: 'Asynchronous event-driven JavaScript runtime for scalable server-side applications.', related: ['Express', 'JavaScript', 'TypeScript', 'REST APIs', 'MongoDB'] },
      { id: 'express', name: 'Express', icon: SiExpress, description: 'Minimalist web framework for building Node.js RESTful APIs and middleware.', related: ['Node.js', 'REST APIs', 'MongoDB', 'PostgreSQL', 'JavaScript'] },
      { id: 'django', name: 'Django', icon: SiDjango, description: 'High-level Python web framework encouraging rapid development and clean design.', related: ['Python', 'REST APIs'] },
      { id: 'flask', name: 'Flask', icon: SiFlask, description: 'Micro Python web framework for lightweight REST microservices and APIs.', related: ['Python', 'REST APIs'] },
      { id: 'rest', name: 'REST APIs', icon: Server, description: 'Architectural style for designing networked HTTP APIs with clean endpoints and JSON payloads.', related: ['Express', 'Django', 'Node.js', 'Flask'] },
    ],
  },
  {
    id: 'databases',
    label: 'Databases',
    color: '#f59e0b',
    skills: [
      { id: 'mongodb', name: 'MongoDB', icon: SiMongodb, description: 'NoSQL document database for flexible JSON-like document storage and aggregation.', related: ['Node.js', 'Express'] },
      { id: 'mysql', name: 'MySQL', icon: SiMysql, description: 'Popular open-source relational database management system featuring robust SQL query execution.', related: ['SQL'] },
      { id: 'postgres', name: 'PostgreSQL', icon: SiPostgresql, description: 'Advanced open-source object-relational database with strong ACID compliance and complex queries.', related: ['SQL', 'Express'] },
    ],
  },
  {
    id: 'ai',
    label: 'AI / ML',
    color: '#34d399',
    skills: [
      { id: 'ml', name: 'ML/AI', icon: BrainCircuit, description: 'Machine learning fundamentals, predictive modeling, and intelligent agent algorithms.', related: ['Python', 'Data Analysis'] },
      { id: 'automation', name: 'Automation', icon: Workflow, description: 'Automated workflow scripts, task scheduling, and system orchestration.', related: ['Python'] },
      { id: 'dataanalysis', name: 'Data Analysis', icon: BarChart3, description: 'Data processing, feature extraction, and statistical trend visualization.', related: ['Python', 'ML/AI'] },
    ],
  },
  {
    id: 'concepts',
    label: 'CS Fundamentals',
    color: '#fb7185',
    skills: [
      { id: 'dsa', name: 'DSA', icon: GitBranch, description: 'Data Structures & Algorithms: trees, graphs, heaps, dynamic programming, and efficiency optimization.', related: ['C++', 'Algorithms', 'OOP'] },
      { id: 'algorithms', name: 'Algorithms', icon: Code2, description: 'Graph traversal (Dijkstra), sorting, searching, and space/time complexity analysis.', related: ['DSA', 'C++'] },
      { id: 'oop', name: 'OOP', icon: Boxes, description: 'Object-Oriented Design: encapsulation, inheritance, polymorphism, and abstraction.', related: ['C++', 'Java', 'Design Patterns', 'SOLID'] },
      { id: 'designpatterns', name: 'Design Patterns', icon: ComponentIcon, description: 'Software design patterns including Factory, Strategy, Observer, and Singleton.', related: ['OOP', 'SOLID', 'Java'] },
      { id: 'solid', name: 'SOLID', icon: ShieldCheck, description: 'The five fundamental principles of object-oriented class design for maintainable software.', related: ['OOP', 'Design Patterns'] },
      { id: 'systems', name: 'Systems', icon: Cpu, description: 'Computer architecture, memory allocation, process threads, and OS concepts.', related: ['C', 'C++'] },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    color: '#94a3b8',
    skills: [
      { id: 'git', name: 'Git', icon: SiGit, description: 'Distributed version control system for tracking source code changes and branch management.', related: ['GitHub', 'VS Code'] },
      { id: 'github', name: 'GitHub', icon: SiGithub, description: 'Cloud repository platform for collaborative software development, code reviews, and CI/CD.', related: ['Git', 'VS Code'] },
      { id: 'vscode', name: 'VS Code', icon: VscCode, description: 'Primary code editor configured with extensions, debugging pipelines, and terminal integration.', related: ['Git', 'GitHub'] },
      { id: 'javafx', name: 'JavaFX', icon: AppWindow, description: 'Java GUI framework for building custom-styled desktop application user interfaces.', related: ['Java', 'OOP'] },
    ],
  },
];

export const SKILL_MAP = new Map<string, { skill: Skill; category: SkillCategory }>();
for (const cat of SKILL_CATEGORIES) {
  for (const s of cat.skills) {
    SKILL_MAP.set(s.name, { skill: s, category: cat });
  }
}

export function isSkillRelated(targetName: string, activeName: string | null): boolean {
  if (!activeName) return false;
  if (targetName === activeName) return false;

  const target = SKILL_MAP.get(targetName)?.skill;
  const active = SKILL_MAP.get(activeName)?.skill;

  if (active?.related?.includes(targetName)) return true;
  if (target?.related?.includes(activeName)) return true;

  return false;
}

export function getGraphData() {
  const nodes: {
    id: string;
    name: string;
    categoryId: string;
    categoryLabel: string;
    color: string;
    icon: ComponentType<{ style?: React.CSSProperties; className?: string }>;
    description: string;
    connectionsCount: number;
  }[] = [];

  const linksSet = new Set<string>();
  const links: { source: string; target: string }[] = [];

  for (const cat of SKILL_CATEGORIES) {
    for (const skill of cat.skills) {
      nodes.push({
        id: skill.name,
        name: skill.name,
        categoryId: cat.id,
        categoryLabel: cat.label,
        color: cat.color,
        icon: skill.icon,
        description: skill.description,
        connectionsCount: skill.related.length,
      });

      for (const rel of skill.related) {
        if (SKILL_MAP.has(rel)) {
          const pairKey = [skill.name, rel].sort().join(':::');
          if (!linksSet.has(pairKey)) {
            linksSet.add(pairKey);
            links.push({
              source: skill.name,
              target: rel,
            });
          }
        }
      }
    }
  }

  return { nodes, links };
}
