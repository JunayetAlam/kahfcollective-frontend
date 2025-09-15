/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Upload, Video, HelpCircle, Trash2 } from "lucide-react";
import { ContentCreationFormProps, Question } from "@/types";

export function ContentCreationForm({ contentData, onInputChange }: ContentCreationFormProps) {
  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    };
    
    const updatedQuestions = [...(contentData.questions || []), newQuestion];
    onInputChange("questions", updatedQuestions);
  };

  const updateQuestion = (questionId: number, field: keyof Question, value: any) => {
    const updatedQuestions = contentData.questions.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    );
    onInputChange("questions", updatedQuestions);
  };

  const updateOption = (questionId: number, optionIndex: number, value: string) => {
    const updatedQuestions = contentData.questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    });
    onInputChange("questions", updatedQuestions);
  };

  const removeQuestion = (questionId: number) => {
    const updatedQuestions = contentData.questions.filter(q => q.id !== questionId);
    onInputChange("questions", updatedQuestions);
  };

  if (contentData.type === "video") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Video Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop your video file here, or click to browse
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Supported formats: MP4, MOV, AVI (Max: 500MB)
            </p>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Choose Video File
            </Button>
          </div>
          
          {contentData.videoFile && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ Video uploaded successfully: {contentData.videoFile.name}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (contentData.type === "quiz") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Quiz Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Create multiple choice questions with 4 options each
            </p>
            <Button onClick={addQuestion} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>

          {contentData.questions && contentData.questions.length > 0 ? (
            <div className="space-y-4">
              {contentData.questions.map((question, questionIndex) => (
                <Card key={question.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Question {questionIndex + 1}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeQuestion(question.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question</Label>
                      <Input 
                        placeholder="Enter your question"
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Answer Options</Label>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                            {String.fromCharCode(65 + optionIndex)}
                          </Badge>
                          <Input 
                            placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                            value={option}
                            onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <Select 
                        value={question.correctAnswer.toString()}
                        onValueChange={(value) => updateQuestion(question.id, "correctAnswer", parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          {question.options.map((option, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              Option {String.fromCharCode(65 + index)}: {option || `Option ${String.fromCharCode(65 + index)}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No questions added yet. Click {`"Add Question"`} to start creating your quiz.</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <p className="text-gray-500">
          Select a content type to start creating content
        </p>
      </CardContent>
    </Card>
  );
}