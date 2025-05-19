"use client"

import { useState, useEffect, useCallback } from "react"
import { createInstance } from "./quantum-error-prevention"

// Types
export type StorageType = "local" | "session" | "memory"

// Memory storage fallback
const memoryStorage: Record<string, string> = {}

// Check if storage is available
function isStorageAvailable(type: StorageType): boolean {
  if (type === "memory") return true

  const storage = type === "local" ? localStorage : sessionStorage

  try {
    const testKey = "__storage_test__"
    storage.setItem(testKey, testKey)
    storage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

// Get storage based on type
function getStorage(type: StorageType): Storage | typeof memoryStorage {
  if (typeof window === "undefined") return memoryStorage

  if (type === "local" && isStorageAvailable("local")) {
    return localStorage
  } else if (type === "session" && isStorageAvailable("session")) {
    return sessionStorage
  }

  return memoryStorage
}

// Custom hook for using storage
export function useStorage<T>(
  key: string,
  initialValue: T,
  type: StorageType = "local",
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get storage object
  const storage = getStorage(type)

  // Function to get value from storage
  const getStoredValue = useCallback((): T => {
    try {
      // For memory storage
      if (storage === memoryStorage) {
        return storage[key] ? JSON.parse(storage[key]) : initialValue
      }

      // For web storage
      const item = (storage as Storage).getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error retrieving ${key} from ${type} storage:`, error)
      return initialValue
    }
  }, [initialValue, key, storage, type])

  // State to store value
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Initialize from storage on mount
  useEffect(() => {
    setStoredValue(getStoredValue())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Function to update value in state and storage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function for previous state
        const valueToStore = value instanceof Function ? value(storedValue) : value

        // Save state
        setStoredValue(valueToStore)

        // Save to storage
        if (storage === memoryStorage) {
          storage[key] = JSON.stringify(valueToStore)
        } else {
          ;(storage as Storage).setItem(key, JSON.stringify(valueToStore))
        }

        // Dispatch storage event for cross-tab communication (local storage only)
        if (type === "local" && typeof window !== "undefined") {
          window.dispatchEvent(new StorageEvent("storage", { key, newValue: JSON.stringify(valueToStore) }))
        }
      } catch (error) {
        console.error(`Error storing ${key} in ${type} storage:`, error)
      }
    },
    [key, storage, storedValue, type],
  )

  // Function to remove item from storage
  const removeItem = useCallback(() => {
    try {
      if (storage === memoryStorage) {
        delete storage[key]
      } else {
        ;(storage as Storage).removeItem(key)
      }
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`Error removing ${key} from ${type} storage:`, error)
    }
  }, [initialValue, key, storage, type])

  // Listen for changes in other tabs (local storage only)
  useEffect(() => {
    if (type !== "local" || typeof window === "undefined") return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parsing ${key} from storage event:`, error)
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(initialValue)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [initialValue, key, type])

  return [storedValue, setValue, removeItem]
}

// Convenience hooks
export function useLocalStorage<T>(key: string, initialValue: T) {
  return useStorage<T>(key, initialValue, "local")
}

export function useSessionStorage<T>(key: string, initialValue: T) {
  return useStorage<T>(key, initialValue, "session")
}

export function useMemoryStorage<T>(key: string, initialValue: T) {
  return useStorage<T>(key, initialValue, "memory")
}

// Offline sync queue
interface SyncQueueItem {
  id: string
  action: string
  data: any
  timestamp: number
  retries: number
}

// Sync queue manager
export class SyncQueueManager {
  private queueKey: string
  private maxRetries: number
  private syncFunction: (item: SyncQueueItem) => Promise<boolean>
  private autoSync: boolean
  private syncInterval: number
  private intervalId: NodeJS.Timeout | null = null

  constructor({
    queueKey = "ideaforge-sync-queue",
    maxRetries = 5,
    syncFunction,
    autoSync = true,
    syncInterval = 30000, // 30 seconds
  }: {
    queueKey?: string
    maxRetries?: number
    syncFunction: (item: SyncQueueItem) => Promise<boolean>
    autoSync?: boolean
    syncInterval?: number
  }) {
    this.queueKey = queueKey
    this.maxRetries = maxRetries
    this.syncFunction = syncFunction
    this.autoSync = autoSync
    this.syncInterval = syncInterval

    if (this.autoSync && typeof window !== "undefined") {
      this.startAutoSync()
    }
  }

  // Get queue from storage
  private getQueue(): SyncQueueItem[] {
    try {
      const queueStr = localStorage.getItem(this.queueKey)
      return queueStr ? JSON.parse(queueStr) : []
    } catch (error) {
      console.error("Error retrieving sync queue:", error)
      return []
    }
  }

  // Save queue to storage
  private saveQueue(queue: SyncQueueItem[]): void {
    try {
      localStorage.setItem(this.queueKey, JSON.stringify(queue))
    } catch (error) {
      console.error("Error saving sync queue:", error)
    }
  }

  // Add item to queue
  public addToQueue(action: string, data: any): string {
    const queue = this.getQueue()
    const id = `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newItem: SyncQueueItem = {
      id,
      action,
      data,
      timestamp: Date.now(),
      retries: 0,
    }

    queue.push(newItem)
    this.saveQueue(queue)

    // Attempt immediate sync if online
    if (typeof navigator !== "undefined" && navigator.onLine) {
      this.syncItem(newItem)
    }

    return id
  }

  // Remove item from queue
  public removeFromQueue(id: string): void {
    const queue = this.getQueue()
    const newQueue = queue.filter((item) => item.id !== id)
    this.saveQueue(newQueue)
  }

  // Sync a single item
  private async syncItem(item: SyncQueueItem): Promise<boolean> {
    try {
      const success = await this.syncFunction(item)

      if (success) {
        this.removeFromQueue(item.id)
        return true
      } else {
        // Update retry count
        const queue = this.getQueue()
        const updatedQueue = queue.map((qItem) => {
          if (qItem.id === item.id) {
            return { ...qItem, retries: qItem.retries + 1 }
          }
          return qItem
        })

        // Remove if max retries reached
        const finalQueue = updatedQueue.filter((qItem) => {
          if (qItem.id === item.id && qItem.retries >= this.maxRetries) {
            console.warn(`Sync item ${item.id} removed after ${this.maxRetries} failed attempts`)
            return false
          }
          return true
        })

        this.saveQueue(finalQueue)
        return false
      }
    } catch (error) {
      console.error(`Error syncing item ${item.id}:`, error)
      return false
    }
  }

  // Sync all items in queue
  public async syncAll(): Promise<{ success: number; failed: number }> {
    const queue = this.getQueue()
    let success = 0
    let failed = 0

    for (const item of queue) {
      const result = await this.syncItem(item)
      if (result) {
        success++
      } else {
        failed++
      }
    }

    return { success, failed }
  }

  // Start auto sync
  public startAutoSync(): void {
    if (this.intervalId) return

    this.intervalId = setInterval(() => {
      if (typeof navigator !== "undefined" && navigator.onLine) {
        this.syncAll()
      }
    }, this.syncInterval)

    // Also sync when coming back online
    if (typeof window !== "undefined") {
      window.addEventListener("online", this.handleOnline)
    }
  }

  // Handle coming back online
  private handleOnline = (): void => {
    this.syncAll()
  }

  // Stop auto sync
  public stopAutoSync(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }

    if (typeof window !== "undefined") {
      window.removeEventListener("online", this.handleOnline)
    }
  }

  // Get queue status
  public getStatus(): { total: number; pending: number } {
    const queue = this.getQueue()
    return {
      total: queue.length,
      pending: queue.filter((item) => item.retries < this.maxRetries).length,
    }
  }

  // Clean up
  public destroy(): void {
    this.stopAutoSync()
  }
}

// Data persistence service
export class DataPersistenceService {
  private baseUrl: string
  private syncQueue: SyncQueueManager

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl

    // Initialize sync queue with createInstance to ensure 'new' is used
    this.syncQueue = createInstance(SyncQueueManager, {
      queueKey: "ideaforge-data-sync",
      syncFunction: this.processSyncItem.bind(this),
    })
  }

  // Process sync queue item
  private async processSyncItem(item: SyncQueueItem): Promise<boolean> {
    try {
      const { action, data } = item

      switch (action) {
        case "create":
          await this.createItem(data.collection, data.item, true)
          break
        case "update":
          await this.updateItem(data.collection, data.id, data.updates, true)
          break
        case "delete":
          await this.deleteItem(data.collection, data.id, true)
          break
        default:
          console.warn(`Unknown sync action: ${action}`)
          return false
      }

      return true
    } catch (error) {
      console.error("Error processing sync item:", error)
      return false
    }
  }

  // Create item
  public async createItem(collection: string, item: any, skipQueue = false): Promise<any> {
    try {
      if (!navigator.onLine && !skipQueue) {
        // Add to sync queue if offline
        this.syncQueue.addToQueue("create", { collection, item })

        // Save to local storage for immediate use
        const items = this.getLocalItems(collection)
        const newItem = { ...item, id: item.id || `local-${Date.now()}` }
        this.saveLocalItems(collection, [...items, newItem])

        return newItem
      }

      // Online - send to API
      const response = await fetch(`${this.baseUrl}/${collection}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      })

      if (!response.ok) {
        throw new Error(`Failed to create item: ${response.statusText}`)
      }

      const createdItem = await response.json()

      // Update local cache
      this.updateLocalCache(collection, createdItem)

      return createdItem
    } catch (error) {
      console.error(`Error creating item in ${collection}:`, error)
      throw error
    }
  }

  // Get items
  public async getItems(collection: string, query?: Record<string, any>): Promise<any[]> {
    try {
      // Try to get from API first
      if (navigator.onLine) {
        const queryString = query ? `?${new URLSearchParams(query as any).toString()}` : ""
        const response = await fetch(`${this.baseUrl}/${collection}${queryString}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch items: ${response.statusText}`)
        }

        const items = await response.json()

        // Update local cache
        this.saveLocalItems(collection, items)

        return items
      }

      // Fallback to local storage if offline
      return this.getLocalItems(collection)
    } catch (error) {
      console.error(`Error fetching items from ${collection}:`, error)

      // Fallback to local storage on error
      return this.getLocalItems(collection)
    }
  }

  // Get item by ID
  public async getItemById(collection: string, id: string): Promise<any> {
    try {
      // Try to get from API first
      if (navigator.onLine) {
        const response = await fetch(`${this.baseUrl}/${collection}/${id}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch item: ${response.statusText}`)
        }

        const item = await response.json()

        // Update local cache
        this.updateLocalCache(collection, item)

        return item
      }

      // Fallback to local storage if offline
      const items = this.getLocalItems(collection)
      return items.find((item) => item.id === id)
    } catch (error) {
      console.error(`Error fetching item ${id} from ${collection}:`, error)

      // Fallback to local storage on error
      const items = this.getLocalItems(collection)
      return items.find((item) => item.id === id)
    }
  }

  // Update item
  public async updateItem(collection: string, id: string, updates: any, skipQueue = false): Promise<any> {
    try {
      if (!navigator.onLine && !skipQueue) {
        // Add to sync queue if offline
        this.syncQueue.addToQueue("update", { collection, id, updates })

        // Update in local storage for immediate use
        const items = this.getLocalItems(collection)
        const updatedItems = items.map((item) =>
          item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item,
        )
        this.saveLocalItems(collection, updatedItems)

        return updatedItems.find((item) => item.id === id)
      }

      // Online - send to API
      const response = await fetch(`${this.baseUrl}/${collection}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error(`Failed to update item: ${response.statusText}`)
      }

      const updatedItem = await response.json()

      // Update local cache
      this.updateLocalCache(collection, updatedItem)

      return updatedItem
    } catch (error) {
      console.error(`Error updating item ${id} in ${collection}:`, error)
      throw error
    }
  }

  // Delete item
  public async deleteItem(collection: string, id: string, skipQueue = false): Promise<void> {
    try {
      if (!navigator.onLine && !skipQueue) {
        // Add to sync queue if offline
        this.syncQueue.addToQueue("delete", { collection, id })

        // Remove from local storage for immediate effect
        const items = this.getLocalItems(collection)
        const filteredItems = items.filter((item) => item.id !== id)
        this.saveLocalItems(collection, filteredItems)

        return
      }

      // Online - send to API
      const response = await fetch(`${this.baseUrl}/${collection}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.statusText}`)
      }

      // Update local cache
      const items = this.getLocalItems(collection)
      const filteredItems = items.filter((item) => item.id !== id)
      this.saveLocalItems(collection, filteredItems)
    } catch (error) {
      console.error(`Error deleting item ${id} from ${collection}:`, error)
      throw error
    }
  }

  // Get items from local storage
  private getLocalItems(collection: string): any[] {
    try {
      const itemsStr = localStorage.getItem(`ideaforge-${collection}`)
      return itemsStr ? JSON.parse(itemsStr) : []
    } catch (error) {
      console.error(`Error retrieving ${collection} from local storage:`, error)
      return []
    }
  }

  // Save items to local storage
  private saveLocalItems(collection: string, items: any[]): void {
    try {
      localStorage.setItem(`ideaforge-${collection}`, JSON.stringify(items))
    } catch (error) {
      console.error(`Error saving ${collection} to local storage:`, error)
    }
  }

  // Update a single item in local cache
  private updateLocalCache(collection: string, item: any): void {
    const items = this.getLocalItems(collection)
    const existingIndex = items.findIndex((i) => i.id === item.id)

    if (existingIndex >= 0) {
      items[existingIndex] = item
    } else {
      items.push(item)
    }

    this.saveLocalItems(collection, items)
  }

  // Sync all pending changes
  public async syncAll(): Promise<{ success: number; failed: number }> {
    return this.syncQueue.syncAll()
  }

  // Get sync status
  public getSyncStatus(): { total: number; pending: number } {
    return this.syncQueue.getStatus()
  }

  // Clear local data for a collection
  public clearLocalData(collection: string): void {
    localStorage.removeItem(`ideaforge-${collection}`)
  }

  // Clear all local data
  public clearAllLocalData(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("ideaforge-")) {
        localStorage.removeItem(key)
      }
    }
  }
}

// Create a singleton instance
let dataPersistenceServiceInstance: DataPersistenceService | null = null

// Get or create the data persistence service instance
export function getDataPersistenceService(baseUrl = "/api"): DataPersistenceService {
  if (!dataPersistenceServiceInstance) {
    // Use createInstance to ensure 'new' is used
    dataPersistenceServiceInstance = createInstance(DataPersistenceService, baseUrl)
  }
  return dataPersistenceServiceInstance
}

// Hook for using data persistence in components
export function useDataPersistence<T extends { id: string }>(collection: string) {
  const service = getDataPersistenceService()
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Load items
  const loadItems = useCallback(
    async (query?: Record<string, any>) => {
      try {
        setLoading(true)
        setError(null)
        const data = (await service.getItems(collection, query)) as T[]
        setItems(data)
        return data
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
        return [] as T[]
      } finally {
        setLoading(false)
      }
    },
    [collection, service],
  )

  // Load on mount
  useEffect(() => {
    loadItems()
  }, [loadItems])

  // Create item
  const createItem = useCallback(
    async (item: Omit<T, "id">) => {
      try {
        const newItem = (await service.createItem(collection, item)) as T
        setItems((prev) => [...prev, newItem])
        return newItem
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
        throw err
      }
    },
    [collection, service],
  )

  // Update item
  const updateItem = useCallback(
    async (id: string, updates: Partial<T>) => {
      try {
        const updatedItem = (await service.updateItem(collection, id, updates)) as T
        setItems((prev) => prev.map((item) => (item.id === id ? updatedItem : item)))
        return updatedItem
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
        throw err
      }
    },
    [collection, service],
  )

  // Delete item
  const deleteItem = useCallback(
    async (id: string) => {
      try {
        await service.deleteItem(collection, id)
        setItems((prev) => prev.filter((item) => item.id !== id))
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
        throw err
      }
    },
    [collection, service],
  )

  // Get item by ID
  const getItemById = useCallback(
    async (id: string) => {
      try {
        return (await service.getItemById(collection, id)) as T
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
        throw err
      }
    },
    [collection, service],
  )

  // Sync all
  const syncAll = useCallback(async () => {
    return await service.syncAll()
  }, [service])

  // Get sync status
  const getSyncStatus = useCallback(() => {
    return service.getSyncStatus()
  }, [service])

  return {
    items,
    loading,
    error,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
    getItemById,
    syncAll,
    getSyncStatus,
  }
}
