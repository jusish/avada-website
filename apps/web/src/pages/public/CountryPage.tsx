import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { KenyaPage } from '@/pages/public/KenyaPage';
import { RwandaPage } from '@/pages/public/RwandaPage';
import { TanzaniaPage } from '@/pages/public/TanzaniaPage';

export const CountryPage: React.FC = () => {
  const { countrySlug } = useParams<{ countrySlug: string }>();

  if (!countrySlug) {
    return <Navigate to="/" replace />;
  }

  const slug = countrySlug.toLowerCase().trim();

  switch (slug) {
    case 'kenya':
    case 'ke':
      return <KenyaPage />;
    case 'rwanda':
    case 'rw':
      return <RwandaPage />;
    case 'tanzania':
    case 'tz':
      return <TanzaniaPage />;
    default:
      return <Navigate to="/" replace />;
  }
};
