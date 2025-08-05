"use client";

import styles from "../styles/login.module.css";


import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import { getCredentials } from "../utils/api.js";
import Image from "next/image";
import banner from "../assets/banner.png";

import { Inter } from 'next/font/google';
import { FaUser, FaLock } from "react-icons/fa";

const inter = Inter({ subsets: ['latin'], weight: ['500', '700'] });

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Limpieza de estado al montar
  useEffect(() => {
    setUsername("");
    setPassword("");
    setError("");
    setLoading(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Usuario y contraseña son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const response = await getCredentials(username, password);

      if (response.status === 200) {
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("userId", response.data.userId);
        sessionStorage.setItem("name", response.data.name);
        sessionStorage.setItem("lastname", response.data.lastname);

        router.push("/inventory");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Error al iniciar sesión.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        {/* Imagen izquierda */}
        <div className={styles.leftSide}>
          <Image
            src={banner}
            alt="Banner"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Formulario derecho */}
        <div className={styles.rightSide}>
          <h2 className={`${styles.loginTitle} ${inter.className}`}>INICIAR SESIÓN</h2>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputWrapper}>
              <FaUser className={styles.inputIcon} />
              <input
                type="text"
                placeholder="Usuario"
                autoComplete="username"
                autoFocus
                required
                className={styles.inputField}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={styles.inputWrapper}>
              <FaLock className={styles.inputIcon} />
              <input
                type="password"
                placeholder="Contraseña"
                autoComplete="current-password"
                required
                className={styles.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              className={styles.signInButton}
              type="submit"
              disabled={loading}
            >
              {loading ? "Cargando..." : "INGRESAR"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
