export function saveLoginSession(data: any) {
  sessionStorage.setItem('buildingType', JSON.stringify(data.buildingType));
  sessionStorage.setItem('landType', JSON.stringify(data.landType));
  sessionStorage.setItem('propertyTypes', JSON.stringify(data.propertyTypes));
  sessionStorage.setItem('token', data.token);
  sessionStorage.setItem('role', data.role);
  sessionStorage.setItem('email', data.email);
  sessionStorage.setItem('isFirstPoster', data.isFirstPoster);
}


export function getLoginSession() {
  const buildingType = sessionStorage.getItem('buildingType');
  const landType = sessionStorage.getItem('landType');
  const propertyTypes = sessionStorage.getItem('propertyTypes');
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');
  const email = sessionStorage.getItem('email');
  const isFirstPoster = sessionStorage.getItem('isFirstPoster');

  return {
    buildingType: buildingType ? JSON.parse(buildingType) : null,
    landType: landType ? JSON.parse(landType) : null,
    propertyTypes: propertyTypes ? JSON.parse(propertyTypes) : null,
    token,
    role,
    email,
    isFirstPoster
  };
}