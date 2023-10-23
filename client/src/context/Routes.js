const host = "http://192.168.11.154:5050/";
// const host = "https://taptab-server.onrender.com/";
export const developmentRoutes = {
  users: host + "users/",
  userLogin: host + "users/login",
  userRegistration: host + "users/register",
  userDeactivate: host + "users/deactivate/",
  userReactivate: host + "users/reactivate/",
  userDelete: host + "users/delete/",
  storage: host + "storage/",
  uploadMedia: host + "storage/upload",
  staticAds: host + "staticAds/",
  staticAdsCreation: host + "staticAds/create",
  staticAdsDelete: host + "staticAds/hide",
  engagements: host + "surveys/",
  planner: host + "planner/",
  players: host + "players/",
};
