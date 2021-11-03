export class CreateProductDTO {
  name: string;
  description: string;
  rating: number;
  type: string;
  hot: boolean;
  productVariant: {
    price: number;
    taste: string;
    property: {
      weight: string;
      price: number;
    }[];
    quantityOfGoods: number;
  }[];
}
