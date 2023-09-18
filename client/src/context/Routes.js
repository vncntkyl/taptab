const host = "192.168.11.199";
export const developmentRoutes = {
  users: "http://" + host + ":5050/users/",
  userLogin: "http://" + host + ":5050/users/login",
  userRegistration: "http://" + host + ":5050/users/register",
  userDeactivate: "http://" + host + ":5050/users/deactivate/",
  userReactivate: "http://" + host + ":5050/users/reactivate/",
  userDelete: "http://" + host + ":5050/users/delete/",
  storage: "http://" + host + ":5050/storage/",
  uploadMedia: "http://" + host + ":5050/storage/upload",
  staticAds: "http://" + host + ":5050/staticAds/",
  staticAdsCreation: "http://" + host + ":5050/staticAds/create",
};
