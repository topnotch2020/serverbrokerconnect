import { PropertyModel } from "../modals/property.model.js";
import { PropertyStatus } from "../enums/property.enums.js";

export async function expireProperties() {
  await PropertyModel.updateMany(
    { expiresAt: { $lte: new Date() } },
    { status: PropertyStatus.EXPIRED }
  );
}
