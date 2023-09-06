import { NavLink } from "react-router-dom";

// Here, we display our Navbar
export default function Navbar() {
  return (
    <div>
      <nav className="bg-white shadow">
        <div className="container mx-auto">
          <div className="flex justify-end">
            <ul className="flex space-x-4">
              <li className="nav-item">
                <NavLink to="/create" className="text-blue-500 hover:underline">
                  Create Record
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/login" className="text-blue-500 hover:underline">
                  Login
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
