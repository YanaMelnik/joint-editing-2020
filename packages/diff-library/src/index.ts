import { Change, diffChars } from 'diff';

export interface DiffChange {
  type: DiffStatus,
  index: number,
  count: number,
  value?: string,
}

export enum DiffStatus {
  Added = 'added',
  Removed = 'removed',
}

export function getTextDiff(start: string, modified: string): DiffChange[] {
  const diffs: Change[] = diffChars(start, modified);
  const result: DiffChange[] = [];
  let pointer: number = 0;

  diffs.forEach((elem) => {
    if (elem.removed) {
      result.push({
        type: DiffStatus.Removed,
        index: pointer,
        count: elem.count,
      });

      pointer += elem.count;
    }

    if (elem.added) {
      result.push({
        type: DiffStatus.Added,
        index: pointer,
        value: elem.value,
        count: elem.count,
      });
    }

    if (!elem.removed && !elem.added) {
      pointer += elem.count;
    }
  });

  return result;
}

export function applyTextDiff(text: string, diffs: DiffChange[]): string {
  const newString = [];
  let cursor = 0;

  diffs.forEach((elem) => {
    if (elem.type === 'added') {
      newString.push(text.slice(cursor, elem.index));
      newString.push(elem.value);
      cursor = elem.index;
    }

    if (elem.type === 'removed') {
      if (cursor !== elem.index) {
        newString.push(text.slice(cursor, elem.index));
      }

      cursor = elem.index + elem.count;
    }
  });

  if (cursor < text.length) {
    newString.push(text.slice(cursor));
  }

  return newString.join('');
}
