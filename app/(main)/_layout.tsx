import { Tabs } from "expo-router";

export default function MainLayout(){
    return(
        <Tabs screenOptions={{headerShown:false}}>
            <Tabs.Screen options={{title:"Home"}} name="index" />
            <Tabs.Screen options={{title:"Find"}} name="find" />
            <Tabs.Screen options={{title:"Groups"}} name = "groups"/>
            <Tabs.Screen options={{title:"Profile"}} name = "profile"/>
            <Tabs.Screen options={{title:"Message"}} name = "message"/>
        </Tabs>
    )
}