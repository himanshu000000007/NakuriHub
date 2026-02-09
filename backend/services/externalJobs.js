const axios = require('axios');

/**
 * Fetch jobs from JSearch API (RapidAPI)
 * Normalizes external job data to match internal job format
 */
const fetchExternalJobs = async (query = '', location = '', limit = 10) => {
  try {
    // Check if API key is configured
    if (!process.env.JSEARCH_API_KEY) {
      console.warn('JSearch API key not configured');
      return [];
    }

    // Build search query
    let searchQuery = query || 'software developer';
    if (location) {
      searchQuery += ` in ${location}`;
    }

    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: {
        query: searchQuery,
        page: '1',
        num_pages: '1',
        date_posted: 'all'
      },
      headers: {
        'X-RapidAPI-Key': process.env.JSEARCH_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      },
      timeout: 20000 // 5 second timeout
    };

    const response = await axios.request(options);
    const externalJobs = response.data.data || [];

    // Normalize external jobs to match internal job format
    const normalizedJobs = externalJobs.slice(0, limit).map(job => ({
      _id: `external_${job.job_id}`,
      title: job.job_title || 'N/A',
      description: job.job_description || 'No description available',
      skillsRequired: job.job_required_skills || [],
      location: job.job_city && job.job_state 
        ? `${job.job_city}, ${job.job_state}, ${job.job_country}`
        : job.job_country || 'Remote',
      experienceRequired: job.job_required_experience?.required_experience_in_months 
        ? `${Math.floor(job.job_required_experience.required_experience_in_months / 12)} years`
        : 'Not specified',
      jobType: normalizeJobType(job.job_employment_type),
      salaryRange: normalizeSalary(job),
      companyName: job.employer_name || 'Company Name Not Available',
      applicationCount: 0,
      isActive: true,
      postedAt: job.job_posted_at_datetime_utc || new Date(),
      // External job specific fields
      isExternal: true,
      source: 'JSEARCH',
      externalUrl: job.job_apply_link || job.job_google_link || '#',
      externalData: {
        publisher: job.job_publisher,
        employerLogo: job.employer_logo,
        jobId: job.job_id,
        highlights: job.job_highlights,
        benefits: job.job_benefits
      }
    }));

    return normalizedJobs;

  } catch (error) {
    // Log error but don't crash the app
    console.error('Error fetching external jobs:', error.message);
    
    // Return empty array if API fails
    return [];
  }
};

/**
 * Normalize job employment type
 */
const normalizeJobType = (type) => {
  if (!type) return 'Full-time';
  
  const typeMap = {
    'FULLTIME': 'Full-time',
    'PARTTIME': 'Part-time',
    'CONTRACTOR': 'Contract',
    'INTERN': 'Internship'
  };
  
  return typeMap[type.toUpperCase()] || 'Full-time';
};

/**
 * Normalize salary information
 */
const normalizeSalary = (job) => {
  if (job.job_min_salary && job.job_max_salary) {
    return {
      min: Math.round(job.job_min_salary),
      max: Math.round(job.job_max_salary),
      currency: job.job_salary_currency || 'USD'
    };
  }
  return null;
};

/**
 * Get single external job by ID
 */
const fetchExternalJobById = async (externalId) => {
  try {
    if (!process.env.JSEARCH_API_KEY) {
      return null;
    }

    // Extract job_id from external_jobid format
    const jobId = externalId.replace('external_', '');

    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/job-details',
      params: {
        job_id: jobId
      },
      headers: {
        'X-RapidAPI-Key': process.env.JSEARCH_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      },
      timeout: 5000
    };

    const response = await axios.request(options);
    const job = response.data.data?.[0];

    if (!job) return null;

    // Normalize single job
    return {
      _id: `external_${job.job_id}`,
      title: job.job_title || 'N/A',
      description: job.job_description || 'No description available',
      skillsRequired: job.job_required_skills || [],
      location: job.job_city && job.job_state 
        ? `${job.job_city}, ${job.job_state}, ${job.job_country}`
        : job.job_country || 'Remote',
      experienceRequired: job.job_required_experience?.required_experience_in_months 
        ? `${Math.floor(job.job_required_experience.required_experience_in_months / 12)} years`
        : 'Not specified',
      jobType: normalizeJobType(job.job_employment_type),
      salaryRange: normalizeSalary(job),
      companyName: job.employer_name || 'Company Name Not Available',
      applicationCount: 0,
      isActive: true,
      postedAt: job.job_posted_at_datetime_utc || new Date(),
      isExternal: true,
      source: 'JSEARCH',
      externalUrl: job.job_apply_link || job.job_google_link || '#',
      externalData: {
        publisher: job.job_publisher,
        employerLogo: job.employer_logo,
        jobId: job.job_id,
        highlights: job.job_highlights,
        benefits: job.job_benefits
      }
    };

  } catch (error) {
    console.error('Error fetching external job details:', error.message);
    return null;
  }
};

module.exports = {
  fetchExternalJobs,
  fetchExternalJobById
};