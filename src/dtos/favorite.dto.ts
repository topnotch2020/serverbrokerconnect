// dtos/favorite.dto.ts

export class FavoriteDTO {
  id: string;
  propertyId: string;
  title: string;
  price: number;
  city: string;
  ownerName: string;
  createdAt: Date;

  constructor(favorite: any) {
    this.id = favorite._id;
    this.propertyId = favorite.property._id;
    this.title = favorite.property.title;
    this.price = favorite.property.price;
    this.city = favorite.property.address?.city;
    this.ownerName = favorite.property.broker?.fname;
    this.createdAt = favorite.createdAt;
  }
}
