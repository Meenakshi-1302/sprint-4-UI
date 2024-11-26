import React, { useState } from 'react';
import { Search, Briefcase, MapPin, DollarSign, Clock, Filter } from 'lucide-react';

const JobListingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sample job data
  const initialJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp",
      location: "New York",
      type: "Full-time",
      salary: "$120k - $150k",
      posted: "2 days ago",
      description: "We're looking for an experienced frontend developer with React expertise..."
    },
    {
      id: 2,
      title: "UX Designer",
      company: "DesignHub",
      location: "Remote",
      type: "Contract",
      salary: "$80k - $100k",
      posted: "1 day ago",
      description: "Join our creative team as a UX Designer working on exciting projects..."
    },
    {
      id: 3,
      title: "Backend Engineer",
      company: "DataSys",
      location: "San Francisco",
      type: "Full-time",
      salary: "$130k - $160k",
      posted: "5 days ago",
      description: "Looking for a backend engineer with strong Python and AWS experience..."
    },
    {
      id: 4,
      title: "Product Manager",
      company: "InnovateCo",
      location: "Remote",
      type: "Part-time",
      salary: "$90k - $110k",
      posted: "3 days ago",
      description: "Seeking an experienced product manager to lead our flagship product..."
    }
  ];

  const [jobs] = useState(initialJobs);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    const matchesType = selectedType === 'all' || job.type === selectedType;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const locations = ['all', ...new Set(jobs.map(job => job.location))];
  const types = ['all', ...new Set(jobs.map(job => job.type))];

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Your Dream Job</h1>
        <p className="text-gray-600">Discover opportunities that match your skills and aspirations</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs, companies, or keywords..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Button (Mobile) */}
          <button
            className="md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={20} />
            Filters
          </button>

          {/* Desktop Filters */}
          <div className="hidden md:flex gap-4">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {locations.map(location => (
                <option key={location} value={location}>
                  {location.charAt(0).toUpperCase() + location.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Filters */}
        {isFilterOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-4">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {locations.map(location => (
                <option key={location} value={location}>
                  {location.charAt(0).toUpperCase() + location.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map(job => (
          <div
            key={job.id}
            className="bg-white rounded-lg shadow-md p-6 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg cursor-pointer"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h2>
                <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Briefcase size={16} />
                    {job.company}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={16} />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    {job.posted}
                  </div>
                </div>
                <p className="text-gray-600">{job.description}</p>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {job.type}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {filteredJobs.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            No jobs found matching your criteria. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListingPage;