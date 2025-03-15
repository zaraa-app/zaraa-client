import React, { useEffect, useRef } from "react";
import { Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const SCREEN_WIDTH = Dimensions.get("window").width;

const Shimmer = ({ isLoading, className, style }: { isLoading: boolean; className?: string; style?: object }) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current; // Start fully visible

  useEffect(() => {
    // Continuous shimmer animation
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    );

    if (isLoading) {
      shimmerLoop.start();
    } else {
      shimmerLoop.stop();
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // Smooth fade-out
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading]);

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH * 0.75, SCREEN_WIDTH * 0.75], // Ensures continuous coverage
  });

  return (
    <Animated.View
      className={`relative flex-1 overflow-hidden rounded-full ${className}`}
      style={[{ backgroundColor: "#ededed", opacity: fadeAnim }, style]}
    >
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          width: SCREEN_WIDTH * 1.5, // Slightly bigger for smooth effect
          transform: [{ translateX }], // Continuous shimmer
        }}
      >
        <LinearGradient
          colors={["#ededed", "#e1e1e1", "#ededed"]} // Soft shimmer effect
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={{ width: "100%", height: "100%" }}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default Shimmer;
