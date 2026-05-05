import { configureStore } from "@reduxjs/toolkit";
import themeSettingSlice from "./themeSettingSlice";
import sidebarSlice from "./sidebarSlice";
import userSlice from "./userSlice";

const store = configureStore({
  reducer: {
    themeSetting: themeSettingSlice,
    sidebarSlice: sidebarSlice,
    user: userSlice,
  },
});

export default store;
