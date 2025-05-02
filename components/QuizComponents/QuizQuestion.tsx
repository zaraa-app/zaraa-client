import React from "react";
import { View, Image, FlatList } from "react-native";
import TextContent from "@/components/TextContent";
import AnswerOption from "@/components/QuizComponents/AnswerOption";
import FlashcardOption from "@/components/QuizComponents/FlashcardOption";
import { LessonQuestionResponse, EQuestionType } from "@/api/types/lessonQuestions.types";

interface QuizQuestionProps {
  question: LessonQuestionResponse;
  selectedOption: string | null;
  checked: boolean;
  onSelect: (text: string) => void;
}

export default function QuizQuestion({ question, selectedOption, checked, onSelect }: QuizQuestionProps) {
  const isWithImages = question.questionType === EQuestionType.WithImages;

  return (
    <View className="flex-1 gap-4">
      <TextContent size="lg" text={question.questionText} className="text-center font-bold" />
      {question.questionImage && (
        <Image
          source={{ uri: question.questionImage.toString().replace("/preview", "/view") }}
          className="my-2 h-1/4 w-full rounded-xl"
          resizeMode="contain"
        />
      )}

      {/* Layout Wrapper */}
      {isWithImages ?
        <FlatList
          data={question.options}
          keyExtractor={(item, i) => `${item.answerText}-${i}`}
          numColumns={2}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item, index }) => {
            const isSelected = selectedOption === item.answerText;
            const letter = String.fromCharCode(65 + index);

            return (
              <FlashcardOption
                id={item.$id}
                letter={letter}
                answer={item.answerText}
                isSelected={isSelected}
                isCorrect={item.isCorrect}
                checked={checked}
                imageUrl={item.answerImage?.toString().replace("/preview", "/view")}
                onPress={() => !checked && onSelect(item.answerText)}
              />
            );
          }}
        />
      : <View className="flex-1 flex-col gap-2">
          {question.options.map((opt, i) => {
            const key = `${opt.answerText}-${i}`;
            const isSelected = selectedOption === opt.answerText;
            const letter = String.fromCharCode(65 + i);

            return (
              <AnswerOption
                key={key}
                letter={letter}
                text={opt.answerText}
                isCorrect={opt.isCorrect}
                selected={isSelected}
                checked={checked}
                onPress={() => !checked && onSelect(opt.answerText)}
              />
            );
          })}
        </View>
      }
    </View>
  );
}
