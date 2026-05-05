import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Scrollbars from "react-custom-scrollbars-2";
import { SidebarData } from "../../data/json/sidebarData";
import { SidebarData2 } from "../../data/json/sidebarData2";
import { SidebarData3 } from "../../data/json/sidebarData3";
import ImageWithBasePath from "../imageWithBasePath";
import "../../../style/icon/tabler-icons/webfont/tabler-icons.css";
import { setExpandMenu } from "../../data/redux/sidebarSlice";
import { useDispatch } from "react-redux";
import api from "../../../core/data/api";
import {
  resetAllMode,
  setDataLayout,
} from "../../data/redux/themeSettingSlice";
import usePreviousRoute from "./usePreviousRoute";

const Sidebar = () => {
  const Location = useLocation();
  const [permissions, setPermissions] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [subOpen, setSubopen] = useState<any>("");
  const [subsidebar, setSubsidebar] = useState("");
  const userId = localStorage.getItem("Role");
  const selectedSidebarData = userId === "1" ? SidebarData :(userId == "2")?  SidebarData2 :SidebarData3;


  const toggleSidebar = (title: any) => {
    localStorage.setItem("menuOpened", title);
    if (title === subOpen) {
      setSubopen("");
    } else {
      setSubopen(title);
    }
  };

  const toggleSubsidebar = (subitem: any) => {
    if (subitem === subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };

  const handleLayoutChange = (layout: string) => {
    dispatch(setDataLayout(layout));
  };

  const handleClick = (label: any, themeSetting: any, layout: any) => {
    toggleSidebar(label);
    if (themeSetting) {
      handleLayoutChange(layout);
    }
  };

  const getLayoutClass = (label: any) => {
    switch (label) {
      case "Default":
        return "default_layout";
      case "Mini":
        return "mini_layout";
      case "Box":
        return "boxed_layout";
      case "Dark":
        return "dark_data_theme";
      case "RTL":
        return "rtl";
      default:
        return "";
    }
  };
  const location = useLocation();
  const dispatch = useDispatch();
  const previousLocation = usePreviousRoute();
  useEffect(() => {
    const layoutPages = [
      "/layout-dark",
      "/layout-rtl",
      "/layout-mini",
      "/layout-box",
      "/layout-default",
    ];

    const isCurrentLayoutPage = layoutPages.some((path) =>
      location.pathname.includes(path)
    );
    const isPreviousLayoutPage =
      previousLocation &&
      layoutPages.some((path) => previousLocation.pathname.includes(path));

    if (isPreviousLayoutPage && !isCurrentLayoutPage) {
      dispatch(resetAllMode());
    }
  }, [location, previousLocation, dispatch]);

  useEffect(() => {
    setSubopen(localStorage.getItem("menuOpened"));
    const submenus = document.querySelectorAll(".submenu");
    submenus.forEach((submenu) => {
      const listItems = submenu.querySelectorAll("li");
      submenu.classList.remove("active");
      listItems.forEach((item) => {
        if (item.classList.contains("active")) {
          submenu.classList.add("active");
          return;
        }
      });
    });
  }, [Location.pathname]);

  const onMouseEnter = () => {
    dispatch(setExpandMenu(true));
  };
  const onMouseLeave = () => {
    dispatch(setExpandMenu(false));
  };

  const filterMenuItems = (items: any[]) => {
    return items.filter((item) => {
      if (item.submenuItems && Array.isArray(item.submenuItems)) {
        item.submenuItems = filterMenuItems(item.submenuItems);
      }

      const permissionKey = item.permission;
      if (!permissionKey) return true;

      const hasPermission =
        permissions[permissionKey]?.allowAll === true ||
        permissions[permissionKey]?.view === true || permissions[permissionKey]?.create === true||
         permissions[permissionKey]?.delete === true||  permissions[permissionKey]?.edit === true;
      return (
        hasPermission && (!item.submenuItems || item.submenuItems.length > 0)
      );
    });
  };

  return (
    <>
      <div
        className="sidebar"
        id="sidebar"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Scrollbars>
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                <li>
                  <Link
                    to="#"
                    className="d-flex align-items-center border bg-white rounded p-2 mb-4"
                  >
                    <ImageWithBasePath
                      src="assets/images/logo3.png"
                      className="avatar avatar-md img-fluid rounded"
                      alt="Profile"
                    />
                    <span className="text-dark ms-2 fw-normal">
                      Ikidz Super
                    </span>
                  </Link>
                </li>
              </ul>
              <ul>
                {selectedSidebarData?.map((mainLabel, index) => {
                  // let filteredSubmenuItems =[];
                  // if(userId === "2" ||userId ==="3" ){
                  //    filteredSubmenuItems = filterMenuItems(
                  //   mainLabel.submenuItems || []
                  // )}else{
                  //   filteredSubmenuItems= mainLabel.submenuItems;
                  // }
                  // if (filteredSubmenuItems.length === 0) return null;
                  return (
                    <li key={index}>
                      <h6 className="submenu-hdr">
                        <span>{mainLabel?.label}</span>
                      </h6>
                      <ul>
                        {mainLabel.submenuItems?.map((title: any, i: any) => {
                          let link_array: any = [];
                          if ("submenuItems" in title) {
                            title.submenuItems?.forEach((link: any) => {
                              link_array.push(link?.link);
                              if (link?.submenu && "submenuItems" in link) {
                                link.submenuItems?.forEach((item: any) => {
                                  link_array.push(item?.link);
                                });
                              }
                            });
                          }
                          title.links = link_array;

                          return (
                            <li className="submenu" key={title.label}>
                              <Link
                                to={title?.submenu ? "#" : title?.link}
                                onClick={() =>
                                  handleClick(
                                    title?.label,
                                    title?.themeSetting,
                                    getLayoutClass(title?.label)
                                  )
                                }
                                className={`${
                                  subOpen === title?.label ? "subdrop" : ""
                                } ${
                                  title?.links?.includes(Location.pathname)
                                    ? "active"
                                    : ""
                                } ${
                                  title?.submenuItems
                                    ?.map((link: any) => link?.link)
                                    .includes(Location.pathname) ||
                                  title?.link === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink1 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink2 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink3 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink4 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink5 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink6 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink7 === Location.pathname
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <i className={title.icon}></i>
                                <span>{title?.label}</span>
                                <span className="badge badge-primary badge-xs text-white fs-10 ms-auto">
                                  {title?.version}
                                </span>
                                <span
                                  className={title?.submenu ? "menu-arrow" : ""}
                                />
                              </Link>
                              {title?.submenu !== false &&
                                subOpen === title?.label && (
                                  <ul
                                    style={{
                                      display:
                                        subOpen === title?.label
                                          ? "block"
                                          : "none",
                                    }}
                                  >
                                    {title?.submenuItems?.map((item: any) => (
                                      <li
                                        className={
                                          item?.submenuItems
                                            ? "submenu submenu-two "
                                            : ""
                                        }
                                        key={item.label}
                                      >
                                        <Link
                                          to={item?.link}
                                          className={`${
                                            item?.submenuItems
                                              ?.map((link: any) => link?.link)
                                              .includes(Location.pathname) ||
                                            item?.link === Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink1 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink2 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink3 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink4 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink5 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink6 ===
                                                  Location.pathname
                                              ? "active"
                                              : ""
                                          } ${
                                            subsidebar === item?.label
                                              ? "subdrop"
                                              : ""
                                          }  `}
                                          onClick={() => {
                                            toggleSubsidebar(item?.label);
                                          }}
                                        >
                                          {item?.label}
                                          <span
                                            className={
                                              item?.submenu ? "menu-arrow" : ""
                                            }
                                          />
                                        </Link>
                                        {item?.submenuItems ? (
                                          <ul
                                            style={{
                                              display:
                                                subsidebar === item?.label
                                                  ? "block"
                                                  : "none",
                                            }}
                                          >
                                            {item?.submenuItems?.map(
                                              (items: any) => (
                                                <li key={items.label}>
                                                  <Link
                                                    to={items?.link}
                                                    className={`${
                                                      subsidebar ===
                                                      items?.label
                                                        ? "submenu-two subdrop"
                                                        : "submenu-two"
                                                    } ${
                                                      items?.submenuItems
                                                        ?.map(
                                                          (link: any) =>
                                                            link.link
                                                        )
                                                        .includes(
                                                          Location.pathname
                                                        ) ||
                                                      items?.link ===
                                                        Location.pathname
                                                        ? "active"
                                                        : ""
                                                    }`}
                                                  >
                                                    {items?.label}
                                                  </Link>
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        ) : (
                                          <></>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Scrollbars>
      </div>
    </>
  );
};

export default Sidebar;
