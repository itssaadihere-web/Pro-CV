'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { 
  Search, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  Calendar, 
  User, 
  ArrowRight,
  BookOpen,
  X
} from 'lucide-react';

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  meta_description: string;
  published_at: string;
  author_name: string;
  featured_image: string | null;
  primary_keyword?: string | null;
  category?: string | null;
}

interface BlogIndexClientProps {
  posts: BlogPostItem[];
}

const ITEMS_PER_PAGE = 10;

/**
 * Intelligent categorization fallback for posts that do not have an explicit category set in DB.
 */
export function inferCategory(post: BlogPostItem): string {
  if (post.category && post.category.trim()) {
    return post.category.trim();
  }

  const text = `${post.title || ''} ${post.primary_keyword || ''} ${post.meta_description || ''}`.toLowerCase();

  if (text.includes('linkedin') || text.includes('profile optimization') || text.includes('profile optimizer') || text.includes('boolean')) {
    return 'LinkedIn & Branding';
  }
  if (
    text.includes('teaching') ||
    text.includes('software engineer') ||
    text.includes('developer') ||
    text.includes('customer support') ||
    text.includes('marketing') ||
    text.includes('fmcg') ||
    text.includes('supply chain') ||
    text.includes('corporate')
  ) {
    return 'Industry Guides';
  }
  if (
    text.includes('interview') ||
    text.includes('tell me about yourself') ||
    text.includes('salary') ||
    text.includes('remote') ||
    text.includes('negotiation') ||
    text.includes('gap') ||
    text.includes('fresh grad') ||
    text.includes('career change') ||
    text.includes('star method') ||
    text.includes('recruit')
  ) {
    return 'Career & Interviews';
  }
  if (
    text.includes('template') ||
    text.includes('format') ||
    text.includes('ats') ||
    text.includes('resume') ||
    text.includes('score') ||
    text.includes('builder') ||
    text.includes('maker') ||
    text.includes('column')
  ) {
    return 'ATS & Resumes';
  }

  return 'Career Advice';
}

type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

