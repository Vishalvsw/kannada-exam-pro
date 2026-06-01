let memoryStore = {
  questions: [],
  users: [],
  results: [],
  notes: [],
  currentAffairs: [],
  qaQuestions: []
};

export const getQuestions = () => memoryStore.questions;
export const saveQuestions = (data) => { memoryStore.questions = data; };
export const getUsers = () => memoryStore.users;
export const saveUsers = (data) => { memoryStore.users = data; };
export const getResults = () => memoryStore.results;
export const saveResults = (data) => { memoryStore.results = data; };
export const getNotes = () => memoryStore.notes;
export const saveNotes = (data) => { memoryStore.notes = data; };
export const getCurrentAffairs = () => memoryStore.currentAffairs;
export const saveCurrentAffairs = (data) => { memoryStore.currentAffairs = data; };
export const getQAQuestions = () => memoryStore.qaQuestions;
export const saveQAQuestions = (data) => { memoryStore.qaQuestions = data; };
