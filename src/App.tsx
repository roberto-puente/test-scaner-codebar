import React, { useState } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import ProductsList from "./ProductsList";

const App: React.FC = () => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [user, setUser] = useState<String>(null);

  const handleLogin = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      const account = response.account;
      setUser(account?.name);
    } catch (err) {
      console.error("Error en el login:", err);
    }
  };

  const handleLogout = () => {
    instance.logoutPopup();
    setUser(null);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Gestión de Productos</h1>
      {!isAuthenticated ? (
        <button onClick={handleLogin}>Iniciar Sesión</button>
      ) : (
        <div>
          <p>Bienvenido, {user}</p>
          <button onClick={handleLogout}>Cerrar Sesión</button>
          <ProductsList />
        </div>
      )}
    </div>
  );
};

export default App;
