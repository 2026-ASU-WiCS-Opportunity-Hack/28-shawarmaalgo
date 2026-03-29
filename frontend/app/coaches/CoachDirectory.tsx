'use client';

import { useMemo, useState } from 'react';
import { CoachCard } from '@/components/cards/CoachCard';
import type { Coach as UICoach, CountryPageData } from '@/data/countries';

const certifications = ['All levels', 'CALC', 'PALC', 'SALC', 'MALC'] as const;

type CoachDirectoryCoach = UICoach & {
  country: string;
};

type CoachDirectoryProps = {
  initialCoaches: CoachDirectoryCoach[];
  chapters: CountryPageData[];
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function buildSearchableText(coach: CoachDirectoryCoach) {
  return [coach.name, coach.certification, coach.location, coach.focus, coach.bio, coach.country]
    .join(' ')
    .toLowerCase();
}

export default function CoachDirectory({ initialCoaches, chapters }: CoachDirectoryProps) {
  const [query, setQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('All chapters');
  const [selectedCertification, setSelectedCertification] = useState<(typeof certifications)[number]>('All levels');

  const filteredCoaches = useMemo(() => {
    const normalizedQuery = normalize(query);

    return initialCoaches.filter((coach) => {
      const matchesQuery = normalizedQuery === '' || buildSearchableText(coach).includes(normalizedQuery);
      const matchesChapter = selectedChapter === 'All chapters' || coach.country === selectedChapter;
      const matchesCertification = selectedCertification === 'All levels' || coach.certification === selectedCertification;
      return matchesQuery && matchesChapter && matchesCertification;
    });
  }, [initialCoaches, query, selectedChapter, selectedCertification]);

  function handleReset() {
    setQuery('');
    setSelectedChapter('All chapters');
    setSelectedCertification('All levels');
  }

  return (
    <>
      <section className="mt-8 grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
        <label className="sr-only" htmlFor="coach-search-input">
          Search coaches
        </label>
        <input
          id="coach-search-input"
          aria-label="Search coaches"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by specialty, location, or name"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-ink outline-none ring-brand-teal placeholder:text-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <label className="sr-only" htmlFor="coach-search-chapter">
          Filter by chapter
        </label>
        <select
          id="coach-search-chapter"
          value={selectedChapter}
          onChange={(event) => setSelectedChapter(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-ink outline-none focus:ring-2 focus:ring-brand-teal dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          <option>All chapters</option>
          {chapters.map((country) => (
            <option key={country.slug} value={country.shortName}>
              {country.shortName}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="coach-search-certification">
          Filter by certification
        </label>
        <select
          id="coach-search-certification"
          value={selectedCertification}
          onChange={(event) => setSelectedCertification(event.target.value as (typeof certifications)[number])}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-ink outline-none focus:ring-2 focus:ring-brand-teal dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          {certifications.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-ink"
        >
          Reset
        </button>
      </section>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-300">
        <p>
          Showing <span className="font-semibold text-brand-navy dark:text-white">{filteredCoaches.length}</span> of{' '}
          <span className="font-semibold text-brand-navy dark:text-white">{initialCoaches.length}</span> published coaches.
        </p>
        {(query || selectedChapter !== 'All chapters' || selectedCertification !== 'All levels') ? (
          <p>
            Active filters: {query ? `search “${query}”` : 'no text filter'}
            {selectedChapter !== 'All chapters' ? ` · ${selectedChapter}` : ''}
            {selectedCertification !== 'All levels' ? ` · ${selectedCertification}` : ''}
          </p>
        ) : null}
      </div>

      {filteredCoaches.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCoaches.map((coach) => (
            <div key={`${coach.name}-${coach.country}`}>
              <CoachCard coach={coach} />
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Chapter: {coach.country}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-soft dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          No coaches match your current search. Try a broader name, location, specialty, or certification filter.
        </div>
      )}
    </>
  );
}
