export interface Product {
  name: string;
  label: string;
  defaultAmount: number[];
  SportIds?: number;
  CategoryTypes?: string;

}

export interface DataProduct  {
  productName: string;
  productId: number;
  category: string;
}
