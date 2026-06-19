// client/src/hooks/useListing.js
// Fetch un logement par son id + ses avis.
// Utilisé dans DetailPage.jsx.

import { useState, useEffect } from 'react';
import { getLogementById, getAvisLogement } from '../services/listings.service';

export function useListing(id) {
  const [listing,  setListing]  = useState(null);
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // Les deux appels en parallèle
        const [listingData, avisData] = await Promise.all([
          getLogementById(id),
          getAvisLogement(id),
        ]);
        setListing(listingData.data);
        setReviews(avisData.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Logement introuvable');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  return { listing, reviews, loading, error };
}