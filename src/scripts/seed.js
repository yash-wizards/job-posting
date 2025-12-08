const database = require('../config/database.js');
const JobPosting = require('../models/jobPosting.js');
const logger = require('../config/logger.js');

const sampleJobs = [
  {
    title: 'Senior Full-Stack Developer',
    description: 'We are looking for an experienced Full-Stack Developer to join our team. You will work with modern technologies including React, Node.js, and AWS. The ideal candidate has 5+ years of experience in web development and a passion for creating scalable applications.',
    url: 'https://example.com/jobs/senior-fullstack-developer',
    company: 'Tech Innovations AB',
    location: 'Stockholm, Sweden',
    employmentType: 'full-time',
    salary: {
      min: 50000,
      max: 70000,
      currency: 'SEK'
    },
    enabled: true,
  },
  {
    title: 'Frontend Developer - React Specialist',
    description: 'Join our creative team as a Frontend Developer specializing in React. You will be responsible for building beautiful and responsive user interfaces. We value clean code, attention to detail, and a strong understanding of modern frontend technologies.',
    url: 'https://example.com/jobs/frontend-react-developer',
    company: 'Digital Design Studio',
    location: 'Gothenburg, Sweden',
    employmentType: 'full-time',
    salary: {
      min: 40000,
      max: 55000,
      currency: 'SEK'
    },
  enabled: true,
  },
  {
    title: 'Backend Engineer - Node.js',
    description: 'We need a talented Backend Engineer with strong Node.js skills to help build and maintain our microservices architecture. You will work with a team of experienced developers on challenging problems at scale.',
    url: 'https://example.com/jobs/backend-nodejs-engineer',
    company: 'CloudTech Solutions',
    location: 'Malmö, Sweden',
    employmentType: 'full-time',
    salary: {
      min: 45000,
      max: 60000,
      currency: 'SEK'
    },
    enabled: true,
  },
  {
    title: 'DevOps Engineer',
    description: 'Looking for a DevOps Engineer to manage our infrastructure and deployment pipelines. You will work closely with development teams to improve our CI/CD processes and ensure high availability of our services.',
    url: 'https://example.com/jobs/devops-engineer',
    company: 'Infrastructure Experts',
    location: 'Uppsala, Sweden',
    employmentType: 'full-time',
    salary: {
      min: 48000,
      max: 65000,
      currency: 'SEK'
    },
  enabled: true,
  },
  {
    title: 'Junior Web Developer',
    description: 'Great opportunity for a Junior Web Developer to start their career in a supportive environment. You will learn from experienced developers while working on real projects. We value enthusiasm and willingness to learn.',
    url: 'https://example.com/jobs/junior-web-developer',
    company: 'StartUp Hub',
    location: 'Linköping, Sweden',
    employmentType: 'full-time',
    salary: {
      min: 30000,
      max: 38000,
      currency: 'SEK'
    },
  enabled: true,
  },
  {
    title: 'Mobile Developer - iOS',
    description: 'We are seeking an iOS Developer to create amazing mobile experiences. You will work on our flagship iOS application used by thousands of users. Strong Swift skills and understanding of iOS design patterns are essential.',
    url: 'https://example.com/jobs/ios-developer',
    company: 'Mobile First AB',
    location: 'Stockholm, Sweden',
    employmentType: 'full-time',
    salary: {
      min: 45000,
      max: 60000,
      currency: 'SEK'
    },
   enabled: true,
  },
  {
    title: 'Data Engineer',
    description: 'Join our data team as a Data Engineer. You will design and build data pipelines, work with large datasets, and help drive data-driven decision making across the organization.',
    url: 'https://example.com/jobs/data-engineer',
    company: 'Data Insights Corp',
    location: 'Stockholm, Sweden',
    employmentType: 'full-time',
    salary: {
      min: 50000,
      max: 68000,
      currency: 'SEK'
    },
   enabled: true,
  },
  {
    title: 'UX/UI Designer',
    description: 'Creative UX/UI Designer needed to craft beautiful and intuitive user experiences. You will work closely with product managers and developers to bring ideas to life.',
    url: 'https://example.com/jobs/ux-ui-designer',
    company: 'Design Masters',
    location: 'Gothenburg, Sweden',
    employmentType: 'full-time',
    salary: {
      min: 38000,
      max: 52000,
      currency: 'SEK'
    },
  enabled: true,
  },
  {
    title: 'QA Automation Engineer',
    description: 'Help ensure our software quality by developing and maintaining automated test suites. You will work with developers to create comprehensive testing strategies.',
    url: 'https://example.com/jobs/qa-automation-engineer',
    company: 'Quality First AB',
    location: 'Remote, Sweden',
    employmentType: 'full-time',
    salary: {
      min: 42000,
      max: 55000,
      currency: 'SEK'
    },
   enabled: true,
  },
  {
    title: 'Product Manager - Tech',
    description: 'Lead product development as a Technical Product Manager. You will define product strategy, work with stakeholders, and guide development teams to deliver exceptional products.',
    url: 'https://example.com/jobs/product-manager-tech',
    company: 'Product Leaders',
    location: 'Stockholm, Sweden',
    employmentType: 'full-time',
    salary: {
      min: 55000,
      max: 75000,
      currency: 'SEK'
    },
  enabled: true,
  }
];

const seedDatabase = async () => {
  try {
    logger.info('Starting database seed...');

    await database.connect();

    const deleteResult = await JobPosting.deleteMany({});
    logger.info(`Cleared ${deleteResult.deletedCount} existing job postings`);

    const insertedJobs = await JobPosting.insertMany(sampleJobs);
    logger.info(`Inserted ${insertedJobs.length} sample job postings`);

    logger.info('Seed completed successfully!');
    logger.info(`Total active jobs: ${insertedJobs.filter(j => j.enabled).length}`);
    logger.info(`Companies: ${new Set(insertedJobs.map(j => j.company)).size}`);
    logger.info(`Locations: ${new Set(insertedJobs.map(j => j.location)).size}`);

    process.exit(0);
  } catch (error) {
    logger.error('Seed failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;