import { Notification } from '../interfaces/Notification';
import { Logger } from './logger';

export class MinHeap {
  private heap: Notification[] = [];
  private readonly maxSize: number;

  constructor(maxSize: number = 10) {
    this.maxSize = maxSize;
    Logger.info(`Initialized MinHeap with capacity: ${this.maxSize}`);
  }

  /**
   * Returns current size of the heap.
   */
  public size(): number {
    return this.heap.length;
  }

  /**
   * Returns the node with the minimum priority score without removing it.
   */
  public peek(): Notification | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  /**
   * Inserts a notification into the heap. If the heap is already at capacity:
   * compares the notification score with the minimum score (at root).
   * If the new notification has a higher score, it replaces the root and bubbles down.
   */
  public insert(notification: Notification): void {
    if (this.heap.length < this.maxSize) {
      this.heap.push(notification);
      Logger.info(`Heap space available. Inserted notification ID ${notification.id} (Score: ${notification.priorityScore})`);
      this.bubbleUp(this.heap.length - 1);
    } else {
      const minElement = this.peek();
      if (minElement) {
        if (notification.priorityScore > minElement.priorityScore) {
          Logger.info(`Heap full. Replacing root ID ${minElement.id} (Score: ${minElement.priorityScore}) with higher priority ID ${notification.id} (Score: ${notification.priorityScore})`);
          this.heap[0] = notification;
          this.bubbleDown(0);
        } else {
          Logger.info(`Heap full. Rejected notification ID ${notification.id} (Score: ${notification.priorityScore}) because root ID ${minElement.id} has higher or equal priority (Score: ${minElement.priorityScore})`);
        }
      }
    }
  }

  /**
   * Removes and returns the minimum priority score notification from the heap.
   */
  public extractMin(): Notification | null {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    Logger.info(`Extracting minimum priority item: ID ${min.id} (Score: ${min.priorityScore})`);
    if (this.heap.length > 0 && last !== undefined) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return min;
  }

  /**
   * Returns array copy of the elements inside the heap (unsorted heap structure).
   */
  public toArray(): Notification[] {
    return [...this.heap];
  }

  /**
   * Retrieves final output sorted by:
   * 1. Priority Weight (Descending)
   * 2. Timestamp (Descending)
   */
  public getSortedArray(): Notification[] {
    return [...this.heap].sort((a, b) => {
      if (b.priorityWeight !== a.priorityWeight) {
        return b.priorityWeight - a.priorityWeight;
      }
      return b.timestampValue - a.timestampValue;
    });
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index].priorityScore >= this.heap[parentIndex].priorityScore) {
        break;
      }
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    const length = this.heap.length;
    while (true) {
      let smallestIndex = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (
        leftChild < length &&
        this.heap[leftChild].priorityScore < this.heap[smallestIndex].priorityScore
      ) {
        smallestIndex = leftChild;
      }
      if (
        rightChild < length &&
        this.heap[rightChild].priorityScore < this.heap[smallestIndex].priorityScore
      ) {
        smallestIndex = rightChild;
      }

      if (smallestIndex === index) {
        break;
      }

      this.swap(index, smallestIndex);
      index = smallestIndex;
    }
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}
