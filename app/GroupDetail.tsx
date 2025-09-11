import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function GroupDetail() {
  const { groupId } = useLocalSearchParams();
  
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Group Detail for ID: {groupId}</Text>
      {/* Add your group detail content here */}
    </View>
  );
}
