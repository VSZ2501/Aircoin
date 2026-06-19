// client/src/hooks/useListings.js
// Gère le fetch de la liste des logements avec filtres et pagination.
// Utilisé dans ListingPage.jsx.

import { useState, useEffect, useCallback } from 'react';
import { getLogements } from '../services/listings.service';

const DEFAULT_FILTERS = {
  ville:   '',
  type:    '',
  prixMin: '',
  prixMax: '',
  meuble:  false,
  animaux: false,
  chambres:'',
  sort:    'prix_asc',
};

export function useListings(initialVille = '') {
  const [listings,  setListings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [total,     setTotal]     = useState(0);
  const [page,      setPage]      = useState(1);
  const [pages,     setPages]     = useState(1);
  const [filters,   setFilters]   = useState({ ...DEFAULT_FILTERS, ville: initialVille });

  const fetchListings = useCallback(async (currentFilters, currentPage) => {
    setLoading(true);
    setError(null);
    try {
      // Nettoie les valeurs vides avant d'envoyer
      const params = Object.fromEntries(
        Object.entries({ ...currentFilters, page: currentPage, limit: 12 })
          .filter(([, v]) => v !== '' && v !== false)
      );
      const data = await getLogements(params);
      setListings(data.data);
      setTotal(data.count);
      setPages(data.pages);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  // Relance le fetch à chaque changement de filtre ou de page
  useEffect(() => {
    fetchListings(filters, page);
  }, [filters, page, fetchListings]);

  const updateFilter = (key, value) => {
    setPage(1); // reset pagination sur changement de filtre
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setPage(1);
    setFilters({ ...DEFAULT_FILTERS, ville: initialVille });
  };

  return {
    listings,
    loading,
    error,
    total,
    page,
    pages,
    filters,
    setPage,
    updateFilter,
    resetFilters,
  };
}