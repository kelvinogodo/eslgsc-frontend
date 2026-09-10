/**
 * EXECUTIVES Data Usage Examples
 * 
 * This file demonstrates how to use the EXECUTIVES constant
 * in different scenarios throughout the application.
 */
/* eslint-disable react-refresh/only-export-components */

import { EXECUTIVES } from '../lib/constants';

// ============================================
// EXAMPLE 1: Display in a Simple List
// ============================================

export const ExecutivesList = () => {
  return (
    <ul>
      {EXECUTIVES.map((exec) => (
        <li key={exec.name}>
          {exec.name} - {exec.role}
        </li>
      ))}
    </ul>
  );
};

// ============================================
// EXAMPLE 2: Display Chairman Only
// ============================================

export const ChairmanCard = () => {
  const chairman = EXECUTIVES[0]; // Chairman is always first in array
  
  return (
    <div className="chairman-card">
      <img src={chairman.image} alt={chairman.name} />
      <h3>{chairman.name}</h3>
      <p>{chairman.role}</p>
    </div>
  );
};

// ============================================
// EXAMPLE 3: Filter by Role Type
// ============================================

export const HPMsList = () => {
  // Filter all HPMs (Head Personnel Managers)
  const hpms = EXECUTIVES.filter(exec => 
    exec.role.includes('HPM')
  );
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {hpms.map((hpm) => (
        <div key={hpm.name} className="card">
          <img src={hpm.image} alt={hpm.name} />
          <h4>{hpm.name}</h4>
          <p className="text-sm text-gray-600">{hpm.role}</p>
        </div>
      ))}
    </div>
  );
};

// ============================================
// EXAMPLE 4: Display in Dropdown/Select
// ============================================

export const ExecutiveSelector = () => {
  return (
    <select className="form-select">
      <option value="">Select an Executive</option>
      {EXECUTIVES.map((exec) => (
        <option key={exec.name} value={exec.name}>
          {exec.name} ({exec.role})
        </option>
      ))}
    </select>
  );
};

// ============================================
// EXAMPLE 5: Get Executive Count
// ============================================

export const ExecutiveStats = () => {
  const totalCount = EXECUTIVES.length;
  const hpmCount = EXECUTIVES.filter(e => e.role.includes('HPM')).length;
  const directorCount = EXECUTIVES.filter(e => e.role.includes('Director')).length;
  
  return (
    <div className="stats">
      <div>Total Executives: {totalCount}</div>
      <div>HPMs: {hpmCount}</div>
      <div>Directors: {directorCount}</div>
    </div>
  );
};

// ============================================
// EXAMPLE 6: Search Functionality
// ============================================

export const ExecutiveSearch = ({ searchTerm }) => {
  const filtered = EXECUTIVES.filter(exec =>
    exec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exec.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      {filtered.length > 0 ? (
        filtered.map(exec => (
          <div key={exec.name}>
            <strong>{exec.name}</strong>
            <p>{exec.role}</p>
          </div>
        ))
      ) : (
        <p>No executives found matching "{searchTerm}"</p>
      )}
    </div>
  );
};

// ============================================
// EXAMPLE 7: Random Executive Highlight
// ============================================

export const FeaturedExecutive = () => {
  const randomIndex = Math.floor(Math.random() * EXECUTIVES.length);
  const featured = EXECUTIVES[randomIndex];
  
  return (
    <div className="featured-card bg-blue-50 p-6 rounded-lg">
      <p className="text-sm text-gray-500 mb-2">Featured Executive</p>
      <img 
        src={featured.image} 
        alt={featured.name}
        className="w-32 h-32 rounded-full object-cover mb-4"
      />
      <h3 className="text-xl font-bold">{featured.name}</h3>
      <p className="text-gray-600">{featured.role}</p>
    </div>
  );
};

// ============================================
// EXAMPLE 8: Executive Contact Directory
// ============================================

