import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameMonth, isToday } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import normalize from "@/utils/normalize";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getUserDailyActivity } from "@/api/services/userDailyActivity.service";
import FireIcon from "@/assets/icons/fire.svg";

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

      // Detect streaks (3+ consecutive active days)
      const sorted = [...loginDates].map((d) => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
      const streakSet = new Set<string>();
      let tempStreak: string[] = [];

      for (let i = 0; i < sorted.length; i++) {
        tempStreak.push(format(sorted[i], "yyyy-MM-dd"));
        const next = sorted[i + 1];

        if (next) {
          const diff = (next.getTime() - sorted[i].getTime()) / (1000 * 3600 * 24);
          if (diff !== 1) {
            if (tempStreak.length >= 3) {
              tempStreak.forEach((d) => streakSet.add(d));
            }
            tempStreak = [];
          }
        } else if (tempStreak.length >= 3) {
          tempStreak.forEach((d) => streakSet.add(d));
        }
      }

      setStreakDates(streakSet);
    })();
  }, [user]);

  const allDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const firstDayOfWeek = (getDay(startOfMonth(currentDate)) + 6) % 7;
  const paddedDays: (Date | null)[] = [...Array(firstDayOfWeek).fill(null), ...allDays];
  while (paddedDays.length % 7 !== 0) {
    paddedDays.push(null);
  }

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < paddedDays.length; i += 7) {
    weeks.push(paddedDays.slice(i, i + 7));
  }

  return (
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

      {/* Weekdays */}
      <View className="mb-2 flex-row justify-between px-1">
        {Weekdays.map((day) => (
          <Text key={day} className="w-8 text-center text-[10px] font-medium text-gray-500">
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      {weeks.map((week, rowIndex) => (
        <View key={rowIndex} className="mb-2 flex-row justify-between">
          {week.map((day, colIndex) => {
            if (!day) return <View key={colIndex} className="h-8 w-8" />;

            const key = format(day, "yyyy-MM-dd");
            const isActive = activeDates.has(key);
            const isStreak = streakDates.has(key);
            const today = isToday(day);
            const muted = !isSameMonth(day, currentDate);

            return (
              <View key={colIndex} className="h-8 w-8 items-center justify-center">
                {today && isActive ?
                  <View className="h-6 w-6 rounded-full bg-green-500" />
                : isStreak ?
                  <View className="h-6 w-6 items-center justify-center rounded-full bg-neutral-1000">
                    <FireIcon width={12} height={12} />
                  </View>
                : isActive ?
                  <View className="h-6 w-6 rounded-full bg-neutral-1000" />
                : <View className="h-6 w-6 rounded-full bg-gray-300 opacity-50" />}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default StreakCalendar;
