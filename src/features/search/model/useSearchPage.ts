"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FindContentsByNameLike } from "@/entities/content";
import type { Content } from "@/entities/content/model/types";

const MIN_SEARCH_LENGTH = 3;
type FormSubmitEvent = Parameters<
  NonNullable<ComponentProps<"form">["onSubmit"]>
>[0];
type InputKeyDownEvent = Parameters<
  NonNullable<ComponentProps<"input">["onKeyDown"]>
>[0];

export function useSearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryFromUrl = (searchParams.get("q") ?? "").trim();

  const [inputValue, setInputValue] = useState(queryFromUrl);
  const [results, setResults] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setInputValue(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    let cancelled = false;

    async function runSearch() {
      if (!queryFromUrl) {
        setResults([]);
        setError(null);
        setIsLoading(false);
        return;
      }

      if (queryFromUrl.length < MIN_SEARCH_LENGTH) {
        setResults([]);
        setError(`Ingresa al menos ${MIN_SEARCH_LENGTH} caracteres para buscar.`);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await FindContentsByNameLike(queryFromUrl);
        if (!cancelled) {
          setResults(data);
        }
      } catch {
        if (!cancelled) {
          setError("No se pudo realizar la busqueda. Intenta nuevamente.");
          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void runSearch();

    return () => {
      cancelled = true;
    };
  }, [queryFromUrl]);

  const hasSubmittedQuery = queryFromUrl.length >= MIN_SEARCH_LENGTH;

  const resultLabel = useMemo(() => {
    if (!hasSubmittedQuery) {
      return `Escribe al menos ${MIN_SEARCH_LENGTH} caracteres y presiona Enter para buscar.`;
    }

    if (isLoading) {
      return "Buscando...";
    }

    const total = results.length;
    return `${total} resultado${total === 1 ? "" : "s"} encontrado${total === 1 ? "" : "s"}`;
  }, [hasSubmittedQuery, isLoading, results.length]);

  const updateUrlQuery = useCallback(
    (nextValue: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (nextValue) {
        params.set("q", nextValue);
      } else {
        params.delete("q");
      }

      const search = params.toString();
      router.replace(search ? `${pathname}?${search}` : pathname);
    },
    [pathname, router, searchParams]
  );

  const submitSearch = useCallback(() => {
    const term = inputValue.trim();

    if (term && term.length < MIN_SEARCH_LENGTH) {
      setError(`Ingresa al menos ${MIN_SEARCH_LENGTH} caracteres para buscar.`);
      return;
    }

    setError(null);
    updateUrlQuery(term);
  }, [inputValue, updateUrlQuery]);

  const clearSearch = useCallback(() => {
    setInputValue("");
    updateUrlQuery("");
  }, [updateUrlQuery]);

  const focusFirstCard = useCallback(() => {
    const firstCard = document.querySelector(
      '[data-search-card="0"]'
    ) as HTMLElement | null;

    if (!firstCard) {
      return;
    }

    firstCard.focus({ preventScroll: false });
    firstCard.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, []);

  const focusSearchInput = useCallback(() => {
    searchInputRef.current?.focus({ preventScroll: false });
  }, []);

  const handleSubmit = useCallback(
    (event: FormSubmitEvent) => {
      event.preventDefault();
      submitSearch();
    },
    [submitSearch]
  );

  const handleInputKeyDown = useCallback(
    (event: InputKeyDownEvent) => {
      if (event.key !== "ArrowDown") {
        return;
      }

      event.preventDefault();
      focusFirstCard();
    },
    [focusFirstCard]
  );

  const showClearButton = inputValue.trim().length > 0;
  const showEmptyState =
    !isLoading && hasSubmittedQuery && results.length === 0 && !error;

  return {
    inputValue,
    setInputValue,
    submitSearch,
    clearSearch,
    handleSubmit,
    handleInputKeyDown,
    focusSearchInput,
    searchInputRef,
    results,
    isLoading,
    error,
    hasSubmittedQuery,
    resultLabel,
    showClearButton,
    showEmptyState,
  };
}
