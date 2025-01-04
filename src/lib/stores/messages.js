import { writable } from 'svelte/store';
import en from '../../messages/en.json'; // Import your JSON file

export const messages = writable(en); // Create a writable store for messages

