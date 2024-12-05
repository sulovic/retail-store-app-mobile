import { ActivityIndicator, StyleSheet, View } from "react-native";

const Loader: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (!loading) return null; // Do not render if not loading
  return (
    <View style={styles.overlay}>
      <ActivityIndicator style={styles.activityIndicator} animating={loading} size="large" color="#00ff00" />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  activityIndicator: {
    transform: [{ scale: 3 }],
  },
});

export default Loader;
