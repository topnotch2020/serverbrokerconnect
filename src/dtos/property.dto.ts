import {
  PropertyTypeLabels,
  FurnishingLabels,
  PropertyAgeLabels,
} from "../utils/enumlabels.js";

export class PropertyDTO {
  id: string;
  listingType: string;
  status: string;
  propertyType: { value: string; label: string };
  propertyAge?: { value: string; label: string };
  furnishing?: { value: string; label: string };
  bhkType: string;
  address: any;
  price: number;
 formattedPrice?: string;
  floor?: any;
  area?: any;
  images?: any[];
  brokerName?: string;
  broker?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
  };
  postedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  isFavorited?: boolean;


  constructor(property: any) {
    // Rename _id → id
    this.id = property._id.toString();

    this.listingType = property.listingType;

    // Hide internal workflow states
    this.status = this.mapStatus(property.status);

    this.isFavorited = property.isFavorited ?? false;

    // ENUM → value + label
    this.propertyType = {
      value: property.propertyType,
      label:
        PropertyTypeLabels[property.propertyType] ??
        property.propertyType,
    };
this.price = property.price;
this.formattedPrice = property.price
  ? property.price.toLocaleString("en-IN")
  : null;
    this.propertyAge = property.propertyAge
      ? {
          value: property.propertyAge,
          label:
            PropertyAgeLabels[property.propertyAge] ??
            property.propertyAge,
        }
      : undefined;

    this.furnishing = property.furnishing
      ? {
          value: property.furnishing,
          label:
            FurnishingLabels[property.furnishing] ??
            property.furnishing,
        }
      : undefined;

    this.bhkType = property.bhkType;

    // Clean address (remove geo if not needed publicly)
    this.address = property.address
      ? {
          line1: property.address.line1,
          locality: property.address.locality,
          city: property.address.city,
          state: property.address.state,
          pincode: property.address.pincode,
        }
      : null;

    this.floor = property.floor;
    this.area = property.area;
    this.images = property.images;


    this.postedAt = property.createdAt;
    
if (property.broker) {
  this.broker = {
    id: property.broker._id,
    name: this.capitalize(
      `${property.broker.fname} ${property.broker.lname}`
    ),
    email: property.broker.email,
    phone: property.broker.phone,
  };
}


    this.expiresAt = property.expiresAt;
    this.createdAt = property.createdAt;
    this.updatedAt = property.updatedAt;
  }

  private mapStatus(status: string): string {
    switch (status) {
      case "DRAFTED":
        return "DRAFT";

      case "UNVERIFIED":
        return "PENDING_APPROVAL";

      case "VERIFIED":
        return "ACTIVE";

      case "EXPIRING_SOON":
        return "ACTIVE";

      case "EXPIRED":
        return "EXPIRED";

      case "SOLD":
        return "SOLD";

      default:
        return status;
    }
  }

  private capitalize(value: string): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

}
