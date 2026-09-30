import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './config';
import {
  Agency,
  User,
  Client,
  Project,
  Task,
  TaskType,
  Asset,
  Invoice,
  Payment,
  TaskComment,
  ActivityLogItem,
  NotificationItem,
} from '../types';

// Generic collection references
export const COLLECTIONS = {
  AGENCIES: 'agencies',
  USERS: 'users',
  CLIENTS: 'clients',
  PROJECTS: 'projects',
  TASKS: 'tasks',
  TASK_TYPES: 'taskTypes',
  ASSETS: 'assets',
  INVOICES: 'invoices',
  PAYMENTS: 'payments',
  COMMENTS: 'taskComments',
  ACTIVITY: 'activityLogs',
  NOTIFICATIONS: 'notifications',
};

// Helper to check if Firebase is currently authenticated
export function isFirebaseUserAuthenticated(): boolean {
  return Boolean(auth.currentUser);
}

// Generic save (create or overwrite)
export async function saveDocument<T extends { id: string }>(
  collectionName: string,
  item: T
): Promise<void> {
  // Only attempt write if authenticated to respect Firestore security rules
  if (!auth.currentUser) {
    return;
  }
  const path = `${collectionName}/${item.id}`;
  try {
    const docRef = doc(db, collectionName, item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Generic delete
export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<void> {
  // Only attempt delete if authenticated to respect Firestore security rules
  if (!auth.currentUser) {
    return;
  }
  const path = `${collectionName}/${id}`;
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Fetch all documents for an organization
export async function fetchOrgDocuments<T>(
  collectionName: string,
  orgId?: string
): Promise<T[]> {
  // Skill requirement: Data fetching must only occur if user is authenticated
  if (!auth.currentUser) {
    return [];
  }
  try {
    const colRef = collection(db, collectionName);
    const q = orgId ? query(colRef, where('orgId', '==', orgId)) : query(colRef);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data() as T);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
    return [];
  }
}

// Subscribe to real-time updates for an organization
export function subscribeToOrgDocuments<T>(
  collectionName: string,
  orgId: string | undefined,
  onData: (items: T[]) => void,
  onError?: (error: unknown) => void
): () => void {
  // Skill requirement: Only attach onSnapshot listeners if auth is ready and user is authenticated
  if (!auth.currentUser) {
    return () => {};
  }
  try {
    const colRef = collection(db, collectionName);
    const q = orgId ? query(colRef, where('orgId', '==', orgId)) : query(colRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => docSnap.data() as T);
        onData(items);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, collectionName);
      }
    );

    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, collectionName);
    return () => {};
  }
}
