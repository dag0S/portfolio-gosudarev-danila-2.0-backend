export interface CreateBookDto {
  title: string;
  description: string;
  author: string;
  copies: number;
  bookCoverURL?: string;
}
