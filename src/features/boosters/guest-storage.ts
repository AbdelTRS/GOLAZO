"use client";

import { useSyncExternalStore } from "react";

/*
 * Jetons des boosters ouverts sans compte, gardés dans le navigateur (localStorage)
 * jusqu'à l'inscription. Toutes les lectures et écritures sont protégées :
 * le stockage peut être indisponible (navigation privée, données bloquées).
 */

const STORAGE_KEY = "golazo:guest-boosters";
const CHANGE_EVENT = "golazo:guest-boosters-change";

/** Lecture mise en cache : useSyncExternalStore exige une valeur stable entre deux rendus. */
let cachedRaw: string | null = null;
let cachedTokens: string[] = [];
const EMPTY: string[] = [];

export function readGuestTokens(): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cachedRaw) return cachedTokens;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedTokens = Array.isArray(parsed) ? parsed.filter((t) => typeof t === "string") : [];
  } catch {
    cachedTokens = [];
  }
  return cachedTokens;
}

function writeGuestTokens(tokens: string[]) {
  try {
    if (tokens.length === 0) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  } catch {
    // Stockage indisponible : le booster reste jouable, il ne sera simplement pas importé.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function addGuestToken(token: string) {
  writeGuestTokens([...readGuestTokens(), token]);
}

export function clearGuestTokens() {
  writeGuestTokens([]);
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** Nombre de boosters ouverts en invité ; null tant que le navigateur n'a pas été lu. */
export function useGuestBoosterCount(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => readGuestTokens().length,
    () => null,
  );
}
