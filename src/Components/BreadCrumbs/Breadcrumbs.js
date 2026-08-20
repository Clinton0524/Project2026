import { Link, useLocation } from "react-router-dom";
import '../Css/BreadCrumbs.css'
const Breadcrumbs = ({ customLabel }) => {
  const location = useLocation();

  const pathnames = location.pathname
    .split("/")
    .filter((x) => x);

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link className="text-decoration-none breadcrumbs" to="/home">Home</Link>
        </li>

        {pathnames.map((name, index) => {
          const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;

          const label =
            isLast && customLabel ? customLabel : decodeURIComponent(name);

          return isLast ? (
            <li
              key={index}
              className="breadcrumb-item active breadcrumbs"
              aria-current="page"
            >
              {label}
            </li>
          ) : (
            <li key={index} className="breadcrumb-item ">
              <Link className="text-decoration-none" to={routeTo}>{decodeURIComponent(name)}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
