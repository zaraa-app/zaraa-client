import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday, isSameMonth, addDays } from "date-fns";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import normalize from "@/utils/normalize";
import FireIcon from "@/assets/icons/fire.svg";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getUserDailyActivity } from "@/api/services/userDailyActivity.service";
import { selectionAsync } from "expo-haptics";

const Weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const StreakCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeDates, setActiveDates] = useState<Set<string>>(new Set());
  const [streakDates, setStreakDates] = useState<Set<string>>(new Set());
  const { user } = useGlobalContext();

  useEffect(() => {
    if (!user) return;
    (async () => {
      const res = await getUserDailyActivity(user.$id);
      if (!res) return;

      const loginDates = res.filter((r) => r.wasActive).map((r) => format(new Date(r.activityDate), "yyyy-MM-dd"));

      setActiveDates(new Set(loginDates));

      const sorted = loginDates.map((d) => new Date(d)).sort((a, b) => a.getTime() - b.getTime());

      const streakSet = new Set<string>();
      let temp: string[] = [];

      for (let i = 0; i < sorted.length; i++) {
        const cur = sorted[i];
        const next = sorted[i + 1];
        const key = format(cur, "yyyy-MM-dd");

        temp.push(key);

        const isConsecutive = next && (next.getTime() - cur.getTime()) / (1000 * 3600 * 24) === 1;
        if (!isConsecutive) {
          if (temp.length >= 3) {
            temp.forEach((d) => streakSet.add(d));
          }
          temp = [];
        }
      }

      setStreakDates(streakSet);
    })();
  }, [user]);

  const onSwipe = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.END) {
      const { translationX } = nativeEvent;
      if (translationX > 50) {
        selectionAsync();
        setCurrentDate((prev) => subMonths(prev, 1));
      } else if (translationX < -50) {
        selectionAsync();
        setCurrentDate((prev) => addMonths(prev, 1));
      }
    }
  };

  const { weeks } = useMemo(() => {
    const allDays = eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    });

    const firstDayOfWeek = (getDay(startOfMonth(currentDate)) + 6) % 7;
    const paddedDays: (Date | null)[] = [...Array(firstDayOfWeek).fill(null), ...allDays];
    while (paddedDays.length % 7 !== 0) paddedDays.push(null);

    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < paddedDays.length; i += 7) {
      weeks.push(paddedDays.slice(i, i + 7));
    }

    return { weeks };
  }, [currentDate]);

  return (
    <PanGestureHandler onHandlerStateChange={onSwipe}>
      <View className="mt-8 w-full">
        {/* Navigation */}
        <View className="mb-4 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => setCurrentDate((prev) => subMonths(prev, 1))}>
            <Ionicons name="chevron-back" size={normalize(16)} className="text-xl font-bold" />
          </TouchableOpacity>
          <Text className="text-base font-bold">{format(currentDate, "MMMM yyyy").toUpperCase()}</Text>
          <TouchableOpacity onPress={() => setCurrentDate((prev) => addMonths(prev, 1))}>
            <Ionicons name="chevron-forward" size={normalize(16)} className="text-xl font-bold" />
          </TouchableOpacity>
        </View>

        {/* Weekday Headers */}
        <View className="mb-2 flex-1 flex-row">
          {Weekdays.map((day, i) => (
            <View
              key={i}
              style={{
                width: `${100 / 7}%`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text className="text-[10px] font-medium text-gray-500">{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        {weeks.map((week, rowIndex) => (
          <View key={rowIndex} className="mb-2 flex-row flex-wrap">
            {week.map((day, colIndex) => {
              if (!day) {
                return (
                  <View
                    key={colIndex}
                    style={{
                      width: `${100 / 7}%`,
                      backgroundColor: "transparent",
                    }}
                  />
                );
              }

              const key = format(day, "yyyy-MM-dd");
              const isActive = activeDates.has(key);
              const isStreak = streakDates.has(key);
              const today = isToday(day);

              const prevKey = format(addDays(day, -1), "yyyy-MM-dd");
              const nextKey = format(addDays(day, 1), "yyyy-MM-dd");

              const isStart = isStreak && (!streakDates.has(prevKey) || colIndex === 0);
              const isEnd = isStreak && (!streakDates.has(nextKey) || colIndex === 6);

              const bgColor = isStreak ? "#999999" : "transparent";
              const borderRadiusStyle = {
                borderTopLeftRadius: isStart ? 20 : 0,
                borderBottomLeftRadius: isStart ? 20 : 0,
                borderTopRightRadius: isEnd ? 20 : 0,
                borderBottomRightRadius: isEnd ? 20 : 0,
              };

              return (
                <View
                  key={colIndex}
                  style={{
                    width: `${100 / 7}%`,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: 1,
                    paddingBottom: 1,
                    backgroundColor: bgColor,
                    ...borderRadiusStyle,
                  }}
                >
                  {isStreak ?
                    <View className="h-6 w-6 items-center justify-center rounded-full bg-neutral-1000">
                      <FireIcon width={12} height={12} />
                    </View>
                  : today && isActive ?
                    <View className="h-6 w-6 rounded-full bg-primary-300" />
                  : isActive ?
                    <View className="h-6 w-6 rounded-full bg-neutral-1000" />
                  : <View className="h-6 w-6 rounded-full bg-gray-300 opacity-50" />}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </PanGestureHandler>
  );
};

export default StreakCalendar;
