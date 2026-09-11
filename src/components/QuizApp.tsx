"use client";

import { useState } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import FamilyMoonCard from "@/components/FamilyMoonCard";
import { VUI_LOGO } from "@/data/assets";
import {
  QUESTIONS,
  getPersona,
  type Option,
  type Question,
} from "@/data/questions";

type Step = "welcome" | "quiz" | "result";

export default function QuizApp() {
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = QUESTIONS[index];
  const chosen =
    question?.options.find((option) => option.id === selected) ?? null;
  const progress = ((index + (selected ? 0.5 : 0)) / QUESTIONS.length) * 100;
  const persona = getPersona(answers);
  const displayName = name.trim() || "Bạn";
  const isLast = index >= QUESTIONS.length - 1;

  function startQuiz() {
    setStep("quiz");
    setIndex(0);
    setSelected(null);
    setFeedbackOpen(false);
    setAnswers({});
  }

  function chooseOption(optionId: string) {
    setSelected(optionId);
    setFeedbackOpen(true);
  }

  function goNext() {
    if (!selected || !question) return;
    const nextAnswers = { ...answers, [question.id]: selected };
    setAnswers(nextAnswers);
    setFeedbackOpen(false);

    if (isLast) {
      setStep("result");
      return;
    }

    setIndex((value) => value + 1);
    setSelected(null);
  }

  function restart() {
    setStep("welcome");
    setIndex(0);
    setSelected(null);
    setFeedbackOpen(false);
    setAnswers({});
  }

  return (
    <Box className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-6 sm:px-6 sm:py-10">
      <header className="mb-5 flex items-center justify-between gap-3">
        <Box className="flex items-center gap-3">
          <Box className="rounded-2xl bg-white px-2 py-1 shadow-md">
            <Image
              src={VUI_LOGO}
              alt="Vui App"
              width={120}
              height={48}
              unoptimized
              className="h-9 w-auto sm:h-10"
              priority
            />
          </Box>
          <Typography
            component="p"
            className="hidden rounded-full bg-white/25 px-4 py-1 text-sm font-bold tracking-wide text-white shadow-sm backdrop-blur sm:block"
          >
            Đêm hội Trung Thu
          </Typography>
        </Box>
        {step === "quiz" ? (
          <Typography className="text-sm font-semibold text-white/90">
            {index + 1}/{QUESTIONS.length}
          </Typography>
        ) : null}
      </header>

      {step === "welcome" ? (
        <WelcomeScreen name={name} onNameChange={setName} onStart={startQuiz} />
      ) : null}

      {step === "quiz" && question ? (
        <QuizScreen
          question={question}
          index={index}
          selected={selected}
          progress={progress}
          onChoose={chooseOption}
          onNext={goNext}
        />
      ) : null}

      {step === "result" ? (
        <ResultScreen
          displayName={displayName}
          answers={answers}
          personaTitle={persona.title}
          personaEmoji={persona.emoji}
          personaDescription={persona.description}
          onRestart={restart}
        />
      ) : null}

      <FeedbackPopup
        open={feedbackOpen && Boolean(chosen)}
        option={chosen}
        isLast={isLast}
        onClose={() => setFeedbackOpen(false)}
        onContinue={goNext}
      />
    </Box>
  );
}

function WelcomeScreen({
  name,
  onNameChange,
  onStart,
}: {
  name: string;
  onNameChange: (value: string) => void;
  onStart: () => void;
}) {
  return (
    <Box className="flex flex-1 flex-col items-center justify-center text-center">
      <Box className="moon-glow mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-[#fff4c2] text-6xl shadow-[0_0_40px_rgba(255,244,180,0.85)]">
        🌕
      </Box>
      <Typography
        variant="h3"
        className="text-[2rem]! font-extrabold! text-white! drop-shadow sm:text-5xl!"
      >
        Trung Thu của bạn
      </Typography>
      <Typography className="mt-3 max-w-md text-lg text-white/95!">
        Vài câu hỏi nhỏ dưới ánh trăng — không có đáp án đúng hay sai, chỉ có
        những lời nhắc dịu dàng về nhà, về ba mẹ, về một đêm rằm.
      </Typography>
      <TextField
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        placeholder="Tên của bạn (không bắt buộc)"
        fullWidth
        className="mt-8! max-w-md"
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(255,255,255,0.92)",
            borderRadius: "16px",
          },
        }}
      />
      <Button
        variant="contained"
        size="large"
        onClick={onStart}
        className="mt-6! bg-[#ff9a3c]! px-8! py-3! text-lg! hover:bg-[#f08a2a]!"
      >
        Bắt đầu dưới ánh trăng
      </Button>
    </Box>
  );
}

