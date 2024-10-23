// TypeScript Interface for UserArticleVisit
export interface UserArticleVisit {
  id?: number;
  userId: number;
  article: ArticleType;  // Reference to the Article type
  visitedAt: string; // ISO date string for the visit date
}
