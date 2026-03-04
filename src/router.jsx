import { createBrowserRouter, NavLink, useRouteError } from "react-router-dom";
import Dashboard from "./Components/Pages/Dashboard/Dashboard";
import Login from "./Components/Pages/Login/Login";
import Layouts from "./Components/Pages/Layouts/Layouts";
import PrivateRoutes from "./Components/hoc/PrivateRoutes";
import concat from "lodash/concat";
import Employee from "./Components/Pages/Employee/Employee";
import Profile from "./Components/Pages/Profile/Profile";
import AppWrapper from "./AppWrapper";
import Patients from "./Components/Pages/Patients/Patients";
import Criteria from "./Components/Pages/Criteria/Criteria";
import Hcp from "./Components/Pages/HCP/Hcp";
import NewHcp from "./Components/Pages/HCP/NewHcp";
import Upload from "./Components/Pages/Upload/Upload";
import Preview from "./Components/Preview/Preview";
import ContractFile from "./Components/Pages/ContractFile/ContractFile";
import Chat from "./Components/Pages/Chat/Chat";
import ContractList from "./Components/Pages/ContractList/ContractList";
import ContractListNew from "./Components/Pages/ContractList/ContractListNew";
import Comparison from "./Components/Pages/Comparison/Comparison";
import AuditLog from "./Components/Pages/AuditLog/AuditLog";
import Restatement from "./Components/Pages/Restatement/Restatement";
import Conflict from "./Components/Pages/Confilict/Conflict";
import Entity from "./Components/Pages/EntityExtraction/Entity";
import NewEntityTemplate from "./Components/Pages/EntityExtraction/NewEntityTemplate";
import EntityValidation from "./Components/Pages/EntityExtraction/EntityValidation";
import ListContract from "./Components/Pages/EntityExtraction/ListContract";

const dashboardRoutes = [
  {
    handle: {
      crumb: () => (
        <NavLink to="/dashboard" className="breadcrumb-link">
          Dashboard
        </NavLink>
      ),
      activeMenuId: "dashboard",
    },
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
];

const profileRoutes = [
  {
    handle: {
      crumb: () => (
        <NavLink to="/profile" className="breadcrumb-link">
          Profile
        </NavLink>
      ),
      activeMenuId: "profile",
    },
    children: [
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
];

const patientsRoutes = [
  {
    handle: {
      crumb: () => (
        <NavLink to="/patients" className="breadcrumb-link">
          Patients
        </NavLink>
      ),
      activeMenuId: "patients",
    },
    children: [
      {
        path: "/patients",
        element: <Patients />,
      },
    ],
  },
];

const criteriaRoutes = [
  {
    handle: {
      crumb: () => (
        <NavLink to="/criteria" className="breadcrumb-link">
          Criteria
        </NavLink>
      ),
      activeMenuId: "criteria",
    },
    children: [
      {
        path: "/criteria",
        element: <Criteria />,
      },
    ],
  },
];

const hcpRouters = [
  {
    handle: {
      crumb: () => (
        <NavLink to="/hcp" className="breadcrumb-link">
          HCP
        </NavLink>
      ),
      activeMenuId: "hcp",
    },
    children: [
      {
        path: "/hcp",
        element: <NewHcp />,
      },
    ],
  },
];

const contractRouters =[
  {
    path:'/contract',
     handle: {
      crumb: () => (
        <NavLink to="/contract" className="breadcrumb-link">
          Contract
        </NavLink>
      ),
      activeMenuId: "contract",
    },
    children:[
      {
        index: true,
        element: <ContractListNew />,
      },
    ]
  }
]

const comparisonRouter =[
  {
    path:'/comparison',
     handle: {
      crumb: () => (
        <NavLink to="/comparison" className="breadcrumb-link">
          Comparison
        </NavLink>
      ),
      activeMenuId: "comparison",
    },
    children:[
      {
        index: true,
        element: <Comparison />,
      },
    ]
  }
]

const uploadRouters = [
  {
    path: "/list",
    handle: {
      crumb: () => (
        <NavLink to="/list" className="breadcrumb-link">
          Upload
        </NavLink>
      ),
      activeMenuId: "list",
    },
    children: [
      {
        index: true,
        element: <ContractFile />,
      },
      {
        path: "/list/upload",
        element: <Upload />,
      },
      {
        path: "/list/preview",
        element: <Preview />,
      },
    ],
  },
];

const chatRouters = [
 { 
  path: "/chat",
  handle: {
      crumb: () => (
        <NavLink to="/chat" className="breadcrumb-link">
          Chat
        </NavLink>
      ),
      activeMenuId: "chat",
    },
  children: [
      {
        index: true,
        element: <Chat />,
      },
    ],
  },
  
]

const AuditRouters = [
 { 
  path: "/audit",
  handle: {
      crumb: () => (
        <NavLink to="/audit" className="breadcrumb-link">
          Audit
        </NavLink>
      ),
      activeMenuId: "audit",
    },
  children: [
      {
        index: true,
        element: <AuditLog />,
      },
    ],
  },
  
]

const RestatementRouter = [
 { 
  path: "/restatement",
  handle: {
      crumb: () => (
        <NavLink to="/restatement" className="breadcrumb-link">
          Restatement
        </NavLink>
      ),
      activeMenuId: "restatement",
    },
  children: [
      {
        index: true,
        element: <Restatement/>,
      },
    ],
  },
  
]

const conflictRouter = [
 { 
  path: "/conflict",
  handle: {
      crumb: () => (
        <NavLink to="/conflict" className="breadcrumb-link">
          Restatement
        </NavLink>
      ),
      activeMenuId: "conflict",
    },
  children: [
      {
        index: true,
        element: <Conflict/>,
      },
    ],
  },
  
]

const entityRouter =[
  { 
  path: "/entity-extraction",
  handle: {
      crumb: () => (
        <NavLink to="/entity-rxtraction" className="breadcrumb-link">
          Entity Extraction
        </NavLink>
      ),
      activeMenuId: "entity-rxtraction",
    },
  children: [
      {
        index: true,
        element: <Entity/>,
      },
      {
        path: "/entity-extraction/new",
        element: <NewEntityTemplate />,
      },
      {
        path: "/entity-extraction/test",
        element: <ListContract />,
      },
      {
        path: "/entity-extraction/validation",
        element: <EntityValidation />,
      },
      
    ],
  },
  

]

export const router = createBrowserRouter(
  [
    // Public Routes
    {
      path: "/",
      element: (
        <>
          <AppWrapper /> {/* ✅ Now inside Router context */}
          <Login />
        </>
      ),
    },
    //   { path: '/forgotpassword', element: <ForgotPassword /> },
    //   { path: '/request/otp', element: <ForgotPasswordCode /> },
    //   { path: '/request/password', element: <NewPassword /> },
    //   { path: '/request/password/success', element: <Success /> },
    //   { path: '/request/auth/:loginUUID', element: <RequestLogin /> },

    // Private Routes
    {
      element: <PrivateRoutes />,
      children: [
        {
          element: "",
          children: concat(
            uploadRouters,
            contractRouters,
            chatRouters,
            comparisonRouter,
            AuditRouters,
            RestatementRouter,
            conflictRouter,
            entityRouter
          ),
          errorElement: <ErrorBoundary />,
        },
      ],
    },
  ],
  { basename: "/" }
);

function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  // Uncaught ReferenceError: path is not defined
  return <div></div>;
}

export default router;
