import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday, isSameMonth } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import normalize from "@/utils/normalize";
import FireIcon from "@/assets/icons/fire.svg";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getUserDailyActivity } from "@/api/services/userDailyActivity.service";

const Weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const StreakCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeDates, setActiveDates] = useState<Set<string>>(new Set());
  const [streakDates, setStreakDates] = useState<Set<string>>(new Set());
  const [streakGroups, setStreakGroups] = useState<string[][]>([]);
  const { user } = useGlobalContext();

  // ⏳ Load streak and login activity from Appwrite
  useEffect(() => {
    if (!user) return;
    (async () => {
      const res = await getUserDailyActivity(user.$id);
      if (!res) return;

      const loginDates = res.filter((r) => r.wasActive).map((r) => format(new Date(r.activityDate), "yyyy-MM-dd"));

      setActiveDates(new Set(loginDates));

      const sorted = loginDates.map((d) => new Date(d)).sort((a, b) => a.getTime() - b.getTime());

      const streakSet = new Set<string>();
      const streakGroups: string[][] = [];

      let temp: string[] = [];
      for (let i = 0; i < sorted.length; i++) {
        const cur = sorted[i];
        const next = sorted[i + 1];
        const key = format(cur, "yyyy-MM-dd");

        temp.push(key);

        if (!next || (next.getTime() - cur.getTime()) / (1000 * 3600 * 24) !== 1) {
          if (temp.length >= 3) {
            temp.forEach((d) => streakSet.add(d));
            streakGroups.push([...temp]);
          }
          temp = [];
        }
      }

      setStreakDates(streakSet);
      setStreakGroups(streakGroups);
    })();
  }, [user]);

  // 🗓️ Build calendar
  const { weeks, dayMap } = useMemo(() => {
    const allDays = eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    });

    const firstDayOfWeek = (getDay(startOfMonth(currentDate)) + 6) % 7;
    const paddedDays: (Date | null)[] = [...Array(firstDayOfWeek).fill(null), ...allDays];
    while (paddedDays.length % 7 !== 0) paddedDays.push(null);

    const weeks: (Date | null)[][] = [];
    const dayMap: { [key: string]: { row: number; col: number } } = {};

    for (let i = 0; i < paddedDays.length; i += 7) {
      const week = paddedDays.slice(i, i + 7);
      weeks.push(week);

      week.forEach((day, col) => {
        if (day) {
          dayMap[format(day, "yyyy-MM-dd")] = { row: i / 7, col };
        }
      });
    }

    return { weeks, dayMap };
  }, [currentDate]);

  // 📦 Group streaks by row
  const pillsByRow: { [row: number]: { left: number; width: number }[] } = useMemo(() => {
    const map: { [row: number]: { left: number; width: number }[] } = {};

    for (const group of streakGroups) {
      const rowGroups: { [row: number]: number[] } = {};

      for (const day of group) {
        const pos = dayMap[day];
        if (!pos) continue;

        if (!rowGroups[pos.row]) rowGroups[pos.row] = [];
        rowGroups[pos.row].push(pos.col);
      }

      for (const row in rowGroups) {
        const cols = rowGroups[row].sort((a, b) => a - b);
        const left = cols[0];
        const width = cols.length;

        if (!map[+row]) map[+row] = [];
        map[+row].push({ left, width });
      }
    }

    return map;
  }, [streakGroups, dayMap]);

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

      {/* Weekday Headers */}
      <View className="mb-2 flex-row justify-between px-1">
        {Weekdays.map((day) => (
          <Text key={day} className="w-8 text-center text-[10px] font-medium text-gray-500">
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      {weeks.map((week, rowIndex) => (
        <View key={rowIndex} className="mb-2">
          {/* Pill backgrounds */}
          <View className="absolute -top-0.5 flex-row">
            {(pillsByRow[rowIndex] || []).map((pill, i) => (
              <View
                key={i}
                style={{
                  position: "absolute",
                  left: pill.left * 32,
                  width: pill.width * 32,
                  height: 32,
                  borderRadius: 20,
                  backgroundColor: "#999999",
                }}
              />
            ))}
          </View>

          {/* Days */}
          <View className="flex-row justify-between">
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
                    <View className="h-6 w-6 rounded-full bg-primary-300" />
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
        </View>
      ))}
    </View>
  );
};

export default StreakCalendar;
