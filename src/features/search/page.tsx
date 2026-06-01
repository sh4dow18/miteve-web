"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { Tag } from "lucide-react";
import { SearchResultsGrid } from "@/features/search/ui/SearchResultsGrid";
import { useSearchPage } from "@/features/search/model/useSearchPage";

export default function SearchPage() {
  const {
    inputValue,
    setInputValue,
    clearSearch,
    handleSubmit,
    handleInputKeyDown,
    focusSearchInput,
    searchInputRef,
    results,
    error,
    resultLabel,
    showClearButton,
    showEmptyState,
  } = useSearchPage();

  return (
    <div className="min-h-screen px-4 pb-12 pt-20 sm:px-8 md:px-12 md:pt-8">
      <h1 className="text-4xl font-semibold tracking-tight">Buscar</h1>

      <div className="flex items-center gap-3 mt-6">
        <form onSubmit={handleSubmit} className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            ref={searchInputRef}
            type="text"
            value={inputValue}
            placeholder="Buscar pelicula o serie..."
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleInputKeyDown}
            className="h-14 w-full rounded-xl border border-red-500/80 bg-[#061534] pl-12 pr-12 text-base text-white outline-none transition-colors placeholder:text-slate-400 focus:border-red-500"
            aria-label="Buscar contenido"
          />

          {showClearButton && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
              aria-label="Limpiar busqueda"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </form>

        <Link
          href="/genre"
          className="flex shrink-0 items-center gap-2 h-14 px-5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors whitespace-nowrap"
        >
          <Tag className="w-4 h-4" />
          Buscar por género
        </Link>
      </div>

      <p className="mt-6 text-xl font-semibold text-slate-200">{resultLabel}</p>

      {error && <p className="mt-3 text-red-400">{error}</p>}

      {showEmptyState && (
        <p className="mt-10 rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-slate-300">
          No encontramos resultados para la busqueda actual.
        </p>
      )}

      <div className="mt-6">
        <SearchResultsGrid
          results={results}
          onMoveUpFromFirstRow={focusSearchInput}
        />
      </div>
    </div>
  );
}
