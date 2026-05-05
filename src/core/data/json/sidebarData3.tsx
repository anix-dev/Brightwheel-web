import { all_routes } from "../../../feature-module/router/all_routes";
const routes = all_routes;

export const SidebarData3 = [
 
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
        label: "Assignments",
        link: routes.Assignment,
        icon: "fas fa-file-alt",
        showSubRoute: false,
        submenu: false,
        permission: "Meal",
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
        label: "Wish",
        link: routes.setting,
        icon: "ti ti-message-circle",
        submenu: true,
        permission:"Wish",
        showSubRoute: false,
        submenuItems: [
          {
            label: "Wishes",
            link: routes.wish,
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
  }
];
