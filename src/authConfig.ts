export const msalConfig = {
  auth: {
    clientId: "1eff792a-fcfd-490e-b408-c68b504e8456",
    authority:
      "https://login.microsoftonline.com/bf85ce1c-7325-4f78-8a86-f882d91ea637",
    redirectUri: "https://mhlsml.csb.app/",
  },
};

export const loginRequest = {
  scopes: ["User.Read"], // Permiso para leer datos del perfil
};
