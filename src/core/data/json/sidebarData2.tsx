import { all_routes } from "../../../feature-module/router/all_routes";
const routes = all_routes;

export const SidebarData2 = [
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
        label: "Users",
        link: routes.setting,
        icon: "ti ti-user",
        submenu: true,
        showSubRoute: false,
        permission: "Users",
        submenuItems: [
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
          {
            label: "Students",
            icon: "ti ti-settings",
            submenu: true,
            showSubRoute: false,
            submenuItems: [
              {
                label: "All Students",
                link: routes.allStudens,
                icon: "ti ti-settings",
                showSubRoute: false,
                submenu: false,
              },
              {
                label: "Add Students",
                link: routes.addStudents,
                icon: "ti ti-settings",
                showSubRoute: false,
                submenu: false,
              },
            ],
          },
          {
            label: "Teachers",
            icon: "ti ti-settings",
            submenu: true,
            showSubRoute: false,
            submenuItems: [
              {
                label: "All Teachers",
                link: routes.allTeacher,
                icon: "ti ti-settings",
                showSubRoute: false,
                submenu: false,
              },
              {
                label: "Add Teachers",
                link: routes.addTeacher,
                icon: "ti ti-settings",
                showSubRoute: false,
                submenu: false,
              },
            ],
          },
        ],
      },
    ],
  },
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
      {
        label: "Daily Records",
        link: routes.setting,
        icon: "ti ti-calendar",
        submenu: true,
        permission: "Records",
        showSubRoute: false,
        submenuItems: [
          {
            label: "Record Templates",
            link: routes.recordTemplate,
            icon: "ti ti-settings",
            showSubRoute: false,
            permission: "Records",

            submenu: false,
          },
          {
            label: "Send Record",
            link: routes.sendRecord,
            permission: "Records",

            icon: "ti ti-settings",
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
        label: "Fee Collection",
        link: routes.setting,
        icon: "fas fa-wallet",
        submenu: true,
        permission: "SubscriptionPlans",
        showSubRoute: false,
        submenuItems: [
          {
            label: "Fee Setup",
            link: routes.feeSetup,
            icon: "ti ti-settings",
            showSubRoute: false,
            permission: "SubscriptionPlans",
            submenu: false,
          },
        ],
      },
      {
        label: "Business",
        icon: "ti ti-user-circle",
        submenu: true,
        permission: "SubscriptionPlans",
        showSubRoute: false,
        submenuItems: [
          {
            label: "Expense",
            permission: "SubscriptionPlans",
            link: routes.noticeBoardTwo,
            icon: "ti ti-settings",
            showSubRoute: false,
            submenu: false,
          },
        ],
      },
    ],
  },
  
];
