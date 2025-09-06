import { CategoryData } from "./category-data.model";

export class ProductData {
    productId: number | undefined;
    name: string | undefined;
    description: string | undefined;
    categories: CategoryData| undefined;    
}
