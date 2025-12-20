import { Project } from '../types/Project';

export const DEMO_PROJECTS: Project[] = [
    {
        id: 'demo-free-project',
        title: '🎁 Free Demo: Full-Stack Task Management System',
        description: 'A comprehensive task management application built with modern web technologies. This project demonstrates a complete full-stack solution with user authentication, real-time updates, and responsive design. Perfect for learning MERN stack development or as a starting point for your own project management tool. Features include drag-and-drop task organization, team collaboration, deadline tracking, and priority management. The codebase follows industry best practices with clean architecture, proper error handling, and extensive documentation.',
        key_features: 'User Authentication & Authorization, Real-time Task Updates, Drag & Drop Interface, Team Collaboration Features, Priority & Deadline Management, Email Notifications, Dark Mode Support, Mobile Responsive Design, RESTful API, Comprehensive Documentation, Unit & Integration Tests, Docker Support',
        category: 'web_development',
        author_id: 'demo-author-1',
        buyers: [],
        difficulty_level: 'Intermediate',
        tech_stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux', 'JWT', 'Socket.io', 'Tailwind CSS', 'Jest', 'Docker'],
        github_url: 'https://github.com/demo/task-manager',
        demo_url: 'https://demo-task-manager.example.com',
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        pricing: {
            sale_price: 0,
            original_price: 0,
            currency: 'INR'
        },
        delivery_time: 1,
        status: 'approved',
        is_featured: false,
        isPurchased: true,
        isDemo: true,
        created_at: new Date('2024-01-15').toISOString(),
        updated_at: new Date().toISOString(),
        thumbnail: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        files: {
            source_files: ['frontend-source.zip', 'backend-source.zip', 'database-schema.sql'],
            documentation_files: ['README.md', 'API_DOCUMENTATION.md', 'SETUP_GUIDE.md', 'USER_MANUAL.pdf']
        },
        requirements: {
            system_requirements: [
                'Node.js 16.x or higher',
                'MongoDB 5.0 or higher',
                'npm or yarn package manager',
                '4GB RAM minimum (8GB recommended)',
                'Modern web browser (Chrome, Firefox, Safari, Edge)',
                'Git for version control'
            ],
            dependencies: [
                'react: ^18.2.0',
                'react-dom: ^18.2.0',
                'react-router-dom: ^6.8.0',
                'redux: ^4.2.0',
                'express: ^4.18.2',
                'mongoose: ^7.0.0',
                'jsonwebtoken: ^9.0.0',
                'bcryptjs: ^2.4.3',
                'socket.io: ^4.5.4',
                'nodemailer: ^6.9.1',
                'dotenv: ^16.0.3',
                'cors: ^2.8.5',
                'tailwindcss: ^3.2.7'
            ],
            installation_steps: [
                '1. Clone the repository: git clone https://github.com/demo/task-manager.git',
                '2. Navigate to project directory: cd task-manager',
                '3. Install backend dependencies: cd backend && npm install',
                '4. Install frontend dependencies: cd ../frontend && npm install',
                '5. Create .env file in backend folder with required environment variables (see .env.example)',
                '6. Set up MongoDB database (local or cloud)',
                '7. Run database migrations: npm run migrate',
                '8. Start backend server: npm run dev (runs on port 5000)',
                '9. Start frontend development server: cd ../frontend && npm start (runs on port 3000)',
                '10. Access the application at http://localhost:3000',
                '11. Default admin credentials: admin@demo.com / Admin@123',
                '12. For production deployment, see DEPLOYMENT.md'
            ]
        },
        rating: {
            average_rating: 4.7,
            total_ratings: 342,
            rating_distribution: {
                '5': 220,
                '4': 85,
                '3': 25,
                '2': 8,
                '1': 4
            }
        },
        view_count: 5420,
        purchase_count: 1250,
        download_count: 1250,
        author_details: {
            authorId: 'demo-author-1',
            avatar: null,
            full_name: 'Demo Developer',
            email: 'demo@example.com',
            total_projects: 12,
            rating: 4.8,
            total_sales: 3500,
            social_links: {
                github: 'https://github.com/demo-developer',
                linkedin: 'https://linkedin.com/in/demo-developer',
                twitter: 'https://twitter.com/demo_dev'
            }
        }
    }
];
