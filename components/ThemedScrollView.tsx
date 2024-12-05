import { ScrollView, type ScrollViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const ThemedScrollView = ({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) => {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  return <ScrollView style={[{ backgroundColor }, style]} {...otherProps} />;
};

export default ThemedScrollView;