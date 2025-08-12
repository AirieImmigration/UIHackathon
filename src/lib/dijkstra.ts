import type { Visa, PathwayEdge } from "./queries/pathway";

export interface GraphNode {
  id: string;
  visa: Visa;
  edges: { to: string; weight: number }[];
}

export interface PathResult {
  path: string[];
  totalWeight: number;
}

export function buildGraph(visas: Visa[], edges: PathwayEdge[]): Map<string, GraphNode> {
  const graph = new Map<string, GraphNode>();
  
  // Create nodes for all visas
  visas.forEach(visa => {
    graph.set(visa.slug, {
      id: visa.slug,
      visa,
      edges: []
    });
  });
  
  // Add edges
  edges.forEach(edge => {
    const fromNode = graph.get(edge.from_visa_slug);
    if (fromNode) {
      fromNode.edges.push({
        to: edge.to_visa_slug,
        weight: edge.weight || 1
      });
    }
  });
  
  return graph;
}

export function findShortestPath(
  graph: Map<string, GraphNode>,
  startSlug: string,
  endSlugs: string[]
): PathResult | null {
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set<string>();
  
  // Initialize distances
  graph.forEach((_, slug) => {
    distances.set(slug, Infinity);
    previous.set(slug, null);
    unvisited.add(slug);
  });
  
  distances.set(startSlug, 0);
  
  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let current: string | null = null;
    let minDistance = Infinity;
    
    for (const slug of unvisited) {
      const distance = distances.get(slug) || Infinity;
      if (distance < minDistance) {
        minDistance = distance;
        current = slug;
      }
    }
    
    if (!current || minDistance === Infinity) break;
    
    unvisited.delete(current);
    
    // If we've reached one of our target nodes, check if it's optimal
    if (endSlugs.includes(current)) {
      // Continue to find all possible paths for tie-breaking
    }
    
    const currentNode = graph.get(current);
    if (!currentNode) continue;
    
    // Update distances to neighbors
    currentNode.edges.forEach(edge => {
      if (unvisited.has(edge.to)) {
        const newDistance = (distances.get(current!) || 0) + edge.weight;
        const currentDistance = distances.get(edge.to) || Infinity;
        
        if (newDistance < currentDistance) {
          distances.set(edge.to, newDistance);
          previous.set(edge.to, current);
        }
      }
    });
  }
  
  // Find the best end node using tie-breaking rules
  let bestEndSlug: string | null = null;
  let bestDistance = Infinity;
  let bestPath: string[] = [];
  
  for (const endSlug of endSlugs) {
    const distance = distances.get(endSlug) || Infinity;
    if (distance === Infinity) continue;
    
    const path = reconstructPath(previous, startSlug, endSlug);
    if (path.length === 0) continue;
    
    // Tie-breaking: prefer shorter paths, then alphabetical by final node
    const isBetter = distance < bestDistance || 
      (distance === bestDistance && path.length < bestPath.length) ||
      (distance === bestDistance && path.length === bestPath.length && endSlug < (bestEndSlug || ''));
    
    if (isBetter) {
      bestDistance = distance;
      bestEndSlug = endSlug;
      bestPath = path;
    }
  }
  
  if (!bestEndSlug || bestPath.length === 0) {
    return null;
  }
  
  return {
    path: bestPath,
    totalWeight: bestDistance
  };
}

function reconstructPath(
  previous: Map<string, string | null>,
  start: string,
  end: string
): string[] {
  const path: string[] = [];
  let current: string | null = end;
  
  while (current !== null) {
    path.unshift(current);
    current = previous.get(current) || null;
    
    if (current === start) {
      path.unshift(start);
      break;
    }
  }
  
  // Verify the path is complete
  if (path[0] !== start) {
    return [];
  }
  
  return path;
}

export function determineStartVisa(visas: Visa[], personaStage?: string): string | null {
  // Map persona stage to visa stage, with fallbacks
  const stageMapping: Record<string, string[]> = {
    "not-in-nz": ["NotInNZ", "Visitor"],
    "initial-visas": ["Work", "Student", "Visitor"],
    "pathway": ["Work", "Student"],
    "first-residence": ["FirstResidence"],
    "permanent": ["Permanent"]
  };
  
  const targetStages = stageMapping[personaStage || "not-in-nz"] || ["NotInNZ"];
  
  // Find visas matching the target stage
  const matchingVisas = visas.filter(visa => 
    targetStages.includes(visa.stage || "")
  );
  
  if (matchingVisas.length === 0) {
    // Fallback to first available visa
    return visas[0]?.slug || null;
  }
  
  // Return the first matching visa (most canonical)
  return matchingVisas[0].slug;
}

export function determineEndVisas(visas: Visa[], goalVisaSlug?: string, wantsPermanent?: boolean): string[] {
  if (goalVisaSlug) {
    return [goalVisaSlug];
  }
  
  const targetStage = wantsPermanent ? "Permanent" : "FirstResidence";
  const matchingVisas = visas.filter(visa => visa.stage === targetStage);
  
  return matchingVisas.map(visa => visa.slug);
}