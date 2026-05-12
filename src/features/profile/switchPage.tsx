"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useSwitchProfiles } from "./model/useSwitchProfiles";
import { AddProfileModal } from "./ui/AddProfileModal";

// Shared card focus/hover classes — visible enough for TV remote D-pad navigation
const CARD_BTN = "group flex flex-col items-center gap-3 focus:outline-none";
const CARD_BOX_BASE =
  "rounded-md border-4 border-transparent transition-all duration-150 group-hover:border-white group-focus:border-white group-hover:scale-105 group-focus:scale-105";

function ProfileAvatar({ name, avatar }: { name: string; avatar?: string }) {
  if (avatar) {
    return (
      <div className="relative size-full overflow-hidden rounded-md">
        <Image src={avatar} alt={name} fill className="object-cover" />
      </div>
    );
  }

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="flex size-full items-center justify-center rounded-md bg-linear-to-br from-[#e50914] to-[#8b0000] text-2xl font-bold text-white">
      {initials}
    </div>
  );
}

export default function SwitchProfilesPage() {
  const {
    profiles,
    loading,
    error,
    canAddProfile,
    modalOpen,
    newName,
    addError,
    adding,
    selectProfile,
    openModal,
    closeModal,
    handleNameChange,
    handleAddProfile,
  } = useSwitchProfiles();

  // Refs for D-pad / arrow-key navigation (TV remote support)
  const profileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const addButtonRef = useRef<HTMLButtonElement | null>(null);

  // Auto-focus the first card once the page is ready
  useEffect(() => {
    if (!loading && !error) {
      profileRefs.current[0]?.focus();
    }
  }, [loading, error]);

  // Return focus to the "Add profile" button after the modal closes
  const prevModalOpen = useRef(false);
  useEffect(() => {
    if (prevModalOpen.current && !modalOpen) {
      addButtonRef.current?.focus();
    }
    prevModalOpen.current = modalOpen;
  }, [modalOpen]);

  function getAllCards(): HTMLButtonElement[] {
    const cards: (HTMLButtonElement | null)[] = [
      ...profileRefs.current.slice(0, profiles.length),
    ];
    if (canAddProfile) cards.push(addButtonRef.current);
    return cards.filter((c): c is HTMLButtonElement => c !== null);
  }

  function handleCardKeyDown(e: React.KeyboardEvent, idx: number) {
    const cards = getAllCards();
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      cards[(idx + 1) % cards.length]?.focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      cards[(idx - 1 + cards.length) % cards.length]?.focus();
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 animate-spin rounded-full border-2 border-white/10 border-t-white" />
          <p className="text-sm text-gray-400">Cargando perfiles…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-6" role="alert">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-8 py-10 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <Link
            href="/home"
            className="mt-5 inline-block text-xs font-medium text-gray-400 underline underline-offset-4 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6">
      {/* Title */}
      <h1
        id="who-is-watching"
        className="mb-10 text-4xl font-light tracking-wide text-white sm:text-5xl"
      >
        ¿Quién está viendo?
      </h1>

      {/* Profile grid */}
      <div
        role="list"
        aria-labelledby="who-is-watching"
        className="flex flex-wrap justify-center gap-6"
      >
        {profiles.map((profile, idx) => (
          <div key={profile.id} role="listitem">
            <button
              ref={(el) => { profileRefs.current[idx] = el; }}
              onClick={() => selectProfile(profile)}
              onKeyDown={(e) => handleCardKeyDown(e, idx)}
              aria-label={`Seleccionar perfil ${profile.name}`}
              className={CARD_BTN}
            >
              <div className={`size-38.75 overflow-hidden ${CARD_BOX_BASE}`}>
                <ProfileAvatar name={profile.name} avatar={profile.avatar} />
              </div>
              <span
                aria-hidden="true"
                className="text-base text-gray-400 transition-colors group-hover:text-white group-focus:text-white"
              >
                {profile.name}
              </span>
            </button>
          </div>
        ))}

        {/* Add profile card — hidden when the 5-profile limit is reached */}
        {canAddProfile && (
          <div role="listitem">
            <button
              ref={addButtonRef}
              onClick={openModal}
              onKeyDown={(e) => handleCardKeyDown(e, profiles.length)}
              aria-label="Agregar nuevo perfil"
              className={CARD_BTN}
            >
              <div
                className={`flex size-38.75 items-center justify-center bg-[#1a1a24] ${CARD_BOX_BASE}`}
              >
                <Plus className="size-12 text-gray-400 transition-colors group-hover:text-white group-focus:text-white" />
              </div>
              <span
                aria-hidden="true"
                className="text-base text-gray-400 transition-colors group-hover:text-white group-focus:text-white"
              >
                Agregar Perfil
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Manage profiles button */}
      <div className="mt-12">
        <Link
          href="/account"
          className="rounded border border-gray-500 px-8 py-3 text-base font-medium tracking-wider text-gray-400 transition-colors hover:border-white hover:text-white focus:border-white focus:text-white focus:outline-none"
        >
          Administrar Perfiles
        </Link>
      </div>

      {/* Add profile modal */}
      <AnimatePresence>
        {modalOpen && (
          <AddProfileModal
            name={newName}
            error={addError}
            adding={adding}
            onNameChange={handleNameChange}
            onSubmit={handleAddProfile}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
