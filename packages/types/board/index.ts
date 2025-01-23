export type BoardBody = {
  board: number[][]; // 2D array of numbers
};

export type CreateBoardResponse = {
  id: string;
} & BoardBody;
