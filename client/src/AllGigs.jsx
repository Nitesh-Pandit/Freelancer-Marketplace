import React, { useState, useEffect } from 'react';
import GigGrid from './GigGrid';
import './AllGigs.css';

function AllGigs({ onGigClick }) {
  const [gigs, setGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState('all');
  
  useEffect(() => {
    fetchAllGigs();
  }, []);

  useEffect(() => {
    filterAndSortGigs();
  }, [gigs, searchTerm, sortBy, priceRange]);

  const fetchAllGigs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gigs`);
      const data = await response.json();

      if (response.ok) {
        setGigs(data.gigs || []);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch gigs');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Fetch gigs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortGigs = () => {
    let filtered = gigs;

    // Search filter
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(gig =>
        gig.title.toLowerCase().includes(lowerSearch) ||
        gig.description.toLowerCase().includes(lowerSearch) ||
        gig.freelancerName.toLowerCase().includes(lowerSearch)
      );
    }

    // Price range filter
    if (priceRange === 'budget') {
      filtered = filtered.filter(gig => gig.price <= 25);
    } else if (priceRange === 'moderate') {
      filtered = filtered.filter(gig => gig.price > 25 && gig.price <= 75);
    } else if (priceRange === 'premium') {
      filtered = filtered.filter(gig => gig.price > 75);
    }

    // Sort
    if (sortBy === 'newest') {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      filtered = [...filtered].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    setFilteredGigs(filtered);
  };

  return (
    <div className="all-gigs-container">
      {/* HEADER */}
      <div className="all-gigs-header">
        <div className="header-content">
          <h1>🔍 Browse Gigs</h1>
          <p>Find the perfect freelancer for your project</p>
        </div>
        <div className="gigs-count">
          Found <strong>{filteredGigs.length}</strong> {filteredGigs.length === 1 ? 'gig' : 'gigs'}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* FILTERS SECTION */}
      <div className="filters-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by skill, title, or freelancer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="price">Price Range:</label>
            <select
              id="price"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Prices</option>
              <option value="budget">Budget (≤ $25)</option>
              <option value="moderate">Moderate ($25 - $75)</option>
              <option value="premium">Premium ($75+)</option>
            </select>
          </div>
        </div>
      </div>

      {/* GIGS CONTENT */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading gigs...</p>
        </div>
      ) : (
        <>
          {filteredGigs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h2>No Gigs Found</h2>
              <p>
                {searchTerm
                  ? `We couldn't find any gigs matching "${searchTerm}"`
                  : 'No gigs available yet. Check back soon!'}
              </p>
              {searchTerm && (
                <button
                  className="clear-btn"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <GigGrid gigs={filteredGigs} onGigClick={onGigClick} />
          )}
        </>
      )}
    </div>
  );
}

export default AllGigs;
