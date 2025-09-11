import CustomButton from "@/components/CustomButton";
import CustomText from "@/components/CustomText";
import Page from "@/components/Page";
import { router } from "expo-router";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
export default function Index() {
  const {colors} = useTheme();
  return (
    <Page>
      <CustomText bold fontSize="3xl">Welcome to Kram</CustomText>
      <CustomText>Your campus study network.</CustomText>
      <View style={{width: "100%", marginTop: 15, gap: 10}}>
        <CustomButton  variant="contained" onPress={() => router.push("/(auth)/SignIn")}>Sign In</CustomButton>
        <CustomButton variant="outlined" onPress={() => router.push("/(auth)/SignUp")  }>New User? Sign Up</CustomButton>
      </View>
    </Page>
  );
}

