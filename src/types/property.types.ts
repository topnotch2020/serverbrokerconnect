import { Types } from "mongoose";

export interface IBrokerPopulated {
  _id: Types.ObjectId;
  fname: string;
  lname: string;
  email: string;
  phone?: string;
}

export interface IPropertyBase {
  _id: Types.ObjectId;
  listingType: string;
  status: string;
  propertyType: string;
  propertyAge?: string;
  furnishing?: string;
  bhkType: string;
  address: {
    city: string;
    locality: string;
  };
  price: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPropertyPopulated extends IPropertyBase {
  brokerId: IBrokerPopulated;
}
