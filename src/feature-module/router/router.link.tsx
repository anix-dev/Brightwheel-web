import { Route } from "react-router";
import { all_routes } from "./all_routes";
import ComingSoon from "../pages/comingSoon";
import Login from "../auth/login/login";
import Register from "../auth/register/register";
import TwoStepVerification from "../auth/twoStepVerification/twoStepVerification";
import ResetPassword from "../auth/resetPassword/resetPassword";
import ForgotPassword from "../auth/forgotPassword/forgotPassword";
import Error404 from "../pages/error/error-404";
import Error500 from "../pages/error/error-500";
import AdminDashboard from "../mainMenu/adminDashboard";
import Assignment from "../../pages/Assignment";
import AddAssignment from "../../pages/Assignment/AddAssignment";
import ViewAssignment from "../../pages/Assignment/ViewAssignment";
import ResetPasswordSuccess from "../auth/resetPasswordSuccess/resetPasswordSuccess";
import TransportRoutes from "../../pages/transport/transportRoutes";
import TransportPickupPoints from "../../pages/transport/transportPickupPoints";
import TransportVehicleDrivers from "../../pages/transport/transportVehicleDrivers";
import TransportVehicle from "../../pages/transport/transportVehicle";
import TransportAssignVehicle from "../../pages/transport/transportAssignVehicle";
import NoticeBoard from "../announcements/notice-board";
import LockScreen from "../auth/lockScreen";
import Busniess from "../../../src/pages/business/business";
import Setting from "../announcements/setting";
import Search from "../../pages/Search/Search";
import SearchPage from "../../pages/Search/Search";
import NotificationScreen from "../../pages/NotificationScreen/NotificationScreen";
import Attendence from "../../pages/Attendence/studentAttendence";
import MealMenu from "../../pages/MealMenu/mealMenu";
import Wish from "../../pages/Wish/wish";
import Invoice from "../../pages/Invoice/invoice";
import LiveCctv from "../../pages/LiveCctv/liveCctv";
import StudentAttendence from "../../pages/Attendence/studentAttendence";
import Center from "../../pages/Center/center";
import AddCctv from "../../pages/LiveCctv/addCctv";
import TeacherAttendence from "../../pages/Attendence/teacherAttendence";
import Notices from "../../pages/Communication/notices";
import ImageGallery from "../../pages/Communication/imageGallery";
import VideoGallery from "../../pages/Communication/videoGallery";
import DirectMessage from "../../pages/Communication/directMessage";
import CenterAdd from "../../pages/Center/CenterAdd";
import AddStudents from "../../pages/Users/addStudents";
import AddTeacher from "../../pages/Users/addTeacher";
import AddClass from "../../pages/Users/addClass";
import EditClass from "../../pages/Users/editClass";

import Leads from "../../pages/Leads/leads";
import AllStudens from "../../pages/Users/allStudens";
import AllTeacher from "../../pages/Users/allTeacher";
import RecordTemplate from "../../pages/DailyRecords/recordTemplate";
import SendReport from "../../pages/DailyRecords/sendRecord";
import FeeFunds from "../../pages/FeesCollection/feeFunds";
import ChannelList from "../../pages/LiveCctv/channelList";
import FeeSetup from "../../pages/FeesCollection/feeSetup";
import AllClass from "../../pages/Users/allClass";
import Expenseadd from "../../pages/business/expenseadd";
import Subscription from "../../pages/Subscription/subscription";
import SubscriptionAdd from "../../pages/Subscription/SubscriptionAdd";
import SubscriptionEdit from "../../pages/Subscription/SubscriptionEdit";
import Profile from "../pages/profile";
import TeacherDashboard from "../mainMenu/adminDashboard/teacherDashboard";
import AddFee from "../../pages/FeesCollection/AddFee";
import RolesPermissions from "../../pages/Access-control/rolesPermissions";
import Permission from "../../pages/Access-control/permission";
import StudentDetail from "../../pages/Attendence/studentDetails";
import TeacherDetail from '../../pages/Attendence/teacherDetails';
import EditCctv from "../../pages/LiveCctv/editCctv";
import AdminLogin from "../auth/login/AdminLogin";
import TeacherLogin from "../auth/login/TeacherLogin";
import AddWish from "../../pages/Wish/AddWish";
const routes = all_routes;

