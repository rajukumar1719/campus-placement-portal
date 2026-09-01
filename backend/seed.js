const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const User = require('./models/User');
const Notification = require('./models/Notification');

dotenv.config();

// ===== 20 Jobs Data =====
const jobsData = [
    {
        companyName: "Tata Consultancy Services (TCS)",
        jobTitle: "Software Developer",
        description: `We are looking for talented Software Developers to join our Digital Engineering team at TCS.

Responsibilities:
• Design, develop and maintain enterprise-level software applications
• Write clean, scalable and well-documented code
• Collaborate with cross-functional teams including designers, product managers
• Participate in code reviews and maintain code quality standards
• Debug and resolve technical issues in production environment
• Follow Agile/Scrum development methodology

Requirements:
• Strong proficiency in Java, Python or JavaScript
• Understanding of data structures, algorithms and OOP concepts
• Knowledge of web frameworks (Spring Boot, Django, React/Angular)
• Familiarity with databases (MySQL, MongoDB, PostgreSQL)
• Experience with version control (Git)
• Good analytical and problem-solving skills`,
        jobType: "Full Time",
        location: "Mumbai, Maharashtra",
        salary: "6-8 LPA",
        eligibility: "CSE, IT, ECE",
        minCGPA: 7.0,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        applyLink: "https://www.tcs.com/careers",
        status: "active"
    },
    {
        companyName: "Infosys Limited",
        jobTitle: "Systems Engineer",
        description: `Infosys is hiring Systems Engineers for our technology consulting division.

Responsibilities:
• Develop and maintain enterprise software solutions for global clients
• Work on full-stack development projects
• Participate in requirement analysis and system design
• Create technical documentation and user manuals
• Support production deployments and troubleshooting
• Collaborate with onshore and offshore teams

Requirements:
• B.Tech/BE in Computer Science or related field
• Knowledge of Java, Python, C++ or .NET technologies
• Understanding of software development lifecycle (SDLC)
• Good analytical and logical reasoning skills
• Strong verbal and written communication
• Willingness to work in shifts if required`,
        jobType: "Full Time",
        location: "Bangalore, Karnataka",
        salary: "5-7 LPA",
        eligibility: "CSE, IT, ECE, EE",
        minCGPA: 6.5,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        applyLink: "https://www.infosys.com/careers",
        status: "active"
    },
    {
        companyName: "Wipro Technologies",
        jobTitle: "Project Engineer",
        description: `Wipro is looking for enthusiastic fresh graduates to join as Project Engineers.

Responsibilities:
• Develop software components and modules
• Write unit tests and integration tests
• Participate in daily standup meetings and sprint planning
• Work with experienced mentors on live client projects
• Follow coding best practices and standards
• Contribute to continuous improvement initiatives

Requirements:
• B.Tech/BE from recognized university
• Basic programming knowledge in any language
• Understanding of database concepts
• Good logical thinking and problem-solving ability
• Team player with positive attitude
• Ready to relocate to project location`,
        jobType: "Full Time",
        location: "Hyderabad, Telangana",
        salary: "5-6 LPA",
        eligibility: "CSE, IT, ECE, EE, ME",
        minCGPA: 6.0,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        applyLink: "https://www.wipro.com/careers",
        status: "active"
    },
    {
        companyName: "Accenture India",
        jobTitle: "Associate Software Engineer",
        description: `Accenture is seeking Associate Software Engineers for our technology transformation team.

Responsibilities:
• Build and maintain scalable web applications
• Work with React, Angular or Vue.js for frontend development
• Develop RESTful APIs using Node.js, Java or Python
• Implement CI/CD pipelines and DevOps practices
• Participate in architectural design discussions
• Mentor junior team members

Requirements:
• Strong foundation in computer science fundamentals
• Knowledge of modern web technologies (HTML5, CSS3, JavaScript ES6+)
• Experience with at least one backend framework
• Understanding of cloud platforms (AWS, Azure, GCP)
• Good problem-solving and analytical mindset
• Excellent communication and presentation skills`,
        jobType: "Full Time",
        location: "Pune, Maharashtra",
        salary: "7-9 LPA",
        eligibility: "CSE, IT",
        minCGPA: 7.5,
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        applyLink: "https://www.accenture.com/careers",
        status: "active"
    },
    {
        companyName: "Amazon India",
        jobTitle: "SDE Intern",
        description: `Amazon is offering a 6-month internship program for exceptional engineering students.

Responsibilities:
• Work on real-world projects impacting millions of customers
• Design and implement features for Amazon's services
• Write high-quality, production-ready code
• Collaborate with senior SDEs and learn best practices
• Present your project work to leadership team
• Opportunity to convert to full-time based on performance

Requirements:
• Currently pursuing B.Tech/BE in CSE or IT (Pre-final year)
• Strong data structures and algorithms knowledge
• Proficiency in Java, C++ or Python
• Problem-solving skills (LeetCode/HackerRank 200+ problems solved)
• Understanding of system design basics
• Passion for building customer-centric products`,
        jobType: "Internship",
        location: "Hyderabad, Telangana",
        salary: "80,000/month + Housing",
        eligibility: "CSE, IT",
        minCGPA: 8.0,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        applyLink: "https://www.amazon.jobs",
        status: "active"
    },
    {
        companyName: "Google India",
        jobTitle: "Software Engineering Intern",
        description: `Google is looking for passionate engineering students for our summer internship program.

Responsibilities:
• Work on Google-scale projects with world-class engineers
• Develop features for products used by billions
• Write efficient, reliable and maintainable code
• Participate in design reviews and technical discussions
• Complete a meaningful project during the internship
• Get mentored by experienced Googlers

Requirements:
• B.Tech/BE in Computer Science (Pre-final or Final year)
• Excellent coding skills in C++, Java, Python or Go
• Strong understanding of algorithms and data structures
• Experience in competitive programming is a plus
• Knowledge of distributed systems concepts
• Strong analytical and quantitative skills`,
        jobType: "Internship",
        location: "Bangalore, Karnataka",
        salary: "1,00,000/month",
        eligibility: "CSE, IT",
        minCGPA: 8.5,
        deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        applyLink: "https://careers.google.com",
        status: "active"
    },
    {
        companyName: "Microsoft India",
        jobTitle: "Software Engineer - Full Time",
        description: `Microsoft is hiring Software Engineers for our India Development Center.

Responsibilities:
• Build features for Microsoft 365, Azure, or Windows platforms
• Design scalable and reliable distributed systems
• Write clean, tested and well-documented code
• Collaborate with PM, Design and Data Science teams
• Participate in on-call rotations for production services
• Drive innovation through hackathons and side projects

Requirements:
• B.Tech/BE in Computer Science or related field
• Strong coding skills in C#, C++, Java or TypeScript
• Deep understanding of data structures and algorithms
• Knowledge of cloud computing and microservices architecture
• Experience with agile development practices
• Excellent problem-solving and debugging skills`,
        jobType: "Full Time",
        location: "Noida, Uttar Pradesh",
        salary: "18-25 LPA",
        eligibility: "CSE, IT",
        minCGPA: 8.0,
        deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        applyLink: "https://careers.microsoft.com",
        status: "active"
    },
    {
        companyName: "HCL Technologies",
        jobTitle: "Graduate Engineer Trainee",
        description: `HCL Technologies is hiring Graduate Engineer Trainees across multiple technology domains.

Responsibilities:
• Undergo intensive 3-month training program
• Learn enterprise technologies and HCL platforms
• Work on client projects under senior guidance
• Develop technical and soft skills
• Participate in team building activities
• Get certified in relevant technologies

Requirements:
• B.Tech/BE in any engineering discipline
• Consistent academic record (no active backlogs)
• Basic programming awareness
• Good communication skills in English
• Willingness to relocate anywhere in India
• Strong desire to build a career in IT`,
        jobType: "Full Time",
        location: "Noida, Uttar Pradesh",
        salary: "4-5 LPA",
        eligibility: "CSE, IT, ECE, EE, ME, CE",
        minCGPA: 6.0,
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        applyLink: "https://www.hcltech.com/careers",
        status: "active"
    },
    {
        companyName: "Cognizant Technology Solutions",
        jobTitle: "Programmer Analyst Trainee",
        description: `Cognizant is looking for Programmer Analyst Trainees to join our digital transformation team.

Responsibilities:
• Develop and maintain web and mobile applications
• Work with modern frameworks like React, Angular, Spring Boot
• Support client deliverables and project milestones
• Learn Cognizant's proprietary tools and methodologies
• Collaborate with globally distributed teams
• Participate in knowledge sharing sessions

Requirements:
• B.Tech/BE in CSE, IT or related field
• Knowledge of at least one programming language (Java/Python/JavaScript)
• Basic understanding of databases and SQL
• Good analytical and logical reasoning skills
• Strong team collaboration abilities
• Willingness to learn new technologies continuously`,
        jobType: "Full Time",
        location: "Chennai, Tamil Nadu",
        salary: "5-7 LPA",
        eligibility: "CSE, IT, ECE",
        minCGPA: 6.5,
        deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        applyLink: "https://careers.cognizant.com",
        status: "active"
    },
    {
        companyName: "Tech Mahindra",
        jobTitle: "Software Engineer Trainee",
        description: `Tech Mahindra is hiring fresh graduates for our Connected World solutions division.

Responsibilities:
• Develop applications using Java, .NET or Python
• Work on telecom, banking and healthcare domain projects
• Participate in requirements gathering and analysis
• Write technical documentation and test cases
• Support UAT and production deployment activities
• Follow quality standards and best practices

Requirements:
• B.Tech/BE in any engineering branch
• Basic programming knowledge in any language
• Understanding of SDLC and testing concepts
• Good English communication (written and verbal)
• Positive attitude and eagerness to learn
• Flexible with work timings and location`,
        jobType: "Full Time",
        location: "Gurgaon, Haryana",
        salary: "4-5 LPA",
        eligibility: "CSE, IT, ECE, EE, ME",
        minCGPA: 5.5,
        deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        applyLink: "https://careers.techmahindra.com",
        status: "active"
    },
    {
        companyName: "Deloitte India",
        jobTitle: "Analyst - Technology Consulting",
        description: `Deloitte is hiring Analysts for our Technology Consulting practice.

Responsibilities:
• Work with Fortune 500 clients on digital transformation projects
• Analyze business requirements and propose technology solutions
• Develop prototypes and proof-of-concept applications
• Create detailed technical design documents
• Present findings and recommendations to stakeholders
• Travel to client locations as needed

Requirements:
• B.Tech/BE in CSE, IT or related field
• Strong analytical and problem-solving abilities
• Knowledge of cloud platforms (AWS/Azure/GCP)
• Understanding of AI/ML, Data Analytics or Blockchain
• Excellent presentation and communication skills
• Leadership qualities and team management potential`,
        jobType: "Full Time",
        location: "Mumbai, Maharashtra",
        salary: "8-12 LPA",
        eligibility: "CSE, IT",
        minCGPA: 7.5,
        deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        applyLink: "https://www2.deloitte.com/careers",
        status: "active"
    },
    {
        companyName: "Capgemini India",
        jobTitle: "Associate Consultant",
        description: `Capgemini is seeking fresh talent for our engineering and technology services.

Responsibilities:
• Work on application development and maintenance projects
• Implement solutions using Agile methodology
• Develop APIs and microservices
• Conduct code reviews and testing
• Support client demos and walkthroughs
• Participate in innovation and R&D activities

Requirements:
• B.Tech/BE in Computer Science or related discipline
• Programming knowledge in Java, Python or C++
• Understanding of web technologies and databases
• Good communication and interpersonal skills
• Ability to work under pressure and meet deadlines
• Team-oriented mindset with leadership potential`,
        jobType: "Full Time",
        location: "Pune, Maharashtra",
        salary: "5-7 LPA",
        eligibility: "CSE, IT, ECE",
        minCGPA: 6.5,
        deadline: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
        applyLink: "https://www.capgemini.com/careers",
        status: "active"
    },
    {
        companyName: "Flipkart",
        jobTitle: "SDE-1 (Backend)",
        description: `Flipkart is hiring SDE-1 for our backend engineering team.

Responsibilities:
• Design and build highly scalable backend services
• Handle millions of requests per second
• Optimize system performance and reliability
• Work with distributed systems and microservices
• Implement data pipelines and event-driven architectures
• Participate in system design and architecture reviews

Requirements:
• B.Tech/BE in Computer Science
• Strong DSA and problem-solving skills
• Proficiency in Java, Go or Python
• Knowledge of distributed systems and databases
• Understanding of system design principles
• Experience with message queues (Kafka, RabbitMQ)`,
        jobType: "Full Time",
        location: "Bangalore, Karnataka",
        salary: "15-22 LPA",
        eligibility: "CSE, IT",
        minCGPA: 7.5,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        applyLink: "https://www.flipkartcareers.com",
        status: "active"
    },
    {
        companyName: "Paytm (One97 Communications)",
        jobTitle: "Frontend Developer",
        description: `Paytm is looking for talented Frontend Developers to build world-class user experiences.

Responsibilities:
• Build responsive and performant web applications
• Develop mobile-first UI using React.js or Next.js
• Implement pixel-perfect designs from Figma mockups
• Optimize application performance and load times
• Write reusable components and front-end libraries
• Collaborate with backend team for API integration

Requirements:
• B.Tech/BE in CSE or IT
• Strong proficiency in React.js, HTML5, CSS3, JavaScript
• Experience with state management (Redux, Context API)
• Knowledge of responsive design and cross-browser compatibility
• Understanding of RESTful APIs and GraphQL
• Eye for detail and passion for UI/UX`,
        jobType: "Full Time",
        location: "Noida, Uttar Pradesh",
        salary: "10-15 LPA",
        eligibility: "CSE, IT",
        minCGPA: 7.0,
        deadline: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
        applyLink: "https://paytm.com/careers",
        status: "active"
    },
    {
        companyName: "Zomato",
        jobTitle: "Data Analyst Intern",
        description: `Zomato is offering a Data Analyst Internship to work with our business intelligence team.

Responsibilities:
• Analyze large datasets to derive actionable insights
• Build dashboards and reports using Tableau/Power BI
• Work with SQL to extract and transform data
• Support business teams with data-driven decision making
• Present findings to leadership through visualizations
• Automate reporting processes using Python

Requirements:
• Currently pursuing B.Tech/BE in CSE, IT or Mathematics
• Strong SQL and Excel skills
• Knowledge of Python (Pandas, NumPy, Matplotlib)
• Understanding of statistics and probability
• Experience with data visualization tools
• Analytical mindset and attention to detail`,
        jobType: "Internship",
        location: "Gurgaon, Haryana",
        salary: "40,000/month",
        eligibility: "CSE, IT, ECE",
        minCGPA: 7.0,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        applyLink: "https://www.zomato.com/careers",
        status: "active"
    },
    {
        companyName: "Reliance Jio",
        jobTitle: "Network Engineer",
        description: `Reliance Jio is hiring Network Engineers for our 5G infrastructure team.

Responsibilities:
• Design and implement network infrastructure solutions
• Monitor and maintain 4G/5G network equipment
• Troubleshoot network issues and optimize performance
• Work with vendors on equipment installation and configuration
• Conduct network capacity planning and analysis
• Document network architectures and procedures

Requirements:
• B.Tech/BE in ECE, EE or CSE
• Knowledge of networking protocols (TCP/IP, OSPF, BGP)
• Understanding of 4G LTE and 5G NR technologies
• Familiarity with network monitoring tools
• Good analytical and troubleshooting skills
• Willingness to work in field locations`,
        jobType: "Full Time",
        location: "Navi Mumbai, Maharashtra",
        salary: "6-9 LPA",
        eligibility: "ECE, EE, CSE",
        minCGPA: 6.5,
        deadline: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
        applyLink: "https://careers.jio.com",
        status: "active"
    },
    {
        companyName: "Larsen & Toubro Infotech (LTIMindtree)",
        jobTitle: "Cloud Engineer",
        description: `LTIMindtree is hiring Cloud Engineers for our digital transformation practice.

Responsibilities:
• Design and deploy cloud-native applications on AWS/Azure
• Implement Infrastructure as Code using Terraform/CloudFormation
• Set up CI/CD pipelines using Jenkins, GitLab CI or Azure DevOps
• Manage containerized applications using Docker and Kubernetes
• Monitor cloud infrastructure and optimize costs
• Implement security best practices and compliance

Requirements:
• B.Tech/BE in CSE, IT or related field
• Knowledge of at least one cloud platform (AWS/Azure/GCP)
• Understanding of DevOps practices and tools
• Experience with Linux administration
• Knowledge of scripting (Bash, Python, PowerShell)
• Any cloud certification is a plus (AWS SAA, AZ-104)`,
        jobType: "Full Time",
        location: "Pune, Maharashtra",
        salary: "7-10 LPA",
        eligibility: "CSE, IT",
        minCGPA: 7.0,
        deadline: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
        applyLink: "https://www.ltimindtree.com/careers",
        status: "active"
    },
    {
        companyName: "PhonePe",
        jobTitle: "Mobile App Developer",
        description: `PhonePe is looking for Mobile App Developers to build India's best fintech app.

Responsibilities:
• Develop and maintain Android/iOS applications
• Build smooth and responsive UIs with great performance
• Integrate payment gateway APIs and security features
• Write comprehensive unit and integration tests
• Optimize app for battery, data and memory usage
• Collaborate with product and design teams

Requirements:
• B.Tech/BE in Computer Science or IT
• Experience with Android (Kotlin/Java) or iOS (Swift)
• Knowledge of mobile app architecture patterns (MVVM, Clean Architecture)
• Understanding of RESTful APIs and JSON
• Familiarity with mobile CI/CD and app distribution
• Passion for building consumer-facing mobile products`,
        jobType: "Full Time",
        location: "Bangalore, Karnataka",
        salary: "12-18 LPA",
        eligibility: "CSE, IT",
        minCGPA: 7.5,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        applyLink: "https://www.phonepe.com/careers",
        status: "active"
    },
    {
        companyName: "Tata Motors",
        jobTitle: "Embedded Systems Engineer",
        description: `Tata Motors is hiring Embedded Systems Engineers for our Electric Vehicle division.

Responsibilities:
• Develop embedded software for EV control systems
• Work on Battery Management Systems (BMS)
• Program microcontrollers (ARM Cortex, STM32)
• Design and test communication protocols (CAN, LIN, SPI)
• Collaborate with hardware team on PCB design
• Conduct system integration and validation testing

Requirements:
• B.Tech/BE in ECE, EE or CSE
• Knowledge of C/C++ programming for embedded systems
• Understanding of microcontroller architectures
• Familiarity with RTOS concepts
• Knowledge of automotive protocols (CAN, UDS)
• Interest in electric vehicles and sustainable technology`,
        jobType: "Full Time",
        location: "Pune, Maharashtra",
        salary: "6-9 LPA",
        eligibility: "ECE, EE, CSE, ME",
        minCGPA: 7.0,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        applyLink: "https://www.tatamotors.com/careers",
        status: "active"
    },
    {
        companyName: "HDFC Bank",
        jobTitle: "Technology Analyst",
        description: `HDFC Bank is seeking Technology Analysts for our digital banking innovations team.

Responsibilities:
• Develop and maintain core banking applications
• Build secure APIs for mobile and internet banking
• Implement fraud detection and prevention systems
• Work on database optimization and performance tuning
• Support regulatory compliance requirements
• Participate in disaster recovery planning and testing

Requirements:
• B.Tech/BE in CSE, IT or related field
• Knowledge of Java, Spring Boot or .NET
• Understanding of relational databases (Oracle, SQL Server)
• Awareness of banking and financial domain
• Knowledge of information security best practices
• Strong analytical and communication skills`,
        jobType: "Full Time",
        location: "Mumbai, Maharashtra",
        salary: "7-10 LPA",
        eligibility: "CSE, IT, ECE",
        minCGPA: 7.0,
        deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        applyLink: "https://www.hdfcbank.com/careers",
        status: "active"
    }
];