export const ExecutiveDirectory = () => {
  // Group by role type
  const chairman = EXECUTIVES[0];
  const hpms = EXECUTIVES.filter(e => e.role.includes('HPM'));
  const others = EXECUTIVES.filter(e => 
    !e.role.includes('Chairman') && !e.role.includes('HPM')
  );
  
  return (
    <div className="directory">
      <section>
        <h2 className="text-2xl font-bold mb-4">Chairman</h2>
        <ExecutiveCard executive={chairman} />
      </section>
      
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Head Personnel Managers ({hpms.length})
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {hpms.map(exec => <ExecutiveCard key={exec.name} executive={exec} />)}
        </div>
      </section>
      
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Other Leadership ({others.length})
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {others.map(exec => <ExecutiveCard key={exec.name} executive={exec} />)}
        </div>
      </section>
    </div>
  );
};

const ExecutiveCard = ({ executive }) => (
  <div className="flex items-start gap-4 p-4 border rounded-lg">
    <img 
      src={executive.image} 
      alt={executive.name}
      className="w-16 h-16 rounded-full object-cover"
    />
    <div>
      <h3 className="font-semibold">{executive.name}</h3>
      <p className="text-sm text-gray-600">{executive.role}</p>
    </div>
  </div>
);

// ============================================
// EXAMPLE 9: Sidebar Widget
// ============================================

export const ExecutivesSidebarWidget = () => {
  // Show first 5 executives only
  const topFive = EXECUTIVES.slice(0, 5);
  
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-3">Leadership Team</h3>
      <div className="space-y-2">
        {topFive.map(exec => (
          <div key={exec.name} className="flex items-center gap-2">
            <img 
              src={exec.image} 
              alt={exec.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-sm">
              <p className="font-medium">{exec.name}</p>
              <p className="text-gray-500 text-xs truncate">{exec.role}</p>
            </div>
          </div>
        ))}
      </div>
      <a href="/about#leadership" className="text-blue-600 text-sm mt-3 block">
        View all executives →
      </a>
    </div>
  );
};

// ============================================
// EXAMPLE 10: API Response Format
// ============================================

// If you need to send executive data via API:
export const getExecutivesAPI = () => {
  return {
    success: true,
    count: EXECUTIVES.length,
    data: EXECUTIVES,
    // Can add metadata
    metadata: {
      chairman: EXECUTIVES[0].name,
      lastUpdated: '2025-11-10',
      categories: {
        chairman: 1,
        hpms: EXECUTIVES.filter(e => e.role.includes('HPM')).length,
        directors: EXECUTIVES.filter(e => e.role.includes('Director')).length,
        others: EXECUTIVES.length - 1 - EXECUTIVES.filter(e => 
          e.role.includes('HPM') || e.role.includes('Director')
        ).length
      }
    }
  };
};

// ============================================
// EXAMPLE 11: Utility Functions
// ============================================

// Get executive by name
export const getExecutiveByName = (name) => {
  return EXECUTIVES.find(exec => exec.name === name);
};

// Get chairman
export const getChairman = () => EXECUTIVES[0];

// Get all HPMs
export const getHPMs = () => EXECUTIVES.filter(e => e.role.includes('HPM'));

// Get total count
export const getExecutiveCount = () => EXECUTIVES.length;

// Check if executive exists
export const executiveExists = (name) => {
  return EXECUTIVES.some(exec => exec.name === name);
};

// ============================================
// EXAMPLE 12: Responsive Image Component
// ============================================

export const ExecutiveImage = ({ name, size = 'md' }) => {
  const executive = EXECUTIVES.find(e => e.name === name);
  
  if (!executive) return null;
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };
  
  return (
    <img
      src={executive.image}
      alt={`Portrait of ${executive.name}`}
      className={`${sizeClasses[size]} rounded-full object-cover`}
      loading="lazy"
    />
  );
};

// ============================================
// USAGE IN OTHER COMPONENTS
// ============================================

/*

// In any component file:
import { EXECUTIVES } from './lib/constants';

// Access the data:
const chairman = EXECUTIVES[0];
const allHPMs = EXECUTIVES.filter(e => e.role.includes('HPM'));
const totalExecutives = EXECUTIVES.length;

// Map and display:
{EXECUTIVES.map(exec => (
  <div key={exec.name}>
    <img src={exec.image} alt={exec.name} />
    <h3>{exec.name}</h3>
    <p>{exec.role}</p>
  </div>
))}

*/