export const publicRoutes = [
  {
    path: routes.noticeBoard + "/:id",
    element: <NoticeBoard />,
  },
  {
    path: routes.noticeBoardTwo,
    element: <Busniess />,
  },
  {
    path: routes.adminDashboard,
    element: <AdminDashboard />,
    route: Route,
    permission: "Dashboard" 
  },
  {
    path: routes.TeacherDashboard,
    element: <TeacherDashboard />,
    route: Route,
    permission: "Dashboard" 
  },
  {
    path: routes.setting,
    element: <Setting />,
    route: Route,
  },
  {
    path: routes.studentAttendence,
    element: <StudentAttendence/>,
    route: Route,
    permission: "Attendence" 
  },
  {
    path: routes.meailMenu,
    element: <MealMenu/>,
    route: Route,
    permission: "Meal" 
  },
    {
    path: routes.meailMenu,
    element: <MealMenu/>,
    route: Route,
    permission: "Meal" 
  },
  {
    path: routes.rolesPermissions,
    element: <RolesPermissions/>,
    route: Route,
    permission: "AccessControl" 
  },
  {
    path:routes.addCctv,
    element:<AddCctv/>,
    route:Route,
    permission: "Live Cctv" 
  },
  {
    path:routes.channelList,
    element:<ChannelList/>,
    rout:Route,
    permission: "Live Cctv" 
  },{
    path:routes.editChannel,
    element:<EditCctv/>,
    rout:Route,
    permission: "Live Cctv" 
  },
  {
    path:routes.StudentDetail,
    element:<StudentDetail/>,
    rout:Route,
    permission: "Users" 
  },
    {
    path:routes.Assignment,
    element:<Assignment/>,
    rout:Route,
    permission: "Assignment" 
  },
   {
    path:routes.addSubjects,
    element:<AddAssignment/>,
    rout:Route,
    permission: "Assignment" 
  },
    {
    path:routes.viewSubjects,
    element:<ViewAssignment/>,
    rout:Route,
    permission: "Assignment" 
  },
    {
    path:routes.TeacherDetail,
    element:<TeacherDetail/>,
    rout:Route,
    permission: "Users" 
  },
  {
    path: routes.permissions,
    element: <Permission/>,
    route: Route,
    permission: "AccessControl" 
  },
  {
    path: routes.invoice,
    element: <Invoice/>,
    route: Route,
    permission: "AccessControl" 
  },
  {
    path: routes.liveCctv,
    element: <LiveCctv/>,
    route: Route,
    permission: "Dashboard" 
  },
  {
    path: routes.center,
    element: <Center/>,
    route: Route,
    permission: "Centers" 
  },
  {
    path: routes.CenterAdd,
    element: <CenterAdd/>,
    route: Route,
    permission: "Centers" 
  },
  {
    path: routes.subscription,
    element: <Subscription/>,
    route: Route,
    permission: "SubscriptionPlans" 
  },
  {
    path: routes.addSubscription,
    element: <SubscriptionAdd/>,
    route: Route,
    permission: "SubscriptionPlans" 
  },
  {
    path: routes.editSubscription,
    element: <SubscriptionEdit/>,
    route: Route,
    permission: "SubscriptionPlans" 
  },
   {
    path: routes.addStudents,
    element: <AddStudents/>,
    route: Route,
    permission: "Users" 
  },
   {
    path: routes.profile,
    element: <Profile/>,
    route: Route,
    permission: "Users" 
  },
  {
    path: routes.addTeacher,
    element: <AddTeacher/>,
    route: Route,
    permission: "Users" 
  },
  {
    path: routes.addClass,
    element: <AddClass/>,
    route: Route,
    permission: "Centers" 
  },
    {
    path: routes.editClass,
    element: <EditClass/>,
    route: Route,
    permission: "Centers" 
  },
  {
    path: routes.allClass,
    element: <AllClass/>,
    route: Route,
    permission: "Centers" 
  },
  {
    path: routes.allStudens,
    element: <AllStudens/>,
    route: Route,
    permission: "Users" 
  },
  {
    path: routes.allTeacher,
    element: <AllTeacher/>,
    route: Route,
    permission: "Users" 
  },
  {
    path: routes.recordTemplate,
    element: <RecordTemplate/>,
    route: Route,
     permission: "Records"
  },
  {
    path: routes.sendRecord,
    element: <SendReport/>,
    route: Route,
     permission: "Records"
  },
  {
    path: routes.feeFunds,
    element: <FeeFunds/>,
    route: Route,
     permission: "SubscriptionPlans"
  },
  {
    path: routes.transportRoutes,
    element: <TransportRoutes />,
  },
  {
    path: routes.transportAssignVehicle,
    element: <TransportAssignVehicle />,
  },
  {
    path: routes.transportPickupPoints,
    element: <TransportPickupPoints />,
  },
  {
    path: routes.transportVehicleDrivers,
    element: <TransportVehicleDrivers />,
  },
  {
    path: routes.transportVehicle,
    element: <TransportVehicle />,
  },
  {
    path: routes.feePayment,
    element: <AddFee/>,
    route: Route,
     permission: "SubscriptionPlans"
  },
  {
    path: routes.feeSetup,
    element: <FeeSetup/>,
    route: Route,
     permission: "SubscriptionPlans"
  },
  {
    path: routes.leads,
    element: <Leads/>,
    route: Route,
     permission: "Users"
  },
  {
    path: routes.expense,
    element: <Expenseadd/>,
    route: Route,
     permission: "SubscriptionPlans"
  },
  {
    path: routes.teacherAttendence,
    element: <TeacherAttendence/>,
    route: Route,
    permission: "Dashboard" 
  },
  {
    path: routes.notes,
    element: <Notices/>,
    route: Route,
    permission: "Communication" 
  },
    {
    path: routes.wish,
    element: <Wish/>,
    route: Route,
    permission: "Wish" 
  },
  {
    path: routes.wishAdd,
    element: <AddWish/>,
    route: Route,
    permission: "Wish" 
  },
  {
    path: routes.imageGallery,
    element: <ImageGallery/>,
    route: Route,
    permission: "Communication" 
  },
  {
    path: routes.videoGallery,
    element: <VideoGallery/>,
    route: Route,
    permission: "Communication" 
  },
  {
    path: routes.directMessage,
    element: <DirectMessage/>,
    route: Route,

  },
];