// ===== 10 Notifications Data =====
const notificationsData = [
    {
        title: "🎓 Welcome to Campus Placement Season 2025!",
        message: "Dear Students, we are excited to announce that the campus placement season for 2025 batch has officially begun! Multiple top-tier companies will be visiting our campus in the coming weeks. Make sure your profile is 100% complete, your resume is uploaded, and you meet the eligibility criteria. Stay tuned for exciting opportunities! Best wishes from the Placement Cell."
    },
    {
        title: "📋 Profile Completion Reminder",
        message: "Attention all students! We have noticed that many students have not completed their profiles yet. Companies cannot shortlist you if your profile is incomplete. Please update your Name, Phone, Branch, CGPA, Batch, College Name and upload your resume as soon as possible. Incomplete profiles will NOT be eligible for any placement drive. Deadline: Complete before the first company visit."
    },
    {
        title: "🏢 TCS & Infosys - Mega Recruitment Drive",
        message: "Exciting News! TCS and Infosys will be conducting a mega recruitment drive on our campus next week. Eligible branches: CSE, IT, ECE, EE. Minimum CGPA: 6.5 for TCS, 6.0 for Infosys. The drive will include an online aptitude test, technical interview, and HR round. Students who meet the criteria should apply through the portal immediately. Limited slots available!"
    },
    {
        title: "📅 Interview Preparation Workshop",
        message: "The Placement Cell is organizing a FREE Interview Preparation Workshop this Saturday from 10:00 AM to 4:00 PM in the Main Auditorium. Topics covered: Resume Building, Group Discussion Tips, Technical Interview Preparation, HR Interview Do's and Don'ts, and Mock Interview Sessions. All final year students are strongly encouraged to attend. Refreshments will be provided."
    },
    {
        title: "⚠️ Important: Resume Upload Mandatory",
        message: "Starting from this week, uploading your resume in PDF format is MANDATORY for all job applications. Companies have specifically requested student resumes for shortlisting. Please ensure your resume is: 1) In PDF format only, 2) Maximum 2 pages, 3) Updated with latest projects and skills, 4) Free of spelling and grammatical errors. You can upload your resume from the Profile section."
    },
    {
        title: "🏆 Congratulations to Selected Students!",
        message: "We are proud to announce that 45 students from our campus have been selected by top companies in this placement season so far! Selected companies include: Amazon (5 students), Microsoft (3 students), TCS (12 students), Infosys (8 students), Wipro (7 students), Accenture (6 students), and others (4 students). Congratulations to all selected students! Keep up the great work. More opportunities are coming soon!"
    },
    {
        title: "📢 Google & Flipkart - Dream Company Recruitment",
        message: "Dream company alert! Google and Flipkart will be visiting our campus for hiring Software Development Engineers. This is a highly selective process. Eligibility: CSE and IT students only, Minimum CGPA: 8.0 for Google, 7.5 for Flipkart. Selection Process: Online Coding Test → Technical Round 1 → Technical Round 2 → System Design Round → HR Round. Prepare thoroughly! Apply through the portal by the deadline."
    },
    {
        title: "📊 Placement Statistics Update - January 2025",
        message: "Here's the latest placement statistics update:\n\n• Total Students Registered: 450\n• Students Placed: 180 (40%)\n• Highest Package: 25 LPA (Microsoft)\n• Average Package: 7.5 LPA\n• Companies Visited: 35\n• More Companies Scheduled: 20+\n\nBranch-wise placement: CSE - 65%, IT - 55%, ECE - 40%, EE - 35%, ME - 25%. We are working hard to bring more opportunities. Keep applying!"
    },
    {
        title: "🔔 Deadline Alert - Multiple Companies",
        message: "URGENT: Application deadlines approaching for multiple companies!\n\n• Amazon SDE Intern - 3 days left\n• Deloitte Analyst - 5 days left\n• Zomato Data Analyst - 7 days left\n• PhonePe Mobile Dev - 10 days left\n\nDon't miss out! Check the Jobs section and apply before the deadline. Late applications will NOT be accepted. Make sure your profile is complete and resume is uploaded before applying."
    },
    {
        title: "🎯 Aptitude Test Preparation Resources",
        message: "The Placement Cell has compiled a list of FREE resources for aptitude test preparation:\n\n1. Quantitative Aptitude - R.S. Aggarwal (PDF available in library)\n2. Logical Reasoning - Practice on IndiaBix.com\n3. Verbal Ability - Daily reading of The Hindu newspaper\n4. Coding Practice - LeetCode (Top 150 problems), HackerRank\n5. Company-specific papers - Available in the Placement Cell office\n\nWe also recommend joining our Telegram group for daily practice questions. Remember: Consistent practice is the key to success!"
    }
];

