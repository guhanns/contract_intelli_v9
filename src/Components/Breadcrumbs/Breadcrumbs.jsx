import { useMatches } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import './breadcrumbs.css'

export default function Breadcumbs() {
  let matches = useMatches();
  let crumbs = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map((match) => match.handle.crumb(match.data));


  return (
    <Breadcrumb className="app-breadcrumb">
      {crumbs.map((crumb, index) => {
        return <BreadcrumbItem key={index}>{crumb}</BreadcrumbItem>;
      })}
    </Breadcrumb>
  );
}
