import { all_routes } from "../../../feature-module/router/all_routes";
const routes = all_routes;

export const SidebarData = [
  {
    label: "MAIN",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Main",
    submenu: false,
    submenuItems: [
      {
        label: "Dashboard",
        link: routes.adminDashboard,
        icon: "ti ti-layout-dashboard",
        showSubRoute: false,
        submenu: false,
        permission: "Dashboard",
      },
       
      {
        label: "Centers",
        link: routes.center,
        icon: "fas fa-building",
        showSubRoute: false,
        submenu: true,
        permission: "Centers",
        submenuItems: [
           {
            label: "All Centers",
            link: routes.center,
            icon: "ti ti-settings",
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Add Center",
            link: routes.CenterAdd,
            icon: "ti ti-settings",
            showSubRoute: false,
            
            submenu: false,
          },
        ],
      },
       {
        label: "Leads",
        link: routes.leads,
        icon: "fas fa-building",
        showSubRoute: false,
        submenu: true,
        permission: "Leads",
        submenuItems: [
           {
            label: "All Leads",
            link: routes.leads,
            icon: "ti ti-settings",
            showSubRoute: false,
            submenu: false,
          }
       
        ],
      },
      {
        label: "Classes",
        link: routes.allClass,
        icon: "fa-solid fa-id-card ",
        showSubRoute: false,
        submenu: true,
        permission: "Classes",
        submenuItems: [
           {
            label: "All Classes",
            link: routes.allClass,
            icon: "ti ti-settings",
            showSubRoute: false,
            submenu: false,
          },       
        ],
      },
    ],
  },
    //   {
    //   label: "Transport",
    //   icon: "fa fa-bus",
    //   submenu: true,
    //   showSubRoute: false,

    //   submenuItems: [
    //     { label: "Routes",icon: "fa-solid fa fa-bus", link: routes.transportRoutes },
    //     { label: "Pickup Points",icon: "fa-solid fa fa-bus", link: routes.transportPickupPoints },
    //     { label: "Vehicle Drivers", icon: "fa-solid fa fa-bus",link: routes.transportVehicleDrivers },
    //     { label: "Vehicle",icon: "fa-solid fa fa-bus", link: routes.transportVehicle },
    //     { label: "Assign Vehicle",icon: "fa-solid fa fa-bus", link: routes.transportAssignVehicle },
    //   ],
    // }, 
  {
    label: "Acedemic",
    submenuOpen: true,
    submenuHdr: "Sales",
    submenu: false,
    showSubRoute: false,
    submenuItems: [
       
      {
        label: "Attendence",
        icon: "ti ti-checklist",
        submenu: true,
        permission: "Attendence",
        showSubRoute: false,
        submenuItems: [
          {
            label: "Student Attendence",
            link: routes.studentAttendence,
            icon: "ti ti-settings",
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Teacher Attendence",
            link: routes.teacherAttendence,
            icon: "ti ti-settings",
            showSubRoute: false,
            submenu: false,
          },
        ],
      },
       
      {
        label: "Meal Menu",
        link: routes.meailMenu,
        icon: "fas fa-utensils",
        showSubRoute: false,
        submenu: false,
        permission: "Meal",
      },
      {
        label: "Communication",
        link: routes.setting,
        icon: "ti ti-message-circle",
        submenu: true,
        permission:"Communication",
        showSubRoute: false,
        submenuItems: [
          {
            label: "Notices",
            link: routes.notes,
            icon: "ti ti-settings",
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Image Gallery",
            link: routes.imageGallery,
            icon: "ti ti-settings",
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Video Gallery",
            link: routes.videoGallery,
            icon: "ti ti-settings",
            showSubRoute: false,
            submenu: false,
          },
        ],
      },
     
      {
        label: "Live Cctv",
        link: routes.liveCctv,
        icon: "ti ti-video",
        submenu: true,
        permission: "Live Cctv",
        showSubRoute: false,
        submenuItems: [
          {
            label: "ChannelList",
            link: routes.channelList,    
            icon: "ti ti-camera",
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Live Cctv",
            link: routes.liveCctv,
            icon: "ti ti-video",
            showSubRoute: false,
            submenu: false,
          },
        ],
      },
    
    ],
  },
  {
    label: "Management",
    submenuOpen: true,
    submenuHdr: "Sales",
    submenu: false,
    showSubRoute: false,
    submenuItems: [
      {
        label: "Subscription Plans",
        link: routes.subscription,
        icon: "fa-solid fa-money-check",
        showSubRoute: false,
        submenu: false,
        permission: "SubscriptionPlans",
      },
    
      {
        label: "Business",
        icon: "ti ti-user-circle",
        submenu: true,
        showSubRoute: false,
        submenuItems: [
          {
            label: "Expense",
            link: routes.noticeBoardTwo,
            icon: "ti ti-settings",
            showSubRoute: false,
            submenu: false,
          },
        ],
      },
    ],
  },
  // {
  //   label: "Access Control",
  //   submenuOpen: true,
  //   submenuHdr: "Sales",
  //   submenu: false,
  //   showSubRoute: false,
  //   submenuItems: [
  //     {
  //       label: "Roles & Permission",
  //       link: routes.rolesPermissions,
  //       icon: "ti ti-shield-plus",
  //       permission: "AccessControl",
  //       showSubRoute: false,
  //       submenu: false,
  //     },
  //     {
  //       label: "Invoice",
  //       link: routes.invoice,
  //       permission: "AccessControl",

  //       icon: "ti ti-message-circle",
  //       showSubRoute: false,
  //       submenu: false,
  //     },
  //   ],
  // },
];
