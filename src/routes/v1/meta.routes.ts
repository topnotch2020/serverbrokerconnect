import { Router } from "express";

const router = Router();

router.get("/property", (req, res) => {
  res.json({
    success: true,
    data: {
      propertyTypes: ["flat", "villa", "plot"],
      floorLevels: ["low", "mid", "high"],
      furnishing: ["unfurnished", "semi_furnished", "fully_furnished"],
    },
  });
});

export const metaRoutes = router;

