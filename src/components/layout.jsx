"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faClipboard, faFileAlt, faBoxOpen, faUsers,
  faSignOutAlt, faBars
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import logo from "../assets/logo.png";
import "../styles/global.css";
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], weight: ['500', '700'] });


export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const name = sessionStorage.getItem("name");
    const lastname = sessionStorage.getItem("lastname");
    if (name && lastname) setUserName(`${name.toUpperCase()} ${lastname.toUpperCase()}`);
  }, []);

  const isActive = (href) => pathname === href;

  const handleLogout = () => {
    if (confirm("¿Seguro que deseas cerrar sesión?")) {
      sessionStorage.clear();
      router.push("/");
    }
  };
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };


  return (
    <div className={`layout ${inter.className}`}>
      <div className="header">
        <div className="header-left">
          <FontAwesomeIcon icon={faBars} className="menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)} />
          <Image src={logo} alt="Logo Tornemec" className="logo" />
          <span className="company-name">
            TORNEMEC<small> SRL</small>
          </span>
        </div>
        <div className="header-right">
          <span className="user-name">{userName}</span>
          <FontAwesomeIcon icon={faUser} className="icon" />
          <div className="logout-container" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
            <span className="logout-text">CERRAR SESIÓN</span>
          </div>
        </div>
      </div>

      <div className="content">
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="fixed">
            <nav>
              <ul>
                <li className={`sidebar-item ${isActive('/inventory') ? 'active' : ''}`}>
                  <Link href="/inventory" onClick={handleLinkClick}>
                    <FontAwesomeIcon icon={faClipboard} className="iconSidebar" />
                    <span>Inventario</span>
                  </Link>
                </li>
                <li className={`sidebar-item ${isActive('/store') ? 'active' : ''}`}>
                  <Link href="/store" onClick={handleLinkClick}>
                    <FontAwesomeIcon icon={faBoxOpen} className="iconSidebar" />
                    <span>Almacén</span>
                  </Link>
                </li>
                <li className={`sidebar-item ${isActive('/users') ? 'active' : ''}`}>
                  <Link href="/users" onClick={handleLinkClick}>
                    <FontAwesomeIcon icon={faUsers} className="iconSidebar" />
                    <span>Usuarios</span>
                  </Link>
                </li>
                <li className={`sidebar-item ${isActive('/report') ? 'active' : ''}`}>
                  <Link href="/report" onClick={handleLinkClick}>
                    <FontAwesomeIcon icon={faFileAlt} className="iconSidebar" />
                    <span>Reporte</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
}
