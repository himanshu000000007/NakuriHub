const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const connectDB = require('../config/db');

dotenv.config();

const seedFakeData = async () => {
  try {
    await connectDB();

    // Clear existing data (except admin)
    await Job.deleteMany({});
    await Application.deleteMany({});
    await User.deleteMany({ role: { $ne: 'ADMIN' } });

    console.log('Cleared existing data...');

    // Create Recruiters
    const recruiters = await User.create([
      {
        name: 'Sarah Johnson',
        email: 'sarah@techcorp.com',
        password: 'Test@123',
        role: 'RECRUITER',
        phone: '555-0101',
        isApproved: true,
        company: {
          name: 'TechCorp Solutions',
          website: 'https://techcorp.com',
          description: 'Leading software development company',
          location: 'San Francisco, CA'
        }
      },
      {
        name: 'Michael Chen',
        email: 'michael@innovate.com',
        password: 'Test@123',
        role: 'RECRUITER',
        phone: '555-0102',
        isApproved: true,
        company: {
          name: 'Innovate Labs',
          website: 'https://innovatelabs.com',
          description: 'AI and Machine Learning startup',
          location: 'Austin, TX'
        }
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily@cloudnine.com',
        password: 'Test@123',
        role: 'RECRUITER',
        phone: '555-0103',
        isApproved: true,
        company: {
          name: 'CloudNine Technologies',
          website: 'https://cloudnine.com',
          description: 'Cloud infrastructure and DevOps',
          location: 'Seattle, WA'
        }
      },
      {
        name: 'David Park',
        email: 'david@dataflow.com',
        password: 'Test@123',
        role: 'RECRUITER',
        phone: '555-0104',
        isApproved: true,
        company: {
          name: 'DataFlow Inc',
          website: 'https://dataflow.com',
          description: 'Big Data and Analytics solutions',
          location: 'New York, NY'
        }
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa@mobilefirst.com',
        password: 'Test@123',
        role: 'RECRUITER',
        phone: '555-0105',
        isApproved: false, // Pending approval
        company: {
          name: 'MobileFirst Apps',
          website: 'https://mobilefirst.com',
          description: 'Mobile app development agency',
          location: 'Los Angeles, CA'
        }
      }
    ]);

    console.log('Created recruiters...');

    // Create Job Seekers
    const jobSeekers = await User.create([
      {
        name: 'Alex Thompson',
        email: 'alex.thompson@email.com',
        password: 'Test@123',
        role: 'JOB_SEEKER',
        phone: '555-0201',
        profile: {
          bio: 'Passionate full-stack developer with 3 years of experience in MERN stack',
          skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Git'],
          experience: '3 years at WebDev Inc as Full Stack Developer',
          education: 'BS Computer Science, Stanford University',
          resume: {
            url: 'https://example.com/resume1.pdf',
            publicId: 'resume_1'
          }
        }
      },
      {
        name: 'Jessica Martinez',
        email: 'jessica.martinez@email.com',
        password: 'Test@123',
        role: 'JOB_SEEKER',
        phone: '555-0202',
        profile: {
          bio: 'Data scientist specializing in machine learning and AI',
          skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Pandas', 'Scikit-learn'],
          experience: '2 years at AI Research Lab',
          education: 'MS Data Science, MIT',
          resume: {
            url: 'https://example.com/resume2.pdf',
            publicId: 'resume_2'
          }
        }
      },
      {
        name: 'Robert Kim',
        email: 'robert.kim@email.com',
        password: 'Test@123',
        role: 'JOB_SEEKER',
        phone: '555-0203',
        profile: {
          bio: 'DevOps engineer with expertise in cloud infrastructure',
          skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Linux'],
          experience: '4 years in DevOps at CloudTech',
          education: 'BS Software Engineering, UC Berkeley',
          resume: {
            url: 'https://example.com/resume3.pdf',
            publicId: 'resume_3'
          }
        }
      },
      {
        name: 'Amanda Singh',
        email: 'amanda.singh@email.com',
        password: 'Test@123',
        role: 'JOB_SEEKER',
        phone: '555-0204',
        profile: {
          bio: 'Frontend developer creating beautiful user experiences',
          skills: ['React', 'Vue.js', 'TypeScript', 'CSS', 'HTML', 'Tailwind'],
          experience: '2.5 years at DesignHub',
          education: 'BS Information Technology, Georgia Tech',
          resume: {
            url: 'https://example.com/resume4.pdf',
            publicId: 'resume_4'
          }
        }
      },
      {
        name: 'Chris Walker',
        email: 'chris.walker@email.com',
        password: 'Test@123',
        role: 'JOB_SEEKER',
        phone: '555-0205',
        profile: {
          bio: 'Backend engineer focused on scalable systems',
          skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Microservices'],
          experience: '5 years at Enterprise Solutions',
          education: 'MS Computer Engineering, Carnegie Mellon',
          resume: {
            url: 'https://example.com/resume5.pdf',
            publicId: 'resume_5'
          }
        }
      },
      {
        name: 'Sophia Lee',
        email: 'sophia.lee@email.com',
        password: 'Test@123',
        role: 'JOB_SEEKER',
        phone: '555-0206',
        profile: {
          bio: 'Mobile app developer specializing in React Native',
          skills: ['React Native', 'iOS', 'Android', 'Swift', 'Kotlin'],
          experience: '3 years building mobile apps',
          education: 'BS Mobile Computing, NYU'
        }
      }
    ]);

    console.log('Created job seekers...');

    // Create Jobs
    const jobs = await Job.create([
      {
        title: 'Senior Full Stack Developer',
        description: 'We are looking for an experienced Full Stack Developer to join our growing team. You will work on cutting-edge web applications using the MERN stack.\n\nResponsibilities:\n- Develop and maintain web applications\n- Collaborate with cross-functional teams\n- Write clean, maintainable code\n- Participate in code reviews',
        skillsRequired: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Git'],
        location: 'San Francisco, CA',
        experienceRequired: '3-5 years',
        jobType: 'Full-time',
        salaryRange: { min: 120000, max: 160000, currency: 'USD' },
        recruiterId: recruiters[0]._id,
        companyName: recruiters[0].company.name,
        applicationCount: 0,
        isActive: true
      },
      {
        title: 'Machine Learning Engineer',
        description: 'Join our AI team to build next-generation ML models. Work on exciting projects in computer vision, NLP, and recommendation systems.\n\nRequirements:\n- Strong Python skills\n- Experience with TensorFlow or PyTorch\n- Understanding of ML algorithms\n- PhD or MS preferred',
        skillsRequired: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP'],
        location: 'Austin, TX',
        experienceRequired: '2-4 years',
        jobType: 'Full-time',
        salaryRange: { min: 130000, max: 180000, currency: 'USD' },
        recruiterId: recruiters[1]._id,
        companyName: recruiters[1].company.name,
        applicationCount: 0,
        isActive: true
      },
      {
        title: 'DevOps Engineer',
        description: 'We need a skilled DevOps engineer to manage our cloud infrastructure and CI/CD pipelines.\n\nKey Responsibilities:\n- Manage AWS infrastructure\n- Build and maintain CI/CD pipelines\n- Monitor system performance\n- Ensure security best practices',
        skillsRequired: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
        location: 'Seattle, WA',
        experienceRequired: '4-6 years',
        jobType: 'Full-time',
        salaryRange: { min: 140000, max: 190000, currency: 'USD' },
        recruiterId: recruiters[2]._id,
        companyName: recruiters[2].company.name,
        applicationCount: 0,
        isActive: true
      },
      {
        title: 'Frontend Developer',
        description: 'Create amazing user interfaces using modern frontend technologies. Work with designers to bring mockups to life.\n\nWhat we offer:\n- Flexible work hours\n- Remote-first culture\n- Learning budget\n- Health insurance',
        skillsRequired: ['React', 'TypeScript', 'CSS', 'HTML', 'Tailwind CSS'],
        location: 'Remote',
        experienceRequired: '2-4 years',
        jobType: 'Remote',
        salaryRange: { min: 100000, max: 140000, currency: 'USD' },
        recruiterId: recruiters[0]._id,
        companyName: recruiters[0].company.name,
        applicationCount: 0,
        isActive: true
      },
      {
        title: 'Data Analyst',
        description: 'Analyze large datasets to derive actionable insights for business decisions.\n\nQualifications:\n- SQL expertise\n- Experience with Python/R\n- Data visualization skills\n- Business acumen',
        skillsRequired: ['SQL', 'Python', 'Tableau', 'Excel', 'Statistics'],
        location: 'New York, NY',
        experienceRequired: '1-3 years',
        jobType: 'Full-time',
        salaryRange: { min: 80000, max: 110000, currency: 'USD' },
        recruiterId: recruiters[3]._id,
        companyName: recruiters[3].company.name,
        applicationCount: 0,
        isActive: true
      },
      {
        title: 'Backend Engineer',
        description: 'Build scalable backend systems and APIs. Work with microservices architecture.\n\nTech Stack:\n- Java/Spring Boot\n- PostgreSQL\n- Redis\n- Kafka\n- AWS',
        skillsRequired: ['Java', 'Spring Boot', 'PostgreSQL', 'Microservices', 'AWS'],
        location: 'San Francisco, CA',
        experienceRequired: '5-7 years',
        jobType: 'Full-time',
        salaryRange: { min: 150000, max: 200000, currency: 'USD' },
        recruiterId: recruiters[2]._id,
        companyName: recruiters[2].company.name,
        applicationCount: 0,
        isActive: true
      },
      {
        title: 'React Native Developer',
        description: 'Develop cross-platform mobile applications using React Native.\n\nPerks:\n- Stock options\n- Unlimited PTO\n- Work from anywhere\n- Latest MacBook Pro',
        skillsRequired: ['React Native', 'JavaScript', 'iOS', 'Android', 'Redux'],
        location: 'Remote',
        experienceRequired: '3-5 years',
        jobType: 'Remote',
        salaryRange: { min: 110000, max: 150000, currency: 'USD' },
        recruiterId: recruiters[1]._id,
        companyName: recruiters[1].company.name,
        applicationCount: 0,
        isActive: true
      },
      {
        title: 'Junior Software Developer',
        description: 'Great opportunity for recent graduates! Learn from experienced developers and work on real projects.\n\nWe provide:\n- Mentorship program\n- Training budget\n- Career growth\n- Friendly team',
        skillsRequired: ['JavaScript', 'HTML', 'CSS', 'Git', 'Problem Solving'],
        location: 'Austin, TX',
        experienceRequired: '0-1 years',
        jobType: 'Full-time',
        salaryRange: { min: 65000, max: 85000, currency: 'USD' },
        recruiterId: recruiters[1]._id,
        companyName: recruiters[1].company.name,
        applicationCount: 0,
        isActive: true
      },
      {
        title: 'Cloud Architect',
        description: 'Design and implement cloud solutions at enterprise scale.\n\nRequired:\n- 7+ years experience\n- AWS/Azure/GCP certifications\n- Architecture expertise\n- Leadership skills',
        skillsRequired: ['AWS', 'Azure', 'Cloud Architecture', 'Terraform', 'Security'],
        location: 'Seattle, WA',
        experienceRequired: '7-10 years',
        jobType: 'Full-time',
        salaryRange: { min: 180000, max: 250000, currency: 'USD' },
        recruiterId: recruiters[2]._id,
        companyName: recruiters[2].company.name,
        applicationCount: 0,
        isActive: true
      },
      {
        title: 'Software Engineering Intern',
        description: 'Summer internship program for students. Gain hands-on experience in software development.\n\nDuration: 3 months\nStipend: $6000/month\nPossibility of full-time offer',
        skillsRequired: ['Programming', 'Problem Solving', 'Communication'],
        location: 'New York, NY',
        experienceRequired: '0 years',
        jobType: 'Internship',
        salaryRange: { min: 18000, max: 18000, currency: 'USD' },
        recruiterId: recruiters[3]._id,
        companyName: recruiters[3].company.name,
        applicationCount: 0,
        isActive: true
      }
    ]);

    console.log('Created jobs...');

    // Create Applications
    const applications = await Application.create([
      {
        jobId: jobs[0]._id,
        jobSeekerId: jobSeekers[0]._id,
        resumeUrl: jobSeekers[0].profile.resume.url,
        coverLetter: 'I am excited to apply for the Senior Full Stack Developer position. With 3 years of MERN stack experience, I am confident I can contribute to your team.',
        status: 'Shortlisted',
        recruiterNotes: 'Strong candidate, excellent React skills. Schedule for technical interview.',
        appliedAt: new Date('2024-01-15')
      },
      {
        jobId: jobs[0]._id,
        jobSeekerId: jobSeekers[3]._id,
        resumeUrl: jobSeekers[3].profile.resume.url,
        coverLetter: 'As a frontend specialist, I would love to bring my React expertise to your full-stack team.',
        status: 'Applied',
        appliedAt: new Date('2024-01-18')
      },
      {
        jobId: jobs[1]._id,
        jobSeekerId: jobSeekers[1]._id,
        resumeUrl: jobSeekers[1].profile.resume.url,
        coverLetter: 'My background in AI research and TensorFlow makes me a perfect fit for this ML Engineer role.',
        status: 'Interview',
        recruiterNotes: 'Impressive research background. Final round interview scheduled for next week.',
        appliedAt: new Date('2024-01-10')
      },
      {
        jobId: jobs[2]._id,
        jobSeekerId: jobSeekers[2]._id,
        resumeUrl: jobSeekers[2].profile.resume.url,
        coverLetter: 'With 4 years of DevOps experience and AWS expertise, I am ready to take on this challenge.',
        status: 'Hired',
        recruiterNotes: 'Excellent candidate! Offer extended and accepted.',
        appliedAt: new Date('2024-01-05')
      },
      {
        jobId: jobs[3]._id,
        jobSeekerId: jobSeekers[3]._id,
        resumeUrl: jobSeekers[3].profile.resume.url,
        coverLetter: 'Remote frontend work is my passion. I have extensive experience with React and TypeScript.',
        status: 'Shortlisted',
        recruiterNotes: 'Portfolio looks great. Moving to next round.',
        appliedAt: new Date('2024-01-12')
      },
      {
        jobId: jobs[4]._id,
        jobSeekerId: jobSeekers[1]._id,
        resumeUrl: jobSeekers[1].profile.resume.url,
        coverLetter: 'My data science background includes strong SQL and Python skills perfect for this analyst role.',
        status: 'Applied',
        appliedAt: new Date('2024-01-20')
      },
      {
        jobId: jobs[5]._id,
        jobSeekerId: jobSeekers[4]._id,
        resumeUrl: jobSeekers[4].profile.resume.url,
        coverLetter: 'I have 5 years of experience building scalable backend systems with Java and Spring Boot.',
        status: 'Shortlisted',
        recruiterNotes: 'Strong technical background. Proceed to system design interview.',
        appliedAt: new Date('2024-01-14')
      },
      {
        jobId: jobs[6]._id,
        jobSeekerId: jobSeekers[5]._id,
        resumeUrl: 'https://example.com/resume6.pdf',
        coverLetter: 'React Native is my specialty. I have built multiple cross-platform apps.',
        status: 'Rejected',
        recruiterNotes: 'Looking for someone with more iOS native experience.',
        appliedAt: new Date('2024-01-08')
      },
      {
        jobId: jobs[7]._id,
        jobSeekerId: jobSeekers[5]._id,
        resumeUrl: 'https://example.com/resume6.pdf',
        coverLetter: 'As a recent graduate, I am eager to learn and grow with your team.',
        status: 'Interview',
        recruiterNotes: 'Enthusiastic candidate. Good cultural fit.',
        appliedAt: new Date('2024-01-16')
      }
    ]);

    // Update application counts
    for (let job of jobs) {
      const count = await Application.countDocuments({ jobId: job._id });
      job.applicationCount = count;
      await job.save();
    }

    console.log('Created applications...');
    console.log('\n=================================');
    console.log('✅ Fake data seeded successfully!');
    console.log('=================================\n');
    console.log('📊 Summary:');
    console.log(`- Recruiters: ${recruiters.length} (4 approved, 1 pending)`);
    console.log(`- Job Seekers: ${jobSeekers.length}`);
    console.log(`- Jobs: ${jobs.length}`);
    console.log(`- Applications: ${applications.length}\n`);
    console.log('🔐 Login Credentials:');
    console.log('\nAdmin:');
    console.log('  Email: admin@jobportal.com');
    console.log('  Password: Admin@123');
    console.log('\nRecruiter (Approved):');
    console.log('  Email: sarah@techcorp.com');
    console.log('  Password: Test@123');
    console.log('\nRecruiter (Pending Approval):');
    console.log('  Email: lisa@mobilefirst.com');
    console.log('  Password: Test@123');
    console.log('\nJob Seeker:');
    console.log('  Email: alex.thompson@email.com');
    console.log('  Password: Test@123\n');

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedFakeData();