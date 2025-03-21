export interface CreateBookDto {
  title: string;
  description: string;
  copies: number;
  authorId: string;
  bookCoverURL?: string;
}
