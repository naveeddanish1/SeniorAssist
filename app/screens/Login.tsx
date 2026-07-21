import { StyleSheet, Text, View } from "react-native";

export default function Login() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Text>Welcome back to SeniorAssist</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
});
