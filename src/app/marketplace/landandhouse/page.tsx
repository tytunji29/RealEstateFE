"use client";

import LandAndHousePage from "@/components/HouseCard/land-and-house-client";
import { getLoginSession } from "@/lib/auth/session";

export default  function LandAndHousePageServer() {
  const session =  getLoginSession();

  const propertyTypes = session?.propertyTypes ?? [];
  const landTypes = session?.landType ?? [];
  const buildingTypes = session?.buildingType ?? [];

  return (
	<LandAndHousePage
	  propertyTypes={propertyTypes}
	  landTypes={landTypes}
	  buildingTypes={buildingTypes}
	/>
  );
}
