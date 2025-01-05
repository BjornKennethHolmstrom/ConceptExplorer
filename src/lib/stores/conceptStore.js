// src/lib/stores/conceptStore.js
import { writable, derived, get } from 'svelte/store';
import { messages } from './messages';

// Store for the currently viewed concept
export const currentConceptName = writable(null);

// Derived store that gets the current concept's full data
export const currentConcept = derived(
  [messages, currentConceptName],
  ([$messages, $currentConceptName]) => {
    if (!$currentConceptName || !$messages.concepts) return null;
    return $messages.concepts.find(c => c.name === $currentConceptName);
  }
);

// Function to get a concept by name
export function getConceptByName(name) {
  let allConcepts = get(messages).concepts;
  return allConcepts.find(c => c.name === name);
}

// Function to find all related concepts with their full data
export function getRelatedConceptsData(conceptName) {
  const concept = getConceptByName(conceptName);
  if (!concept) return [];
  
  return concept.related_concepts
    .map(name => getConceptByName(name))
    .filter(c => c !== undefined);
}