export default function BlogIndexClient({ posts }: BlogIndexClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gridTopRef = useRef<HTMLDivElement>(null);

  // Initialize state from URL params if available
  const initialCategory = searchParams.get('category') || 'All';
  const initialSort = (searchParams.get('sort') as SortOption) || 'newest';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialSearch = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSort, setSelectedSort] = useState<SortOption>(initialSort);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [currentPage, setCurrentPage] = useState<number>(isNaN(initialPage) || initialPage < 1 ? 1 : initialPage);

  // Augment posts with derived/actual category
  const augmentedPosts = useMemo(() => {
    return posts.map(post => ({
      ...post,
      categoryResolved: inferCategory(post),
    }));
  }, [posts]);

  // Compute available categories with their counts
  const { categories, categoryCounts } = useMemo(() => {
    const counts: Record<string, number> = { All: augmentedPosts.length };
    
    augmentedPosts.forEach(post => {
      const cat = post.categoryResolved;
      counts[cat] = (counts[cat] || 0) + 1;
    });

    // Desired display priority order
    const preferredOrder = [
      'All',
      'ATS & Resumes',
      'Career & Interviews',
      'LinkedIn & Branding',
      'Industry Guides',
      'Career Advice'
    ];

    // Collect all unique categories
    const allUniqueCats = Array.from(new Set(['All', ...augmentedPosts.map(p => p.categoryResolved)]));

    // Sort according to preferredOrder, then any extra custom categories alphabetically
    allUniqueCats.sort((a, b) => {
      const idxA = preferredOrder.indexOf(a);
      const idxB = preferredOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    return { categories: allUniqueCats, categoryCounts: counts };
  }, [augmentedPosts]);

  // Filter and sort the posts
  const filteredAndSortedPosts = useMemo(() => {
    let result = [...augmentedPosts];

    // 1. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.categoryResolved.toLowerCase() === selectedCategory.toLowerCase());
    }

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.meta_description?.toLowerCase().includes(q) ||
        p.categoryResolved.toLowerCase().includes(q) ||
        p.author_name?.toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    result.sort((a, b) => {
      switch (selectedSort) {
        case 'oldest':
          return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
        case 'title-desc':
          return b.title.localeCompare(a.title, undefined, { sensitivity: 'base' });
        case 'newest':
        default:
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      }
    });

    return result;
  }, [augmentedPosts, selectedCategory, searchQuery, selectedSort]);

  // Pagination calculation
  const totalPosts = filteredAndSortedPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / ITEMS_PER_PAGE));
  
  // Safe page clamping
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedPosts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedPosts, safeCurrentPage]);

  // Update URL params when filters change (browser history friendly)
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'All') {
      params.set('category', selectedCategory);
    }
    if (selectedSort && selectedSort !== 'newest') {
      params.set('sort', selectedSort);
    }
    if (safeCurrentPage > 1) {
      params.set('page', safeCurrentPage.toString());
    }
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }

    const queryStr = params.toString();
    const newUrl = queryStr ? `${pathname}?${queryStr}` : pathname;
    window.history.replaceState(null, '', newUrl);
  }, [selectedCategory, selectedSort, safeCurrentPage, searchQuery, pathname]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    scrollToGrid();
  };

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
    setCurrentPage(1);
    scrollToGrid();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToGrid();
  };

  const scrollToGrid = () => {
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedSort('newest');
    setSearchQuery('');
    setCurrentPage(1);
    scrollToGrid();
  };

  // Generate pagination page numbers with smart ellipsis
  const paginationRange = useMemo(() => {
    const delta = 1; // Number of pages around current page
    const range: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= safeCurrentPage - delta && i <= safeCurrentPage + delta)
      ) {
        range.push(i);
      } else if (
        (i === safeCurrentPage - delta - 1 && i > 1) ||
        (i === safeCurrentPage + delta + 1 && i < totalPages)
      ) {
        range.push('...');
      }
    }

    // Deduplicate consecutive ellipsis
    return range.filter((item, index) => item !== '...' || range[index - 1] !== '...');
  }, [totalPages, safeCurrentPage]);

  const startItemIndex = totalPosts === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItemIndex = Math.min(safeCurrentPage * ITEMS_PER_PAGE, totalPosts);

  return (
    <div className="space-y-8" ref={gridTopRef}>
      {/* Category Filter Pills Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">Filter by Category:</span>
          </div>
          {(selectedCategory !== 'All' || searchQuery || selectedSort !== 'newest') && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            const count = categoryCounts[cat] ?? 0;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary text-white shadow-md shadow-primary-950/20 scale-[1.02]'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Bar: Search, Sort & Results Count */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search articles by keyword or topic..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Counter & Sort Option */}
        <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
          <span className="text-xs font-semibold text-slate-500">
            {totalPosts > 0 ? (
              <>Showing <strong className="text-slate-800">{startItemIndex}–{endItemIndex}</strong> of <strong className="text-slate-800">{totalPosts}</strong></>
            ) : (
              '0 articles'
            )}
          </span>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="blog-sort-select" className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5 whitespace-nowrap">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span>Sort:</span>
            </label>
            <div className="relative">
              <select
                id="blog-sort-select"
                value={selectedSort}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="appearance-none text-xs font-bold bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition"
              >
                <option value="newest">🕒 Newest First</option>
                <option value="oldest">⏳ Oldest First</option>
                <option value="title-asc">🔤 Title (A → Z)</option>
                <option value="title-desc">🔤 Title (Z → A)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Cards Grid (Max 10 per page) */}
      {paginatedPosts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {paginatedPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col transform hover:-translate-y-1"
            >
              {/* Image banner */}
              {post.featured_image ? (
                <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-sm text-white shadow-sm border border-white/10">
                    {post.categoryResolved}
                  </span>
                </div>
              ) : (
                <div className="aspect-video w-full bg-gradient-to-tr from-primary-50 via-slate-100 to-amber-50 flex flex-col justify-between p-6 border-b border-slate-100 relative">
                  <span className="self-start text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-primary text-white shadow-sm">
                    {post.categoryResolved}
                  </span>
                  <h3 className="text-lg font-bold text-primary-900 line-clamp-2">{post.title}</h3>
                </div>
              )}

              {/* Card content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  <span className="flex items-center gap-1 text-primary">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                  <span className="text-slate-500">{post.categoryResolved}</span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                  {post.meta_description}
                </p>

                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-500 pt-4 border-t border-slate-100 mt-auto">
                  <span className="flex items-center gap-1.5 truncate max-w-[150px]">
                    <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{post.author_name || 'Sophi Team'}</span>
                  </span>
                  <span className="text-primary font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900">No blog posts found</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            {searchQuery 
              ? `We couldn't find any articles matching "${searchQuery}" in ${selectedCategory === 'All' ? 'any category' : selectedCategory}.`
              : `There are currently no articles in the "${selectedCategory}" category.`}
          </p>
          <div className="pt-2">
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-black hover:bg-primary-900 transition shadow-sm"
            >
              View All Articles
            </button>
          </div>
        </div>
      )}

      {/* Pagination Controls (Max 10 per page) */}
      {totalPages > 1 && (
        <div className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <div className="text-xs font-bold text-slate-500 order-2 sm:order-1">
            Page <span className="text-slate-900 font-black">{safeCurrentPage}</span> of <span className="text-slate-900 font-black">{totalPages}</span> (10 articles per page)
          </div>

          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            {/* Previous Button */}
            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage <= 1}
              aria-label="Previous Page"
              className={`inline-flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-xl border transition ${
                safeCurrentPage <= 1
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-sm'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Number Buttons */}
            {paginationRange.map((pageItem, idx) => {
              if (pageItem === '...') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 py-1 text-slate-400 font-black text-xs select-none"
                  >
                    …
                  </span>
                );
              }

              const pageNum = pageItem as number;
              const isActive = pageNum === safeCurrentPage;

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`min-w-[36px] h-9 px-2 text-xs font-black rounded-xl transition duration-150 ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary-950/20'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage >= totalPages}
              aria-label="Next Page"
              className={`inline-flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-xl border transition ${
                safeCurrentPage >= totalPages
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-sm'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
