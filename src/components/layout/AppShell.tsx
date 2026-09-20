import React from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';
import { Sidebar } from '../common/Sidebar';
import { BottomNav } from '../common/BottomNav';
import { Toast } from '../common/Toast';
import { OnboardingModal } from '../onboarding/OnboardingModal';
import { HomeView } from '../home/HomeView';
import { ExploreView } from '../explore/ExploreView';
import { LearningSessionView } from '../learn/LearningSessionView';
import { LessonResultView } from '../learn/LessonResultView';
import { ReviewCenterView } from '../review/ReviewCenterView';
import { HistoryView } from '../history/HistoryView';
import { ProfileView } from '../profile/ProfileView';

export const AppShell: React.FC = () => {
  const { activeSession, lastResult, activeTab } = useApp();

  // If in an active learning session, hide global navigation and display session
  if (activeSession) {
    return (
      <div className="min-h-screen bg-surface font-sans text-on-surface">
        <LearningSessionView />
        <Toast />
      </div>
    );
  }

  // If user just completed a session, show results view
  if (lastResult) {
    return (
      <div className="min-h-screen bg-surface font-sans text-on-surface">
        <Header />
        <Sidebar />
        <main className="pt-20 pb-28 lg:pl-60 min-h-screen">
          <LessonResultView />
        </main>
        <BottomNav />
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface flex flex-col relative antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Header */}
      <Header />

      {/* Desktop Sidebar (fixed 240px) */}
      <Sidebar />

      {/* Main Responsive Content Body */}
      <main className="flex-1 pt-18 pb-28 lg:pb-12 lg:pl-60 min-h-screen">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'explore' && <ExploreView />}
        {activeTab === 'learn' && <HomeView />}
        {activeTab === 'review' && <ReviewCenterView />}
        {activeTab === 'history' && <HistoryView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Mobile Bottom Navigation (5 tabs) */}
      <BottomNav />

      {/* Floating Ambient Toast */}
      <Toast />

      {/* Onboarding Welcome Modal */}
      <OnboardingModal />
    </div>
  );
};
