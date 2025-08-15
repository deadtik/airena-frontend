// app/page.tsx

import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategoriesSection from '@/app/components/CategoriesSection';
import FeaturedVideoSection from '@/app/components/FeaturedVideoSection';
import BigTournamentSection from '@/app/components/BigTournamentSection';
import FoundersClubSection from '@/app/components/FoundersClubSection';
import LeaderboardSection from '@/app/components/LeaderboardSection';
import Footer from '@/app/components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedVideoSection />
        <BigTournamentSection />
        <FoundersClubSection />
        <LeaderboardSection />
      </main>
      <Footer />
    </>
  );
}