export const PrivateRoutes=[
    {
    path: routes.schoolLogin,
    element: <AdminLogin />,
    route: Route,

    },
     {
    path: routes.teacherLogin,
    element: <TeacherLogin />,
    route: Route,

    },
]
export const authRoutes = [
  {
    path: routes.comingSoon,
    element: <ComingSoon />,
    route: Route,
  },
  {
    path: routes.login,
    element: <Login />,
    route: Route,
  },

  {
    path: routes.register,
    element: <Register />,
    route: Route,
  },
  {
    path: routes.twoStepVerification,
    element: <TwoStepVerification />,
    route: Route,
  },

  {
    path: routes.register,
    element: <Register />,
    route: Route,
  },

  {
    path: routes.resetPassword,
    element: <ResetPassword />,
    route: Route,
  },
  {
    path: routes.search,
    element: <SearchPage />,
    route: Route,
  },
  {
    path: routes.notificationScreen,
    element: <NotificationScreen />,
    route: Route,
  },

  {
    path: routes.forgotPassword,
    element: <ForgotPassword />,
    route: Route,
  },

  {
    path: routes.error404,
    element: <Error404 />,
    route: Route,
  },
  {
    path: routes.error500,
    element: <Error500 />,
    route: Route,
  },

  {
    path: routes.lockScreen,
    element: <LockScreen />,
  },
  {
    path: routes.resetPasswordSuccess,
    element: <ResetPasswordSuccess />,
  }
];
