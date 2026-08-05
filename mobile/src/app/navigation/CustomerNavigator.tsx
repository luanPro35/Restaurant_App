import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../features/home/screens/HomeScreen";
import DeliveryScreen from "../../features/delivery/screens/DeliveryScreen";
import AtRestaurant from "../../features/at_restaurant/screens/AtRestaurant";
import MenuScreen from "../../features/menu/screens/MenuScreen";
import BestSellerScreen from "../../features/sell_well/screens/BestSellerScreen";
import PromotionScreen from "../../features/promotion/screens/PromotionScreen";
import HistoryScreen from "../../features/history/screens/HistoryScreen";
import PackageScreen from "../../features/package/screens/PackageScreen";
import MessagesScreen from "../../features/messages/screens/MessagesScreen";
import ProfileScreen from "../../features/profile/screens/ProfileScreen";
import ChangeProfileScreen from "../../features/profile/components/ChangeProfile";
import DetailProduct from "../../features/menu/screens/DetailProduct";
import { AdminUser } from "../../features/admin/types/admin-user.types";
import FormAddress from "../../features/delivery/Header/FormAddress";
import AddAdress from "../../features/delivery/Header/AddAdress";
import GamePromotion from "../../features/profile/games/GamePromotion";
import ChatScreen from "../../features/chat/screens/ChatScreen";
import QRScannerScreen from "../../features/at_restaurant/screens/QRScannerScreen";
import VietQrScreen from "../../features/vietQr/screen/vietQr";
import PaymentSuccessful from "../../features/vietQr/screen/PaymentSuccessful";
import AiChatScreen from "../../features/AI/Screens/AiChatScreen";
import UploadImagePayment from "../../features/vietQr/screen/UploadImagePayment";
import UploadComment from "../../features/comment/screen/UploadComment";
import SeeImage from "../../features/comment/screen/SeeImage";
import SeeYourImage from "../../features/comment/screen/SeeYourImage";
import EditCommentScreen from "../../features/comment/screen/EditCommentScreen";
import WatchImage from "../../features/comment/screen/WatchImage";
import MealFoodScreen from "../../features/meal_food/screens/MealFoodScreen";
import AI_FoodScreen from "../../features/ai_food_recognition/AI_FoodScreen";

export type CustomerStackParamList = {
  Home: undefined;
  AtRestaurant: {
    scannedTableId?: string;
    scannedTableName?: string;
    initialTab?: "tables" | "order" | "menu"
  } | undefined;
  Delivery: undefined;
  Menu: undefined;
  BestSeller: undefined;
  Promotion: undefined;
  History: undefined;
  Package: undefined;
  Messages: undefined;
  Profile: undefined;
  ChangeProfile: { item?: AdminUser | null };
  DetailProduct: { id: string };
  FormAddress: undefined;
  AddAdress: undefined;
  GamePromotion: undefined;
  Chat: undefined;
  QRScanner: undefined;
  VietQr: { packageId?: string, orderId?: string };
  PaymentSuccessful: undefined;
  AI: { product?: string, initialMessage?: string } | undefined;
  UploadImagePayment: { packageId?: string, orderId?: string };
  Comment: undefined;
  SeeImage: { imageUrl?: string };
  SeeYourImage: undefined;
  EditComment: { comment: any };
  WatchImage: { imageUrl: string };
  MealFood: undefined;
  AIFoodRecognition: undefined;
};

const Stack = createNativeStackNavigator<CustomerStackParamList>();

export default function CustomerNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AtRestaurant" component={AtRestaurant} />
      <Stack.Screen name="Delivery" component={DeliveryScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="BestSeller" component={BestSellerScreen} />
      <Stack.Screen name="Promotion" component={PromotionScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Package" component={PackageScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ChangeProfile" component={ChangeProfileScreen} />
      <Stack.Screen name="DetailProduct" component={DetailProduct} />
      <Stack.Screen name="FormAddress" component={FormAddress} />
      <Stack.Screen name="AddAdress" component={AddAdress} />
      <Stack.Screen name="GamePromotion" component={GamePromotion} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="VietQr" component={VietQrScreen} />
      <Stack.Screen name="PaymentSuccessful" component={PaymentSuccessful} />
      <Stack.Screen name="AI" component={AiChatScreen} />
      <Stack.Screen name="UploadImagePayment" component={UploadImagePayment} />
      <Stack.Screen name="Comment" component={UploadComment} />
      <Stack.Screen name="SeeImage" component={SeeImage} />
      <Stack.Screen name="SeeYourImage" component={SeeYourImage} />
      <Stack.Screen name="EditComment" component={EditCommentScreen} />
      <Stack.Screen name="WatchImage" component={WatchImage} />
      <Stack.Screen name="MealFood" component={MealFoodScreen} />
      <Stack.Screen name="AIFoodRecognition" component={AI_FoodScreen} />
    </Stack.Navigator>
  );
}