// ===== Seed Function =====
const seedDatabase = async () => {
    try {
        // Connect Database
        await mongoose.connect(process.env.Mongodb_URI);
        console.log('✅ Database Connected');
        console.log('='.repeat(60));

        // Admin user find karo
        const admin = await User.findOne({ role: 'admin' });

        if (!admin) {
            console.log('❌ Admin user not found!');
            console.log('👉 Pehle admin account banao');
            process.exit(1);
        }

        console.log(`✅ Admin found: ${admin.name} (${admin.email})`);
        console.log('='.repeat(60));

        // ===== Ask what to seed =====
        const args = process.argv[2];

        if (args === '--jobs' || args === '--all' || !args) {
            // Delete existing jobs
            const existingJobs = await Job.countDocuments();
            if (existingJobs > 0) {
                await Job.deleteMany({});
                console.log(`🗑️  Deleted ${existingJobs} existing jobs`);
            }

            // Add postedBy to all jobs
            const jobsWithAdmin = jobsData.map(job => ({
                ...job,
                postedBy: admin._id
            }));

            // Insert jobs
            const insertedJobs = await Job.insertMany(jobsWithAdmin);

            console.log('\n🎉 JOBS ADDED SUCCESSFULLY!\n');
            console.log('-'.repeat(60));

            insertedJobs.forEach((job, index) => {
                console.log(`  ${index + 1}. ${job.jobTitle}`);
                console.log(`     🏢 ${job.companyName}`);
                console.log(`     📍 ${job.location} | 💰 ${job.salary} | 🎓 CGPA: ${job.minCGPA}`);
                console.log(`     💼 ${job.jobType} | 📅 Deadline: ${job.deadline.toDateString()}`);
                console.log('');
            });

            console.log('-'.repeat(60));
            console.log(`  ✅ Total ${insertedJobs.length} jobs added!`);
            console.log('='.repeat(60));
        }

        if (args === '--notifications' || args === '--all' || !args) {
            // Delete existing notifications
            const existingNotifs = await Notification.countDocuments();
            if (existingNotifs > 0) {
                await Notification.deleteMany({});
                console.log(`🗑️  Deleted ${existingNotifs} existing notifications`);
            }

            // Add sentBy to all notifications
            const notifsWithAdmin = notificationsData.map(notif => ({
                ...notif,
                sentBy: admin._id
            }));

            // Insert notifications
            const insertedNotifs = await Notification.insertMany(notifsWithAdmin);

            console.log('\n🔔 NOTIFICATIONS ADDED SUCCESSFULLY!\n');
            console.log('-'.repeat(60));

            insertedNotifs.forEach((notif, index) => {
                console.log(`  ${index + 1}. ${notif.title}`);
                console.log(`     ${notif.message.substring(0, 80)}...`);
                console.log('');
            });

            console.log('-'.repeat(60));
            console.log(`  ✅ Total ${insertedNotifs.length} notifications added!`);
            console.log('='.repeat(60));
        }

        console.log('\n🎉 SEEDING COMPLETE!\n');

    } catch (error) {
        console.error('❌ Seed Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('✅ Database Connection Closed');
        process.exit(0);
    }
};

// Run
seedDatabase();