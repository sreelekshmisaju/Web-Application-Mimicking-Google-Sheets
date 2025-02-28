import { CellData } from '../types/spreadsheet';

type DependencyGraph = Map<string, Set<string>>;

class CellDependencyManager {
  private dependencyGraph: DependencyGraph = new Map();
  private reverseDependencyGraph: DependencyGraph = new Map();

  public addDependency(dependentCell: string, dependencyCell: string): void {
    if (!this.dependencyGraph.has(dependentCell)) {
      this.dependencyGraph.set(dependentCell, new Set());
    }
    this.dependencyGraph.get(dependentCell)!.add(dependencyCell);

    if (!this.reverseDependencyGraph.has(dependencyCell)) {
      this.reverseDependencyGraph.set(dependencyCell, new Set());
    }
    this.reverseDependencyGraph.get(dependencyCell)!.add(dependentCell);
  }

  public removeDependencies(cellId: string): void {
    // Remove forward dependencies
    if (this.dependencyGraph.has(cellId)) {
      const dependencies = this.dependencyGraph.get(cellId)!;
      for (const dep of dependencies) {
        this.reverseDependencyGraph.get(dep)?.delete(cellId);
      }
      this.dependencyGraph.delete(cellId);
    }

    // Remove reverse dependencies
    if (this.reverseDependencyGraph.has(cellId)) {
      const dependents = this.reverseDependencyGraph.get(cellId)!;
      for (const dep of dependents) {
        this.dependencyGraph.get(dep)?.delete(cellId);
      }
      this.reverseDependencyGraph.delete(cellId);
    }
  }

  public getDependents(cellId: string): string[] {
    return Array.from(this.reverseDependencyGraph.get(cellId) || []);
  }

  public detectCircularDependency(startCell: string, newDependency: string): boolean {
    const visited = new Set<string>();
    const stack = [newDependency];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (current === startCell) return true;

      if (!visited.has(current)) {
        visited.add(current);
        const dependencies = this.reverseDependencyGraph.get(current);
        if (dependencies) {
          stack.push(...dependencies);
        }
      }
    }

    return false;
  }

  public updateDependencies(cellId: string, formula: string, cells: { [key: string]: CellData }): void {
    this.removeDependencies(cellId);

    if (!formula.startsWith('=')) return;

    const cellReferences = formula.match(/[A-Z]+\d+/g) || [];
    for (const ref of cellReferences) {
      if (this.detectCircularDependency(cellId, ref)) {
        throw new Error('Circular dependency detected');
      }
      this.addDependency(cellId, ref);
    }
  }

  public getAffectedCells(changedCellId: string): string[] {
    const affected = new Set<string>();
    const queue = [changedCellId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const dependents = this.getDependents(current);

      for (const dependent of dependents) {
        if (!affected.has(dependent)) {
          affected.add(dependent);
          queue.push(dependent);
        }
      }
    }

    return Array.from(affected);
  }
}

export const cellDependencyManager = new CellDependencyManager();