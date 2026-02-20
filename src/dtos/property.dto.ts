import {
  PropertyTypeLabels,
  FurnishingLabels,
  PropertyAgeLabels,
} from "../utils/enumlabels.js";
import { AppError } from "../utils/error.js";

export class PropertyDTO {
  id: string;
  listingType: string;
  status: string;

  propertyType: { value: string; label: string };
  propertyAge?: { value: string; label: string };
  furnishing?: { value: string; label: string };

  bhkType: string;

  pricing: {
    price: number;
    formattedPrice: string;
    maintenance?: number;
    deposit?: number;
  };

  availableFrom?: string;
  tenantsAllowed?: string[];
  amenities?: string[];

  address: any;
  floor?: any;
  area?: any;
  images?: any[];

  broker?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
  };

  postedAt: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isFavorited?: boolean;

  constructor(property: any) {
    this.id = property._id.toString();

    this.listingType = property.listingType;
    this.status = this.mapStatus(property.status);
    this.isFavorited = property.isFavorited ?? false;

    this.propertyType = {
      value: property.propertyType,
      label:
        PropertyTypeLabels[property.propertyType] ??
        property.propertyType,
    };

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

    this.pricing = {
      price: property.pricing?.price ?? 0,
      formattedPrice: property.pricing?.price
        ? property.pricing.price.toLocaleString("en-IN")
        : "0",
      maintenance: property.pricing?.maintenance,
      deposit: property.pricing?.deposit,
    };

    this.availableFrom = property.availableFrom;
    this.tenantsAllowed = property.tenantsAllowed;
    this.amenities = property.amenities;

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
    this.images = property.images?.map((img: any) => ({
      _id: img._id?.toString(),
      url: img.url,
      type: img.type,
      isPrimary: Boolean(img.isPrimary),
    }));

    if (property.broker) {
      this.broker = {
        id: property.broker._id?.toString(),
        name: this.capitalize(
          `${property.broker.fname} ${property.broker.lname}`
        ),
        email: property.broker.email,
        phone: property.broker.phone,
        profileImage: property.broker.profileImage,
      };
    }

    this.postedAt = property.createdAt;
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
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }


  private validatePrimaryImage(payload: any) {
    if (payload.images) {
      const primaryCount = payload.images.filter(
        (img: any) => img.isPrimary
      ).length;

      if (primaryCount > 1) {
        throw new AppError("Only one primary image allowed", 400);
      }
    }
  }
}