function QuizScreen({
  question,
  index,
  selected,
  progress,
  onChoose,
  onNext,
}: {
  question: Question;
  index: number;
  selected: string | null;
  progress: number;
  onChoose: (id: string) => void;
  onNext: () => void;
}) {
  return (
    <Box className="flex flex-1 flex-col">
      <LinearProgress
        variant="determinate"
        value={progress}
        className="mb-6! h-2.5! rounded-full! bg-white/30!"
        sx={{
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#fff4c2",
            borderRadius: 99,
          },
        }}
      />

      <Box className="mb-6 rounded-3xl bg-white/90 p-5 shadow-lg sm:p-7">
        <Chip
          label="Câu chuyện của bạn"
          className="mb-3! bg-[#fff0d6]! font-bold! text-[#c45c12]!"
        />
        <Typography variant="h5" className="font-extrabold! leading-snug!">
          {question.title}
        </Typography>
      </Box>

      <Box className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {question.options.map((option, optionIndex) => {
          const isActive = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChoose(option.id)}
              className={`flex min-h-[108px] items-center gap-4 rounded-[22px] px-5 py-4 text-left shadow-md transition duration-200 hover:-translate-y-0.5 hover:brightness-105 ${
                isActive ? "ring-4 ring-white scale-[1.01]" : ""
              } ${selected && !isActive ? "opacity-70" : ""}`}
              style={{ backgroundColor: option.color }}
            >
              <span className="text-4xl font-black text-white sm:text-5xl">
                {optionIndex + 1}
              </span>
              <span className="text-base font-extrabold leading-snug text-white sm:text-lg">
                {option.label}
              </span>
            </button>
          );
        })}
      </Box>

      <Box className="mt-auto flex items-center justify-between pt-6">
        <Typography className="text-sm text-white/80!">
          {selected
            ? "Bấm lại đáp án nếu muốn xem lại popup, rồi sang câu tiếp"
            : "Chọn một câu trả lời để hiện popup lời nhắn"}
        </Typography>
        <IconButton
          aria-label="Câu tiếp theo"
          onClick={onNext}
          disabled={!selected}
          className="h-14! w-14! rounded-2xl! bg-[#3ad07a]! text-white! disabled:bg-white/35!"
        >
          <ArrowForwardRoundedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

function FeedbackPopup({
  open,
  option,
  isLast,
  onClose,
  onContinue,
}: {
  open: boolean;
  option: Option | null;
  isLast: boolean;
  onClose: () => void;
  onContinue: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="body"
      slotProps={{
        paper: {
          sx: {
            borderRadius: "24px",
            overflow: "hidden",
            borderTop: option ? `8px solid ${option.color}` : undefined,
          },
        },
      }}
    >
      <Box className="flex items-start justify-between px-5 pt-4">
        <Typography className="text-xs! font-extrabold! uppercase! tracking-widest! text-[#c45c12]!">
          Lời nhắn dưới trăng
        </Typography>
        <IconButton aria-label="Đóng" onClick={onClose} size="small">
          <CloseRoundedIcon />
        </IconButton>
      </Box>
      <DialogContent className="pt-1!">
        {option ? (
          <>
            <Typography className="text-[1.08rem]! leading-relaxed! text-slate-700!">
              {option.feedback}
            </Typography>
            <Box className="relative mt-4 overflow-hidden rounded-2xl">
              <Image
                src={option.image}
                alt={option.label}
                width={1920}
                height={1080}
                unoptimized
                className="h-auto w-full object-cover"
                priority
              />
            </Box>
          </>
        ) : null}
      </DialogContent>
      <DialogActions className="px-5! pb-4!">
        <Button onClick={onClose}>Đóng</Button>
        <Button
          variant="contained"
          onClick={onContinue}
          className="bg-[#3ad07a]! hover:bg-[#2bb968]!"
        >
          {isLast ? "Xem kết quả" : "Câu tiếp theo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ResultScreen({
  displayName,
  answers,
  personaTitle,
  personaEmoji,
  personaDescription,
  onRestart,
}: {
  displayName: string;
  answers: Record<string, string>;
  personaTitle: string;
  personaEmoji: string;
  personaDescription: string;
  onRestart: () => void;
}) {
  return (
    <Box className="flex flex-1 flex-col items-center pb-10">
      <Box className="w-full rounded-[28px] bg-white/95 p-6 shadow-xl sm:p-8">
        <Typography className="text-sm! font-bold! uppercase! tracking-widest! text-[#c45c12]!">
          Kết quả đêm trăng
        </Typography>
        <Typography variant="h4" className="mt-2! font-extrabold!">
          {personaEmoji} {displayName} ơi, {personaTitle.toLowerCase()}!
        </Typography>
        <Typography className="mt-3 text-lg! text-slate-700!">
          {personaDescription}
        </Typography>

        <Box className="mt-6 space-y-3">
          {QUESTIONS.map((item) => {
            const chosen = item.options.find(
              (option) => option.id === answers[item.id],
            );
            return (
              <Box
                key={item.id}
                className="rounded-2xl border border-orange-100 bg-white p-4"
              >
                <Typography className="font-semibold! text-slate-700!">
                  {item.title}
                </Typography>
                <Chip
                  label={chosen?.label ?? "—"}
                  className="mt-2!"
                  sx={{
                    backgroundColor: chosen?.color ?? "#eee",
                    color: "#fff",
                    fontWeight: 800,
                    height: "auto",
                    py: 0.75,
                    "& .MuiChip-label": {
                      whiteSpace: "normal",
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>

        <FamilyMoonCard displayName={displayName} />

        <Button
          variant="contained"
          startIcon={<RestartAltRoundedIcon />}
          onClick={onRestart}
          className="mt-8! bg-[#8b74f0]! hover:bg-[#7459e6]!"
        >
          Làm lại từ đầu
        </Button>
      </Box>
    </Box>
  );
}
